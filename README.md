# clone-check

A utility to check whether a directory is an exact clone of another directory.
This might be useful, if you have some source code in your repository, that is created by a template.
For example, if you have a create-react-app template, and an instance of that template in the same repo.
This is helpful for testing purposes, because you don't need to re-create a new app from the template every time you want to test something.
The problem in this case is that you have to make sure to keep the test app and the template in sync.
In this scenario the clone-check utility will come in handy: It will check whether your test app and template are the same, by running just a single script command.

## Install
```bash
yarn add --dev clone-check
```

## Usage
Add a script to your `package.json` to run the clone check:
```json
  "scripts": {
    "test": "...",
    "build": "...",
    "template:check": "clone-check -m \\\"The template is not up-to-date!\\\" src template tmp test"
  },
```

## Command line interface
```text
Usage: clone-check [options] <sourceDir> <cloneDir> [ignorePatterns...]

Arguments:
  sourceDir                The source directory
  cloneDir                 The clone directory to check
  ignorePatterns           Files and directories to ignore when checking the clone (glob syntax)

Options:
  --verbose                Increase the console output
  -m, --message <message>  An optional error message to show when the clone does not match the source
  -h, --help               display help for command
```

## Examples
Basic usage:
```bash
clone-check src clone
```

Use custom error message:
```bash
clone-check -m "The clone directory does not have the same contents as the src directory!" src clone
```

Relative source and clone directories:
```bash
clone-check . ../other
```

Absolute source and clone directories:
```bash
clone-check C:/git/my-app/src C:/git/my-app/clone
```

Ignore `node_modules` directory (in all subdirectories):
```bash
clone-check src clone **/node_modules/**
```

Ignore `test` directory (only in root):
```bash
clone-check src clone test/**
```

Ignore `config.js` file (only in root):
```bash
clone-check src clone config.js
```

Ignore test files (in all subdirectories):
```bash
clone-check src clone **/*.test.js
```

Multiple ignore patterns:
```bash
clone-check src clone **/*.test.js **/*rc.js config.js **/node_modules/**
```