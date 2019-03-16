#!/usr/bin/env node
const { lernaRoot } = require('../src');

lernaRoot({
  argv: process.argv,
  cwd: process.cwd(),
});
