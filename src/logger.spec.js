/* eslint-disable no-console */
describe('logger', () => {
  let globalConsole = console;

  const doTest = (method, expectations) => {
    it(`should output for calls to ${method}`, () => {
      const logger = require('./logger');
      const args = [method];

      logger[method](...args);
      expectations();
    });
  };

  beforeEach(() => {
    globalConsole = global.console;

    global.console = {
      error: jest.fn(),
      log: jest.fn(),
      warn: jest.fn(),
    };

    process.env.LOG_LEVEL = 'trace';
  });

  afterEach(() => {
    global.console = globalConsole;
    delete process.env.LOG_LEVEL;
  });

  describe('methods', () => {
    describe('trace', () => {
      doTest('trace', () => {
        expect(console.log)
          .toHaveBeenCalledWith('trace');
      });
    });

    describe('debug', () => {
      doTest('debug', () => {
        expect(console.log)
          .toHaveBeenCalledWith('debug');
      });
    });

    describe('info', () => {
      doTest('info', () => {
        expect(console.log)
          .toHaveBeenCalledWith('info');
      });
    });

    describe('warn', () => {
      doTest('warn', () => {
        expect(console.warn)
          .toHaveBeenCalledWith('warn');
      });
    });

    describe('error', () => {
      doTest('error', () => {
        expect(console.error)
          .toHaveBeenCalledWith('error');
      });
    });
  });

  describe('LOG_LEVEL', () => {
    describe('trace', () => {
      beforeEach(() => {
        process.env.LOG_LEVEL = 'trace';
        jest.resetModuleRegistry();
      });

      doTest('trace', () => {
        expect(console.log)
          .toHaveBeenCalled();
      });

      doTest('debug', () => {
        expect(console.log)
          .toHaveBeenCalled();
      });

      doTest('info', () => {
        expect(console.log)
          .toHaveBeenCalled();
      });

      doTest('warn', () => {
        expect(console.warn)
          .toHaveBeenCalled();
      });

      doTest('error', () => {
        expect(console.error)
          .toHaveBeenCalled();
      });
    });

    describe('debug', () => {
      beforeEach(() => {
        process.env.LOG_LEVEL = 'debug';
        jest.resetModuleRegistry();
      });

      doTest('trace', () => {
        expect(console.log)
          .not
          .toHaveBeenCalled();
      });

      doTest('debug', () => {
        expect(console.log)
          .toHaveBeenCalled();
      });

      doTest('info', () => {
        expect(console.log)
          .toHaveBeenCalled();
      });

      doTest('warn', () => {
        expect(console.warn)
          .toHaveBeenCalled();
      });

      doTest('error', () => {
        expect(console.error)
          .toHaveBeenCalled();
      });
    });

    describe('info', () => {
      beforeEach(() => {
        process.env.LOG_LEVEL = 'info';
        jest.resetModuleRegistry();
      });

      doTest('trace', () => {
        expect(console.log)
          .not
          .toHaveBeenCalled();
      });

      doTest('debug', () => {
        expect(console.log)
          .not
          .toHaveBeenCalled();
      });

      doTest('info', () => {
        expect(console.log)
          .toHaveBeenCalled();
      });

      doTest('warn', () => {
        expect(console.warn)
          .toHaveBeenCalled();
      });

      doTest('error', () => {
        expect(console.error)
          .toHaveBeenCalled();
      });
    });

    describe('warn', () => {
      beforeEach(() => {
        process.env.LOG_LEVEL = 'warn';
        jest.resetModuleRegistry();
      });

      doTest('trace', () => {
        expect(console.log)
          .not
          .toHaveBeenCalled();
      });

      doTest('debug', () => {
        expect(console.log)
          .not
          .toHaveBeenCalled();
      });

      doTest('info', () => {
        expect(console.log)
          .not
          .toHaveBeenCalled();
      });

      doTest('warn', () => {
        expect(console.warn)
          .toHaveBeenCalled();
      });

      doTest('error', () => {
        expect(console.error)
          .toHaveBeenCalled();
      });
    });

    describe('error', () => {
      beforeEach(() => {
        process.env.LOG_LEVEL = 'error';
        jest.resetModuleRegistry();
      });

      doTest('trace', () => {
        expect(console.log)
          .not
          .toHaveBeenCalled();
      });

      doTest('debug', () => {
        expect(console.log)
          .not
          .toHaveBeenCalled();
      });

      doTest('info', () => {
        expect(console.log)
          .not
          .toHaveBeenCalled();
      });

      doTest('warn', () => {
        expect(console.warn)
          .not
          .toHaveBeenCalled();
      });

      doTest('error', () => {
        expect(console.error)
          .toHaveBeenCalled();
      });
    });

    describe('silent', () => {
      beforeEach(() => {
        process.env.LOG_LEVEL = 'silent';
        jest.resetModuleRegistry();
      });

      doTest('trace', () => {
        expect(console.log)
          .not
          .toHaveBeenCalled();
      });

      doTest('debug', () => {
        expect(console.log)
          .not
          .toHaveBeenCalled();
      });

      doTest('info', () => {
        expect(console.log)
          .not
          .toHaveBeenCalled();
      });

      doTest('warn', () => {
        expect(console.warn)
          .not
          .toHaveBeenCalled();
      });

      doTest('error', () => {
        expect(console.error)
          .not
          .toHaveBeenCalled();
      });
    });

    describe('unset', () => {
      beforeEach(() => {
        delete process.env.LOG_LEVEL;
        jest.resetModuleRegistry();
      });

      doTest('trace', () => {
        expect(console.log)
          .not
          .toHaveBeenCalled();
      });

      doTest('debug', () => {
        expect(console.log)
          .not
          .toHaveBeenCalled();
      });

      doTest('info', () => {
        expect(console.log)
          .toHaveBeenCalled();
      });

      doTest('warn', () => {
        expect(console.warn)
          .toHaveBeenCalled();
      });

      doTest('error', () => {
        expect(console.error)
          .toHaveBeenCalled();
      });
    });
  });
});
