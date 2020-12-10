local docker_host_volume = [
  {
    name: "docker",
    host: { path: "/var/run/docker.sock" }
  },
  {
    name: "docker-token",
    host: { path: "/root/.docker/config.json" }
  }
];

local activate_venv(type) = [
  "export VENV_TYPE=" + type,
  ". ./venv/" + type + "/bin/activate",
];

local prepare_dot_env(env) =
  if env == "dev" then [
    "cp ./configs/example.dev.env .env"
  ] else [] +
  if env == "stage" then [
    "cp ./configs/example.stage.env .env"
  ] else [];

# steps
local restore_cache() = {
  name: "restore-cache",
  image: "164073796161.dkr.ecr.ap-northeast-1.amazonaws.com/thingspro-cloud/drone-ci-images:drone-cache",
  environment: {
    AWS_ACCESS_KEY_ID: { from_secret: "AWS_DEV_KEY_ID" },
    AWS_SECRET_ACCESS_KEY: { from_secret: "AWS_DEV_KEY" },
  },
  settings:{
    restore: true,
    bucket: "dlm-drone-ci-cache",
    region: "ap-northeast-1",
    mount: [".cache"]
  }
};

local rebuild_cache(deps) = {
  name: "rebuild-cache",
  image: "164073796161.dkr.ecr.ap-northeast-1.amazonaws.com/thingspro-cloud/drone-ci-images:drone-cache",
  environment: {
    AWS_ACCESS_KEY_ID: { from_secret: "AWS_DEV_KEY_ID" },
    AWS_SECRET_ACCESS_KEY: { from_secret: "AWS_DEV_KEY" },
  },
  settings:{
    rebuild: true,
    bucket: "dlm-drone-ci-cache",
    region: "ap-northeast-1",
    mount: [".cache"]
  },
  depends_on: deps
};

local setup_deps() = {
  name: "setup-deps",
  image: "164073796161.dkr.ecr.ap-northeast-1.amazonaws.com/ci/node:12-cloud",
  commands: [
    "make deps"
  ],
  depends_on: [
    "restore-cache"
  ]
};

local setup_aws_cli() = {
  name: "setup-aws-cli",
  image: "164073796161.dkr.ecr.ap-northeast-1.amazonaws.com/ci/docker:dind-cloud-4",
  commands: [
    "make deps-py VENV_TYPE=dkr"
  ],
  depends_on: [
    "restore-cache"
  ]
};

local lint() = {
  name: "lint",
  image: "164073796161.dkr.ecr.ap-northeast-1.amazonaws.com/ci/node:12-cloud",
  commands: [
    "make lint",
  ],
  depends_on: ["setup-deps"]
};

local build() = {
  name: "build",
  image: "164073796161.dkr.ecr.ap-northeast-1.amazonaws.com/ci/node:12-cloud",
  commands: [
    "make build"
  ],
  depends_on: ["setup-deps"]
};

local release(env) = {
  name: "release",
  image: "164073796161.dkr.ecr.ap-northeast-1.amazonaws.com/ci/node:12-cloud",
  environment: {
    GITHUB_TOKEN: { from_secret: "GITHUB_TOKEN" }
  },
  commands: (
    if env == "dev" then [
      "make pre-release VERSION=${DRONE_BRANCH//\\//-}-${DRONE_COMMIT_SHA:0:8} ENV=" + env,
    ] else []
  ) + (
    if env == "stage" then [
      "make release"
    ] else []
  ) + (
    if env == "prod" then [
      "cat package.json | python -c \"import sys, json; print(json.load(sys.stdin)['version'])\" > VERSION",
      "make pre-release ENV=" + env,
    ] else []
  ),
  depends_on: [
    "build"
  ] + (if env == "dev" then ["integration-test"] else [])
  + (if env == "stage" then ["integration-test"] else [])
};

