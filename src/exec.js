const { spawnSync } = require('child_process');
const {
  ENTRY_POINT_WORKING_DIRECTORY,
  ITERATION_COUNTER,
  PACKAGE_SCOPE,
  PASSED_ARGS,
} = require('./env');

const {
  debug,
  error,
} = require('./logger');


const exec = ({
  command,
  currentWorkingDirectory,
  passedArgs,
  entryWorkingDirectory,
  packageName,
  scope,
}) => {
  debug(`➤➤➤ ${packageName} ➤ ${command}`);
  const watchdog = Number(process.env[ITERATION_COUNTER]) || 0;

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
    passedArgs ? {
      [PASSED_ARGS]: JSON.stringify(passedArgs),
    } : {},
  );

  debug('↳', {
    command,
    currentWorkingDirectory,
    env: {
      [PASSED_ARGS]: env[PASSED_ARGS],
      [ENTRY_POINT_WORKING_DIRECTORY]: env[ENTRY_POINT_WORKING_DIRECTORY],
      [ITERATION_COUNTER]: env[ITERATION_COUNTER],
      [PACKAGE_SCOPE]: env[PACKAGE_SCOPE],
    },
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
