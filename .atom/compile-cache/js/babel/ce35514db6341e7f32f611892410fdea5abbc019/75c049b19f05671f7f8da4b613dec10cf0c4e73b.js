Object.defineProperty(exports, '__esModule', {
  value: true
});

/**
 * Utility helper to copy a file into the OS temp directory.
 *
 * @param  {string} fileToCopyPath  Path of the file to be copied
 * @return {string}                 Full path of the file in copy destination
 */
// eslint-disable-next-line import/prefer-default-export

var copyFileToTempDir = _asyncToGenerator(function* (fileToCopyPath) {
  var tempFixtureDir = fs.mkdtempSync((0, _os.tmpdir)() + path.sep);
  return copyFileToDir(fileToCopyPath, tempFixtureDir);
});

exports.copyFileToTempDir = copyFileToTempDir;

var getNotification = _asyncToGenerator(function* (expectedMessage) {
  return new Promise(function (resolve) {
    var notificationSub = undefined;
    var newNotification = function newNotification(notification) {
      if (notification.getMessage() !== expectedMessage) {
        // As the specs execute asynchronously, it's possible a notification
        // from a different spec was grabbed, if the message doesn't match what
        // is expected simply return and keep waiting for the next message.
        return;
      }
      // Dispose of the notification subscription
      notificationSub.dispose();
      resolve(notification);
    };
    // Subscribe to Atom's notifications
    notificationSub = atom.notifications.onDidAddNotification(newNotification);
  });
});

