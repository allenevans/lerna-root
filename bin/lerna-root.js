#!/usr/bin/env node
const { join } = require('path');
const { exec } = require('shelljs');

const { repoRoot } = require('../src/repo-utils');

const rootPath = repoRoot(process.cwd());

const lernaPath = join(rootPath, 'node_modules', '.bin', 'lerna');
const args = process.argv.slice(2);

const isRoot = () => process.cwd() === repoRoot(process.cwd());

if (!isRoot()) {
  const command = args.slice(args.indexOf('--') + 1).join(' ');
  console.log(`PACKAGE >>> command args:- ${command}`);

  exec(command, { async: true });
} else {
  const command = [lernaPath, ...args].join(' ');
  console.log(`ROOT >>> command args:- ${command}`);

  exec(command, { async: true });
}
