const { existsSync, readFileSync } = require('fs');
const { join } = require('path');

const LERNA_JSON = 'lerna.json';
const PACKAGE_JSON = 'package.json';

const cwd = () => process.cwd();

const traverseFind = (path, file) => {
  const exists = existsSync(join(path, file));

  if (exists) {
    return path;
  }

  if (path === join(path, '..')) {
    throw new Error(`${file} not found`);
  }

  return traverseFind(join(path, '..'), file);
};

const repoRoot = (path = cwd()) => traverseFind(path, LERNA_JSON);

const nearestPackage = (path = cwd()) => join(traverseFind(path, PACKAGE_JSON), PACKAGE_JSON);

const importJson = filePath => JSON.parse(readFileSync(filePath).toString());

module.exports = {
  cwd,
  importJson,
  nearestPackage,
  repoRoot,
};
