# fl-router [![Build Status](https://travis-ci.org/danjamin/fl-router.svg)](https://travis-ci.org/danjamin/fl-router)

## USE

### install

Note: this is still in development and not published to **npm** yet.
      So keep this in mind and install via the Git URL for now.

```sh
$ npm install --save https://github.com/danjamin/fl-router.git#0.1.9
```


## DEVELOP

### pre-reqs

Install node packed with npm >=2.0 and <3.0

### install dependencies

```sh
$ npm install -g mocha@2.3.3 babel@5.8.29 broccoli-cli@1.0.0
```

```sh
$ npm install
```

### linting

```sh
$ npm run lint
```

### testing

Transpile and test once:

```sh
$ npm test
```

Watch transpilation:

```sh
$ ./scripts/transpile watch
```

Run test after each change:

```sh
$ ./scripts/test
```

Optionally, you can filter the tests:

```sh
$ ./scripts/test RouteStore
```

### building

```sh
$ npm run build
```

update **package.json** version
tag semver and push to origin


### todo

- [x] linkTo component
- [x] Setup travis CI
- [ ] Clean up code
- [ ] Add more unit tests
- [ ] Bring in flow
- [ ] document better
- [ ] show example usage
