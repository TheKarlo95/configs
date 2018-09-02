var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _path = require('path');

var Path = _interopRequireWildcard(_path);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _srcWorkerHelpers = require('../src/worker-helpers');

var Helpers = _interopRequireWildcard(_srcWorkerHelpers);

var _linterEslintSpec = require('./linter-eslint-spec');

'use babel';

var getFixturesPath = function getFixturesPath(path) {
  return Path.join(__dirname, 'fixtures', path);
};

var globalNodePath = process.platform === 'win32' ? Path.join(getFixturesPath('global-eslint'), 'lib') : getFixturesPath('global-eslint');

describe('Worker Helpers', function () {
  describe('findESLintDirectory', function () {
    it('returns an object with path and type keys', function () {
      var modulesDir = Path.join(getFixturesPath('local-eslint'), 'node_modules');
      var foundEslint = Helpers.findESLintDirectory(modulesDir, {});
      expect(typeof foundEslint === 'object').toBe(true);
      expect(foundEslint.path).toBeDefined();
      expect(foundEslint.type).toBeDefined();
    });

    it('finds a local eslint when useGlobalEslint is false', function () {
      var modulesDir = Path.join(getFixturesPath('local-eslint'), 'node_modules');
      var foundEslint = Helpers.findESLintDirectory(modulesDir, { useGlobalEslint: false });
      var expectedEslintPath = Path.join(getFixturesPath('local-eslint'), 'node_modules', 'eslint');
      expect(foundEslint.path).toEqual(expectedEslintPath);
      expect(foundEslint.type).toEqual('local project');
    });

    it('does not find a local eslint when useGlobalEslint is true', function () {
      var modulesDir = Path.join(getFixturesPath('local-eslint'), 'node_modules');
      var config = { useGlobalEslint: true, globalNodePath: globalNodePath };
      var foundEslint = Helpers.findESLintDirectory(modulesDir, config);
      var expectedEslintPath = Path.join(getFixturesPath('local-eslint'), 'node_modules', 'eslint');
      expect(foundEslint.path).not.toEqual(expectedEslintPath);
      expect(foundEslint.type).not.toEqual('local project');
    });

    it('finds a global eslint when useGlobalEslint is true and a valid globalNodePath is provided', function () {
      var modulesDir = Path.join(getFixturesPath('local-eslint'), 'node_modules');
      var config = { useGlobalEslint: true, globalNodePath: globalNodePath };
      var foundEslint = Helpers.findESLintDirectory(modulesDir, config);
      var expectedEslintPath = process.platform === 'win32' ? Path.join(globalNodePath, 'node_modules', 'eslint') : Path.join(globalNodePath, 'lib', 'node_modules', 'eslint');
      expect(foundEslint.path).toEqual(expectedEslintPath);
      expect(foundEslint.type).toEqual('global');
    });

    it('falls back to the packaged eslint when no local eslint is found', function () {
      var modulesDir = 'not/a/real/path';
      var config = { useGlobalEslint: false };
      var foundEslint = Helpers.findESLintDirectory(modulesDir, config);
      var expectedBundledPath = Path.join(__dirname, '..', 'node_modules', 'eslint');
      expect(foundEslint.path).toEqual(expectedBundledPath);
      expect(foundEslint.type).toEqual('bundled fallback');
    });
  });

  describe('getESLintInstance && getESLintFromDirectory', function () {
    var pathPart = Path.join('testing', 'eslint', 'node_modules');

    it('tries to find an indirect local eslint using an absolute path', function () {
      var path = Path.join(getFixturesPath('indirect-local-eslint'), pathPart);
      var eslint = Helpers.getESLintInstance('', {
        useGlobalEslint: false,
        advancedLocalNodeModules: path
      });
      expect(eslint).toBe('located');
    });

    it('tries to find an indirect local eslint using a relative path', function () {
      var path = Path.join(getFixturesPath('indirect-local-eslint'), pathPart);

      var _atom$project$relativizePath = atom.project.relativizePath(path);

      var _atom$project$relativizePath2 = _slicedToArray(_atom$project$relativizePath, 2);

      var projectPath = _atom$project$relativizePath2[0];
      var relativePath = _atom$project$relativizePath2[1];

      var eslint = Helpers.getESLintInstance('', {
        useGlobalEslint: false,
        advancedLocalNodeModules: relativePath
      }, projectPath);

      expect(eslint).toBe('located');
    });

    it('tries to find a local eslint', function () {
      var eslint = Helpers.getESLintInstance(getFixturesPath('local-eslint'), {});
      expect(eslint).toBe('located');
    });

    it('cries if local eslint is not found', function () {
      expect(function () {
        Helpers.getESLintInstance(getFixturesPath('files', {}));
      }).toThrow();
    });

    it('tries to find a global eslint if config is specified', function () {
      var eslint = Helpers.getESLintInstance(getFixturesPath('local-eslint'), {
        useGlobalEslint: true,
        globalNodePath: globalNodePath
      });
      expect(eslint).toBe('located');
    });

    it('cries if global eslint is not found', function () {
      expect(function () {
        Helpers.getESLintInstance(getFixturesPath('local-eslint'), {
          useGlobalEslint: true,
          globalNodePath: getFixturesPath('files')
        });
      }).toThrow();
    });

    it('tries to find a local eslint with nested node_modules', function () {
      var fileDir = Path.join(getFixturesPath('local-eslint'), 'lib', 'foo.js');
      var eslint = Helpers.getESLintInstance(fileDir, {});
      expect(eslint).toBe('located');
    });
  });

  describe('getConfigPath', function () {
    it('finds .eslintrc', function () {
      var fileDir = getFixturesPath(Path.join('configs', 'no-ext'));
      var expectedPath = Path.join(fileDir, '.eslintrc');
      expect(Helpers.getConfigPath(fileDir)).toBe(expectedPath);
    });

    it('finds .eslintrc.yaml', function () {
      var fileDir = getFixturesPath(Path.join('configs', 'yaml'));
      var expectedPath = Path.join(fileDir, '.eslintrc.yaml');
      expect(Helpers.getConfigPath(fileDir)).toBe(expectedPath);
    });

    it('finds .eslintrc.yml', function () {
      var fileDir = getFixturesPath(Path.join('configs', 'yml'));
      var expectedPath = Path.join(fileDir, '.eslintrc.yml');
      expect(Helpers.getConfigPath(fileDir)).toBe(expectedPath);
    });

    it('finds .eslintrc.js', function () {
      var fileDir = getFixturesPath(Path.join('configs', 'js'));
      var expectedPath = Path.join(fileDir, '.eslintrc.js');
      expect(Helpers.getConfigPath(fileDir)).toBe(expectedPath);
    });

    it('finds .eslintrc.json', function () {
      var fileDir = getFixturesPath(Path.join('configs', 'json'));
      var expectedPath = Path.join(fileDir, '.eslintrc.json');
      expect(Helpers.getConfigPath(fileDir)).toBe(expectedPath);
    });

    it('finds package.json with an eslintConfig property', function () {
      var fileDir = getFixturesPath(Path.join('configs', 'package-json'));
      var expectedPath = Path.join(fileDir, 'package.json');
      expect(Helpers.getConfigPath(fileDir)).toBe(expectedPath);
    });

    it('ignores package.json with no eslintConfig property', function () {
      var fileDir = getFixturesPath(Path.join('configs', 'package-json', 'nested'));
      var expectedPath = getFixturesPath(Path.join('configs', 'package-json', 'package.json'));
      expect(Helpers.getConfigPath(fileDir)).toBe(expectedPath);
    });
  });

  describe('getRelativePath', function () {
    it('return path relative of ignore file if found', function () {
      var fixtureDir = getFixturesPath('eslintignore');
      var fixtureFile = Path.join(fixtureDir, 'ignored.js');
      var relativePath = Helpers.getRelativePath(fixtureDir, fixtureFile, {});
      var expectedPath = Path.relative(Path.join(__dirname, '..'), fixtureFile);
      expect(relativePath).toBe(expectedPath);
    });

    it('does not return path relative to ignore file if config overrides it', function () {
      var fixtureDir = getFixturesPath('eslintignore');
      var fixtureFile = Path.join(fixtureDir, 'ignored.js');
      var relativePath = Helpers.getRelativePath(fixtureDir, fixtureFile, { disableEslintIgnore: true });
      expect(relativePath).toBe('ignored.js');
    });

    it('returns the path relative to the project dir if provided when no ignore file is found', _asyncToGenerator(function* () {
      var fixtureFile = getFixturesPath(Path.join('files', 'good.js'));
      // Copy the file to a temporary folder
      var tempFixturePath = yield (0, _linterEslintSpec.copyFileToTempDir)(fixtureFile);
      var tempDir = Path.dirname(tempFixturePath);
      var filepath = Path.join(tempDir, 'good.js');
      var tempDirParent = Path.dirname(tempDir);

      var relativePath = Helpers.getRelativePath(tempDir, filepath, {}, tempDirParent);
      // Since the project is the parent of the temp dir, the relative path should be
      // the dir containing the file, plus the file. (e.g. asgln3/good.js)
      var expectedPath = Path.join(Path.basename(tempDir), 'good.js');
      expect(relativePath).toBe(expectedPath);
      // Remove the temporary directory
      _rimraf2['default'].sync(tempDir);
    }));

    it('returns just the file being linted if no ignore file is found and no project dir is provided', _asyncToGenerator(function* () {
      var fixtureFile = getFixturesPath(Path.join('files', 'good.js'));
      // Copy the file to a temporary folder
      var tempFixturePath = yield (0, _linterEslintSpec.copyFileToTempDir)(fixtureFile);
      var tempDir = Path.dirname(tempFixturePath);
      var filepath = Path.join(tempDir, 'good.js');

      var relativePath = Helpers.getRelativePath(tempDir, filepath, {}, null);
      expect(relativePath).toBe('good.js');

      // Remove the temporary directory
      _rimraf2['default'].sync(tempDir);
    }));
  });

  describe('getRules', function () {
    it('works with the getRules function introduced in ESLint v4.15.0', function () {
      var cliEngine = {
        getRules: function getRules() {
          return 'foo';
        }
      };
      expect(Helpers.getRules(cliEngine)).toBe('foo');
    });

    it('works with the hidden linter in ESLint v4 before v4.15.0', function () {
      var cliEngine = {
        linter: {
          getRules: function getRules() {
            return 'foo';
          }
        }
      };
      expect(Helpers.getRules(cliEngine)).toBe('foo');
    });

    it('returns an empty Map for old ESLint versions', function () {
      var cliEngine = {};
      expect(Helpers.getRules(cliEngine)).toEqual(new Map());
    });
  });

  describe('didRulesChange', function () {
    var emptyRules = new Map();
    var rules1 = new Map([['rule1', {}]]);
    var rules2 = new Map([['rule1', {}], ['rule2', {}]]);

    it('returns false for empty Maps', function () {
      var newRules = new Map();
      expect(Helpers.didRulesChange(emptyRules, newRules)).toBe(false);
    });

    it('returns false when they are the same', function () {
      expect(Helpers.didRulesChange(rules1, rules1)).toBe(false);
    });

    it('returns true when a new rule is added to an empty list', function () {
      expect(Helpers.didRulesChange(emptyRules, rules1)).toBe(true);
    });

    it('returns true when the last rule is removed', function () {
      expect(Helpers.didRulesChange(rules1, emptyRules)).toBe(true);
    });

    it('returns true when a new rule is added to an existing list', function () {
      expect(Helpers.didRulesChange(rules1, rules2)).toBe(true);
    });

    it('returns true when a rule is removed from an existing list', function () {
      expect(Helpers.didRulesChange(rules2, rules1)).toBe(true);
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvbGludGVyLWVzbGludC9zcGVjL3dvcmtlci1oZWxwZXJzLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBRXNCLE1BQU07O0lBQWhCLElBQUk7O3NCQUNHLFFBQVE7Ozs7Z0NBQ0YsdUJBQXVCOztJQUFwQyxPQUFPOztnQ0FDZSxzQkFBc0I7O0FBTHhELFdBQVcsQ0FBQTs7QUFPWCxJQUFNLGVBQWUsR0FBRyxTQUFsQixlQUFlLENBQUcsSUFBSTtTQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUM7Q0FBQSxDQUFBOztBQUd0RSxJQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sR0FDakQsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQ2xELGVBQWUsQ0FBQyxlQUFlLENBQUMsQ0FBQTs7QUFFbEMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLFlBQU07QUFDL0IsVUFBUSxDQUFDLHFCQUFxQixFQUFFLFlBQU07QUFDcEMsTUFBRSxDQUFDLDJDQUEyQyxFQUFFLFlBQU07QUFDcEQsVUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLEVBQUUsY0FBYyxDQUFDLENBQUE7QUFDN0UsVUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQTtBQUMvRCxZQUFNLENBQUMsT0FBTyxXQUFXLEtBQUssUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ2xELFlBQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDdEMsWUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUs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QUVGLE1BQUUsQ0FBQyx3REFBd0QsRUFBRSxZQUFNO0FBQ2pFLFlBQU0sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUM5RCxDQUFDLENBQUE7O0FBRUYsTUFBRSxDQUFDLDRDQUE0QyxFQUFFLFlBQU07QUFDckQsWUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQzlELENBQUMsQ0FBQTs7QUFFRixNQUFFLENBQUMsMkRBQTJELEVBQUUsWUFBTTtBQUNwRSxZQUFNLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDMUQsQ0FBQyxDQUFBOztBQUVGLE1BQUUsQ0FBQywyREFBMkQsRUFBRSxZQUFNO0FBQ3BFLFlBQU0sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUMxRCxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL2hvbWUvdGhla2FybG85NS8uYXRvbS9wYWNrYWdlcy9saW50ZXItZXNsaW50L3NwZWMvd29ya2VyLWhlbHBlcnMtc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCAqIGFzIFBhdGggZnJvbSAncGF0aCdcbmltcG9ydCByaW1yYWYgZnJvbSAncmltcmFmJ1xuaW1wb3J0ICogYXMgSGVscGVycyBmcm9tICcuLi9zcmMvd29ya2VyLWhlbHBlcnMnXG5pbXBvcnQgeyBjb3B5RmlsZVRvVGVtcERpciB9IGZyb20gJy4vbGludGVyLWVzbGludC1zcGVjJ1xuXG5jb25zdCBnZXRGaXh0dXJlc1BhdGggPSBwYXRoID0+IFBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycsIHBhdGgpXG5cblxuY29uc3QgZ2xvYmFsTm9kZVBhdGggPSBwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInID9cbiAgUGF0aC5qb2luKGdldEZpeHR1cmVzUGF0aCgnZ2xvYmFsLWVzbGludCcpLCAnbGliJykgOlxuICBnZXRGaXh0dXJlc1BhdGgoJ2dsb2JhbC1lc2xpbnQnKVxuXG5kZXNjcmliZSgnV29ya2VyIEhlbHBlcnMnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdmaW5kRVNMaW50RGlyZWN0b3J5JywgKCkgPT4ge1xuICAgIGl0KCdyZXR1cm5zIGFuIG9iamVjdCB3aXRoIHBhdGggYW5kIHR5cGUga2V5cycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZHVsZXNEaXIgPSBQYXRoLmpvaW4oZ2V0Rml4dHVyZXNQYXRoKCdsb2NhbC1lc2xpbnQnKSwgJ25vZGVfbW9kdWxlcycpXG4gICAgICBjb25zdCBmb3VuZEVzbGludCA9IEhlbHBlcnMuZmluZEVTTGludERpcmVjdG9yeShtb2R1bGVzRGlyLCB7fSlcbiAgICAgIGV4cGVjdCh0eXBlb2YgZm91bmRFc2xpbnQgPT09ICdvYmplY3QnKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QoZm91bmRFc2xpbnQucGF0aCkudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KGZvdW5kRXNsaW50LnR5cGUpLnRvQmVEZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ2ZpbmRzIGEgbG9jYWwgZXNsaW50IHdoZW4gdXNlR2xvYmFsRXNsaW50IGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kdWxlc0RpciA9IFBhdGguam9pbihnZXRGaXh0dXJlc1BhdGgoJ2xvY2FsLWVzbGludCcpLCAnbm9kZV9tb2R1bGVzJylcbiAgICAgIGNvbnN0IGZvdW5kRXNsaW50ID0gSGVscGVycy5maW5kRVNMaW50RGlyZWN0b3J5KG1vZHVsZXNEaXIsIHsgdXNlR2xvYmFsRXNsaW50OiBmYWxzZSB9KVxuICAgICAgY29uc3QgZXhwZWN0ZWRFc2xpbnRQYXRoID0gUGF0aC5qb2luKGdldEZpeHR1cmVzUGF0aCgnbG9jYWwtZXNsaW50JyksICdub2RlX21vZHVsZXMnLCAnZXNsaW50JylcbiAgICAgIGV4cGVjdChmb3VuZEVzbGludC5wYXRoKS50b0VxdWFsKGV4cGVjdGVkRXNsaW50UGF0aClcbiAgICAgIGV4cGVjdChmb3VuZEVzbGludC50eXBlKS50b0VxdWFsKCdsb2NhbCBwcm9qZWN0JylcbiAgICB9KVxuXG4gICAgaXQoJ2RvZXMgbm90IGZpbmQgYSBsb2NhbCBlc2xpbnQgd2hlbiB1c2VHbG9iYWxFc2xpbnQgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZHVsZXNEaXIgPSBQYXRoLmpvaW4oZ2V0Rml4dHVyZXNQYXRoKCdsb2NhbC1lc2xpbnQnKSwgJ25vZGVfbW9kdWxlcycpXG4gICAgICBjb25zdCBjb25maWcgPSB7IHVzZUdsb2JhbEVzbGludDogdHJ1ZSwgZ2xvYmFsTm9kZVBhdGggfVxuICAgICAgY29uc3QgZm91bmRFc2xpbnQgPSBIZWxwZXJzLmZpbmRFU0xpbnREaXJlY3RvcnkobW9kdWxlc0RpciwgY29uZmlnKVxuICAgICAgY29uc3QgZXhwZWN0ZWRFc2xpbnRQYXRoID0gUGF0aC5qb2luKGdldEZpeHR1cmVzUGF0aCgnbG9jYWwtZXNsaW50JyksICdub2RlX21vZHVsZXMnLCAnZXNsaW50JylcbiAgICAgIGV4cGVjdChmb3VuZEVzbGludC5wYXRoKS5ub3QudG9FcXVhbChleHBlY3RlZEVzbGludFBhdGgpXG4gICAgICBleHBlY3QoZm91bmRFc2xpbnQudHlwZSkubm90LnRvRXF1YWwoJ2xvY2FsIHByb2plY3QnKVxuICAgIH0pXG5cbiAgICBpdCgnZmluZHMgYSBnbG9iYWwgZXNsaW50IHdoZW4gdXNlR2xvYmFsRXNsaW50IGlzIHRydWUgYW5kIGEgdmFsaWQgZ2xvYmFsTm9kZVBhdGggaXMgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2R1bGVzRGlyID0gUGF0aC5qb2luKGdldEZpeHR1cmVzUGF0aCgnbG9jYWwtZXNsaW50JyksICdub2RlX21vZHVsZXMnKVxuICAgICAgY29uc3QgY29uZmlnID0geyB1c2VHbG9iYWxFc2xpbnQ6IHRydWUsIGdsb2JhbE5vZGVQYXRoIH1cbiAgICAgIGNvbnN0IGZvdW5kRXNsaW50ID0gSGVscGVycy5maW5kRVNMaW50RGlyZWN0b3J5KG1vZHVsZXNEaXIsIGNvbmZpZylcbiAgICAgIGNvbnN0IGV4cGVjdGVkRXNsaW50UGF0aCA9IHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMidcbiAgICAgICAgPyBQYXRoLmpvaW4oZ2xvYmFsTm9kZVBhdGgsICdub2RlX21vZHVsZXMnLCAnZXNsaW50JylcbiAgICAgICAgOiBQYXRoLmpvaW4oZ2xvYmFsTm9kZVBhdGgsICdsaWInLCAnbm9kZV9tb2R1bGVzJywgJ2VzbGludCcpXG4gICAgICBleHBlY3QoZm91bmRFc2xpbnQucGF0aCkudG9FcXVhbChleHBlY3RlZEVzbGludFBhdGgpXG4gICAgICBleHBlY3QoZm91bmRFc2xpbnQudHlwZSkudG9FcXVhbCgnZ2xvYmFsJylcbiAgICB9KVxuXG4gICAgaXQoJ2ZhbGxzIGJhY2sgdG8gdGhlIHBhY2thZ2VkIGVzbGludCB3aGVuIG5vIGxvY2FsIGVzbGludCBpcyBmb3VuZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZHVsZXNEaXIgPSAnbm90L2EvcmVhbC9wYXRoJ1xuICAgICAgY29uc3QgY29uZmlnID0geyB1c2VHbG9iYWxFc2xpbnQ6IGZhbHNlIH1cbiAgICAgIGNvbnN0IGZvdW5kRXNsaW50ID0gSGVscGVycy5maW5kRVNMaW50RGlyZWN0b3J5KG1vZHVsZXNEaXIsIGNvbmZpZylcbiAgICAgIGNvbnN0IGV4cGVjdGVkQnVuZGxlZFBhdGggPSBQYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnbm9kZV9tb2R1bGVzJywgJ2VzbGludCcpXG4gICAgICBleHBlY3QoZm91bmRFc2xpbnQucGF0aCkudG9FcXVhbChleHBlY3RlZEJ1bmRsZWRQYXRoKVxuICAgICAgZXhwZWN0KGZvdW5kRXNsaW50LnR5cGUpLnRvRXF1YWwoJ2J1bmRsZWQgZmFsbGJhY2snKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2dldEVTTGludEluc3RhbmNlICYmIGdldEVTTGludEZyb21EaXJlY3RvcnknLCAoKSA9PiB7XG4gICAgY29uc3QgcGF0aFBhcnQgPSBQYXRoLmpvaW4oJ3Rlc3RpbmcnLCAnZXNsaW50JywgJ25vZGVfbW9kdWxlcycpXG5cbiAgICBpdCgndHJpZXMgdG8gZmluZCBhbiBpbmRpcmVjdCBsb2NhbCBlc2xpbnQgdXNpbmcgYW4gYWJzb2x1dGUgcGF0aCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHBhdGggPSBQYXRoLmpvaW4oZ2V0Rml4dHVyZXNQYXRoKCdpbmRpcmVjdC1sb2NhbC1lc2xpbnQnKSwgcGF0aFBhcnQpXG4gICAgICBjb25zdCBlc2xpbnQgPSBIZWxwZXJzLmdldEVTTGludEluc3RhbmNlKCcnLCB7XG4gICAgICAgIHVzZUdsb2JhbEVzbGludDogZmFsc2UsXG4gICAgICAgIGFkdmFuY2VkTG9jYWxOb2RlTW9kdWxlczogcGF0aFxuICAgICAgfSlcbiAgICAgIGV4cGVjdChlc2xpbnQpLnRvQmUoJ2xvY2F0ZWQnKVxuICAgIH0pXG5cbiAgICBpdCgndHJpZXMgdG8gZmluZCBhbiBpbmRpcmVjdCBsb2NhbCBlc2xpbnQgdXNpbmcgYSByZWxhdGl2ZSBwYXRoJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGF0aCA9IFBhdGguam9pbihnZXRGaXh0dXJlc1BhdGgoJ2luZGlyZWN0LWxvY2FsLWVzbGludCcpLCBwYXRoUGFydClcbiAgICAgIGNvbnN0IFtwcm9qZWN0UGF0aCwgcmVsYXRpdmVQYXRoXSA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChwYXRoKVxuXG4gICAgICBjb25zdCBlc2xpbnQgPSBIZWxwZXJzLmdldEVTTGludEluc3RhbmNlKCcnLCB7XG4gICAgICAgIHVzZUdsb2JhbEVzbGludDogZmFsc2UsXG4gICAgICAgIGFkdmFuY2VkTG9jYWxOb2RlTW9kdWxlczogcmVsYXRpdmVQYXRoXG4gICAgICB9LCBwcm9qZWN0UGF0aClcblxuICAgICAgZXhwZWN0KGVzbGludCkudG9CZSgnbG9jYXRlZCcpXG4gICAgfSlcblxuICAgIGl0KCd0cmllcyB0byBmaW5kIGEgbG9jYWwgZXNsaW50JywgKCkgPT4ge1xuICAgICAgY29uc3QgZXNsaW50ID0gSGVscGVycy5nZXRFU0xpbnRJbnN0YW5jZShnZXRGaXh0dXJlc1BhdGgoJ2xvY2FsLWVzbGludCcpLCB7fSlcbiAgICAgIGV4cGVjdChlc2xpbnQpLnRvQmUoJ2xvY2F0ZWQnKVxuICAgIH0pXG5cbiAgICBpdCgnY3JpZXMgaWYgbG9jYWwgZXNsaW50IGlzIG5vdCBmb3VuZCcsICgpID0+IHtcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIEhlbHBlcnMuZ2V0RVNMaW50SW5zdGFuY2UoZ2V0Rml4dHVyZXNQYXRoKCdmaWxlcycsIHt9KSlcbiAgICAgIH0pLnRvVGhyb3coKVxuICAgIH0pXG5cbiAgICBpdCgndHJpZXMgdG8gZmluZCBhIGdsb2JhbCBlc2xpbnQgaWYgY29uZmlnIGlzIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGVzbGludCA9IEhlbHBlcnMuZ2V0RVNMaW50SW5zdGFuY2UoZ2V0Rml4dHVyZXNQYXRoKCdsb2NhbC1lc2xpbnQnKSwge1xuICAgICAgICB1c2VHbG9iYWxFc2xpbnQ6IHRydWUsXG4gICAgICAgIGdsb2JhbE5vZGVQYXRoXG4gICAgICB9KVxuICAgICAgZXhwZWN0KGVzbGludCkudG9CZSgnbG9jYXRlZCcpXG4gICAgfSlcblxuICAgIGl0KCdjcmllcyBpZiBnbG9iYWwgZXNsaW50IGlzIG5vdCBmb3VuZCcsICgpID0+IHtcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIEhlbHBlcnMuZ2V0RVNMaW50SW5zdGFuY2UoZ2V0Rml4dHVyZXNQYXRoKCdsb2NhbC1lc2xpbnQnKSwge1xuICAgICAgICAgIHVzZUdsb2JhbEVzbGludDogdHJ1ZSxcbiAgICAgICAgICBnbG9iYWxOb2RlUGF0aDogZ2V0Rml4dHVyZXNQYXRoKCdmaWxlcycpXG4gICAgICAgIH0pXG4gICAgICB9KS50b1Rocm93KClcbiAgICB9KVxuXG4gICAgaXQoJ3RyaWVzIHRvIGZpbmQgYSBsb2NhbCBlc2xpbnQgd2l0aCBuZXN0ZWQgbm9kZV9tb2R1bGVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZURpciA9IFBhdGguam9pbihnZXRGaXh0dXJlc1BhdGgoJ2xvY2FsLWVzbGludCcpLCAnbGliJywgJ2Zvby5qcycpXG4gICAgICBjb25zdCBlc2xpbnQgPSBIZWxwZXJzLmdldEVTTGludEluc3RhbmNlKGZpbGVEaXIsIHt9KVxuICAgICAgZXhwZWN0KGVzbGludCkudG9CZSgnbG9jYXRlZCcpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnZ2V0Q29uZmlnUGF0aCcsICgpID0+IHtcbiAgICBpdCgnZmluZHMgLmVzbGludHJjJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZURpciA9IGdldEZpeHR1cmVzUGF0aChQYXRoLmpvaW4oJ2NvbmZpZ3MnLCAnbm8tZXh0JykpXG4gICAgICBjb25zdCBleHBlY3RlZFBhdGggPSBQYXRoLmpvaW4oZmlsZURpciwgJy5lc2xpbnRyYycpXG4gICAgICBleHBlY3QoSGVscGVycy5nZXRDb25maWdQYXRoKGZpbGVEaXIpKS50b0JlKGV4cGVjdGVkUGF0aClcbiAgICB9KVxuXG4gICAgaXQoJ2ZpbmRzIC5lc2xpbnRyYy55YW1sJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZURpciA9IGdldEZpeHR1cmVzUGF0aChQYXRoLmpvaW4oJ2NvbmZpZ3MnLCAneWFtbCcpKVxuICAgICAgY29uc3QgZXhwZWN0ZWRQYXRoID0gUGF0aC5qb2luKGZpbGVEaXIsICcuZXNsaW50cmMueWFtbCcpXG4gICAgICBleHBlY3QoSGVscGVycy5nZXRDb25maWdQYXRoKGZpbGVEaXIpKS50b0JlKGV4cGVjdGVkUGF0aClcbiAgICB9KVxuXG4gICAgaXQoJ2ZpbmRzIC5lc2xpbnRyYy55bWwnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmaWxlRGlyID0gZ2V0Rml4dHVyZXNQYXRoKFBhdGguam9pbignY29uZmlncycsICd5bWwnKSlcbiAgICAgIGNvbnN0IGV4cGVjdGVkUGF0aCA9IFBhdGguam9pbihmaWxlRGlyLCAnLmVzbGludHJjLnltbCcpXG4gICAgICBleHBlY3QoSGVscGVycy5nZXRDb25maWdQYXRoKGZpbGVEaXIpKS50b0JlKGV4cGVjdGVkUGF0aClcbiAgICB9KVxuXG4gICAgaXQoJ2ZpbmRzIC5lc2xpbnRyYy5qcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGVEaXIgPSBnZXRGaXh0dXJlc1BhdGgoUGF0aC5qb2luKCdjb25maWdzJywgJ2pzJykpXG4gICAgICBjb25zdCBleHBlY3RlZFBhdGggPSBQYXRoLmpvaW4oZmlsZURpciwgJy5lc2xpbnRyYy5qcycpXG4gICAgICBleHBlY3QoSGVscGVycy5nZXRDb25maWdQYXRoKGZpbGVEaXIpKS50b0JlKGV4cGVjdGVkUGF0aClcbiAgICB9KVxuXG4gICAgaXQoJ2ZpbmRzIC5lc2xpbnRyYy5qc29uJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZURpciA9IGdldEZpeHR1cmVzUGF0aChQYXRoLmpvaW4oJ2NvbmZpZ3MnLCAnanNvbicpKVxuICAgICAgY29uc3QgZXhwZWN0ZWRQYXRoID0gUGF0aC5qb2luKGZpbGVEaXIsICcuZXNsaW50cmMuanNvbicpXG4gICAgICBleHBlY3QoSGVscGVycy5nZXRDb25maWdQYXRoKGZpbGVEaXIpKS50b0JlKGV4cGVjdGVkUGF0aClcbiAgICB9KVxuXG4gICAgaXQoJ2ZpbmRzIHBhY2thZ2UuanNvbiB3aXRoIGFuIGVzbGludENvbmZpZyBwcm9wZXJ0eScsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGVEaXIgPSBnZXRGaXh0dXJlc1BhdGgoUGF0aC5qb2luKCdjb25maWdzJywgJ3BhY2thZ2UtanNvbicpKVxuICAgICAgY29uc3QgZXhwZWN0ZWRQYXRoID0gUGF0aC5qb2luKGZpbGVEaXIsICdwYWNrYWdlLmpzb24nKVxuICAgICAgZXhwZWN0KEhlbHBlcnMuZ2V0Q29uZmlnUGF0aChmaWxlRGlyKSkudG9CZShleHBlY3RlZFBhdGgpXG4gICAgfSlcblxuICAgIGl0KCdpZ25vcmVzIHBhY2thZ2UuanNvbiB3aXRoIG5vIGVzbGludENvbmZpZyBwcm9wZXJ0eScsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGVEaXIgPSBnZXRGaXh0dXJlc1BhdGgoUGF0aC5qb2luKCdjb25maWdzJywgJ3BhY2thZ2UtanNvbicsICduZXN0ZWQnKSlcbiAgICAgIGNvbnN0IGV4cGVjdGVkUGF0aCA9IGdldEZpeHR1cmVzUGF0aChQYXRoLmpvaW4oJ2NvbmZpZ3MnLCAncGFja2FnZS1qc29uJywgJ3BhY2thZ2UuanNvbicpKVxuICAgICAgZXhwZWN0KEhlbHBlcnMuZ2V0Q29uZmlnUGF0aChmaWxlRGlyKSkudG9CZShleHBlY3RlZFBhdGgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnZ2V0UmVsYXRpdmVQYXRoJywgKCkgPT4ge1xuICAgIGl0KCdyZXR1cm4gcGF0aCByZWxhdGl2ZSBvZiBpZ25vcmUgZmlsZSBpZiBmb3VuZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpeHR1cmVEaXIgPSBnZXRGaXh0dXJlc1BhdGgoJ2VzbGludGlnbm9yZScpXG4gICAgICBjb25zdCBmaXh0dXJlRmlsZSA9IFBhdGguam9pbihmaXh0dXJlRGlyLCAnaWdub3JlZC5qcycpXG4gICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSBIZWxwZXJzLmdldFJlbGF0aXZlUGF0aChmaXh0dXJlRGlyLCBmaXh0dXJlRmlsZSwge30pXG4gICAgICBjb25zdCBleHBlY3RlZFBhdGggPSBQYXRoLnJlbGF0aXZlKFBhdGguam9pbihfX2Rpcm5hbWUsICcuLicpLCBmaXh0dXJlRmlsZSlcbiAgICAgIGV4cGVjdChyZWxhdGl2ZVBhdGgpLnRvQmUoZXhwZWN0ZWRQYXRoKVxuICAgIH0pXG5cbiAgICBpdCgnZG9lcyBub3QgcmV0dXJuIHBhdGggcmVsYXRpdmUgdG8gaWdub3JlIGZpbGUgaWYgY29uZmlnIG92ZXJyaWRlcyBpdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpeHR1cmVEaXIgPSBnZXRGaXh0dXJlc1BhdGgoJ2VzbGludGlnbm9yZScpXG4gICAgICBjb25zdCBmaXh0dXJlRmlsZSA9IFBhdGguam9pbihmaXh0dXJlRGlyLCAnaWdub3JlZC5qcycpXG4gICAgICBjb25zdCByZWxhdGl2ZVBhdGggPVxuICAgICAgICBIZWxwZXJzLmdldFJlbGF0aXZlUGF0aChmaXh0dXJlRGlyLCBmaXh0dXJlRmlsZSwgeyBkaXNhYmxlRXNsaW50SWdub3JlOiB0cnVlIH0pXG4gICAgICBleHBlY3QocmVsYXRpdmVQYXRoKS50b0JlKCdpZ25vcmVkLmpzJylcbiAgICB9KVxuXG4gICAgaXQoJ3JldHVybnMgdGhlIHBhdGggcmVsYXRpdmUgdG8gdGhlIHByb2plY3QgZGlyIGlmIHByb3ZpZGVkIHdoZW4gbm8gaWdub3JlIGZpbGUgaXMgZm91bmQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBmaXh0dXJlRmlsZSA9IGdldEZpeHR1cmVzUGF0aChQYXRoLmpvaW4oJ2ZpbGVzJywgJ2dvb2QuanMnKSlcbiAgICAgIC8vIENvcHkgdGhlIGZpbGUgdG8gYSB0ZW1wb3JhcnkgZm9sZGVyXG4gICAgICBjb25zdCB0ZW1wRml4dHVyZVBhdGggPSBhd2FpdCBjb3B5RmlsZVRvVGVtcERpcihmaXh0dXJlRmlsZSlcbiAgICAgIGNvbnN0IHRlbXBEaXIgPSBQYXRoLmRpcm5hbWUodGVtcEZpeHR1cmVQYXRoKVxuICAgICAgY29uc3QgZmlsZXBhdGggPSBQYXRoLmpvaW4odGVtcERpciwgJ2dvb2QuanMnKVxuICAgICAgY29uc3QgdGVtcERpclBhcmVudCA9IFBhdGguZGlybmFtZSh0ZW1wRGlyKVxuXG4gICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSBIZWxwZXJzLmdldFJlbGF0aXZlUGF0aCh0ZW1wRGlyLCBmaWxlcGF0aCwge30sIHRlbXBEaXJQYXJlbnQpXG4gICAgICAvLyBTaW5jZSB0aGUgcHJvamVjdCBpcyB0aGUgcGFyZW50IG9mIHRoZSB0ZW1wIGRpciwgdGhlIHJlbGF0aXZlIHBhdGggc2hvdWxkIGJlXG4gICAgICAvLyB0aGUgZGlyIGNvbnRhaW5pbmcgdGhlIGZpbGUsIHBsdXMgdGhlIGZpbGUuIChlLmcuIGFzZ2xuMy9nb29kLmpzKVxuICAgICAgY29uc3QgZXhwZWN0ZWRQYXRoID0gUGF0aC5qb2luKFBhdGguYmFzZW5hbWUodGVtcERpciksICdnb29kLmpzJylcbiAgICAgIGV4cGVjdChyZWxhdGl2ZVBhdGgpLnRvQmUoZXhwZWN0ZWRQYXRoKVxuICAgICAgLy8gUmVtb3ZlIHRoZSB0ZW1wb3JhcnkgZGlyZWN0b3J5XG4gICAgICByaW1yYWYuc3luYyh0ZW1wRGlyKVxuICAgIH0pXG5cbiAgICBpdCgncmV0dXJucyBqdXN0IHRoZSBmaWxlIGJlaW5nIGxpbnRlZCBpZiBubyBpZ25vcmUgZmlsZSBpcyBmb3VuZCBhbmQgbm8gcHJvamVjdCBkaXIgaXMgcHJvdmlkZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBmaXh0dXJlRmlsZSA9IGdldEZpeHR1cmVzUGF0aChQYXRoLmpvaW4oJ2ZpbGVzJywgJ2dvb2QuanMnKSlcbiAgICAgIC8vIENvcHkgdGhlIGZpbGUgdG8gYSB0ZW1wb3JhcnkgZm9sZGVyXG4gICAgICBjb25zdCB0ZW1wRml4dHVyZVBhdGggPSBhd2FpdCBjb3B5RmlsZVRvVGVtcERpcihmaXh0dXJlRmlsZSlcbiAgICAgIGNvbnN0IHRlbXBEaXIgPSBQYXRoLmRpcm5hbWUodGVtcEZpeHR1cmVQYXRoKVxuICAgICAgY29uc3QgZmlsZXBhdGggPSBQYXRoLmpvaW4odGVtcERpciwgJ2dvb2QuanMnKVxuXG4gICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSBIZWxwZXJzLmdldFJlbGF0aXZlUGF0aCh0ZW1wRGlyLCBmaWxlcGF0aCwge30sIG51bGwpXG4gICAgICBleHBlY3QocmVsYXRpdmVQYXRoKS50b0JlKCdnb29kLmpzJylcblxuICAgICAgLy8gUmVtb3ZlIHRoZSB0ZW1wb3JhcnkgZGlyZWN0b3J5XG4gICAgICByaW1yYWYuc3luYyh0ZW1wRGlyKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2dldFJ1bGVzJywgKCkgPT4ge1xuICAgIGl0KCd3b3JrcyB3aXRoIHRoZSBnZXRSdWxlcyBmdW5jdGlvbiBpbnRyb2R1Y2VkIGluIEVTTGludCB2NC4xNS4wJywgKCkgPT4ge1xuICAgICAgY29uc3QgY2xpRW5naW5lID0ge1xuICAgICAgICBnZXRSdWxlczogKCkgPT4gJ2ZvbydcbiAgICAgIH1cbiAgICAgIGV4cGVjdChIZWxwZXJzLmdldFJ1bGVzKGNsaUVuZ2luZSkpLnRvQmUoJ2ZvbycpXG4gICAgfSlcblxuICAgIGl0KCd3b3JrcyB3aXRoIHRoZSBoaWRkZW4gbGludGVyIGluIEVTTGludCB2NCBiZWZvcmUgdjQuMTUuMCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGNsaUVuZ2luZSA9IHtcbiAgICAgICAgbGludGVyOiB7XG4gICAgICAgICAgZ2V0UnVsZXM6ICgpID0+ICdmb28nXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGV4cGVjdChIZWxwZXJzLmdldFJ1bGVzKGNsaUVuZ2luZSkpLnRvQmUoJ2ZvbycpXG4gICAgfSlcblxuICAgIGl0KCdyZXR1cm5zIGFuIGVtcHR5IE1hcCBmb3Igb2xkIEVTTGludCB2ZXJzaW9ucycsICgpID0+IHtcbiAgICAgIGNvbnN0IGNsaUVuZ2luZSA9IHt9XG4gICAgICBleHBlY3QoSGVscGVycy5nZXRSdWxlcyhjbGlFbmdpbmUpKS50b0VxdWFsKG5ldyBNYXAoKSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdkaWRSdWxlc0NoYW5nZScsICgpID0+IHtcbiAgICBjb25zdCBlbXB0eVJ1bGVzID0gbmV3IE1hcCgpXG4gICAgY29uc3QgcnVsZXMxID0gbmV3IE1hcChbWydydWxlMScsIHt9XV0pXG4gICAgY29uc3QgcnVsZXMyID0gbmV3IE1hcChbWydydWxlMScsIHt9XSwgWydydWxlMicsIHt9XV0pXG5cbiAgICBpdCgncmV0dXJucyBmYWxzZSBmb3IgZW1wdHkgTWFwcycsICgpID0+IHtcbiAgICAgIGNvbnN0IG5ld1J1bGVzID0gbmV3IE1hcCgpXG4gICAgICBleHBlY3QoSGVscGVycy5kaWRSdWxlc0NoYW5nZShlbXB0eVJ1bGVzLCBuZXdSdWxlcykpLnRvQmUoZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdyZXR1cm5zIGZhbHNlIHdoZW4gdGhleSBhcmUgdGhlIHNhbWUnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoSGVscGVycy5kaWRSdWxlc0NoYW5nZShydWxlczEsIHJ1bGVzMSkpLnRvQmUoZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdyZXR1cm5zIHRydWUgd2hlbiBhIG5ldyBydWxlIGlzIGFkZGVkIHRvIGFuIGVtcHR5IGxpc3QnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoSGVscGVycy5kaWRSdWxlc0NoYW5nZShlbXB0eVJ1bGVzLCBydWxlczEpKS50b0JlKHRydWUpXG4gICAgfSlcblxuICAgIGl0KCdyZXR1cm5zIHRydWUgd2hlbiB0aGUgbGFzdCBydWxlIGlzIHJlbW92ZWQnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoSGVscGVycy5kaWRSdWxlc0NoYW5nZShydWxlczEsIGVtcHR5UnVsZXMpKS50b0JlKHRydWUpXG4gICAgfSlcblxuICAgIGl0KCdyZXR1cm5zIHRydWUgd2hlbiBhIG5ldyBydWxlIGlzIGFkZGVkIHRvIGFuIGV4aXN0aW5nIGxpc3QnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoSGVscGVycy5kaWRSdWxlc0NoYW5nZShydWxlczEsIHJ1bGVzMikpLnRvQmUodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3JldHVybnMgdHJ1ZSB3aGVuIGEgcnVsZSBpcyByZW1vdmVkIGZyb20gYW4gZXhpc3RpbmcgbGlzdCcsICgpID0+IHtcbiAgICAgIGV4cGVjdChIZWxwZXJzLmRpZFJ1bGVzQ2hhbmdlKHJ1bGVzMiwgcnVsZXMxKSkudG9CZSh0cnVlKVxuICAgIH0pXG4gIH0pXG59KVxuIl19