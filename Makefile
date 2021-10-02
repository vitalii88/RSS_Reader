install:
	npm сi
build:
	NODE_ENV=production npx webpack

build-dev:
	webpack

clean:
	rm -R ./dist/*

lint:
	npx eslint .

lint-fix:
	npx eslint . --fix

start:
	webpack server

watch:
	webpack --watch
