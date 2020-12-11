local aws_ecr_repository = "164073796161.dkr.ecr.ap-northeast-1.amazonaws.com/thingspro-cloud/drone-ci-images";

local image(tag) = aws_ecr_repository + ":" + tag;

# steps
local restore_cache() = {
  name: "restore-cache",
  image: image("drone-cache"),
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

local rebuild_cache() = {
  name: "rebuild-cache",
  image: image("drone-cache"),
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
  depends_on: [
    "setup-deps-node"
  ]
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

local integration_test() = {
  name: "integration-test",
  image: image("node-12-v1"),
  commands: [
    "make test"
  ],
  depends_on: [
    "setup-deps-node"
  ]
};

local release_it() = {
  name: "release-it",
  image: image("node-12-v1"),
  environment: {
    AWS_ACCESS_KEY_ID: { from_secret: "AWS_DEV_KEY_ID" },
    AWS_SECRET_ACCESS_KEY: { from_secret: "AWS_DEV_KEY" },
    NPM_TOKEN: { from_secret: "NPM_TOKEN" },
  },
  commands: [
    "echo \"//registry.npmjs.org/:_authToken=$NPM_TOKEN\" > .npmrc",
    "cat .npmrc",
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
