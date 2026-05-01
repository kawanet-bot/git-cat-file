# git-cat-file

[![Node.js CI](https://github.com/kawanet/git-cat-file/workflows/Node.js%20CI/badge.svg?branch=main)](https://github.com/kawanet/git-cat-file/actions/)
[![npm version](https://img.shields.io/npm/v/git-cat-file)](https://www.npmjs.com/package/git-cat-file)

A pure-JavaScript implementation of `git cat-file -p` for Node.js.

## SYNOPSIS

```js
import {openLocalRepo} from "git-cat-file";

const repo = openLocalRepo("repository/.git");
const commit = await repo.getCommit("HEAD");
const file = await commit.getFile("path/to/file.txt");
process.stdout.write(file.data);
```

See [types/git-cat-file.d.ts](https://github.com/kawanet/git-cat-file/blob/main/types/git-cat-file.d.ts) for the full type definitions and per-method documentation.

## CLI

```sh
Usage:
  git-cat-file-js [-C path] [-t | -p] <object>
  git-ls-tree-js [-C path] [<options>] <tree-ish> [<path>...]
  git-rev-parse-js [-C path] <args>...
```

The CLI commands shipped with the package are also available as `git` subcommands when `node_modules/.bin` is on `$PATH`:

```sh
npm install git-cat-file
export PATH="node_modules/.bin:$PATH"
git cat-file-js [-t | -p] <object>
git ls-tree-js [<options>] <tree-ish> [<path>...]
git rev-parse-js <args>...
```

## LINKS

- https://github.com/kawanet/git-cat-file
- https://www.npmjs.com/package/git-cat-file
- https://www.npmjs.com/package/serve-static-git
