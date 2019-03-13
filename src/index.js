// 1. find top level node location i.e. where `lerna.json` resides

// 2. change working directory

// When running at root, package scope is empty

// When running inside a package, the scope is the package name
// Can this be done without environment variables?

const { nearestPackage, repoRoot } = require('./repo-utils');

const rootPath = repoRoot(process.cwd());
const packagePath = nearestPackage(process.cwd());

console.log({
  cwd: process.cwd(),
  rootPath,
  packagePath,
});

