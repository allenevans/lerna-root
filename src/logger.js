const LOGLEVEL = process.env.LOGLEVEL || 'info';
const levels = ['trace', 'debug', 'info', 'warn', 'error'];

const error = (...args) => {
  if (levels.indexOf('error') < levels.indexOf(LOGLEVEL)) { return; }

  console.error(...args);
};

const warn = (...args) => {
  if (levels.indexOf('warn') < levels.indexOf(LOGLEVEL)) { return; }

  console.warn(...args);
};

const info = (...args) => {
  if (levels.indexOf('info') < levels.indexOf(LOGLEVEL)) { return; }

  console.log(...args);
};

const debug = (...args) => {
  if (levels.indexOf('debug') < levels.indexOf(LOGLEVEL)) { return; }

  console.log(...args);
};

const trace = (...args) => {
  if (levels.indexOf('trace') < levels.indexOf(LOGLEVEL)) { return; }

  console.log(...args);
};

module.exports = {
  debug,
  error,
  info,
  trace,
  warn,
};
