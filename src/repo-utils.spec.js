jest.mock('fs');

const { existsSync, readFileSync } = require('fs');
const {
  cwd,
  importJson,
  nearestPackage,
  repoRoot,
} = require('./repo-utils');

describe('repo-utils', () => {
  let cwdMock = null;

  beforeEach(() => {
    cwdMock = jest.spyOn(process, 'cwd').mockReturnValue('/tmp');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('cwd', () => {
    it('should return the current working directory', () => {
      const result = cwd();

      expect(result).toBe('/tmp');
      expect(cwdMock).toHaveBeenCalled();
    });
  });

  describe('importJson', () => {
    it('should read a json file and parse it into an object', () => {
      const mockData = { name: 'my-package' };
      readFileSync.mockReturnValue(JSON.stringify(mockData));

      const result = importJson('/tmp/path/package.json');

      expect(result).toEqual(mockData);
    });

    it('should throw an error if unable to read JSON data from file', () => {
      readFileSync.mockReturnValue(Buffer.from([]));

      expect(() => importJson('/tmp/path/package.json')).toThrowError('Unexpected end of JSON input');
    });
  });

  describe('nearestPackage', () => {
    it('should return the path of the package.json found in the current working directory', () => {
      existsSync
        .mockReturnValueOnce(true);

      const found = nearestPackage();

      expect(found).toBe('/tmp/package.json');
      expect(existsSync).toHaveBeenCalledTimes(1);
    });

    it('should return the path of the package.json found in a parent directory', () => {
      existsSync
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);

      const found = nearestPackage('/tmp/path/');

      expect(found).toBe('/tmp/package.json');
      expect(existsSync).toHaveBeenCalledTimes(2);
    });

    it('should throw an error if package.json cannot be found in search or parent directory', () => {
      existsSync.mockReturnValue(false);

      expect(() => nearestPackage('/tmp/path/'))
        .toThrowError('package.json not found');
      expect(existsSync).toHaveBeenCalledTimes(3);
    });
  });

  describe('repoRoot', () => {
    it('should return the path of lerna json relative to the current working directory', () => {
      existsSync
        .mockReturnValueOnce(true);

      const result = repoRoot();

      expect(result).toBe('/tmp');
      expect(cwdMock).toHaveBeenCalled();
      expect(existsSync).toHaveBeenCalled();
    });

    it('should throw an error if lerna.json cannot be found in current or parent directories', () => {
      existsSync.mockReturnValue(false);

      expect(() => repoRoot('/tmp'))
        .toThrowError('lerna.json not found');
      expect(existsSync).toHaveBeenCalledTimes(2);
    });
  });
});
