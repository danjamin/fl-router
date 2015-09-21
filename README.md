# fl-router [![Build Status](https://travis-ci.org/danjamin/fl-router.svg)](https://travis-ci.org/danjamin/fl-router)

## USE

### install

Note: this is still in development and not published to **npm** yet.
      So keep this in mind and install via the Git URL for now.

```sh
$ npm install --save https://github.com/danjamin/fl-router.git#0.1.9
```


## DEVELOP

### install dependencies

```sh
$ npm install -g babel mocha
```

```sh
$ npm install
```

### linting

```sh
$ npm run lint
```

### testing

```sh
$ npm test
```

Optionally, you can filter the tests:

```sh
$ ./scripts/test RouteStore
```

### publishing

For now:

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
