const { existsSync, readFileSync } = require('fs');
const { join } = require('path');

const LERNA_JSON = 'lerna.json';
const PACKAGE_JSON = 'package.json';

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

const repoRoot = (path = process.cwd()) => traverseFind(path, LERNA_JSON);

const nearestPackage = (path = process.cwd()) => traverseFind(path, PACKAGE_JSON);

const importJson = filePath => JSON.parse(readFileSync(filePath));

module.exports = {
  importJson,
  nearestPackage,
  repoRoot,
};
