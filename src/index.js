const { join } = require('path');
const { spawnSync } = require('child_process');

const {
  debug,
  error,
  info,
  trace,
} = require('./logger');
const { importJson, nearestPackage, repoRoot } = require('./repo-utils');

const ENTRY_POINT_WORKING_DIRECTORY = '__EWD__';
const WATCHDOG_COUNTER = '__WD__';
const PACKAGE_SCOPE = 'PACKAGE_SCOPE';
const WATCHDOG_TRIGGER = 5;

const entryWorkingDirectory = process.env[ENTRY_POINT_WORKING_DIRECTORY] || process.cwd();
const watchdog = Number(process.env[WATCHDOG_COUNTER]) || 0;

if (watchdog > WATCHDOG_TRIGGER) {
  error(`Recursive loop detected in ${process.cwd()}\n`);
  process.exit(1);
}

debug(`⬅ ${process.argv.join(' ')}`);

const exec = ({ command, cwd, scope }) => {
  const { name: packageName } = importJson(join(nearestPackage(cwd), 'package.json'));
  debug(`➤➤➤ ${packageName} ➤ ${command}`);

  const env = Object.assign(
    { FORCE_COLOR: true },
    process.env,
    {
      [ENTRY_POINT_WORKING_DIRECTORY]: cwd,
      [WATCHDOG_COUNTER]: watchdog + 1,
    },
    scope ? {
      [PACKAGE_SCOPE]: scope,
    } : {},
  );

  trace('env', JSON.stringify(env, null, 2));

  const { status } = spawnSync(command, {
    cwd,
    shell: true,
    stdio: 'inherit',
    env,
  });

  if (status) {
    error(`Exit code ${status}`);
    process.exit(status);
  }
};

const lernaRoot = ({ argv, cwd }) => {
  const rootPath = repoRoot(cwd);
  const { name: packageName } = importJson(join(nearestPackage(cwd), 'package.json'));
  const rootPkg = importJson(join(rootPath, 'package.json'));

  const lernaPath = join(rootPath, 'node_modules', '.bin', 'lerna');
  const npmPath = 'npm';
  const args = argv.slice(2);

  const isRoot = () => cwd === repoRoot(cwd);
  const calledInsidePackage = () => !isRoot() && cwd === entryWorkingDirectory;
  const isRunAction = () => args[0] === 'run';
  const taskName = () => args[1];
  const hasNpmRootTask = name => !!rootPkg.scripts[name];

  if (isRoot()) {
    debug('isRoot === true');
    const command = [lernaPath, ...args].join(' ');

    exec({
      command,
      cwd,
    });
  } else if (calledInsidePackage()) {
    const useNpm = isRunAction() && hasNpmRootTask(taskName());
    const runner = useNpm ? npmPath : `${lernaPath} exec --scope=${packageName}`;
    debug(`calledInsidePackage: useNpm ${useNpm}`);

    const command = useNpm ? [
      runner,
      ...args.slice(0, args.indexOf('--')),
    ].join(' ') : [runner, `"${args.slice(args.indexOf('--') + 1).join(' ')}"`].join(' ')

    info(`${packageName} ➤ ${command}`);
    exec({
      command,
      cwd: rootPath,
      scope: packageName,
    });
  } else {
    debug('command executed in package from outside of package');
    const command = args.slice(args.indexOf('--') + 1).join(' ');

    exec({
      command,
      cwd,
    });
  }
};

module.exports = {
  lernaRoot,
};