var makeFixes = _asyncToGenerator(function* (textEditor) {
  var editorReloadPromise = new Promise(function (resolve) {
    // Subscribe to file reload events
    var editorReloadSubscription = textEditor.getBuffer().onDidReload(function () {
      editorReloadSubscription.dispose();
      resolve();
    });
  });

  var expectedMessage = 'Linter-ESLint: Fix complete.';
  // Subscribe to notification events
  var notificationPromise = getNotification(expectedMessage);

  // Subscriptions now active for Editor Reload and Message Notification
  // Send off a fix request.
  atom.commands.dispatch(atom.views.getView(textEditor), 'linter-eslint:fix-file');

  var notification = yield notificationPromise;
  expect(notification.getMessage()).toBe(expectedMessage);
  expect(notification.getType()).toBe('success');

  // After editor reloads, it should be safe for consuming test to resume.
  return editorReloadPromise;
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _os = require('os');

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

// eslint-disable-next-line no-unused-vars

var _jasmineFix = require('jasmine-fix');

var _srcMain = require('../src/main');

var _srcMain2 = _interopRequireDefault(_srcMain);

'use babel';

var fixturesDir = path.join(__dirname, 'fixtures');

var fixtures = {
  good: ['files', 'good.js'],
  bad: ['files', 'bad.js'],
  badInline: ['files', 'badInline.js'],
  empty: ['files', 'empty.js'],
  fix: ['files', 'fix.js'],
  cache: ['files', '.eslintcache'],
  config: ['configs', '.eslintrc.yml'],
  ignored: ['eslintignore', 'ignored.js'],
  endRange: ['end-range', 'no-unreachable.js'],
  badCache: ['badCache'],
  modifiedIgnore: ['modified-ignore-rule', 'foo.js'],
  modifiedIgnoreSpace: ['modified-ignore-rule', 'foo-space.js'],
  importing: ['import-resolution', 'nested', 'importing.js'],
  badImport: ['import-resolution', 'nested', 'badImport.js'],
  fixablePlugin: ['plugin-import', 'life.js'],
  eslintignoreDir: ['eslintignore'],
  eslintIgnoreKeyDir: ['configs', 'eslintignorekey']
};

var paths = Object.keys(fixtures).reduce(function (accumulator, fixture) {
  var acc = accumulator;
  acc[fixture] = path.join.apply(path, [fixturesDir].concat(_toConsumableArray(fixtures[fixture])));
  return acc;
}, {});

/**
 * Async helper to copy a file from one place to another on the filesystem.
 * @param  {string} fileToCopyPath  Path of the file to be copied
 * @param  {string} destinationDir  Directory to paste the file into
 * @return {string}                 Full path of the file in copy destination
 */
function copyFileToDir(fileToCopyPath, destinationDir) {
  return new Promise(function (resolve) {
    var destinationPath = path.join(destinationDir, path.basename(fileToCopyPath));
    var ws = fs.createWriteStream(destinationPath);
    ws.on('close', function () {
      return resolve(destinationPath);
    });
    fs.createReadStream(fileToCopyPath).pipe(ws);
  });
}

describe('The eslint provider for Linter', function () {
  var linterProvider = _srcMain2['default'].provideLinter();
  var lint = linterProvider.lint;

  (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
    atom.config.set('linter-eslint.disableFSCache', false);
    atom.config.set('linter-eslint.disableEslintIgnore', true);

    // Activate the JavaScript language so Atom knows what the files are
    yield atom.packages.activatePackage('language-javascript');
    // Activate the provider
    yield atom.packages.activatePackage('linter-eslint');
  }));

  describe('checks bad.js and', function () {
    var editor = null;
    (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
      editor = yield atom.workspace.open(paths.bad);
    }));

    (0, _jasmineFix.it)('verifies the messages', _asyncToGenerator(function* () {
      var messages = yield lint(editor);
      expect(messages.length).toBe(2);

      var expected0 = "'foo' is not defined. (no-undef)";
      var expected0Url = 'https://eslint.org/docs/rules/no-undef';
      var expected1 = 'Extra semicolon. (semi)';
      var expected1Url = 'https://eslint.org/docs/rules/semi';

      expect(messages[0].severity).toBe('error');
      expect(messages[0].excerpt).toBe(expected0);
      expect(messages[0].url).toBe(expected0Url);
      expect(messages[0].location.file).toBe(paths.bad);
      expect(messages[0].location.position).toEqual([[0, 0], [0, 3]]);
      expect(messages[0].solutions).not.toBeDefined();

      expect(messages[1].severity).toBe('error');
      expect(messages[1].excerpt).toBe(expected1);
      expect(messages[1].url).toBe(expected1Url);
      expect(messages[1].location.file).toBe(paths.bad);
      expect(messages[1].location.position).toEqual([[0, 8], [0, 9]]);
      expect(messages[1].solutions.length).toBe(1);
      expect(messages[1].solutions[0].position).toEqual([[0, 6], [0, 9]]);
      expect(messages[1].solutions[0].replaceWith).toBe('42');
    }));
  });

  (0, _jasmineFix.it)('finds nothing wrong with an empty file', _asyncToGenerator(function* () {
    var editor = yield atom.workspace.open(paths.empty);
    var messages = yield lint(editor);

    expect(messages.length).toBe(0);
  }));

  (0, _jasmineFix.it)('finds nothing wrong with a valid file', _asyncToGenerator(function* () {
    var editor = yield atom.workspace.open(paths.good);
    var messages = yield lint(editor);

    expect(messages.length).toBe(0);
  }));

  (0, _jasmineFix.it)('reports the fixes for fixable errors', _asyncToGenerator(function* () {
    var editor = yield atom.workspace.open(paths.fix);
    var messages = yield lint(editor);

    expect(messages[0].solutions[0].position).toEqual([[0, 10], [1, 8]]);
    expect(messages[0].solutions[0].replaceWith).toBe('6\nfunction');

    expect(messages[1].solutions[0].position).toEqual([[2, 0], [2, 1]]);
    expect(messages[1].solutions[0].replaceWith).toBe('  ');
  }));

  describe('when resolving import paths using eslint-plugin-import', function () {
    (0, _jasmineFix.it)('correctly resolves imports from parent', _asyncToGenerator(function* () {
      var editor = yield atom.workspace.open(paths.importing);
      var messages = yield lint(editor);

      expect(messages.length).toBe(0);
    }));

    (0, _jasmineFix.it)('shows a message for an invalid import', _asyncToGenerator(function* () {
      var editor = yield atom.workspace.open(paths.badImport);
      var messages = yield lint(editor);
      var expected = "Unable to resolve path to module '../nonexistent'. (import/no-unresolved)";
      var expectedUrl = 'https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-unresolved.md';

      expect(messages.length).toBe(1);
      expect(messages[0].severity).toBe('error');
      expect(messages[0].excerpt).toBe(expected);
      expect(messages[0].url).toBe(expectedUrl);
      expect(messages[0].location.file).toBe(paths.badImport);
      expect(messages[0].location.position).toEqual([[0, 24], [0, 40]]);
      expect(messages[0].solutions).not.toBeDefined();
    }));
  });

  describe('when a file is specified in an .eslintignore file', function () {
    (0, _jasmineFix.beforeEach)(function () {
      atom.config.set('linter-eslint.disableEslintIgnore', false);
    });

    (0, _jasmineFix.it)('will not give warnings when linting the file', _asyncToGenerator(function* () {
      var editor = yield atom.workspace.open(paths.ignored);
      var messages = yield lint(editor);

      expect(messages.length).toBe(0);
    }));

    (0, _jasmineFix.it)('will not give warnings when autofixing the file', _asyncToGenerator(function* () {
      var editor = yield atom.workspace.open(paths.ignored);
      var expectedMessage = 'Linter-ESLint: Fix complete.';
      var notificationPromise = getNotification(expectedMessage);
      atom.commands.dispatch(atom.views.getView(editor), 'linter-eslint:fix-file');
      var notification = yield notificationPromise;

      expect(notification.getMessage()).toBe(expectedMessage);
    }));
  });

  describe('when a file is not specified in .eslintignore file', _asyncToGenerator(function* () {
    (0, _jasmineFix.it)('will give warnings when linting the file', _asyncToGenerator(function* () {
      var tempPath = yield copyFileToTempDir(path.join(paths.eslintignoreDir, 'ignored.js'));
      var tempDir = path.dirname(tempPath);

      var editor = yield atom.workspace.open(tempPath);
      atom.config.set('linter-eslint.disableEslintIgnore', false);
      yield copyFileToDir(path.join(paths.eslintignoreDir, '.eslintrc.yaml'), tempDir);

      var messages = yield lint(editor);
      expect(messages.length).toBe(1);
      _rimraf2['default'].sync(tempDir);
    }));
  }));

  describe('when a file is specified in an eslintIgnore key in package.json', function () {
    (0, _jasmineFix.it)('will still lint the file if an .eslintignore file is present', _asyncToGenerator(function* () {
      atom.config.set('linter-eslint.disableEslintIgnore', false);
      var editor = yield atom.workspace.open(path.join(paths.eslintIgnoreKeyDir, 'ignored.js'));
      var messages = yield lint(editor);

      expect(messages.length).toBe(1);
    }));

    (0, _jasmineFix.it)('will not give warnings when linting the file', _asyncToGenerator(function* () {
      var tempPath = yield copyFileToTempDir(path.join(paths.eslintIgnoreKeyDir, 'ignored.js'));
      var tempDir = path.dirname(tempPath);

      var editor = yield atom.workspace.open(tempPath);
      atom.config.set('linter-eslint.disableEslintIgnore', false);
      yield copyFileToDir(path.join(paths.eslintIgnoreKeyDir, 'package.json'), tempDir);

      var messages = yield lint(editor);
      expect(messages.length).toBe(0);
      _rimraf2['default'].sync(tempDir);
    }));
  });

  describe('fixes errors', function () {
    var firstLint = _asyncToGenerator(function* (textEditor) {
      var messages = yield lint(textEditor);
      // The original file has two errors
      expect(messages.length).toBe(2);
    });

    var editor = undefined;
    var tempDir = undefined;

    (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
      // Copy the file to a temporary folder
      var tempFixturePath = yield copyFileToTempDir(paths.fix);
      editor = yield atom.workspace.open(tempFixturePath);
      tempDir = path.dirname(tempFixturePath);
      // Copy the config to the same temporary directory
      yield copyFileToDir(paths.config, tempDir);
    }));

    afterEach(function () {
      // Remove the temporary directory
      _rimraf2['default'].sync(tempDir);
    });

    (0, _jasmineFix.it)('should fix linting errors', _asyncToGenerator(function* () {
      yield firstLint(editor);
      yield makeFixes(editor);
      var messagesAfterFixing = yield lint(editor);

      expect(messagesAfterFixing.length).toBe(0);
    }));

    (0, _jasmineFix.it)('should not fix linting errors for rules that are disabled with rulesToDisableWhileFixing', _asyncToGenerator(function* () {
      atom.config.set('linter-eslint.rulesToDisableWhileFixing', ['semi']);

      yield firstLint(editor);
      yield makeFixes(editor);
      var messagesAfterFixing = yield lint(editor);
      var expected = 'Extra semicolon. (semi)';
      var expectedUrl = 'https://eslint.org/docs/rules/semi';

      expect(messagesAfterFixing.length).toBe(1);
      expect(messagesAfterFixing[0].excerpt).toBe(expected);
      expect(messagesAfterFixing[0].url).toBe(expectedUrl);
    }));
  });

  describe('when an eslint cache file is present', function () {
    var editor = undefined;
    var tempDir = undefined;

    (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
      // Copy the file to a temporary folder
      var tempFixturePath = yield copyFileToTempDir(paths.fix);
      editor = yield atom.workspace.open(tempFixturePath);
      tempDir = path.dirname(tempFixturePath);
      // Copy the config to the same temporary directory
      yield copyFileToDir(paths.config, tempDir);
    }));

    afterEach(function () {
      // Remove the temporary directory
      _rimraf2['default'].sync(tempDir);
    });

    (0, _jasmineFix.it)('does not delete the cache file when performing fixes', _asyncToGenerator(function* () {
      var tempCacheFile = yield copyFileToDir(paths.cache, tempDir);
      var checkCachefileExists = function checkCachefileExists() {
        fs.statSync(tempCacheFile);
      };
      expect(checkCachefileExists).not.toThrow();
      yield makeFixes(editor);
      expect(checkCachefileExists).not.toThrow();
    }));
  });

  describe('Ignores specified rules when editing', function () {
    var expectedPath = undefined;

    var checkNoConsole = function checkNoConsole(message) {
      var text = 'Unexpected console statement. (no-console)';
      var url = 'https://eslint.org/docs/rules/no-console';
      expect(message.severity).toBe('error');
      expect(message.excerpt).toBe(text);
      expect(message.url).toBe(url);
      expect(message.location.file).toBe(expectedPath);
      expect(message.location.position).toEqual([[0, 0], [0, 11]]);
    };

    var checkNoTrailingSpace = function checkNoTrailingSpace(message) {
      var text = 'Trailing spaces not allowed. (no-trailing-spaces)';
      var url = 'https://eslint.org/docs/rules/no-trailing-spaces';

      expect(message.severity).toBe('error');
      expect(message.excerpt).toBe(text);
      expect(message.url).toBe(url);
      expect(message.location.file).toBe(expectedPath);
      expect(message.location.position).toEqual([[1, 9], [1, 10]]);
    };

    var checkBefore = function checkBefore(messages) {
      expect(messages.length).toBe(1);
      checkNoConsole(messages[0]);
    };

    var checkNew = function checkNew(messages) {
      expect(messages.length).toBe(2);
      checkNoConsole(messages[0]);
      checkNoTrailingSpace(messages[1]);
    };

    var checkAfter = function checkAfter(messages) {
      expect(messages.length).toBe(1);
      checkNoConsole(messages[0]);
    };

    (0, _jasmineFix.it)('does nothing on saved files', _asyncToGenerator(function* () {
      atom.config.set('linter-eslint.rulesToSilenceWhileTyping', ['no-trailing-spaces']);
      atom.config.set('linter-eslint.ignoreFixableRulesWhileTyping', true);
      expectedPath = paths.modifiedIgnoreSpace;
      var editor = yield atom.workspace.open(expectedPath);
      // Run once to populate the fixable rules list
      yield lint(editor);
      // Run again for the testable results
      var messages = yield lint(editor);
      checkNew(messages);
    }));

    (0, _jasmineFix.it)('allows ignoring a specific list of rules when modified', _asyncToGenerator(function* () {
      expectedPath = paths.modifiedIgnore;
      var editor = yield atom.workspace.open(expectedPath);

      // Verify expected error before
      var firstMessages = yield lint(editor);
      checkBefore(firstMessages);

      // Insert a space into the editor
      editor.getBuffer().insert([1, 9], ' ');

      // Verify the space is showing an error
      var messages = yield lint(editor);
      checkNew(messages);

      // Enable the option under test
      atom.config.set('linter-eslint.rulesToSilenceWhileTyping', ['no-trailing-spaces']);

      // Check the lint results
      var newMessages = yield lint(editor);
      checkAfter(newMessages);
    }));

    (0, _jasmineFix.it)('allows ignoring all fixable rules while typing', _asyncToGenerator(function* () {
      expectedPath = paths.modifiedIgnore;
      var editor = yield atom.workspace.open(expectedPath);

      // Verify no error before
      var firstMessages = yield lint(editor);
      checkBefore(firstMessages);

      // Insert a space into the editor
      editor.getBuffer().insert([1, 9], ' ');

      // Verify the space is showing an error
      var messages = yield lint(editor);
      checkNew(messages);

      // Enable the option under test
      // NOTE: Depends on no-trailing-spaces being marked as fixable by ESLint
      atom.config.set('linter-eslint.ignoreFixableRulesWhileTyping', true);

      // Check the lint results
      var newMessages = yield lint(editor);
      checkAfter(newMessages);
    }));

    (0, _jasmineFix.it)('allows ignoring fixible rules from plugins while typing', _asyncToGenerator(function* () {
      expectedPath = paths.fixablePlugin;
      var editor = yield atom.workspace.open(expectedPath);

      // Verify no error before the editor is modified
      var firstMessages = yield lint(editor);
      expect(firstMessages.length).toBe(0);

      // Remove the newline between the import and console log
      editor.getBuffer().deleteRow(1);

      // Verify there is an error for the fixable import/newline-after-import rule
      var messages = yield lint(editor);
      expect(messages.length).toBe(1);
      expect(messages[0].severity).toBe('error');
      expect(messages[0].excerpt).toBe('Expected empty line after import statement not followed by another import. (import/newline-after-import)');

      // Enable the option under test
      // NOTE: Depends on mport/newline-after-import rule being marked as fixable
      atom.config.set('linter-eslint.ignoreFixableRulesWhileTyping', true);

      // Check the lint results
      var newMessages = yield lint(editor);
      expect(newMessages.length).toBe(0);
    }));
  });

  describe('prints debugging information with the `debug` command', function () {
    var editor = undefined;
    var expectedMessage = 'linter-eslint debugging information';
    (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
      editor = yield atom.workspace.open(paths.good);
    }));

    (0, _jasmineFix.it)('shows an info notification', _asyncToGenerator(function* () {
      var notificationPromise = getNotification(expectedMessage);
      atom.commands.dispatch(atom.views.getView(editor), 'linter-eslint:debug');
      var notification = yield notificationPromise;

      expect(notification.getMessage()).toBe(expectedMessage);
      expect(notification.getType()).toEqual('info');
    }));

    (0, _jasmineFix.it)('includes debugging information in the details', _asyncToGenerator(function* () {
      var notificationPromise = getNotification(expectedMessage);
      atom.commands.dispatch(atom.views.getView(editor), 'linter-eslint:debug');
      var notification = yield notificationPromise;
      var detail = notification.getDetail();

      expect(detail.includes('Atom version: ' + atom.getVersion())).toBe(true);
      expect(detail.includes('linter-eslint version:')).toBe(true);
      expect(detail.includes('Platform: ' + process.platform)).toBe(true);
      expect(detail.includes('linter-eslint configuration:')).toBe(true);
      expect(detail.includes('Using local project ESLint')).toBe(true);
    }));
  });

  (0, _jasmineFix.it)('handles ranges in messages', _asyncToGenerator(function* () {
    var editor = yield atom.workspace.open(paths.endRange);
    var messages = yield lint(editor);
    var expected = 'Unreachable code. (no-unreachable)';
    var expectedUrl = 'https://eslint.org/docs/rules/no-unreachable';

    expect(messages[0].severity).toBe('error');
    expect(messages[0].excerpt).toBe(expected);
    expect(messages[0].url).toBe(expectedUrl);
    expect(messages[0].location.file).toBe(paths.endRange);
    expect(messages[0].location.position).toEqual([[5, 2], [6, 15]]);
  }));

  describe('when setting `disableWhenNoEslintConfig` is false', function () {
    var editor = undefined;
    var tempFilePath = undefined;
    var tempFixtureDir = undefined;

    (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
      atom.config.set('linter-eslint.disableWhenNoEslintConfig', false);

      tempFilePath = yield copyFileToTempDir(paths.badInline);
      editor = yield atom.workspace.open(tempFilePath);
      tempFixtureDir = path.dirname(tempFilePath);
    }));

    afterEach(function () {
      _rimraf2['default'].sync(tempFixtureDir);
    });

    (0, _jasmineFix.it)('errors when no config file is found', _asyncToGenerator(function* () {
      var messages = yield lint(editor);
      var expected = 'Error while running ESLint: No ESLint configuration found..';
      var description = '<div style="white-space: pre-wrap">No ESLint configuration found.\n<hr />Error: No ESLint configuration found.\n    at Config.getLocalConfigHierarchy';
      // The rest of the description includes paths specific to the computer running it
      expect(messages.length).toBe(1);
      expect(messages[0].severity).toBe('error');
      expect(messages[0].excerpt).toBe(expected);
      expect(messages[0].description.startsWith(description)).toBe(true);
      expect(messages[0].url).not.toBeDefined();
      expect(messages[0].location.file).toBe(tempFilePath);
      expect(messages[0].location.position).toEqual([[0, 0], [0, 28]]);
    }));
  });

  describe('when `disableWhenNoEslintConfig` is true', function () {
    var editor = undefined;
    var tempFixtureDir = undefined;

    (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
      atom.config.set('linter-eslint.disableWhenNoEslintConfig', true);

      var tempFilePath = yield copyFileToTempDir(paths.badInline);
      editor = yield atom.workspace.open(tempFilePath);
      tempFixtureDir = path.dirname(tempFilePath);
    }));

    afterEach(function () {
      _rimraf2['default'].sync(tempFixtureDir);
    });

    (0, _jasmineFix.it)('does not report errors when no config file is found', _asyncToGenerator(function* () {
      var messages = yield lint(editor);

      expect(messages.length).toBe(0);
    }));
  });

  describe('lets ESLint handle configuration', function () {
    (0, _jasmineFix.it)('works when the cache fails', _asyncToGenerator(function* () {
      // Ensure the cache is enabled, since we will be taking advantage of
      // a failing in it's operation
      atom.config.set('linter-eslint.disableFSCache', false);
      var fooPath = path.join(paths.badCache, 'temp', 'foo.js');
      var newConfigPath = path.join(paths.badCache, 'temp', '.eslintrc.js');
      var editor = yield atom.workspace.open(fooPath);
      function undefMsg(varName) {
        return '\'' + varName + '\' is not defined. (no-undef)';
      }
      var expectedUrl = 'https://eslint.org/docs/rules/no-undef';

      // Trigger a first lint to warm up the cache with the first config result
      var messages = yield lint(editor);
      expect(messages.length).toBe(2);
      expect(messages[0].severity).toBe('error');
      expect(messages[0].excerpt).toBe(undefMsg('console'));
      expect(messages[0].url).toBe(expectedUrl);
      expect(messages[0].location.file).toBe(fooPath);
      expect(messages[0].location.position).toEqual([[1, 2], [1, 9]]);
      expect(messages[1].severity).toBe('error');
      expect(messages[1].excerpt).toBe(undefMsg('bar'));
      expect(messages[1].url).toBe(expectedUrl);
      expect(messages[1].location.file).toBe(fooPath);
      expect(messages[1].location.position).toEqual([[1, 14], [1, 17]]);

      // Write the new configuration file
      var newConfig = {
        env: {
          browser: true
        }
      };
      var configContents = 'module.exports = ' + JSON.stringify(newConfig, null, 2) + '\n';
      fs.writeFileSync(newConfigPath, configContents);

      // Lint again, ESLint should recognise the new configuration
      // The cached config results are still pointing at the _parent_ file. ESLint
      // would partially handle this situation if the config file was specified
      // from the cache.
      messages = yield lint(editor);
      expect(messages.length).toBe(1);
      expect(messages[0].severity).toBe('error');
      expect(messages[0].excerpt).toBe(undefMsg('bar'));
      expect(messages[0].url).toBe(expectedUrl);
      expect(messages[0].location.file).toBe(fooPath);
      expect(messages[0].location.position).toEqual([[1, 14], [1, 17]]);

      // Update the configuration
      newConfig.rules = {
        'no-undef': 'off'
      };
      configContents = 'module.exports = ' + JSON.stringify(newConfig, null, 2) + '\n';
      fs.writeFileSync(newConfigPath, configContents);

      // Lint again, if the cache was specifying the file ESLint at this point
      // would fail to update the configuration fully, and would still report a
      // no-undef error.
      messages = yield lint(editor);
      expect(messages.length).toBe(0);

      // Delete the temporary configuration file
      fs.unlinkSync(newConfigPath);
    }));
  });

  describe('works with HTML files', function () {
    var embeddedScope = 'source.js.embedded.html';
    var scopes = linterProvider.grammarScopes;

    (0, _jasmineFix.it)('adds the HTML scope when the setting is enabled', function () {
      expect(scopes.includes(embeddedScope)).toBe(false);
      atom.config.set('linter-eslint.lintHtmlFiles', true);
      expect(scopes.includes(embeddedScope)).toBe(true);
      atom.config.set('linter-eslint.lintHtmlFiles', false);
      expect(scopes.includes(embeddedScope)).toBe(false);
    });

    (0, _jasmineFix.it)('keeps the HTML scope with custom scopes', function () {
      expect(scopes.includes(embeddedScope)).toBe(false);
      atom.config.set('linter-eslint.lintHtmlFiles', true);
      expect(scopes.includes(embeddedScope)).toBe(true);
      atom.config.set('linter-eslint.scopes', ['foo.bar']);
      expect(scopes.includes(embeddedScope)).toBe(true);
    });
  });

  describe('handles the Show Rule ID in Messages option', function () {
    var expectedUrl = 'https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-unresolved.md';

    (0, _jasmineFix.it)('shows the rule ID when enabled', _asyncToGenerator(function* () {
      atom.config.set('linter-eslint.showRuleIdInMessage', true);
      var editor = yield atom.workspace.open(paths.badImport);
      var messages = yield lint(editor);
      var expected = "Unable to resolve path to module '../nonexistent'. (import/no-unresolved)";

      expect(messages.length).toBe(1);
      expect(messages[0].severity).toBe('error');
      expect(messages[0].excerpt).toBe(expected);
      expect(messages[0].url).toBe(expectedUrl);
      expect(messages[0].location.file).toBe(paths.badImport);
      expect(messages[0].location.position).toEqual([[0, 24], [0, 40]]);
      expect(messages[0].solutions).not.toBeDefined();
    }));

    (0, _jasmineFix.it)("doesn't show the rule ID when disabled", _asyncToGenerator(function* () {
      atom.config.set('linter-eslint.showRuleIdInMessage', false);
      var editor = yield atom.workspace.open(paths.badImport);
      var messages = yield lint(editor);
      var expected = "Unable to resolve path to module '../nonexistent'.";

      expect(messages.length).toBe(1);
      expect(messages[0].severity).toBe('error');
      expect(messages[0].excerpt).toBe(expected);
      expect(messages[0].url).toBe(expectedUrl);
      expect(messages[0].location.file).toBe(paths.badImport);
      expect(messages[0].location.position).toEqual([[0, 24], [0, 40]]);
      expect(messages[0].solutions).not.toBeDefined();
    }));
  });

  describe("registers an 'ESLint Fix' right click menu command", function () {
    // NOTE: Reaches into the private data of the ContextMenuManager, there is
    // no public method to check this though so...
    expect(atom.contextMenu.itemSets.some(function (itemSet) {
      return(
        // Matching selector...
        itemSet.selector === 'atom-text-editor:not(.mini), .overlayer' && itemSet.items.some(function (item) {
          return(
            // Matching command...
            item.command === 'linter-eslint:fix-file' &&
            // Matching label
            item.label === 'ESLint Fix' &&
            // And has a function controlling display
            typeof item.shouldDisplay === 'function'
          );
        })
      );
    }));
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvbGludGVyLWVzbGludC9zcGVjL2xpbnRlci1lc2xpbnQtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUE2RHNCLGlCQUFpQixxQkFBaEMsV0FBaUMsY0FBYyxFQUFFO0FBQ3RELE1BQU0sY0FBYyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsaUJBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDMUQsU0FBTyxhQUFhLENBQUMsY0FBYyxFQUFFLGNBQWMsQ0FBQyxDQUFBO0NBQ3JEOzs7O0lBRWMsZUFBZSxxQkFBOUIsV0FBK0IsZUFBZSxFQUFFO0FBQzlDLFNBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUs7QUFDOUIsUUFBSSxlQUFlLFlBQUEsQ0FBQTtBQUNuQixRQUFNLGVBQWUsR0FBRyxTQUFsQixlQUFlLENBQUksWUFBWSxFQUFLO0FBQ3hDLFVBQUksWUFBWSxDQUFDLFVBQVUsRUFBRSxLQUFLLGVBQWUsRUFBRTs7OztBQUlqRCxlQUFNO09BQ1A7O0FBRUQscUJBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUN6QixhQUFPLENBQUMsWUFBWSxDQUFDLENBQUE7S0FDdEIsQ0FBQTs7QUFFRCxtQkFBZSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsZUFBZSxDQUFDLENBQUE7R0FDM0UsQ0FBQyxDQUFBO0NBQ0g7O0lBRWMsU0FBUyxxQkFBeEIsV0FBeUIsVUFBVSxFQUFFO0FBQ25DLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUs7O0FBRW5ELFFBQU0sd0JBQXdCLEdBQUcsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxZQUFNO0FBQ3hFLDhCQUF3QixDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ2xDLGFBQU8sRUFBRSxDQUFBO0tBQ1YsQ0FBQyxDQUFBO0dBQ0gs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QUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTs7QUFFL0IsVUFBTSxTQUFTLEdBQUcsa0NBQWtDLENBQUE7QUFDcEQsVUFBTSxZQUFZLEdBQUcsd0NBQXdDLENBQUE7QUFDN0QsVUFBTSxTQUFTLEdBQUcseUJBQXlCLENBQUE7QUFDM0MsVUFBTSxZQUFZLEdBQUcsb0NBQW9DLENBQUE7O0FBRXpELFlBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQzFDLFlBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQzNDLFlBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO0FBQzFDLFlBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDakQsWUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQy9ELFlBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFBOztBQUUvQyxZQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUMxQyxZQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUMzQyxZQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUMxQyxZQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ2pELFlBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUMvRCxZQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDNUMsWUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ25FLFlBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUN4RCxFQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7O0FBRUYsc0JBQUcsd0NBQXdDLG9CQUFFLGFBQVk7QUFDdkQsUUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDckQsUUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7O0FBRW5DLFVB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LEtBQUssd0JBQXdCOztBQUV6QyxnQkFBSSxDQUFDLEtBQUssS0FBSyxZQUFZOztBQUUzQixtQkFBTyxJQUFJLENBQUMsYUFBYSxLQUFLLFVBQVU7O1NBQUEsQ0FBQzs7S0FBQSxDQUFDLENBQUMsQ0FBQTtHQUNoRCxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL2hvbWUvdGhla2FybG85NS8uYXRvbS9wYWNrYWdlcy9saW50ZXItZXNsaW50L3NwZWMvbGludGVyLWVzbGludC1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnXG5pbXBvcnQgeyB0bXBkaXIgfSBmcm9tICdvcydcbmltcG9ydCByaW1yYWYgZnJvbSAncmltcmFmJ1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG5pbXBvcnQgeyBiZWZvcmVFYWNoLCBpdCwgZml0IH0gZnJvbSAnamFzbWluZS1maXgnXG5pbXBvcnQgbGludGVyRXNsaW50IGZyb20gJy4uL3NyYy9tYWluJ1xuXG5jb25zdCBmaXh0dXJlc0RpciA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycpXG5cbmNvbnN0IGZpeHR1cmVzID0ge1xuICBnb29kOiBbJ2ZpbGVzJywgJ2dvb2QuanMnXSxcbiAgYmFkOiBbJ2ZpbGVzJywgJ2JhZC5qcyddLFxuICBiYWRJbmxpbmU6IFsnZmlsZXMnLCAnYmFkSW5saW5lLmpzJ10sXG4gIGVtcHR5OiBbJ2ZpbGVzJywgJ2VtcHR5LmpzJ10sXG4gIGZpeDogWydmaWxlcycsICdmaXguanMnXSxcbiAgY2FjaGU6IFsnZmlsZXMnLCAnLmVzbGludGNhY2hlJ10sXG4gIGNvbmZpZzogWydjb25maWdzJywgJy5lc2xpbnRyYy55bWwnXSxcbiAgaWdub3JlZDogWydlc2xpbnRpZ25vcmUnLCAnaWdub3JlZC5qcyddLFxuICBlbmRSYW5nZTogWydlbmQtcmFuZ2UnLCAnbm8tdW5yZWFjaGFibGUuanMnXSxcbiAgYmFkQ2FjaGU6IFsnYmFkQ2FjaGUnXSxcbiAgbW9kaWZpZWRJZ25vcmU6IFsnbW9kaWZpZWQtaWdub3JlLXJ1bGUnLCAnZm9vLmpzJ10sXG4gIG1vZGlmaWVkSWdub3JlU3BhY2U6IFsnbW9kaWZpZWQtaWdub3JlLXJ1bGUnLCAnZm9vLXNwYWNlLmpzJ10sXG4gIGltcG9ydGluZzogWydpbXBvcnQtcmVzb2x1dGlvbicsICduZXN0ZWQnLCAnaW1wb3J0aW5nLmpzJ10sXG4gIGJhZEltcG9ydDogWydpbXBvcnQtcmVzb2x1dGlvbicsICduZXN0ZWQnLCAnYmFkSW1wb3J0LmpzJ10sXG4gIGZpeGFibGVQbHVnaW46IFsncGx1Z2luLWltcG9ydCcsICdsaWZlLmpzJ10sXG4gIGVzbGludGlnbm9yZURpcjogWydlc2xpbnRpZ25vcmUnXSxcbiAgZXNsaW50SWdub3JlS2V5RGlyOiBbJ2NvbmZpZ3MnLCAnZXNsaW50aWdub3Jla2V5J11cbn1cblxuY29uc3QgcGF0aHMgPSBPYmplY3Qua2V5cyhmaXh0dXJlcylcbiAgLnJlZHVjZSgoYWNjdW11bGF0b3IsIGZpeHR1cmUpID0+IHtcbiAgICBjb25zdCBhY2MgPSBhY2N1bXVsYXRvclxuICAgIGFjY1tmaXh0dXJlXSA9IHBhdGguam9pbihmaXh0dXJlc0RpciwgLi4uKGZpeHR1cmVzW2ZpeHR1cmVdKSlcbiAgICByZXR1cm4gYWNjXG4gIH0sIHt9KVxuXG4vKipcbiAqIEFzeW5jIGhlbHBlciB0byBjb3B5IGEgZmlsZSBmcm9tIG9uZSBwbGFjZSB0byBhbm90aGVyIG9uIHRoZSBmaWxlc3lzdGVtLlxuICogQHBhcmFtICB7c3RyaW5nfSBmaWxlVG9Db3B5UGF0aCAgUGF0aCBvZiB0aGUgZmlsZSB0byBiZSBjb3BpZWRcbiAqIEBwYXJhbSAge3N0cmluZ30gZGVzdGluYXRpb25EaXIgIERpcmVjdG9yeSB0byBwYXN0ZSB0aGUgZmlsZSBpbnRvXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICBGdWxsIHBhdGggb2YgdGhlIGZpbGUgaW4gY29weSBkZXN0aW5hdGlvblxuICovXG5mdW5jdGlvbiBjb3B5RmlsZVRvRGlyKGZpbGVUb0NvcHlQYXRoLCBkZXN0aW5hdGlvbkRpcikge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBjb25zdCBkZXN0aW5hdGlvblBhdGggPSBwYXRoLmpvaW4oZGVzdGluYXRpb25EaXIsIHBhdGguYmFzZW5hbWUoZmlsZVRvQ29weVBhdGgpKVxuICAgIGNvbnN0IHdzID0gZnMuY3JlYXRlV3JpdGVTdHJlYW0oZGVzdGluYXRpb25QYXRoKVxuICAgIHdzLm9uKCdjbG9zZScsICgpID0+IHJlc29sdmUoZGVzdGluYXRpb25QYXRoKSlcbiAgICBmcy5jcmVhdGVSZWFkU3RyZWFtKGZpbGVUb0NvcHlQYXRoKS5waXBlKHdzKVxuICB9KVxufVxuXG4vKipcbiAqIFV0aWxpdHkgaGVscGVyIHRvIGNvcHkgYSBmaWxlIGludG8gdGhlIE9TIHRlbXAgZGlyZWN0b3J5LlxuICpcbiAqIEBwYXJhbSAge3N0cmluZ30gZmlsZVRvQ29weVBhdGggIFBhdGggb2YgdGhlIGZpbGUgdG8gYmUgY29waWVkXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICBGdWxsIHBhdGggb2YgdGhlIGZpbGUgaW4gY29weSBkZXN0aW5hdGlvblxuICovXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L3ByZWZlci1kZWZhdWx0LWV4cG9ydFxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvcHlGaWxlVG9UZW1wRGlyKGZpbGVUb0NvcHlQYXRoKSB7XG4gIGNvbnN0IHRlbXBGaXh0dXJlRGlyID0gZnMubWtkdGVtcFN5bmModG1wZGlyKCkgKyBwYXRoLnNlcClcbiAgcmV0dXJuIGNvcHlGaWxlVG9EaXIoZmlsZVRvQ29weVBhdGgsIHRlbXBGaXh0dXJlRGlyKVxufVxuXG5hc3luYyBmdW5jdGlvbiBnZXROb3RpZmljYXRpb24oZXhwZWN0ZWRNZXNzYWdlKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGxldCBub3RpZmljYXRpb25TdWJcbiAgICBjb25zdCBuZXdOb3RpZmljYXRpb24gPSAobm90aWZpY2F0aW9uKSA9PiB7XG4gICAgICBpZiAobm90aWZpY2F0aW9uLmdldE1lc3NhZ2UoKSAhPT0gZXhwZWN0ZWRNZXNzYWdlKSB7XG4gICAgICAgIC8vIEFzIHRoZSBzcGVjcyBleGVjdXRlIGFzeW5jaHJvbm91c2x5LCBpdCdzIHBvc3NpYmxlIGEgbm90aWZpY2F0aW9uXG4gICAgICAgIC8vIGZyb20gYSBkaWZmZXJlbnQgc3BlYyB3YXMgZ3JhYmJlZCwgaWYgdGhlIG1lc3NhZ2UgZG9lc24ndCBtYXRjaCB3aGF0XG4gICAgICAgIC8vIGlzIGV4cGVjdGVkIHNpbXBseSByZXR1cm4gYW5kIGtlZXAgd2FpdGluZyBmb3IgdGhlIG5leHQgbWVzc2FnZS5cbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICAvLyBEaXNwb3NlIG9mIHRoZSBub3RpZmljYXRpb24gc3Vic2NyaXB0aW9uXG4gICAgICBub3RpZmljYXRpb25TdWIuZGlzcG9zZSgpXG4gICAgICByZXNvbHZlKG5vdGlmaWNhdGlvbilcbiAgICB9XG4gICAgLy8gU3Vic2NyaWJlIHRvIEF0b20ncyBub3RpZmljYXRpb25zXG4gICAgbm90aWZpY2F0aW9uU3ViID0gYXRvbS5ub3RpZmljYXRpb25zLm9uRGlkQWRkTm90aWZpY2F0aW9uKG5ld05vdGlmaWNhdGlvbilcbiAgfSlcbn1cblxuYXN5bmMgZnVuY3Rpb24gbWFrZUZpeGVzKHRleHRFZGl0b3IpIHtcbiAgY29uc3QgZWRpdG9yUmVsb2FkUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgLy8gU3Vic2NyaWJlIHRvIGZpbGUgcmVsb2FkIGV2ZW50c1xuICAgIGNvbnN0IGVkaXRvclJlbG9hZFN1YnNjcmlwdGlvbiA9IHRleHRFZGl0b3IuZ2V0QnVmZmVyKCkub25EaWRSZWxvYWQoKCkgPT4ge1xuICAgICAgZWRpdG9yUmVsb2FkU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgICAgcmVzb2x2ZSgpXG4gICAgfSlcbiAgfSlcblxuICBjb25zdCBleHBlY3RlZE1lc3NhZ2UgPSAnTGludGVyLUVTTGludDogRml4IGNvbXBsZXRlLidcbiAgLy8gU3Vic2NyaWJlIHRvIG5vdGlmaWNhdGlvbiBldmVudHNcbiAgY29uc3Qgbm90aWZpY2F0aW9uUHJvbWlzZSA9IGdldE5vdGlmaWNhdGlvbihleHBlY3RlZE1lc3NhZ2UpXG5cbiAgLy8gU3Vic2NyaXB0aW9ucyBub3cgYWN0aXZlIGZvciBFZGl0b3IgUmVsb2FkIGFuZCBNZXNzYWdlIE5vdGlmaWNhdGlvblxuICAvLyBTZW5kIG9mZiBhIGZpeCByZXF1ZXN0LlxuICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGF0b20udmlld3MuZ2V0Vmlldyh0ZXh0RWRpdG9yKSwgJ2xpbnRlci1lc2xpbnQ6Zml4LWZpbGUnKVxuXG4gIGNvbnN0IG5vdGlmaWNhdGlvbiA9IGF3YWl0IG5vdGlmaWNhdGlvblByb21pc2VcbiAgZXhwZWN0KG5vdGlmaWNhdGlvbi5nZXRNZXNzYWdlKCkpLnRvQmUoZXhwZWN0ZWRNZXNzYWdlKVxuICBleHBlY3Qobm90aWZpY2F0aW9uLmdldFR5cGUoKSkudG9CZSgnc3VjY2VzcycpXG5cbiAgLy8gQWZ0ZXIgZWRpdG9yIHJlbG9hZHMsIGl0IHNob3VsZCBiZSBzYWZlIGZvciBjb25zdW1pbmcgdGVzdCB0byByZXN1bWUuXG4gIHJldHVybiBlZGl0b3JSZWxvYWRQcm9taXNlXG59XG5cbmRlc2NyaWJlKCdUaGUgZXNsaW50IHByb3ZpZGVyIGZvciBMaW50ZXInLCAoKSA9PiB7XG4gIGNvbnN0IGxpbnRlclByb3ZpZGVyID0gbGludGVyRXNsaW50LnByb3ZpZGVMaW50ZXIoKVxuICBjb25zdCB7IGxpbnQgfSA9IGxpbnRlclByb3ZpZGVyXG5cbiAgYmVmb3JlRWFjaChhc3luYyAoKSA9PiB7XG4gICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItZXNsaW50LmRpc2FibGVGU0NhY2hlJywgZmFsc2UpXG4gICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItZXNsaW50LmRpc2FibGVFc2xpbnRJZ25vcmUnLCB0cnVlKVxuXG4gICAgLy8gQWN0aXZhdGUgdGhlIEphdmFTY3JpcHQgbGFuZ3VhZ2Ugc28gQXRvbSBrbm93cyB3aGF0IHRoZSBmaWxlcyBhcmVcbiAgICBhd2FpdCBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnbGFuZ3VhZ2UtamF2YXNjcmlwdCcpXG4gICAgLy8gQWN0aXZhdGUgdGhlIHByb3ZpZGVyXG4gICAgYXdhaXQgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xpbnRlci1lc2xpbnQnKVxuICB9KVxuXG4gIGRlc2NyaWJlKCdjaGVja3MgYmFkLmpzIGFuZCcsICgpID0+IHtcbiAgICBsZXQgZWRpdG9yID0gbnVsbFxuICAgIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgZWRpdG9yID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihwYXRocy5iYWQpXG4gICAgfSlcblxuICAgIGl0KCd2ZXJpZmllcyB0aGUgbWVzc2FnZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBtZXNzYWdlcyA9IGF3YWl0IGxpbnQoZWRpdG9yKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZSgyKVxuXG4gICAgICBjb25zdCBleHBlY3RlZDAgPSBcIidmb28nIGlzIG5vdCBkZWZpbmVkLiAobm8tdW5kZWYpXCJcbiAgICAgIGNvbnN0IGV4cGVjdGVkMFVybCA9ICdodHRwczovL2VzbGludC5vcmcvZG9jcy9ydWxlcy9uby11bmRlZidcbiAgICAgIGNvbnN0IGV4cGVjdGVkMSA9ICdFeHRyYSBzZW1pY29sb24uIChzZW1pKSdcbiAgICAgIGNvbnN0IGV4cGVjdGVkMVVybCA9ICdodHRwczovL2VzbGludC5vcmcvZG9jcy9ydWxlcy9zZW1pJ1xuXG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0uc2V2ZXJpdHkpLnRvQmUoJ2Vycm9yJylcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5leGNlcnB0KS50b0JlKGV4cGVjdGVkMClcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS51cmwpLnRvQmUoZXhwZWN0ZWQwVXJsKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmxvY2F0aW9uLmZpbGUpLnRvQmUocGF0aHMuYmFkKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmxvY2F0aW9uLnBvc2l0aW9uKS50b0VxdWFsKFtbMCwgMF0sIFswLCAzXV0pXG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0uc29sdXRpb25zKS5ub3QudG9CZURlZmluZWQoKVxuXG4gICAgICBleHBlY3QobWVzc2FnZXNbMV0uc2V2ZXJpdHkpLnRvQmUoJ2Vycm9yJylcbiAgICAgIGV4cGVjdChtZXNzYWdlc1sxXS5leGNlcnB0KS50b0JlKGV4cGVjdGVkMSlcbiAgICAgIGV4cGVjdChtZXNzYWdlc1sxXS51cmwpLnRvQmUoZXhwZWN0ZWQxVXJsKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzFdLmxvY2F0aW9uLmZpbGUpLnRvQmUocGF0aHMuYmFkKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzFdLmxvY2F0aW9uLnBvc2l0aW9uKS50b0VxdWFsKFtbMCwgOF0sIFswLCA5XV0pXG4gICAgICBleHBlY3QobWVzc2FnZXNbMV0uc29sdXRpb25zLmxlbmd0aCkudG9CZSgxKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzFdLnNvbHV0aW9uc1swXS5wb3NpdGlvbikudG9FcXVhbChbWzAsIDZdLCBbMCwgOV1dKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzFdLnNvbHV0aW9uc1swXS5yZXBsYWNlV2l0aCkudG9CZSgnNDInKVxuICAgIH0pXG4gIH0pXG5cbiAgaXQoJ2ZpbmRzIG5vdGhpbmcgd3Jvbmcgd2l0aCBhbiBlbXB0eSBmaWxlJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGVkaXRvciA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4ocGF0aHMuZW1wdHkpXG4gICAgY29uc3QgbWVzc2FnZXMgPSBhd2FpdCBsaW50KGVkaXRvcilcblxuICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmUoMClcbiAgfSlcblxuICBpdCgnZmluZHMgbm90aGluZyB3cm9uZyB3aXRoIGEgdmFsaWQgZmlsZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBlZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKHBhdGhzLmdvb2QpXG4gICAgY29uc3QgbWVzc2FnZXMgPSBhd2FpdCBsaW50KGVkaXRvcilcblxuICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmUoMClcbiAgfSlcblxuICBpdCgncmVwb3J0cyB0aGUgZml4ZXMgZm9yIGZpeGFibGUgZXJyb3JzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGVkaXRvciA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4ocGF0aHMuZml4KVxuICAgIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgbGludChlZGl0b3IpXG5cbiAgICBleHBlY3QobWVzc2FnZXNbMF0uc29sdXRpb25zWzBdLnBvc2l0aW9uKS50b0VxdWFsKFtbMCwgMTBdLCBbMSwgOF1dKVxuICAgIGV4cGVjdChtZXNzYWdlc1swXS5zb2x1dGlvbnNbMF0ucmVwbGFjZVdpdGgpLnRvQmUoJzZcXG5mdW5jdGlvbicpXG5cbiAgICBleHBlY3QobWVzc2FnZXNbMV0uc29sdXRpb25zWzBdLnBvc2l0aW9uKS50b0VxdWFsKFtbMiwgMF0sIFsyLCAxXV0pXG4gICAgZXhwZWN0KG1lc3NhZ2VzWzFdLnNvbHV0aW9uc1swXS5yZXBsYWNlV2l0aCkudG9CZSgnICAnKVxuICB9KVxuXG4gIGRlc2NyaWJlKCd3aGVuIHJlc29sdmluZyBpbXBvcnQgcGF0aHMgdXNpbmcgZXNsaW50LXBsdWdpbi1pbXBvcnQnLCAoKSA9PiB7XG4gICAgaXQoJ2NvcnJlY3RseSByZXNvbHZlcyBpbXBvcnRzIGZyb20gcGFyZW50JywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZWRpdG9yID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihwYXRocy5pbXBvcnRpbmcpXG4gICAgICBjb25zdCBtZXNzYWdlcyA9IGF3YWl0IGxpbnQoZWRpdG9yKVxuXG4gICAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0JlKDApXG4gICAgfSlcblxuICAgIGl0KCdzaG93cyBhIG1lc3NhZ2UgZm9yIGFuIGludmFsaWQgaW1wb3J0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZWRpdG9yID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihwYXRocy5iYWRJbXBvcnQpXG4gICAgICBjb25zdCBtZXNzYWdlcyA9IGF3YWl0IGxpbnQoZWRpdG9yKVxuICAgICAgY29uc3QgZXhwZWN0ZWQgPSBcIlVuYWJsZSB0byByZXNvbHZlIHBhdGggdG8gbW9kdWxlICcuLi9ub25leGlzdGVudCcuIChpbXBvcnQvbm8tdW5yZXNvbHZlZClcIlxuICAgICAgY29uc3QgZXhwZWN0ZWRVcmwgPSAnaHR0cHM6Ly9naXRodWIuY29tL2Jlbm1vc2hlci9lc2xpbnQtcGx1Z2luLWltcG9ydC9ibG9iL21hc3Rlci9kb2NzL3J1bGVzL25vLXVucmVzb2x2ZWQubWQnXG5cbiAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmUoMSlcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5zZXZlcml0eSkudG9CZSgnZXJyb3InKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmV4Y2VycHQpLnRvQmUoZXhwZWN0ZWQpXG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0udXJsKS50b0JlKGV4cGVjdGVkVXJsKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmxvY2F0aW9uLmZpbGUpLnRvQmUocGF0aHMuYmFkSW1wb3J0KVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmxvY2F0aW9uLnBvc2l0aW9uKS50b0VxdWFsKFtbMCwgMjRdLCBbMCwgNDBdXSlcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5zb2x1dGlvbnMpLm5vdC50b0JlRGVmaW5lZCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnd2hlbiBhIGZpbGUgaXMgc3BlY2lmaWVkIGluIGFuIC5lc2xpbnRpZ25vcmUgZmlsZScsICgpID0+IHtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLWVzbGludC5kaXNhYmxlRXNsaW50SWdub3JlJywgZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCd3aWxsIG5vdCBnaXZlIHdhcm5pbmdzIHdoZW4gbGludGluZyB0aGUgZmlsZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGVkaXRvciA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4ocGF0aHMuaWdub3JlZClcbiAgICAgIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgbGludChlZGl0b3IpXG5cbiAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmUoMClcbiAgICB9KVxuXG4gICAgaXQoJ3dpbGwgbm90IGdpdmUgd2FybmluZ3Mgd2hlbiBhdXRvZml4aW5nIHRoZSBmaWxlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZWRpdG9yID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihwYXRocy5pZ25vcmVkKVxuICAgICAgY29uc3QgZXhwZWN0ZWRNZXNzYWdlID0gJ0xpbnRlci1FU0xpbnQ6IEZpeCBjb21wbGV0ZS4nXG4gICAgICBjb25zdCBub3RpZmljYXRpb25Qcm9taXNlID0gZ2V0Tm90aWZpY2F0aW9uKGV4cGVjdGVkTWVzc2FnZSlcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvciksICdsaW50ZXItZXNsaW50OmZpeC1maWxlJylcbiAgICAgIGNvbnN0IG5vdGlmaWNhdGlvbiA9IGF3YWl0IG5vdGlmaWNhdGlvblByb21pc2VcblxuICAgICAgZXhwZWN0KG5vdGlmaWNhdGlvbi5nZXRNZXNzYWdlKCkpLnRvQmUoZXhwZWN0ZWRNZXNzYWdlKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3doZW4gYSBmaWxlIGlzIG5vdCBzcGVjaWZpZWQgaW4gLmVzbGludGlnbm9yZSBmaWxlJywgYXN5bmMgKCkgPT4ge1xuICAgIGl0KCd3aWxsIGdpdmUgd2FybmluZ3Mgd2hlbiBsaW50aW5nIHRoZSBmaWxlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdGVtcFBhdGggPSBhd2FpdCBjb3B5RmlsZVRvVGVtcERpcihwYXRoLmpvaW4ocGF0aHMuZXNsaW50aWdub3JlRGlyLCAnaWdub3JlZC5qcycpKVxuICAgICAgY29uc3QgdGVtcERpciA9IHBhdGguZGlybmFtZSh0ZW1wUGF0aClcblxuICAgICAgY29uc3QgZWRpdG9yID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3Blbih0ZW1wUGF0aClcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLWVzbGludC5kaXNhYmxlRXNsaW50SWdub3JlJywgZmFsc2UpXG4gICAgICBhd2FpdCBjb3B5RmlsZVRvRGlyKHBhdGguam9pbihwYXRocy5lc2xpbnRpZ25vcmVEaXIsICcuZXNsaW50cmMueWFtbCcpLCB0ZW1wRGlyKVxuXG4gICAgICBjb25zdCBtZXNzYWdlcyA9IGF3YWl0IGxpbnQoZWRpdG9yKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZSgxKVxuICAgICAgcmltcmFmLnN5bmModGVtcERpcilcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCd3aGVuIGEgZmlsZSBpcyBzcGVjaWZpZWQgaW4gYW4gZXNsaW50SWdub3JlIGtleSBpbiBwYWNrYWdlLmpzb24nLCAoKSA9PiB7XG4gICAgaXQoJ3dpbGwgc3RpbGwgbGludCB0aGUgZmlsZSBpZiBhbiAuZXNsaW50aWdub3JlIGZpbGUgaXMgcHJlc2VudCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLWVzbGludC5kaXNhYmxlRXNsaW50SWdub3JlJywgZmFsc2UpXG4gICAgICBjb25zdCBlZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKHBhdGguam9pbihwYXRocy5lc2xpbnRJZ25vcmVLZXlEaXIsICdpZ25vcmVkLmpzJykpXG4gICAgICBjb25zdCBtZXNzYWdlcyA9IGF3YWl0IGxpbnQoZWRpdG9yKVxuXG4gICAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0JlKDEpXG4gICAgfSlcblxuICAgIGl0KCd3aWxsIG5vdCBnaXZlIHdhcm5pbmdzIHdoZW4gbGludGluZyB0aGUgZmlsZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHRlbXBQYXRoID0gYXdhaXQgY29weUZpbGVUb1RlbXBEaXIocGF0aC5qb2luKHBhdGhzLmVzbGludElnbm9yZUtleURpciwgJ2lnbm9yZWQuanMnKSlcbiAgICAgIGNvbnN0IHRlbXBEaXIgPSBwYXRoLmRpcm5hbWUodGVtcFBhdGgpXG5cbiAgICAgIGNvbnN0IGVkaXRvciA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4odGVtcFBhdGgpXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci1lc2xpbnQuZGlzYWJsZUVzbGludElnbm9yZScsIGZhbHNlKVxuICAgICAgYXdhaXQgY29weUZpbGVUb0RpcihwYXRoLmpvaW4ocGF0aHMuZXNsaW50SWdub3JlS2V5RGlyLCAncGFja2FnZS5qc29uJyksIHRlbXBEaXIpXG5cbiAgICAgIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgbGludChlZGl0b3IpXG4gICAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0JlKDApXG4gICAgICByaW1yYWYuc3luYyh0ZW1wRGlyKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2ZpeGVzIGVycm9ycycsICgpID0+IHtcbiAgICBsZXQgZWRpdG9yXG4gICAgbGV0IHRlbXBEaXJcblxuICAgIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQ29weSB0aGUgZmlsZSB0byBhIHRlbXBvcmFyeSBmb2xkZXJcbiAgICAgIGNvbnN0IHRlbXBGaXh0dXJlUGF0aCA9IGF3YWl0IGNvcHlGaWxlVG9UZW1wRGlyKHBhdGhzLmZpeClcbiAgICAgIGVkaXRvciA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4odGVtcEZpeHR1cmVQYXRoKVxuICAgICAgdGVtcERpciA9IHBhdGguZGlybmFtZSh0ZW1wRml4dHVyZVBhdGgpXG4gICAgICAvLyBDb3B5IHRoZSBjb25maWcgdG8gdGhlIHNhbWUgdGVtcG9yYXJ5IGRpcmVjdG9yeVxuICAgICAgYXdhaXQgY29weUZpbGVUb0RpcihwYXRocy5jb25maWcsIHRlbXBEaXIpXG4gICAgfSlcblxuICAgIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgICAvLyBSZW1vdmUgdGhlIHRlbXBvcmFyeSBkaXJlY3RvcnlcbiAgICAgIHJpbXJhZi5zeW5jKHRlbXBEaXIpXG4gICAgfSlcblxuICAgIGFzeW5jIGZ1bmN0aW9uIGZpcnN0TGludCh0ZXh0RWRpdG9yKSB7XG4gICAgICBjb25zdCBtZXNzYWdlcyA9IGF3YWl0IGxpbnQodGV4dEVkaXRvcilcbiAgICAgIC8vIFRoZSBvcmlnaW5hbCBmaWxlIGhhcyB0d28gZXJyb3JzXG4gICAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0JlKDIpXG4gICAgfVxuXG4gICAgaXQoJ3Nob3VsZCBmaXggbGludGluZyBlcnJvcnMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCBmaXJzdExpbnQoZWRpdG9yKVxuICAgICAgYXdhaXQgbWFrZUZpeGVzKGVkaXRvcilcbiAgICAgIGNvbnN0IG1lc3NhZ2VzQWZ0ZXJGaXhpbmcgPSBhd2FpdCBsaW50KGVkaXRvcilcblxuICAgICAgZXhwZWN0KG1lc3NhZ2VzQWZ0ZXJGaXhpbmcubGVuZ3RoKS50b0JlKDApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGZpeCBsaW50aW5nIGVycm9ycyBmb3IgcnVsZXMgdGhhdCBhcmUgZGlzYWJsZWQgd2l0aCBydWxlc1RvRGlzYWJsZVdoaWxlRml4aW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItZXNsaW50LnJ1bGVzVG9EaXNhYmxlV2hpbGVGaXhpbmcnLCBbJ3NlbWknXSlcblxuICAgICAgYXdhaXQgZmlyc3RMaW50KGVkaXRvcilcbiAgICAgIGF3YWl0IG1ha2VGaXhlcyhlZGl0b3IpXG4gICAgICBjb25zdCBtZXNzYWdlc0FmdGVyRml4aW5nID0gYXdhaXQgbGludChlZGl0b3IpXG4gICAgICBjb25zdCBleHBlY3RlZCA9ICdFeHRyYSBzZW1pY29sb24uIChzZW1pKSdcbiAgICAgIGNvbnN0IGV4cGVjdGVkVXJsID0gJ2h0dHBzOi8vZXNsaW50Lm9yZy9kb2NzL3J1bGVzL3NlbWknXG5cbiAgICAgIGV4cGVjdChtZXNzYWdlc0FmdGVyRml4aW5nLmxlbmd0aCkudG9CZSgxKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzQWZ0ZXJGaXhpbmdbMF0uZXhjZXJwdCkudG9CZShleHBlY3RlZClcbiAgICAgIGV4cGVjdChtZXNzYWdlc0FmdGVyRml4aW5nWzBdLnVybCkudG9CZShleHBlY3RlZFVybClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCd3aGVuIGFuIGVzbGludCBjYWNoZSBmaWxlIGlzIHByZXNlbnQnLCAoKSA9PiB7XG4gICAgbGV0IGVkaXRvclxuICAgIGxldCB0ZW1wRGlyXG5cbiAgICBiZWZvcmVFYWNoKGFzeW5jICgpID0+IHtcbiAgICAgIC8vIENvcHkgdGhlIGZpbGUgdG8gYSB0ZW1wb3JhcnkgZm9sZGVyXG4gICAgICBjb25zdCB0ZW1wRml4dHVyZVBhdGggPSBhd2FpdCBjb3B5RmlsZVRvVGVtcERpcihwYXRocy5maXgpXG4gICAgICBlZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKHRlbXBGaXh0dXJlUGF0aClcbiAgICAgIHRlbXBEaXIgPSBwYXRoLmRpcm5hbWUodGVtcEZpeHR1cmVQYXRoKVxuICAgICAgLy8gQ29weSB0aGUgY29uZmlnIHRvIHRoZSBzYW1lIHRlbXBvcmFyeSBkaXJlY3RvcnlcbiAgICAgIGF3YWl0IGNvcHlGaWxlVG9EaXIocGF0aHMuY29uZmlnLCB0ZW1wRGlyKVxuICAgIH0pXG5cbiAgICBhZnRlckVhY2goKCkgPT4ge1xuICAgICAgLy8gUmVtb3ZlIHRoZSB0ZW1wb3JhcnkgZGlyZWN0b3J5XG4gICAgICByaW1yYWYuc3luYyh0ZW1wRGlyKVxuICAgIH0pXG5cbiAgICBpdCgnZG9lcyBub3QgZGVsZXRlIHRoZSBjYWNoZSBmaWxlIHdoZW4gcGVyZm9ybWluZyBmaXhlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHRlbXBDYWNoZUZpbGUgPSBhd2FpdCBjb3B5RmlsZVRvRGlyKHBhdGhzLmNhY2hlLCB0ZW1wRGlyKVxuICAgICAgY29uc3QgY2hlY2tDYWNoZWZpbGVFeGlzdHMgPSAoKSA9PiB7XG4gICAgICAgIGZzLnN0YXRTeW5jKHRlbXBDYWNoZUZpbGUpXG4gICAgICB9XG4gICAgICBleHBlY3QoY2hlY2tDYWNoZWZpbGVFeGlzdHMpLm5vdC50b1Rocm93KClcbiAgICAgIGF3YWl0IG1ha2VGaXhlcyhlZGl0b3IpXG4gICAgICBleHBlY3QoY2hlY2tDYWNoZWZpbGVFeGlzdHMpLm5vdC50b1Rocm93KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdJZ25vcmVzIHNwZWNpZmllZCBydWxlcyB3aGVuIGVkaXRpbmcnLCAoKSA9PiB7XG4gICAgbGV0IGV4cGVjdGVkUGF0aFxuXG4gICAgY29uc3QgY2hlY2tOb0NvbnNvbGUgPSAobWVzc2FnZSkgPT4ge1xuICAgICAgY29uc3QgdGV4dCA9ICdVbmV4cGVjdGVkIGNvbnNvbGUgc3RhdGVtZW50LiAobm8tY29uc29sZSknXG4gICAgICBjb25zdCB1cmwgPSAnaHR0cHM6Ly9lc2xpbnQub3JnL2RvY3MvcnVsZXMvbm8tY29uc29sZSdcbiAgICAgIGV4cGVjdChtZXNzYWdlLnNldmVyaXR5KS50b0JlKCdlcnJvcicpXG4gICAgICBleHBlY3QobWVzc2FnZS5leGNlcnB0KS50b0JlKHRleHQpXG4gICAgICBleHBlY3QobWVzc2FnZS51cmwpLnRvQmUodXJsKVxuICAgICAgZXhwZWN0KG1lc3NhZ2UubG9jYXRpb24uZmlsZSkudG9CZShleHBlY3RlZFBhdGgpXG4gICAgICBleHBlY3QobWVzc2FnZS5sb2NhdGlvbi5wb3NpdGlvbikudG9FcXVhbChbWzAsIDBdLCBbMCwgMTFdXSlcbiAgICB9XG5cbiAgICBjb25zdCBjaGVja05vVHJhaWxpbmdTcGFjZSA9IChtZXNzYWdlKSA9PiB7XG4gICAgICBjb25zdCB0ZXh0ID0gJ1RyYWlsaW5nIHNwYWNlcyBub3QgYWxsb3dlZC4gKG5vLXRyYWlsaW5nLXNwYWNlcyknXG4gICAgICBjb25zdCB1cmwgPSAnaHR0cHM6Ly9lc2xpbnQub3JnL2RvY3MvcnVsZXMvbm8tdHJhaWxpbmctc3BhY2VzJ1xuXG4gICAgICBleHBlY3QobWVzc2FnZS5zZXZlcml0eSkudG9CZSgnZXJyb3InKVxuICAgICAgZXhwZWN0KG1lc3NhZ2UuZXhjZXJwdCkudG9CZSh0ZXh0KVxuICAgICAgZXhwZWN0KG1lc3NhZ2UudXJsKS50b0JlKHVybClcbiAgICAgIGV4cGVjdChtZXNzYWdlLmxvY2F0aW9uLmZpbGUpLnRvQmUoZXhwZWN0ZWRQYXRoKVxuICAgICAgZXhwZWN0KG1lc3NhZ2UubG9jYXRpb24ucG9zaXRpb24pLnRvRXF1YWwoW1sxLCA5XSwgWzEsIDEwXV0pXG4gICAgfVxuXG4gICAgY29uc3QgY2hlY2tCZWZvcmUgPSAobWVzc2FnZXMpID0+IHtcbiAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmUoMSlcbiAgICAgIGNoZWNrTm9Db25zb2xlKG1lc3NhZ2VzWzBdKVxuICAgIH1cblxuICAgIGNvbnN0IGNoZWNrTmV3ID0gKG1lc3NhZ2VzKSA9PiB7XG4gICAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0JlKDIpXG4gICAgICBjaGVja05vQ29uc29sZShtZXNzYWdlc1swXSlcbiAgICAgIGNoZWNrTm9UcmFpbGluZ1NwYWNlKG1lc3NhZ2VzWzFdKVxuICAgIH1cblxuICAgIGNvbnN0IGNoZWNrQWZ0ZXIgPSAobWVzc2FnZXMpID0+IHtcbiAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmUoMSlcbiAgICAgIGNoZWNrTm9Db25zb2xlKG1lc3NhZ2VzWzBdKVxuICAgIH1cblxuICAgIGl0KCdkb2VzIG5vdGhpbmcgb24gc2F2ZWQgZmlsZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci1lc2xpbnQucnVsZXNUb1NpbGVuY2VXaGlsZVR5cGluZycsIFsnbm8tdHJhaWxpbmctc3BhY2VzJ10pXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci1lc2xpbnQuaWdub3JlRml4YWJsZVJ1bGVzV2hpbGVUeXBpbmcnLCB0cnVlKVxuICAgICAgZXhwZWN0ZWRQYXRoID0gcGF0aHMubW9kaWZpZWRJZ25vcmVTcGFjZVxuICAgICAgY29uc3QgZWRpdG9yID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihleHBlY3RlZFBhdGgpXG4gICAgICAvLyBSdW4gb25jZSB0byBwb3B1bGF0ZSB0aGUgZml4YWJsZSBydWxlcyBsaXN0XG4gICAgICBhd2FpdCBsaW50KGVkaXRvcilcbiAgICAgIC8vIFJ1biBhZ2FpbiBmb3IgdGhlIHRlc3RhYmxlIHJlc3VsdHNcbiAgICAgIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgbGludChlZGl0b3IpXG4gICAgICBjaGVja05ldyhtZXNzYWdlcylcbiAgICB9KVxuXG4gICAgaXQoJ2FsbG93cyBpZ25vcmluZyBhIHNwZWNpZmljIGxpc3Qgb2YgcnVsZXMgd2hlbiBtb2RpZmllZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGV4cGVjdGVkUGF0aCA9IHBhdGhzLm1vZGlmaWVkSWdub3JlXG4gICAgICBjb25zdCBlZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKGV4cGVjdGVkUGF0aClcblxuICAgICAgLy8gVmVyaWZ5IGV4cGVjdGVkIGVycm9yIGJlZm9yZVxuICAgICAgY29uc3QgZmlyc3RNZXNzYWdlcyA9IGF3YWl0IGxpbnQoZWRpdG9yKVxuICAgICAgY2hlY2tCZWZvcmUoZmlyc3RNZXNzYWdlcylcblxuICAgICAgLy8gSW5zZXJ0IGEgc3BhY2UgaW50byB0aGUgZWRpdG9yXG4gICAgICBlZGl0b3IuZ2V0QnVmZmVyKCkuaW5zZXJ0KFsxLCA5XSwgJyAnKVxuXG4gICAgICAvLyBWZXJpZnkgdGhlIHNwYWNlIGlzIHNob3dpbmcgYW4gZXJyb3JcbiAgICAgIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgbGludChlZGl0b3IpXG4gICAgICBjaGVja05ldyhtZXNzYWdlcylcblxuICAgICAgLy8gRW5hYmxlIHRoZSBvcHRpb24gdW5kZXIgdGVzdFxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItZXNsaW50LnJ1bGVzVG9TaWxlbmNlV2hpbGVUeXBpbmcnLCBbJ25vLXRyYWlsaW5nLXNwYWNlcyddKVxuXG4gICAgICAvLyBDaGVjayB0aGUgbGludCByZXN1bHRzXG4gICAgICBjb25zdCBuZXdNZXNzYWdlcyA9IGF3YWl0IGxpbnQoZWRpdG9yKVxuICAgICAgY2hlY2tBZnRlcihuZXdNZXNzYWdlcylcbiAgICB9KVxuXG4gICAgaXQoJ2FsbG93cyBpZ25vcmluZyBhbGwgZml4YWJsZSBydWxlcyB3aGlsZSB0eXBpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICBleHBlY3RlZFBhdGggPSBwYXRocy5tb2RpZmllZElnbm9yZVxuICAgICAgY29uc3QgZWRpdG9yID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihleHBlY3RlZFBhdGgpXG5cbiAgICAgIC8vIFZlcmlmeSBubyBlcnJvciBiZWZvcmVcbiAgICAgIGNvbnN0IGZpcnN0TWVzc2FnZXMgPSBhd2FpdCBsaW50KGVkaXRvcilcbiAgICAgIGNoZWNrQmVmb3JlKGZpcnN0TWVzc2FnZXMpXG5cbiAgICAgIC8vIEluc2VydCBhIHNwYWNlIGludG8gdGhlIGVkaXRvclxuICAgICAgZWRpdG9yLmdldEJ1ZmZlcigpLmluc2VydChbMSwgOV0sICcgJylcblxuICAgICAgLy8gVmVyaWZ5IHRoZSBzcGFjZSBpcyBzaG93aW5nIGFuIGVycm9yXG4gICAgICBjb25zdCBtZXNzYWdlcyA9IGF3YWl0IGxpbnQoZWRpdG9yKVxuICAgICAgY2hlY2tOZXcobWVzc2FnZXMpXG5cbiAgICAgIC8vIEVuYWJsZSB0aGUgb3B0aW9uIHVuZGVyIHRlc3RcbiAgICAgIC8vIE5PVEU6IERlcGVuZHMgb24gbm8tdHJhaWxpbmctc3BhY2VzIGJlaW5nIG1hcmtlZCBhcyBmaXhhYmxlIGJ5IEVTTGludFxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItZXNsaW50Lmlnbm9yZUZpeGFibGVSdWxlc1doaWxlVHlwaW5nJywgdHJ1ZSlcblxuICAgICAgLy8gQ2hlY2sgdGhlIGxpbnQgcmVzdWx0c1xuICAgICAgY29uc3QgbmV3TWVzc2FnZXMgPSBhd2FpdCBsaW50KGVkaXRvcilcbiAgICAgIGNoZWNrQWZ0ZXIobmV3TWVzc2FnZXMpXG4gICAgfSlcblxuICAgIGl0KCdhbGxvd3MgaWdub3JpbmcgZml4aWJsZSBydWxlcyBmcm9tIHBsdWdpbnMgd2hpbGUgdHlwaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgZXhwZWN0ZWRQYXRoID0gcGF0aHMuZml4YWJsZVBsdWdpblxuICAgICAgY29uc3QgZWRpdG9yID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihleHBlY3RlZFBhdGgpXG5cbiAgICAgIC8vIFZlcmlmeSBubyBlcnJvciBiZWZvcmUgdGhlIGVkaXRvciBpcyBtb2RpZmllZFxuICAgICAgY29uc3QgZmlyc3RNZXNzYWdlcyA9IGF3YWl0IGxpbnQoZWRpdG9yKVxuICAgICAgZXhwZWN0KGZpcnN0TWVzc2FnZXMubGVuZ3RoKS50b0JlKDApXG5cbiAgICAgIC8vIFJlbW92ZSB0aGUgbmV3bGluZSBiZXR3ZWVuIHRoZSBpbXBvcnQgYW5kIGNvbnNvbGUgbG9nXG4gICAgICBlZGl0b3IuZ2V0QnVmZmVyKCkuZGVsZXRlUm93KDEpXG5cbiAgICAgIC8vIFZlcmlmeSB0aGVyZSBpcyBhbiBlcnJvciBmb3IgdGhlIGZpeGFibGUgaW1wb3J0L25ld2xpbmUtYWZ0ZXItaW1wb3J0IHJ1bGVcbiAgICAgIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgbGludChlZGl0b3IpXG4gICAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0JlKDEpXG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0uc2V2ZXJpdHkpLnRvQmUoJ2Vycm9yJylcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5leGNlcnB0KS50b0JlKCdFeHBlY3RlZCBlbXB0eSBsaW5lIGFmdGVyIGltcG9ydCBzdGF0ZW1lbnQgbm90IGZvbGxvd2VkIGJ5IGFub3RoZXIgaW1wb3J0LiAoaW1wb3J0L25ld2xpbmUtYWZ0ZXItaW1wb3J0KScpXG5cbiAgICAgIC8vIEVuYWJsZSB0aGUgb3B0aW9uIHVuZGVyIHRlc3RcbiAgICAgIC8vIE5PVEU6IERlcGVuZHMgb24gbXBvcnQvbmV3bGluZS1hZnRlci1pbXBvcnQgcnVsZSBiZWluZyBtYXJrZWQgYXMgZml4YWJsZVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItZXNsaW50Lmlnbm9yZUZpeGFibGVSdWxlc1doaWxlVHlwaW5nJywgdHJ1ZSlcblxuICAgICAgLy8gQ2hlY2sgdGhlIGxpbnQgcmVzdWx0c1xuICAgICAgY29uc3QgbmV3TWVzc2FnZXMgPSBhd2FpdCBsaW50KGVkaXRvcilcbiAgICAgIGV4cGVjdChuZXdNZXNzYWdlcy5sZW5ndGgpLnRvQmUoMClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdwcmludHMgZGVidWdnaW5nIGluZm9ybWF0aW9uIHdpdGggdGhlIGBkZWJ1Z2AgY29tbWFuZCcsICgpID0+IHtcbiAgICBsZXQgZWRpdG9yXG4gICAgY29uc3QgZXhwZWN0ZWRNZXNzYWdlID0gJ2xpbnRlci1lc2xpbnQgZGVidWdnaW5nIGluZm9ybWF0aW9uJ1xuICAgIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgZWRpdG9yID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihwYXRocy5nb29kKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvd3MgYW4gaW5mbyBub3RpZmljYXRpb24nLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBub3RpZmljYXRpb25Qcm9taXNlID0gZ2V0Tm90aWZpY2F0aW9uKGV4cGVjdGVkTWVzc2FnZSlcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvciksICdsaW50ZXItZXNsaW50OmRlYnVnJylcbiAgICAgIGNvbnN0IG5vdGlmaWNhdGlvbiA9IGF3YWl0IG5vdGlmaWNhdGlvblByb21pc2VcblxuICAgICAgZXhwZWN0KG5vdGlmaWNhdGlvbi5nZXRNZXNzYWdlKCkpLnRvQmUoZXhwZWN0ZWRNZXNzYWdlKVxuICAgICAgZXhwZWN0KG5vdGlmaWNhdGlvbi5nZXRUeXBlKCkpLnRvRXF1YWwoJ2luZm8nKVxuICAgIH0pXG5cbiAgICBpdCgnaW5jbHVkZXMgZGVidWdnaW5nIGluZm9ybWF0aW9uIGluIHRoZSBkZXRhaWxzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgbm90aWZpY2F0aW9uUHJvbWlzZSA9IGdldE5vdGlmaWNhdGlvbihleHBlY3RlZE1lc3NhZ2UpXG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpLCAnbGludGVyLWVzbGludDpkZWJ1ZycpXG4gICAgICBjb25zdCBub3RpZmljYXRpb24gPSBhd2FpdCBub3RpZmljYXRpb25Qcm9taXNlXG4gICAgICBjb25zdCBkZXRhaWwgPSBub3RpZmljYXRpb24uZ2V0RGV0YWlsKClcblxuICAgICAgZXhwZWN0KGRldGFpbC5pbmNsdWRlcyhgQXRvbSB2ZXJzaW9uOiAke2F0b20uZ2V0VmVyc2lvbigpfWApKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QoZGV0YWlsLmluY2x1ZGVzKCdsaW50ZXItZXNsaW50IHZlcnNpb246JykpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChkZXRhaWwuaW5jbHVkZXMoYFBsYXRmb3JtOiAke3Byb2Nlc3MucGxhdGZvcm19YCkpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChkZXRhaWwuaW5jbHVkZXMoJ2xpbnRlci1lc2xpbnQgY29uZmlndXJhdGlvbjonKSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KGRldGFpbC5pbmNsdWRlcygnVXNpbmcgbG9jYWwgcHJvamVjdCBFU0xpbnQnKSkudG9CZSh0cnVlKVxuICAgIH0pXG4gIH0pXG5cbiAgaXQoJ2hhbmRsZXMgcmFuZ2VzIGluIG1lc3NhZ2VzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGVkaXRvciA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4ocGF0aHMuZW5kUmFuZ2UpXG4gICAgY29uc3QgbWVzc2FnZXMgPSBhd2FpdCBsaW50KGVkaXRvcilcbiAgICBjb25zdCBleHBlY3RlZCA9ICdVbnJlYWNoYWJsZSBjb2RlLiAobm8tdW5yZWFjaGFibGUpJ1xuICAgIGNvbnN0IGV4cGVjdGVkVXJsID0gJ2h0dHBzOi8vZXNsaW50Lm9yZy9kb2NzL3J1bGVzL25vLXVucmVhY2hhYmxlJ1xuXG4gICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnNldmVyaXR5KS50b0JlKCdlcnJvcicpXG4gICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmV4Y2VycHQpLnRvQmUoZXhwZWN0ZWQpXG4gICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnVybCkudG9CZShleHBlY3RlZFVybClcbiAgICBleHBlY3QobWVzc2FnZXNbMF0ubG9jYXRpb24uZmlsZSkudG9CZShwYXRocy5lbmRSYW5nZSlcbiAgICBleHBlY3QobWVzc2FnZXNbMF0ubG9jYXRpb24ucG9zaXRpb24pLnRvRXF1YWwoW1s1LCAyXSwgWzYsIDE1XV0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3doZW4gc2V0dGluZyBgZGlzYWJsZVdoZW5Ob0VzbGludENvbmZpZ2AgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgbGV0IGVkaXRvclxuICAgIGxldCB0ZW1wRmlsZVBhdGhcbiAgICBsZXQgdGVtcEZpeHR1cmVEaXJcblxuICAgIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItZXNsaW50LmRpc2FibGVXaGVuTm9Fc2xpbnRDb25maWcnLCBmYWxzZSlcblxuICAgICAgdGVtcEZpbGVQYXRoID0gYXdhaXQgY29weUZpbGVUb1RlbXBEaXIocGF0aHMuYmFkSW5saW5lKVxuICAgICAgZWRpdG9yID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3Blbih0ZW1wRmlsZVBhdGgpXG4gICAgICB0ZW1wRml4dHVyZURpciA9IHBhdGguZGlybmFtZSh0ZW1wRmlsZVBhdGgpXG4gICAgfSlcblxuICAgIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgICByaW1yYWYuc3luYyh0ZW1wRml4dHVyZURpcilcbiAgICB9KVxuXG4gICAgaXQoJ2Vycm9ycyB3aGVuIG5vIGNvbmZpZyBmaWxlIGlzIGZvdW5kJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgbWVzc2FnZXMgPSBhd2FpdCBsaW50KGVkaXRvcilcbiAgICAgIGNvbnN0IGV4cGVjdGVkID0gJ0Vycm9yIHdoaWxlIHJ1bm5pbmcgRVNMaW50OiBObyBFU0xpbnQgY29uZmlndXJhdGlvbiBmb3VuZC4uJ1xuICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSBgPGRpdiBzdHlsZT1cIndoaXRlLXNwYWNlOiBwcmUtd3JhcFwiPk5vIEVTTGludCBjb25maWd1cmF0aW9uIGZvdW5kLlxuPGhyIC8+RXJyb3I6IE5vIEVTTGludCBjb25maWd1cmF0aW9uIGZvdW5kLlxuICAgIGF0IENvbmZpZy5nZXRMb2NhbENvbmZpZ0hpZXJhcmNoeWBcbiAgICAgIC8vIFRoZSByZXN0IG9mIHRoZSBkZXNjcmlwdGlvbiBpbmNsdWRlcyBwYXRocyBzcGVjaWZpYyB0byB0aGUgY29tcHV0ZXIgcnVubmluZyBpdFxuICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZSgxKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnNldmVyaXR5KS50b0JlKCdlcnJvcicpXG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0uZXhjZXJwdCkudG9CZShleHBlY3RlZClcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5kZXNjcmlwdGlvbi5zdGFydHNXaXRoKGRlc2NyaXB0aW9uKSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnVybCkubm90LnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5sb2NhdGlvbi5maWxlKS50b0JlKHRlbXBGaWxlUGF0aClcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5sb2NhdGlvbi5wb3NpdGlvbikudG9FcXVhbChbWzAsIDBdLCBbMCwgMjhdXSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCd3aGVuIGBkaXNhYmxlV2hlbk5vRXNsaW50Q29uZmlnYCBpcyB0cnVlJywgKCkgPT4ge1xuICAgIGxldCBlZGl0b3JcbiAgICBsZXQgdGVtcEZpeHR1cmVEaXJcblxuICAgIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItZXNsaW50LmRpc2FibGVXaGVuTm9Fc2xpbnRDb25maWcnLCB0cnVlKVxuXG4gICAgICBjb25zdCB0ZW1wRmlsZVBhdGggPSBhd2FpdCBjb3B5RmlsZVRvVGVtcERpcihwYXRocy5iYWRJbmxpbmUpXG4gICAgICBlZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKHRlbXBGaWxlUGF0aClcbiAgICAgIHRlbXBGaXh0dXJlRGlyID0gcGF0aC5kaXJuYW1lKHRlbXBGaWxlUGF0aClcbiAgICB9KVxuXG4gICAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICAgIHJpbXJhZi5zeW5jKHRlbXBGaXh0dXJlRGlyKVxuICAgIH0pXG5cbiAgICBpdCgnZG9lcyBub3QgcmVwb3J0IGVycm9ycyB3aGVuIG5vIGNvbmZpZyBmaWxlIGlzIGZvdW5kJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgbWVzc2FnZXMgPSBhd2FpdCBsaW50KGVkaXRvcilcblxuICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZSgwKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2xldHMgRVNMaW50IGhhbmRsZSBjb25maWd1cmF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCd3b3JrcyB3aGVuIHRoZSBjYWNoZSBmYWlscycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEVuc3VyZSB0aGUgY2FjaGUgaXMgZW5hYmxlZCwgc2luY2Ugd2Ugd2lsbCBiZSB0YWtpbmcgYWR2YW50YWdlIG9mXG4gICAgICAvLyBhIGZhaWxpbmcgaW4gaXQncyBvcGVyYXRpb25cbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLWVzbGludC5kaXNhYmxlRlNDYWNoZScsIGZhbHNlKVxuICAgICAgY29uc3QgZm9vUGF0aCA9IHBhdGguam9pbihwYXRocy5iYWRDYWNoZSwgJ3RlbXAnLCAnZm9vLmpzJylcbiAgICAgIGNvbnN0IG5ld0NvbmZpZ1BhdGggPSBwYXRoLmpvaW4ocGF0aHMuYmFkQ2FjaGUsICd0ZW1wJywgJy5lc2xpbnRyYy5qcycpXG4gICAgICBjb25zdCBlZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKGZvb1BhdGgpXG4gICAgICBmdW5jdGlvbiB1bmRlZk1zZyh2YXJOYW1lKSB7XG4gICAgICAgIHJldHVybiBgJyR7dmFyTmFtZX0nIGlzIG5vdCBkZWZpbmVkLiAobm8tdW5kZWYpYFxuICAgICAgfVxuICAgICAgY29uc3QgZXhwZWN0ZWRVcmwgPSAnaHR0cHM6Ly9lc2xpbnQub3JnL2RvY3MvcnVsZXMvbm8tdW5kZWYnXG5cbiAgICAgIC8vIFRyaWdnZXIgYSBmaXJzdCBsaW50IHRvIHdhcm0gdXAgdGhlIGNhY2hlIHdpdGggdGhlIGZpcnN0IGNvbmZpZyByZXN1bHRcbiAgICAgIGxldCBtZXNzYWdlcyA9IGF3YWl0IGxpbnQoZWRpdG9yKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZSgyKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnNldmVyaXR5KS50b0JlKCdlcnJvcicpXG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0uZXhjZXJwdCkudG9CZSh1bmRlZk1zZygnY29uc29sZScpKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnVybCkudG9CZShleHBlY3RlZFVybClcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5sb2NhdGlvbi5maWxlKS50b0JlKGZvb1BhdGgpXG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0ubG9jYXRpb24ucG9zaXRpb24pLnRvRXF1YWwoW1sxLCAyXSwgWzEsIDldXSlcbiAgICAgIGV4cGVjdChtZXNzYWdlc1sxXS5zZXZlcml0eSkudG9CZSgnZXJyb3InKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzFdLmV4Y2VycHQpLnRvQmUodW5kZWZNc2coJ2JhcicpKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzFdLnVybCkudG9CZShleHBlY3RlZFVybClcbiAgICAgIGV4cGVjdChtZXNzYWdlc1sxXS5sb2NhdGlvbi5maWxlKS50b0JlKGZvb1BhdGgpXG4gICAgICBleHBlY3QobWVzc2FnZXNbMV0ubG9jYXRpb24ucG9zaXRpb24pLnRvRXF1YWwoW1sxLCAxNF0sIFsxLCAxN11dKVxuXG4gICAgICAvLyBXcml0ZSB0aGUgbmV3IGNvbmZpZ3VyYXRpb24gZmlsZVxuICAgICAgY29uc3QgbmV3Q29uZmlnID0ge1xuICAgICAgICBlbnY6IHtcbiAgICAgICAgICBicm93c2VyOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfVxuICAgICAgbGV0IGNvbmZpZ0NvbnRlbnRzID0gYG1vZHVsZS5leHBvcnRzID0gJHtKU09OLnN0cmluZ2lmeShuZXdDb25maWcsIG51bGwsIDIpfVxcbmBcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMobmV3Q29uZmlnUGF0aCwgY29uZmlnQ29udGVudHMpXG5cbiAgICAgIC8vIExpbnQgYWdhaW4sIEVTTGludCBzaG91bGQgcmVjb2duaXNlIHRoZSBuZXcgY29uZmlndXJhdGlvblxuICAgICAgLy8gVGhlIGNhY2hlZCBjb25maWcgcmVzdWx0cyBhcmUgc3RpbGwgcG9pbnRpbmcgYXQgdGhlIF9wYXJlbnRfIGZpbGUuIEVTTGludFxuICAgICAgLy8gd291bGQgcGFydGlhbGx5IGhhbmRsZSB0aGlzIHNpdHVhdGlvbiBpZiB0aGUgY29uZmlnIGZpbGUgd2FzIHNwZWNpZmllZFxuICAgICAgLy8gZnJvbSB0aGUgY2FjaGUuXG4gICAgICBtZXNzYWdlcyA9IGF3YWl0IGxpbnQoZWRpdG9yKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZSgxKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnNldmVyaXR5KS50b0JlKCdlcnJvcicpXG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0uZXhjZXJwdCkudG9CZSh1bmRlZk1zZygnYmFyJykpXG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0udXJsKS50b0JlKGV4cGVjdGVkVXJsKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmxvY2F0aW9uLmZpbGUpLnRvQmUoZm9vUGF0aClcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5sb2NhdGlvbi5wb3NpdGlvbikudG9FcXVhbChbWzEsIDE0XSwgWzEsIDE3XV0pXG5cbiAgICAgIC8vIFVwZGF0ZSB0aGUgY29uZmlndXJhdGlvblxuICAgICAgbmV3Q29uZmlnLnJ1bGVzID0ge1xuICAgICAgICAnbm8tdW5kZWYnOiAnb2ZmJyxcbiAgICAgIH1cbiAgICAgIGNvbmZpZ0NvbnRlbnRzID0gYG1vZHVsZS5leHBvcnRzID0gJHtKU09OLnN0cmluZ2lmeShuZXdDb25maWcsIG51bGwsIDIpfVxcbmBcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMobmV3Q29uZmlnUGF0aCwgY29uZmlnQ29udGVudHMpXG5cbiAgICAgIC8vIExpbnQgYWdhaW4sIGlmIHRoZSBjYWNoZSB3YXMgc3BlY2lmeWluZyB0aGUgZmlsZSBFU0xpbnQgYXQgdGhpcyBwb2ludFxuICAgICAgLy8gd291bGQgZmFpbCB0byB1cGRhdGUgdGhlIGNvbmZpZ3VyYXRpb24gZnVsbHksIGFuZCB3b3VsZCBzdGlsbCByZXBvcnQgYVxuICAgICAgLy8gbm8tdW5kZWYgZXJyb3IuXG4gICAgICBtZXNzYWdlcyA9IGF3YWl0IGxpbnQoZWRpdG9yKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZSgwKVxuXG4gICAgICAvLyBEZWxldGUgdGhlIHRlbXBvcmFyeSBjb25maWd1cmF0aW9uIGZpbGVcbiAgICAgIGZzLnVubGlua1N5bmMobmV3Q29uZmlnUGF0aClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCd3b3JrcyB3aXRoIEhUTUwgZmlsZXMnLCAoKSA9PiB7XG4gICAgY29uc3QgZW1iZWRkZWRTY29wZSA9ICdzb3VyY2UuanMuZW1iZWRkZWQuaHRtbCdcbiAgICBjb25zdCBzY29wZXMgPSBsaW50ZXJQcm92aWRlci5ncmFtbWFyU2NvcGVzXG5cbiAgICBpdCgnYWRkcyB0aGUgSFRNTCBzY29wZSB3aGVuIHRoZSBzZXR0aW5nIGlzIGVuYWJsZWQnLCAoKSA9PiB7XG4gICAgICBleHBlY3Qoc2NvcGVzLmluY2x1ZGVzKGVtYmVkZGVkU2NvcGUpKS50b0JlKGZhbHNlKVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItZXNsaW50LmxpbnRIdG1sRmlsZXMnLCB0cnVlKVxuICAgICAgZXhwZWN0KHNjb3Blcy5pbmNsdWRlcyhlbWJlZGRlZFNjb3BlKSkudG9CZSh0cnVlKVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItZXNsaW50LmxpbnRIdG1sRmlsZXMnLCBmYWxzZSlcbiAgICAgIGV4cGVjdChzY29wZXMuaW5jbHVkZXMoZW1iZWRkZWRTY29wZSkpLnRvQmUoZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdrZWVwcyB0aGUgSFRNTCBzY29wZSB3aXRoIGN1c3RvbSBzY29wZXMnLCAoKSA9PiB7XG4gICAgICBleHBlY3Qoc2NvcGVzLmluY2x1ZGVzKGVtYmVkZGVkU2NvcGUpKS50b0JlKGZhbHNlKVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItZXNsaW50LmxpbnRIdG1sRmlsZXMnLCB0cnVlKVxuICAgICAgZXhwZWN0KHNjb3Blcy5pbmNsdWRlcyhlbWJlZGRlZFNjb3BlKSkudG9CZSh0cnVlKVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItZXNsaW50LnNjb3BlcycsIFsnZm9vLmJhciddKVxuICAgICAgZXhwZWN0KHNjb3Blcy5pbmNsdWRlcyhlbWJlZGRlZFNjb3BlKSkudG9CZSh0cnVlKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2hhbmRsZXMgdGhlIFNob3cgUnVsZSBJRCBpbiBNZXNzYWdlcyBvcHRpb24nLCAoKSA9PiB7XG4gICAgY29uc3QgZXhwZWN0ZWRVcmwgPSAnaHR0cHM6Ly9naXRodWIuY29tL2Jlbm1vc2hlci9lc2xpbnQtcGx1Z2luLWltcG9ydC9ibG9iL21hc3Rlci9kb2NzL3J1bGVzL25vLXVucmVzb2x2ZWQubWQnXG5cbiAgICBpdCgnc2hvd3MgdGhlIHJ1bGUgSUQgd2hlbiBlbmFibGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItZXNsaW50LnNob3dSdWxlSWRJbk1lc3NhZ2UnLCB0cnVlKVxuICAgICAgY29uc3QgZWRpdG9yID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihwYXRocy5iYWRJbXBvcnQpXG4gICAgICBjb25zdCBtZXNzYWdlcyA9IGF3YWl0IGxpbnQoZWRpdG9yKVxuICAgICAgY29uc3QgZXhwZWN0ZWQgPSBcIlVuYWJsZSB0byByZXNvbHZlIHBhdGggdG8gbW9kdWxlICcuLi9ub25leGlzdGVudCcuIChpbXBvcnQvbm8tdW5yZXNvbHZlZClcIlxuXG4gICAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0JlKDEpXG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0uc2V2ZXJpdHkpLnRvQmUoJ2Vycm9yJylcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5leGNlcnB0KS50b0JlKGV4cGVjdGVkKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnVybCkudG9CZShleHBlY3RlZFVybClcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5sb2NhdGlvbi5maWxlKS50b0JlKHBhdGhzLmJhZEltcG9ydClcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5sb2NhdGlvbi5wb3NpdGlvbikudG9FcXVhbChbWzAsIDI0XSwgWzAsIDQwXV0pXG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0uc29sdXRpb25zKS5ub3QudG9CZURlZmluZWQoKVxuICAgIH0pXG5cbiAgICBpdChcImRvZXNuJ3Qgc2hvdyB0aGUgcnVsZSBJRCB3aGVuIGRpc2FibGVkXCIsIGFzeW5jICgpID0+IHtcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLWVzbGludC5zaG93UnVsZUlkSW5NZXNzYWdlJywgZmFsc2UpXG4gICAgICBjb25zdCBlZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKHBhdGhzLmJhZEltcG9ydClcbiAgICAgIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgbGludChlZGl0b3IpXG4gICAgICBjb25zdCBleHBlY3RlZCA9IFwiVW5hYmxlIHRvIHJlc29sdmUgcGF0aCB0byBtb2R1bGUgJy4uL25vbmV4aXN0ZW50Jy5cIlxuXG4gICAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0JlKDEpXG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0uc2V2ZXJpdHkpLnRvQmUoJ2Vycm9yJylcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5leGNlcnB0KS50b0JlKGV4cGVjdGVkKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnVybCkudG9CZShleHBlY3RlZFVybClcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5sb2NhdGlvbi5maWxlKS50b0JlKHBhdGhzLmJhZEltcG9ydClcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5sb2NhdGlvbi5wb3NpdGlvbikudG9FcXVhbChbWzAsIDI0XSwgWzAsIDQwXV0pXG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0uc29sdXRpb25zKS5ub3QudG9CZURlZmluZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoXCJyZWdpc3RlcnMgYW4gJ0VTTGludCBGaXgnIHJpZ2h0IGNsaWNrIG1lbnUgY29tbWFuZFwiLCAoKSA9PiB7XG4gICAgLy8gTk9URTogUmVhY2hlcyBpbnRvIHRoZSBwcml2YXRlIGRhdGEgb2YgdGhlIENvbnRleHRNZW51TWFuYWdlciwgdGhlcmUgaXNcbiAgICAvLyBubyBwdWJsaWMgbWV0aG9kIHRvIGNoZWNrIHRoaXMgdGhvdWdoIHNvLi4uXG4gICAgZXhwZWN0KGF0b20uY29udGV4dE1lbnUuaXRlbVNldHMuc29tZShpdGVtU2V0ID0+XG4gICAgICAvLyBNYXRjaGluZyBzZWxlY3Rvci4uLlxuICAgICAgaXRlbVNldC5zZWxlY3RvciA9PT0gJ2F0b20tdGV4dC1lZGl0b3I6bm90KC5taW5pKSwgLm92ZXJsYXllcicgJiZcbiAgICAgIGl0ZW1TZXQuaXRlbXMuc29tZShpdGVtID0+XG4gICAgICAgIC8vIE1hdGNoaW5nIGNvbW1hbmQuLi5cbiAgICAgICAgaXRlbS5jb21tYW5kID09PSAnbGludGVyLWVzbGludDpmaXgtZmlsZScgJiZcbiAgICAgICAgLy8gTWF0Y2hpbmcgbGFiZWxcbiAgICAgICAgaXRlbS5sYWJlbCA9PT0gJ0VTTGludCBGaXgnICYmXG4gICAgICAgIC8vIEFuZCBoYXMgYSBmdW5jdGlvbiBjb250cm9sbGluZyBkaXNwbGF5XG4gICAgICAgIHR5cGVvZiBpdGVtLnNob3VsZERpc3BsYXkgPT09ICdmdW5jdGlvbicpKSlcbiAgfSlcbn0pXG4iXX0=