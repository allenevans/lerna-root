/* eslint-disable import/no-dynamic-require */
const { join } = require('path');
const shell = require('shelljs');

const { nearestPackage, repoRoot } = require('./repo-utils');

const exec = ({ command, cwd }) => shell.exec(command, { cwd });

const lernaRoot = ({ argv, cwd }) => {
  const rootPath = repoRoot(cwd);
  const { name: packageName} = require(join(nearestPackage(cwd), 'package.json'));

  const lernaPath = join(rootPath, 'node_modules', '.bin', 'lerna');
  const args = argv.slice(2);

  const isRoot = () => cwd === repoRoot(cwd);

  if (isRoot()) {
    const command = [lernaPath, ...args].join(' ');
    console.log(`${packageName} ➤ ${command}`);

    exec({
      command,
      cwd,
    });
  } else if (args.indexOf('--') >= 0) {
    const command = args.slice(args.indexOf('--') + 1)
      .join(' ');
    console.log(`${packageName} ➤ ${command}`);

    exec({
      command,
      cwd,
    });
  } else {
    const command = [lernaPath, ...args].join(' ');
    console.log(`${packageName} ➤ ${command}`);

    exec({
      command,
      cwd,
    });
  }
};

module.exports = {
  lernaRoot,
};
