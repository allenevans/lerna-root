#!/usr/bin/env node
const { lernaRoot } = require('../src');
const { ITERATION_COUNTER } = require('../src/env');
const { error } = require('../src/logger');

const WATCHDOG_TRIGGER = 5;

const watchdog = Number(process.env[ITERATION_COUNTER]) || 0;

if (watchdog > WATCHDOG_TRIGGER) {
  error(`Recursive loop detected in ${process.cwd()}\n`);
  process.exit(1);
}

lernaRoot({
  argv: process.argv,
  cwd: process.cwd(),
});
