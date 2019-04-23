const { join } = require('path');
const { ENTRY_POINT_WORKING_DIRECTORY, PACKAGE_SCOPE, ITERATION_COUNTER } = require('./env');
const { exec } = require('./exec');
const {
  cwd,
  importJson,
  nearestPackage,
  repoRoot,
} = require('./repo-utils');
const { debug, info } = require('./logger');

const argsBuilder = ({
  args,
  isEntryPoint,
  isRoot,
}) => {
  const doubleDashPosition = args.indexOf('--');
  const hasDoubleDash = doubleDashPosition >= 0;

  if (hasDoubleDash) {
    return isRoot || isEntryPoint ? args.slice(0, doubleDashPosition) : args.slice(doubleDashPosition + 1);
  }

  return args;
};

const depth = +process.env[ITERATION_COUNTER] || 0;

const lernaRoot = ({
  argv,
  currentWorkingDirectory = cwd(),
  entryWorkingDirectory = process.env[ENTRY_POINT_WORKING_DIRECTORY] || cwd(),
}) => {
  debug('⬅ ', JSON.stringify({
    argv,
    currentWorkingDirectory,
    entryWorkingDirectory,
    env: {
      ENTRY_POINT_WORKING_DIRECTORY: process.env[ENTRY_POINT_WORKING_DIRECTORY],
      PACKAGE_SCOPE: process.env[PACKAGE_SCOPE],
      ITERATION_COUNTER: process.env[ITERATION_COUNTER],
    },
  }, null, 2));

  const rootPath = repoRoot(currentWorkingDirectory);
  const { name: packageName } = importJson(nearestPackage(currentWorkingDirectory));
  const rootPkg = importJson(join(rootPath, 'package.json'));

  const lernaPath = join(rootPath, 'node_modules', '.bin', 'lerna');
  const npmPath = 'npm';
  const args = argv.slice(2);

  const isEntryPoint = currentWorkingDirectory === entryWorkingDirectory && depth === 0;
  const isRoot = () => currentWorkingDirectory === repoRoot(currentWorkingDirectory);
  const calledInsidePackage = () => !isRoot() && isEntryPoint;
  const isRunAction = () => args[0] === 'run';
  const taskName = () => args[1];
  const hasNpmRootTask = name => !!rootPkg.scripts[name];

  const commandArgs = argsBuilder({
    args,
    isEntryPoint,
    isRoot: isRoot(),
  });

  if (calledInsidePackage()) {
    debug('calledInsidePackage');
    if (isRunAction() && hasNpmRootTask(taskName())) {
      const command = [npmPath, ...commandArgs].join(' ');

      info(`${packageName} ➤ ${command}`);
      exec({
        command,
        currentWorkingDirectory: repoRoot(),
        entryWorkingDirectory,
        packageName,
        scope: packageName,
      });
    } else {
      const command = [lernaPath, ...commandArgs, `--scope=${packageName}`].join(' ');

      info(`${packageName} ➤ ${command}`);
      exec({
        command,
        currentWorkingDirectory: rootPath,
        entryWorkingDirectory,
        scope: packageName,
        packageName,
      });
    }
  } else {
    debug('command executed in package from outside of package');
    const command = (args.indexOf('--') < 0 || isEntryPoint ? [lernaPath, ...commandArgs] : commandArgs).join(' ');

    exec({
      command,
      currentWorkingDirectory,
      entryWorkingDirectory,
      packageName,
    });
  }
};

module.exports = {
  lernaRoot,
};
