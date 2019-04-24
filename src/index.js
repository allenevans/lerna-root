const { join } = require('path');
const { removeIntersection } = require('./array-utils');
const {
  PASSED_ARGS, ENTRY_POINT_WORKING_DIRECTORY, PACKAGE_SCOPE, ITERATION_COUNTER,
} = require('./env');
const { exec } = require('./exec');
const {
  cwd,
  importJson,
  nearestPackage,
  repoRoot,
} = require('./repo-utils');
const { debug, info } = require('./logger');

const npmPassedArgs = () => {
  try {
    return JSON.parse(process.env.npm_config_argv).remain || [];
  } catch (x) {
    return [];
  }
};

const passedArgs = () => {
  let args = [];
  try {
    args = JSON.parse(process.env[PASSED_ARGS]) || [];
  } catch (x) { /* ignore error */
  }

  return args.length ? args : npmPassedArgs();
};

const argsBuilder = ({
  args,
  isEntryPoint,
  isRoot,
  runner,
}) => {
  const doubleDashPosition = args.indexOf('--');
  const hasDoubleDash = doubleDashPosition >= 0;

  const pArgs = passedArgs();
  const includePassedArgs = pArgs.length && !runner;

  if (includePassedArgs) {
    return (hasDoubleDash ? [
      runner,
      ...(isRoot || isEntryPoint ? args.slice(0, doubleDashPosition) : args.slice(doubleDashPosition + 1)),
      pArgs,
    ] : [
      runner,
      ...args,
      '--',
      ...pArgs,
    ]).filter(Boolean);
  }

  const commandArgs = (hasDoubleDash ? [
    runner,
    ...(isRoot || isEntryPoint ? args.slice(0, doubleDashPosition) : args.slice(doubleDashPosition + 1)),
    undefined,
  ] : [
    runner,
    ...args,
  ]).filter(Boolean);

  return removeIntersection(commandArgs, pArgs);
};

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
      PASSED_ARGS: process.env[PASSED_ARGS],
      ENTRY_POINT_WORKING_DIRECTORY: process.env[ENTRY_POINT_WORKING_DIRECTORY],
      PACKAGE_SCOPE: process.env[PACKAGE_SCOPE],
      ITERATION_COUNTER: process.env[ITERATION_COUNTER],
      npm_config_argv: process.env.npm_config_argv,
    },
  }, null, 2));

  const depth = +process.env[ITERATION_COUNTER] || 0;

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

  if (calledInsidePackage()) {
    debug('calledInsidePackage');
    if (isRunAction() && hasNpmRootTask(taskName())) {
      const command = argsBuilder({
        args,
        isEntryPoint,
        isRoot: isRoot(),
        runner: npmPath,
      }).join(' ');

      info(`${packageName} ➤ ${command}`);
      exec({
        command,
        currentWorkingDirectory: repoRoot(),
        passedArgs: passedArgs(),
        entryWorkingDirectory,
        packageName,
        scope: packageName,
      });
    } else {
      const commandArgs = argsBuilder({
        args,
        isEntryPoint,
        isRoot: isRoot(),
        runner: lernaPath,
      });

      const command = [...commandArgs, `--scope=${packageName}`].join(' ');

      info(`${packageName} ➤ ${command}`);
      exec({
        command,
        currentWorkingDirectory: rootPath,
        passedArgs: passedArgs(),
        entryWorkingDirectory,
        scope: packageName,
        packageName,
      });
    }
  } else {
    debug('command executed in package from outside of package');
    const command = argsBuilder({
      args,
      isEntryPoint,
      isRoot: isRoot(),
      runner: args.indexOf('--') < 0 || isEntryPoint ? lernaPath : undefined,
    }).join(' ');

    exec({
      command,
      currentWorkingDirectory,
      passedArgs: passedArgs(),
      entryWorkingDirectory,
      packageName,
    });
  }
};

module.exports = {
  lernaRoot,
};
