const { spawnSync } = require('child_process');
const { ENTRY_POINT_WORKING_DIRECTORY, PACKAGE_SCOPE, ITERATION_COUNTER } = require('./env');

const {
  debug,
  error,
} = require('./logger');

const watchdog = Number(process.env[ITERATION_COUNTER]) || 0;

const exec = ({
  command,
  currentWorkingDirectory,
  entryWorkingDirectory,
  packageName,
  scope,
}) => {
  debug(`➤➤➤ ${packageName} ➤ ${command}`);

  const env = Object.assign(
    { FORCE_COLOR: true },
    process.env,
    {
      [ENTRY_POINT_WORKING_DIRECTORY]: entryWorkingDirectory,
      [ITERATION_COUNTER]: watchdog + 1,
    },
    scope ? {
      [PACKAGE_SCOPE]: scope,
    } : {},
  );

  debug('↳', {
    command,
    currentWorkingDirectory,
  });

  const { status } = spawnSync(command, {
    cwd: currentWorkingDirectory,
    shell: true,
    stdio: 'inherit',
    env,
  });
  process.stdout.write(`\n${'-'.repeat(process.stdout.columns)}\n`);

  if (status) {
    error(`Exit code ${status}`);
    process.exit(status);
  }
};

module.exports = { exec };
