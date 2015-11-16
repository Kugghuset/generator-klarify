<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [generator-klarify](#generator-klarify)
  - [Getting started](#getting-started)
  - [Generators](#generators)
    - [klarify](#klarify)
      - [Parameters](#parameters)
      - [Options](#options)
      - [Questions](#questions)
      - [Example: klarify](#example-klarify)
    - [klarify:route](#klarifyroute)
      - [Parameters](#parameters-1)
      - [Questions](#questions-1)
      - [Example: klarify:route](#example-klarifyroute)
    - [klarify:tsd](#klarifytsd)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# generator-klarify

> [Yeoman](http://yeoman.io/) generator for scaffolding klarify-ds projects

## Getting started

Start with cloning the repository:

```bash
git clone git@github.com:Kugghuset/generator-klarify.git
```

Then `cd` into the folder and it and run `npm link`:

```bash
cd generator-klarify
npm link
```

Make sure [`yo`](http://yeoman.io/), [`gulp`](http://gulpjs.com/),  [`tsd`](http://gulpjs.com/), and [`doctoc`](http://gulpjs.com/) are installed globally. (You might have to run the command with `sudo` if you're on a *nix system).

```bash
npm install -g yo gulp tsd mocha doctoc
```

## Generators

- [`klarify`](#klarify)
- [`klarify:route`](#klarifyroute)
- [`klarify:tsd`](#klarifytsd)

### klarify

```bash
yo klarify [name] [--typings|--tsd]
```

The base scaffolds out a fully functional server where only the databse settings must be edited (which is done through the `userConfig.js` file (instructions in the [project README](https://github.com/Kugghuset/generator-klarify/tree/master/generators/app/templates)).

#### Parameters

- `name`, the name of the app, noted as `[name]` above.

#### Options

- `--typings`, defaults to false. Downloads d.ts files for available node modules using [`tsd`](http://definitelytyped.org/tsd/)
- `--tsd`, alias for `--typings`

#### Questions

The project name, should be prefixed with `klarify-ds-`.

```bash
[?] What's the project name? (klarify-ds-[name]|__foldername)
# name as String, [name] is set by parameter if given
```

The name of the data source to fetch from. Will be forced to PascalCase, I.E. `Data source` will become `DataSource`.

```bash
[?] What's the data source name? (<stored_value>)
# Data source as String -> PascalCase
```

The name or alias of the author. Actual name is preferred.

```bash
[?] Who's the author? (Arthur Dent|<stored_value>)
# Name as String
```

The git repo for the project. Can either be the SSH version the HTTPS version.

```bash
[?] Where's the Git repo located?
# Git repo as String - optional
```

Will set up the git repo locally, make the initial commit, mark `userConfig.js` with `--assume-unchanged`

```bash
[?] Do you want to automatically set git up? (Y/n)
# Yes or No answer.
```

#### Example: klarify

```bash
yo klarify fortnox

[?] What's the project name? (klarify-ds-fortnox)

[?] What's the data source name? Fortnox

[?] Who's the author? (Arthur Dent) Kristoffer Östlund

[?] Where's the Git repo located? git@github.com:Kugghuset/klarify-ds-fortnox.git

[?] Do you want to automatically set git up? (Y/n) Y
```

### klarify:route

```bash
yo klarify:route [name]
```

Generates a route containing the desired structure.

#### Parameters

- `name`, the name of the route, noted as `[name]` above

#### Questions

The name of the route, will be set to camelCase if it contains spaces.

```bash
[?] What's the name of the route ([name])
# name as String, required, [name] is set by parameter if given
```

#### Example: klarify:route

```bash
yo klarify:route customer

[?] What's the name of the route (customer)
```

Generates:

```
api
└───customer
    ├───customer.dbHandler.js
    ├───customer.flow.js
    ├───customer.requestHandler.js
    ├───customer.spec.js
    ├───index.js
    └───sql
        ├───customer.disabledByID.sql
        ├───customer.drop.sql
        ├───customer.getActive.sql
        ├───customer.getActiveSince.sql
        ├───customer.getAll.sql
        ├───customer.initialize.sql
        ├───customer.insertOne.sql
        ├───customer.merge.sql
        ├───customer.temp.drop.sql
        ├───customer.temp.initialize.sql
        └───customer.temp.insertOne.sql
```

### klarify:tsd

```bash
yo klarify:tsd
```

Given the user has [`tsd`](http://gulpjs.com/) installed, it downloads and saves all available t.ds files for all dependencies and devDependencies in the package.json file.

