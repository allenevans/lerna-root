jest.mock('child_process');

const { spawnSync } = require('child_process');
const { exec } = require('./exec');
const env = require('./env');

const execArgsBuilder = (custom = {}) => Object.assign({
  command: 'jest',
  currentWorkingDirectory: '/tmp',
  entryWorkingDirectory: '/',
  packageName: 'my-package',
  scope: undefined,
  passedArgs: undefined,
}, custom);

describe('exec', () => {
  let exitMock = null;

  beforeEach(() => {
    spawnSync.mockReturnValue({ status: 0 });
    exitMock = jest.spyOn(process, 'exit').mockImplementation(() => {
    });
  });

  afterEach(() => {
    exitMock.mockRestore();
  });

  it('should synchronously spawn from command arguments', () => {
    exec(execArgsBuilder());

    expect(spawnSync).toHaveBeenCalledWith(
      'jest',
      {
        cwd: '/tmp',
        env: expect.any(Object),
        shell: true,
        stdio: 'inherit',
      },
    );
  });

  it('should terminate the process if the spawned command terminates with a non-zero exit code', () => {
    const errorCode = 1;

    spawnSync.mockReturnValue({ status: errorCode });

    exec(execArgsBuilder());

    expect(exitMock).toHaveBeenCalledWith(errorCode);
  });

  it('should set scope as an environmental argument', () => {
    exec(execArgsBuilder({
      scope: 'my-package',
    }));

    expect(spawnSync).toHaveBeenCalledWith(
      'jest',
      {
        cwd: '/tmp',
        env: expect.objectContaining({
          [env.PACKAGE_SCOPE]: 'my-package',
        }),
        shell: true,
        stdio: 'inherit',
      },
    );
  });

  it('should set passed arguments as an environmental argument', () => {
    exec(execArgsBuilder({
      passedArgs: ['--fix'],
    }));

    expect(spawnSync).toHaveBeenCalledWith(
      'jest',
      {
        cwd: '/tmp',
        env: expect.objectContaining({
          [env.PASSED_ARGS]: '["--fix"]',
        }),
        shell: true,
        stdio: 'inherit',
      },
    );
  });

  it('should increment the environmental iteration counter', () => {
    const iterationCounter = 3;
    process.env[env.ITERATION_COUNTER] = iterationCounter;

    exec(execArgsBuilder());

    expect(spawnSync).toHaveBeenCalledWith(
      'jest',
      {
        cwd: '/tmp',
        env: expect.objectContaining({
          [env.ITERATION_COUNTER]: iterationCounter + 1,
        }),
        shell: true,
        stdio: 'inherit',
      },
    );
  });
});
