.DEFAULT_GOAL := help

VERSION ?= 0.0.0
ifeq "$(VERSION)" "-"
	override VERSION = 0.0.0
endif
ifneq ("$(wildcard VERSION)","")
	override VERSION = `cat VERSION`
endif

TOKEN ?= configs/secrets/ci.token.env
ifneq ("$(wildcard $(TOKEN))","")
	include $(TOKEN)
	export $(shell sed 's/=.*//' $(TOKEN))
endif

export YARN_CACHE_FOLDER = $(PWD)/.cache/yarn

.PHONY: help build test

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
	$$(npm bin)/release-it --config ./build/ci/.release-it.yaml --ci > /dev/null 2>&1 || true

test-pipe:
	drone exec --trusted --pipeline test-pipe build/ci/.drone.yml

develop-pipe:
	drone exec --trusted --pipeline develop-pipe build/ci/.drone.yml

release-pipe:
	drone exec --trusted --pipeline release-pipe build/ci/.drone.yml

jsonnet-convert: ## convert .drone.jsonnet to .drone.yml
	drone jsonnet --source build/ci/.drone.jsonnet --target build/ci/.drone.yml --stream

debug:
	@echo $(VERSION)
	@echo $$AWS_DEFAULT_PROFILE
	@echo $$AWS_PROFILE
