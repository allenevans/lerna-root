const fs = require('fs');
const { join } = require('path');

const LERNA_JSON = 'lerna.json';

const traverseFind = (path, file) => {
  const exists = fs.existsSync(join(path, file));

  if (exists) {
    return path;
  }

  if (path === join(path, '..')) {
    throw new Error(`${file} not found`);
  }

  return traverseFind(join(path, '..'), file);
};

const repoRoot = (path = process.cwd()) => traverseFind(path, LERNA_JSON);

module.exports = {
  repoRoot,
};
