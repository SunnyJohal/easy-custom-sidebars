[![Build Status](https://travis-ci.org/SunnyJohal/easy-custom-sidebars.svg?branch=master)](https://travis-ci.org/SunnyJohal/easy-custom-sidebars)

# Easy Custom Sidebars

Welcome to the Easy Custom Sidebars development repository.

## What is Easy Custom Sidebars?

Easy Custom Sidebars is a WordPress Plugin. It's a simple and easy way to replace any sidebar/widget area in your WordPress theme without coding. This plugin integrates with the WordPress Customizer, so you can preview your custom widget areas on your site in realtime. It’s compatible with any theme and you can even replace more than one widget area on the same page!

## Looking to install this plugin on your site?

**DO NOT USE IN PRODUCTION**

This repository is for development of a complete rewrite of this plugin. If you are looking to install and use this plugin on your WordPress website then please visit the official [Plugin Download Page](https://wordpress.org/support/plugin/easy-custom-sidebars/), where the latest stable version is available to download.

## Getting Up and Running

### Prerequisites

We've made it easy to setup local development with a simple command. We assume that you have already downloaded and installed [Docker](https://www.docker.com/products/docker-desktop) and [Yarn](https://classic.yarnpkg.com/en/docs/install#mac-stable) package manager, if you don't have it already. After that, there are a few commands to run:

### Setup

We've made it easy to setup local development with a simple command to run once you have cloned the repo:

```sh
$ yarn setup
```

**NOTE:** Please be patient this command can take some time to execute.

This command will:

- Install all node and composer dependancies.
- Run the `wp-env` plugin to spin up the relevant docker containers for local development.

Once complete you should be able to visit [`http://localhost:3000/`](http://localhost:3000/) in your browser to see the local test site.

### Development

```sh
$ yarn start
```

This command will: WIP

### Testing

#### PHPUnit Testing

All tests are located in the `phpunit/tests` directory in the project. Any new tests need to be in this directory in order to run properly. phpUnit will automatically run any tests for php files when the filename has the following structure: `test-{NAME}.php`

To run the phpUnit tests run the command:

```sh
$ yarn test-unit-php
```

This command will:

- Spin up a temporary container to execute the phpUnit tests.
- Run all unit tests.
- Show the test results.
- Shutdown the temporary container.

**NOTE:** We plan to add phpunit-watcher to the container in the future to be able to start phpUnit in watch mode.

#### Jest Unit Testing

To run the unit tests for js files run the command:

```sh
$ yarn test
```

This command will:

- Start up jest and run any tests in the `test` directory.
- Watch the project files and re-run the tests when they change (or new tests are added).
