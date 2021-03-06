local aws_ecr_repository = "164073796161.dkr.ecr.ap-northeast-1.amazonaws.com/thingspro-cloud/drone-ci-images";

local image(tag) = aws_ecr_repository + ":" + tag;

# steps
local restore_cache() = {
  name: "restore-cache",
  image: image("drone-cache"),
  settings:{
    restore: true,
    bucket: "mxswdc2",
    region: "ap-northeast-1",
    remote_root: "thingspro-cloud/ci-cache/thingspro-cloud-node-sdk",
    mount: [".cache"]
  }
};

local rebuild_cache() = {
  name: "rebuild-cache",
  image: image("drone-cache"),
  settings:{
    rebuild: true,
    bucket: "mxswdc2",
    region: "ap-northeast-1",
    remote_root: "thingspro-cloud/ci-cache/thingspro-cloud-node-sdk",
    mount: [".cache"]
  },
  depends_on: ["setup-deps-node"]
};

local setup_deps_node() = {
  name: "setup-deps-node",
  image: image("node-12-v1"),
  commands: [
    "make deps",
  ],
  depends_on: [
    "restore-cache"
  ]
};

local download_certs() = {
  name: "download-certs",
  image: image("k8s-v1"),
  environment: {
    AWS_DEFAULT_REGION: "ap-northeast-1",
    AWS_ACCESS_KEY_ID: { from_secret: "AWS_DEV_KEY_ID" },
    AWS_SECRET_ACCESS_KEY: { from_secret: "AWS_DEV_KEY" },
  },
  commands: [
    "make download-certs",
  ],
  depends_on: [
    "setup-deps-node"
  ]
};

local integration_test() = {
  name: "integration-test",
  image: image("node-12-v1"),
  environment: {
    TPC_LOGIN_EMAIL: { from_secret: "TPC_LOGIN_EMAIL" },
    TPC_LOGIN_PASSWORD: { from_secret: "TPC_LOGIN_PASSWORD" },
  },
  commands: [
    "cp configs/.env.dev.example .env",
    "sed -i \"s/guest@thingsprocloud.com/$TPC_LOGIN_EMAIL/g\" .env",
    "sed -i \"s/your_password/$TPC_LOGIN_PASSWORD/g\" .env",
    "cat .env",
    "make test"
  ],
  depends_on: [
    "setup-deps-node",
    "download-certs"
  ]
};

local release_it() = {
  name: "release-it",
  image: image("node-12-v1"),
  environment: {
    AWS_ACCESS_KEY_ID: { from_secret: "AWS_DEV_KEY_ID" },
    AWS_SECRET_ACCESS_KEY: { from_secret: "AWS_DEV_KEY" },
    NPM_TOKEN: { from_secret: "NPM_TOKEN" },
    GITHUB_TOKEN: { from_secret: "GITHUB_TOKEN" },
  },
  commands: [
    "echo \"//registry.npmjs.org/:_authToken=$NPM_TOKEN\" > .npmrc",
    "cat .npmrc",
    "git config remote.origin.url \"https://$GITHUB_TOKEN@github.com/MOXA-ISD/thingspro-cloud-node-sdk.git\"",
    "make release"
  ],
  depends_on: [
    "integration-test"
  ]
};

// piplines
local main_pipeline() = {
  kind: "pipeline",
  name: "main-pipe",
  steps: [
    restore_cache(),
    setup_deps_node(),
    download_certs(),
    integration_test(),
    release_it(),
    rebuild_cache(),
  ],
  trigger: {
    event: ["push"],
    branch: ["main"]
  },
};

[
  main_pipeline()
]
