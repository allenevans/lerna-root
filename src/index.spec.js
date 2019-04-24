/* eslint-disable import/no-dynamic-require */
const { join } = require('path');
const { lernaRoot } = require('.');
const { exec } = require('./exec');
const { importJson, repoRoot } = require('./repo-utils');
const envVars = require('./env');

const DEMO_ROOT = join(__dirname, '..', 'demo');
const DEMO_PACKAGE = join(__dirname, '..', 'demo', 'packages', 'www-server');
const demoRepoJson = require(join(DEMO_ROOT, 'package.json'));
const demoPackageJson = require(join(DEMO_PACKAGE, 'package.json'));

jest.mock('./exec');
jest.mock('./repo-utils');

describe('lerna-root', () => {
  afterEach(() => {
    Object.keys(envVars).forEach(envVar => delete process.env[envVar]);
    delete process.env.npm_config_argv;
  });

  describe('repo root', () => {
    const currentWorkingDirectory = DEMO_ROOT;

    beforeEach(() => {
      repoRoot.mockReturnValue(DEMO_ROOT);
      importJson.mockReturnValue(demoRepoJson);

      exec.mockImplementation = () => {
      };
    });

    describe('lerna-root bootstrap', () => {
      it('should run lerna bootstrap', () => {
        const argv = ['/node',
          '/node_modules/.bin/lerna-root',
          'bootstrap'];

        lernaRoot({
          argv,
          currentWorkingDirectory,
        });

        expect(exec).toHaveBeenCalledWith({
          command: `${currentWorkingDirectory}/node_modules/.bin/lerna bootstrap`,
          currentWorkingDirectory,
          passedArgs: [],
          entryWorkingDirectory: undefined,
          packageName: demoRepoJson.name,
        });
      });
    });

    describe('lerna-root run', () => {
      it('should use `npm run` if the task name is defined in the package.json', () => {
        const argv = ['/node',
          '/node_modules/.bin/lerna-root',
          'run',
          'build'];

        lernaRoot({
          argv,
          currentWorkingDirectory,
        });

        expect(exec).toHaveBeenCalledWith({
          command: `${DEMO_ROOT}/node_modules/.bin/lerna run build`,
          currentWorkingDirectory,
          passedArgs: [],
          entryWorkingDirectory: undefined,
          packageName: demoRepoJson.name,
        });
      });

      it('should use `lerna run` if the task name is not defined in package.json', () => {
        const argv = ['/node',
          '/node_modules/.bin/lerna-root',
          'run',
          'some-task'];

        lernaRoot({
          argv,
          currentWorkingDirectory,
        });

        expect(exec).toHaveBeenCalledWith({
          command: `${currentWorkingDirectory}/node_modules/.bin/lerna run some-task`,
          currentWorkingDirectory,
          passedArgs: [],
          entryWorkingDirectory: undefined,
          packageName: demoRepoJson.name,
        });
      });

      it('should use `lerna run` to run tasks not defined in repo root', () => {
        lernaRoot({
          argv: [
            '/node',
            '/demo/node_modules/.bin/lerna-root',
            'run',
            'clean',
            '--scope=',
            '--include-filtered-dependencies',
          ],
          currentWorkingDirectory: DEMO_ROOT,
          entryWorkingDirectory: DEMO_ROOT,
        });

        expect(exec).toHaveBeenCalledWith({
          command: `${DEMO_ROOT}/node_modules/.bin/lerna run clean --scope= --include-filtered-dependencies`,
          currentWorkingDirectory: DEMO_ROOT,
          passedArgs: [],
          entryWorkingDirectory: DEMO_ROOT,
          packageName: demoRepoJson.name,
        });
      });

      it('should use `lerna run` when executing from the entry point', () => {
        lernaRoot({
          argv: [
            '/node',
            '/node_modules/.bin/lerna-root',
            'run',
            'lint',
            '--',
            '--fix',
          ],
          currentWorkingDirectory: DEMO_ROOT,
          entryWorkingDirectory: DEMO_ROOT,
        });

        expect(exec).toHaveBeenCalledWith({
          command: `${DEMO_ROOT}/node_modules/.bin/lerna run lint`,
          currentWorkingDirectory: DEMO_ROOT,
          passedArgs: [],
          entryWorkingDirectory: DEMO_ROOT,
          packageName: demoRepoJson.name,
        });
      });
    });

    describe('lerna-root exec', () => {
      it('should execute lerna exec in each package', () => {
        const argv = ['/node',
          '/node_modules/.bin/lerna-root',
          'exec',
          'npm',
          'install',
        ];

        lernaRoot({
          argv,
          currentWorkingDirectory,
        });

        expect(exec).toHaveBeenCalledWith({
          command: `${currentWorkingDirectory}/node_modules/.bin/lerna exec npm install`,
          currentWorkingDirectory,
          passedArgs: [],
          entryWorkingDirectory: undefined,
          packageName: demoRepoJson.name,
        });
      });
    });
  });

  describe('package', () => {
    const currentWorkingDirectory = DEMO_PACKAGE;

    beforeEach(() => {
      repoRoot.mockReturnValue(DEMO_ROOT);
      importJson.mockReturnValue(demoPackageJson);

      exec.mockImplementation = () => {
      };
    });

    describe('lerna-root run called directly', () => {
      it('should execute `npm run` at the root of the repo when repo root has task defined', () => {
        const argv = ['/node',
          '/node_modules/.bin/lerna-root',
          'run',
          'build'];

        lernaRoot({
          argv,
          currentWorkingDirectory,
          entryWorkingDirectory: currentWorkingDirectory,
        });

        expect(exec).toHaveBeenCalledWith({
          command: 'npm run build',
          currentWorkingDirectory: DEMO_ROOT,
          passedArgs: [],
          entryWorkingDirectory: DEMO_PACKAGE,
          packageName: demoPackageJson.name,
          scope: demoPackageJson.name,
        });
      });

      it('should execute `lerna run` at the root of the repo when repo root does not have the defined task', () => {
        const argv = ['/node',
          '/node_modules/.bin/lerna-root',
          'run',
          'some-task'];

        lernaRoot({
          argv,
          currentWorkingDirectory,
          entryWorkingDirectory: currentWorkingDirectory,
        });

        expect(exec).toHaveBeenCalledWith({
          command: `${DEMO_ROOT}/node_modules/.bin/lerna run some-task --scope=${demoPackageJson.name}`,
          currentWorkingDirectory: DEMO_ROOT,
          passedArgs: [],
          entryWorkingDirectory: DEMO_PACKAGE,
          packageName: demoPackageJson.name,
          scope: demoPackageJson.name,
        });
      });
    });

    describe('when called from root', () => {
      it('should execute right-hand side of --', () => {
        const argv = ['/node',
          '/node_modules/.bin/lerna-root',
          'run',
          'build',
          '--include-filtered-dependencies',
          '--',
          'echo',
          'build',
          '@example/www-server;',
        ];

        lernaRoot({
          argv,
          currentWorkingDirectory,
          entryWorkingDirectory: repoRoot(),
        });

        expect(exec).toHaveBeenCalledWith({
          command: 'echo build @example/www-server;',
          currentWorkingDirectory: DEMO_PACKAGE,
          passedArgs: [],
          entryWorkingDirectory: DEMO_ROOT,
          packageName: demoPackageJson.name,
        });
      });

      it('should execute right-hand side of -- with args', () => {
        const argv = [
          '/node',
          '/node_modules/.bin/lerna-root',
          'run',
          'lint',
          '--',
          'eslint',
          '--config',
          '../../.eslintrc.json',
          '--ext',
          '.js',
          './',
        ];

        lernaRoot({
          argv,
          currentWorkingDirectory,
          entryWorkingDirectory: repoRoot(),
        });

        expect(exec).toHaveBeenCalledWith({
          command: 'eslint --config ../../.eslintrc.json --ext .js ./',
          currentWorkingDirectory: DEMO_PACKAGE,
          passedArgs: [],
          entryWorkingDirectory: DEMO_ROOT,
          packageName: demoPackageJson.name,
        });
      });

      it('should not include passed args if using a runner (npm or lerna)', () => {
        // demo/packages/www-server ➤ npm run lint -- --fix
        lernaRoot({
          argv: [
            '/node',
            'node_modules/.bin/lerna-root',
            'run',
            'lint',
            '--',
            'eslint',
            '--config',
            '../../.eslintrc.json',
            '--ext',
            '.js',
            './',
            '--fix',
          ],
          currentWorkingDirectory: DEMO_PACKAGE,
          entryWorkingDirectory: DEMO_PACKAGE,
        });

        expect(exec).toHaveBeenCalledWith({
          command: 'npm run lint',
          currentWorkingDirectory: DEMO_ROOT,
          passedArgs: [],
          entryWorkingDirectory: DEMO_PACKAGE,
          packageName: demoPackageJson.name,
          scope: demoPackageJson.name,
        });
      });

      it('should not pass args on to runner', () => {
        process.env.npm_config_argv = '{"remain":["--fix"],"cooked":["run","--loglevel","silent","lint","--","--fix"],"original":["run","-s","lint","--","--fix"]}';

        lernaRoot({
          argv: [
            '/node',
            '/node_modules/.bin/lerna-root',
            'run',
            'lint',
            '--scope=',
            '--fix',
          ],
          currentWorkingDirectory: DEMO_PACKAGE,
          entryWorkingDirectory: DEMO_PACKAGE,
        });

        expect(exec).toHaveBeenCalledWith({
          command: 'npm run lint --scope=',
          currentWorkingDirectory: DEMO_ROOT,
          passedArgs: ['--fix'],
          entryWorkingDirectory: DEMO_PACKAGE,
          packageName: demoPackageJson.name,
          scope: demoPackageJson.name,
        });
      });
    });
  });

  describe('repo root from package', () => {
    beforeEach(() => {
      repoRoot.mockReturnValue(DEMO_ROOT);
      importJson.mockReturnValue(demoPackageJson);

      exec.mockImplementation = () => {
      };
    });

    it('should call the build task in the repo root', () => {
      lernaRoot({
        argv: [
          '/node',
          '/node_modules/.bin/lerna-root',
          'run',
          'build',
          '--scope=@example/www-server',
          '--include-filtered-dependencies',
        ],
        currentWorkingDirectory: DEMO_ROOT,
        entryWorkingDirectory: DEMO_PACKAGE,
      });

      expect(exec).toHaveBeenCalledWith({
        command: `${DEMO_ROOT}/node_modules/.bin/lerna run build --scope=@example/www-server --include-filtered-dependencies`,
        currentWorkingDirectory: DEMO_ROOT,
        passedArgs: [],
        entryWorkingDirectory: DEMO_PACKAGE,
        packageName: demoPackageJson.name,
      });
    });

    it('should ignore passed arguments when using a runner', () => {
      process.env[envVars.PASSED_ARGS] = '["--fix"]';
      lernaRoot({
        argv: [
          '/node',
          '/node_modules/.bin/lerna-root',
          'run',
          'lint',
          '--scope=@example/www-server',
          '--stream',
        ],
        currentWorkingDirectory: DEMO_ROOT,
        entryWorkingDirectory: DEMO_PACKAGE,
      });

      expect(exec).toHaveBeenCalledWith({
        command: `${DEMO_ROOT}/node_modules/.bin/lerna run lint --scope=@example/www-server --stream`,
        currentWorkingDirectory: DEMO_ROOT,
        passedArgs: ['--fix'],
        entryWorkingDirectory: DEMO_PACKAGE,
        packageName: demoPackageJson.name,
      });
    });
  });

  describe('package to root to package', () => {
    beforeEach(() => {
      repoRoot.mockReturnValue(DEMO_ROOT);
      importJson.mockReturnValue(demoPackageJson);

      exec.mockImplementation = () => {
      };
    });

    it('should pass through the additional arguments to the command', () => {
      const argv = [
        '/node',
        '/node_modules/.bin/lerna-root',
        'run',
        'lint',
        '--',
        'eslint',
        '--config',
        '../../.eslintrc.json',
        '--ext',
        '.js',
        './',
      ];

      process.env[envVars.PASSED_ARGS] = '["--fix"]';
      process.env[envVars.PACKAGE_SCOPE] = '@example/www-server';
      process.env[envVars.ITERATION_COUNTER] = '2';

      lernaRoot({
        argv,
        currentWorkingDirectory: DEMO_PACKAGE,
        entryWorkingDirectory: DEMO_PACKAGE,
      });

      expect(exec).toHaveBeenCalledWith({
        command: 'eslint --config ../../.eslintrc.json --ext .js ./ --fix',
        currentWorkingDirectory: DEMO_PACKAGE,
        passedArgs: ['--fix'],
        entryWorkingDirectory: DEMO_PACKAGE,
        packageName: demoPackageJson.name,
      });
    });
  });
});
