install:
	npm install
build:
	NODE_ENV=production npx webpack

build-dev:
	webpack

lint:
	npx eslint .

start:
	webpack server

watch:
	webpack --watch
