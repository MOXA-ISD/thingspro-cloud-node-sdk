.DEFAULT_GOAL := help
.PHONY: build docs test

VERSION ?= 0.0.0
ifeq "$(VERSION)" "-"
	override VERSION = 0.0.0
endif
ifneq ("$(wildcard VERSION)","")
	override VERSION = `cat VERSION`
endif

# loading Current ENV
ifdef ENV
export ENV
else
export ENV=dev
endif

# set AWS_PROFILE for local
ifndef CI
ifeq ($(ENV), dev)
	export AWS_PROFILE=cloud-dev
endif
ifeq ($(ENV), stage)
	export AWS_PROFILE=cloud-stage
endif
ifeq ($(ENV), prod)
	export AWS_PROFILE=cloud-prod
endif
endif

export TPC_SCRIPTS = node_modules/thingspro-cloud-devops-tools/scripts
export YARN_CACHE_FOLDER = $(PWD)/.cache/yarn

j: jsonnet-convert
it: test

help:
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

clean: ## Remove local environment
	rm -rf node_modules
	rm -rf .cache

deps: ## Setup and install local venv
	yarn

lint: ## lint source code
	yarn lint

test: ## run integration test
	yarn test

build:
	rm -rf dist/$(PROJECT)-$(TYPE)-$(APP)
	mkdir -p dist/$(PROJECT)-$(TYPE)-$(APP)
	tar \
		--exclude='./.[edgprv]*' \
		--exclude='.cache/yarn' \
		--exclude='dist' \
		--exclude='node_modules' \
		--exclude='configs/secrets/[ac]*' \
		--exclude='venv' \
		-cf - . | ( cd dist/$(PROJECT)-$(TYPE)-$(APP) ; tar xf - )

release:
	mkdir -p ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts
	yarn
	git branch -u origin/main
	git config --global user.email "thingspro.ci@moxa.com"
	git config --global user.name "CI Robot"
	git config push.default current
	$$(npm bin)/release-it --npm.skipChecks --config ./build/ci/.release-it.yaml --ci

download-certs:
	@./$(TPC_SCRIPTS)/cert/download health-check

test-pipe:
	drone exec --trusted --pipeline test-pipe build/ci/.drone.yml

main-pipe:
	drone exec --trusted --pipeline main-pipe build/ci/.drone.yml

jsonnet-convert: ## convert .drone.jsonnet to .drone.yml
	drone jsonnet --source build/ci/.drone.jsonnet --target build/ci/.drone.yml --stream

debug:
	@echo $(VERSION)
	@echo $$AWS_DEFAULT_PROFILE
	@echo $$AWS_PROFILE
