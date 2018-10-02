# Athloi

Athloi is a tool to assist with the management of multi-package repositories (a.k.a. [monorepos]) with git and npm. It provides an interface to execute commands and scripts within the scope of each package.

[monorepos]: https://github.com/babel/babel/blob/master/doc/design/monorepo.md
[lerna]: https://lernajs.io/

## Getting Started

Start by installing Athloi within your project using [npm].

```sh
npm install --save-dev @financial-times/athloi
```

[npm]: https://www.npmjs.com/

Configuration can be passed to Athloi by providing a `monorepo.json` file in your repository root. This must include a `packages` property which is a list of [globs] matching the directories containing your packages.

```json
{
  "packages": [
    "components/*",
    "tools/*"
  ]
}
```

[globs]: https://en.wikipedia.org/wiki/Glob_(programming)


## Commands

### exec

Runs an arbitrary command in the scope of each package.

```sh
athloi exec npm install
```

A double-dash (`--`) is necessary to pass any dashed arguments to the script being executed.

```sh
athloi exec -- npm i -D
```

### run

Runs an [npm script] in each package that contains that script.

```sh
athloi run build
```

[npm script]: https://docs.npmjs.com/misc/scripts

### script

Runs the given Node script in the scope of each package.

```sh
athloi script path/to/task.js
```

### version

Updates the release number for all packages and writes the new data back to `package.json`. The given tag must parseable as a valid semver number.

```sh
athloi version v1.0.0
```

### publish

Runs [`npm publish`][npm-publish] in the scope of each public package.

```sh
athloi publish
```

Dashed arguments may be passed using a double dash (`--`)

```sh
athloi publish -- --access=public
```

[npm-publish]: https://docs.npmjs.com/cli/publish


## Options

### concurrency

A global concurrency option which can be used to execute multiple tasks in parallel. By default only one task will run at a time.

```sh
# run a build script 3 packages at a time
athloi run build --concurrency 3
```

### filter

A global filter option which can be used for all tasks. It can filter packages based on the value of a field within each package manifest file.

```sh
# Run a build script in only the packages marked as private
athloi run build --filter "private:true"
```

The field name preceeding the colon (`:`) is optional and the default field is `name`.

```sh
# Run a build script only for the package named `x-interaction`
athloi run build --filter x-interaction
```


## What's with the name?

One of the twelve labours of Hercules (hoi hērakleous athloi) was to slay the Lernean Hydra.


## licence

isc
