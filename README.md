[![Build Status](https://travis-ci.org/SunnyJohal/easy-custom-sidebars.svg?branch=master)](https://travis-ci.org/SunnyJohal/easy-custom-sidebars)

# Easy Custom Sidebars

Welcome to the Easy Custom Sidebars development repository.

## What is Easy Custom Sidebars?

Easy Custom Sidebars is a WordPress Plugin. It's a simple and easy way to replace any sidebar/widget area in your WordPress theme without coding. This plugin integrates with the WordPress Customizer, so you can preview your custom widget areas on your site in realtime. It’s compatible with any theme and you can even replace more than one widget area on the same page!

## Looking to install this plugin on your site?

**DO NOT USE IN PRODUCTION**

This repository is for development of a complete rewrite of this plugin. If you are looking to install and use this plugin on your WordPress website then please visit the official [Plugin Download Page](https://wordpress.org/support/plugin/easy-custom-sidebars/), where the latest stable version is available to download.

## Getting Up and Running

We have a basic development environment that you can quickly get up and running with a few commands. First off, you will need to download and install [Docker](https://www.docker.com/products/docker-desktop) and [Yarn](https://classic.yarnpkg.com/en/docs/install#mac-stable) package manager, if you don't have it already. After that, there are a few commands to run:

### Setup

Once you have cloned the repo run the command:

```sh
$ yarn setup
```

This simple command will:

- Install all node and composer dependancies.
- Run the `wp-env` plugin to setup a development env and spin up the relevant docker containers.

Once complete you should be able to visit [`http://localhost:3000/`](http://localhost:3000/) in your browser to see the local test site.
