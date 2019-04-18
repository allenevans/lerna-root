/* eslint-disable no-console */
const LOG_LEVEL = (process.env.LOG_LEVEL || 'info').toLowerCase();
const levels = ['trace', 'debug', 'info', 'warn', 'error', 'silent'];

const isEnabled = level => (levels.indexOf(level) >= levels.indexOf(LOG_LEVEL));

const noop = () => {};

const debug = (...args) => console.log(...args);
const error = (...args) => console.error(...args);
const info = (...args) => console.log(...args);
const trace = (...args) => console.log(...args);
const warn = (...args) => console.warn(...args);

module.exports = {
  debug: isEnabled('debug') ? debug : noop,
  error: isEnabled('error') ? error : noop,
  info: isEnabled('info') ? info : noop,
  trace: isEnabled('trace') ? trace : noop,
  warn: isEnabled('warn') ? warn : noop,
};