local build_docker_image(env) = {
  name: "build-docker-image",
  image: "164073796161.dkr.ecr.ap-northeast-1.amazonaws.com/ci/docker:dind-cloud-4",
  privileged: true,
  environment: {
    AWS_ACCESS_KEY_ID: { from_secret: "AWS_DEV_KEY_ID" },
    AWS_SECRET_ACCESS_KEY: { from_secret: "AWS_DEV_KEY" },
    AWS_DEFAULT_REGION: "us-west-2"
  },
  commands: activate_venv("dkr") + [
    "dockerd --data-root /var/lib/docker &> /dev/null &",
    "until docker version; do sleep 1; done",
    "rm -rf .env",
    "make login",
    "make build-docker-image ENV=" + env,
  ] + (
    if env == "dev" then [
      "make publish-docker-image VERSION=${DRONE_BRANCH//\\//-}-${DRONE_COMMIT_SHA:0:8} ENV=" + env,
    ] else [
      "make publish-docker-image ENV=" + env,
    ]),
  depends_on: [
    "setup-aws-cli",
    "build"
  ] + (
    if env == "stage" then ["release"] else []
  )
};

local tag_docker_image() = {
  name: "tag-docker-image",
  image: "164073796161.dkr.ecr.ap-northeast-1.amazonaws.com/ci/docker:dind-cloud-4",
  privileged: true,
  environment: {
    AWS_ACCESS_KEY_ID: { from_secret: "AWS_DEV_KEY_ID" },
    AWS_SECRET_ACCESS_KEY: { from_secret: "AWS_DEV_KEY" },
    AWS_DEFAULT_REGION: "us-west-2"
  },
  commands: activate_venv("dkr") + [
    "dockerd --data-root /var/lib/docker &> /dev/null &",
    "until docker version; do sleep 1; done",
    "rm -rf .env",
    "make login",
    "make publish-docker-image ENV=prod",
  ],
  depends_on: [
    "setup-aws-cli",
    "release"
  ]
};

local deploy(env) = {
  name: "deploy",
  image: "164073796161.dkr.ecr.ap-northeast-1.amazonaws.com/ci/python3:3.6-cloud-ci-robot",
  environment: {
    AWS_DEFAULT_REGION: if env == "dev" then "ap-northeast-1" else "us-west-2",
  } + if env == "prod" then {
    AWS_ACCESS_KEY_ID: { from_secret: "AWS_PROD_KEY_ID" },
    AWS_SECRET_ACCESS_KEY: { from_secret: "AWS_PROD_KEY" }
  } else {
    AWS_ACCESS_KEY_ID: { from_secret: "AWS_DEV_KEY_ID" },
    AWS_SECRET_ACCESS_KEY: { from_secret: "AWS_DEV_KEY" },
  },
  commands: [
    "rm -rf .env",
    "make login",
    "make switch-cluster ENV=" + env,
    "make deploy"
  ],
  depends_on: [] + if env == "prod" then ["tag-docker-image"] else ["build-docker-image"],
};

# pipelines
local test_pipeline() = {
  kind: "pipeline",
  name: "test-pipe",
  steps: [
    restore_cache(),
    setup_deps(),
    lint(),
    rebuild_cache(["integration-test"])
  ],
  trigger: {
    event: { exclude: ["tag"] },
    branch: { exclude: ["develop", "stage", "master"]},
  }
};

local develop_pipeline() = {
  kind: "pipeline",
  name: "develop-pipe",
  steps: [
    restore_cache(),
    setup_deps(),
    setup_aws_cli(),
    lint(),
    build(),
    release("dev"),
    rebuild_cache(["notify"])
  ],
  trigger: {
    event: ["push"],
    branch: ["develop"]
  },
  volumes: docker_host_volume
};

local stage_pipeline() = {
  kind: "pipeline",
  name: "stage-pipe",
  steps: [
    restore_cache(),
    setup_deps(),
    setup_aws_cli(),
    lint(),
    build(),
    release("stage"),
    rebuild_cache(["notify"])
  ],
  trigger: {
    event: ["push"],
    branch: ["stage"]
  },
  volumes: docker_host_volume
};

local production_pipeline() = {
  kind: "pipeline",
  name: "production-pipe",
  steps: [
    restore_cache(),
    setup_deps(),
    setup_aws_cli(),
    release("prod"),
    rebuild_cache(["notify"])
  ],
  trigger: {
    event: ["push"],
    branch: ["master"]
  },
  volumes: docker_host_volume
};

[
  test_pipeline(),
  develop_pipeline(),
  stage_pipeline(),
  production_pipeline()
]
