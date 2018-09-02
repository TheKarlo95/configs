Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.startWorker = startWorker;
exports.killWorker = killWorker;

/**
 * Send a job to the worker and return the results
 * @param  {Object} config Configuration for the job to send to the worker
 * @return {Object|String|Error}        The data returned from the worker
 */

var sendJob = _asyncToGenerator(function* (config) {
  if (worker && !worker.childProcess.connected) {
    // Sometimes the worker dies and becomes disconnected
    // When that happens, it seems that there is no way to recover other
    // than to kill the worker and create a new one.
    killWorker();
  }

  // Ensure the worker is started
  startWorker();

  // Expand the config with a unique ID to emit on
  // NOTE: Jobs _must_ have a unique ID as they are completely async and results
  // can arrive back in any order.
  // eslint-disable-next-line no-param-reassign
  config.emitKey = (0, _cryptoRandomString2['default'])(10);

  return new Promise(function (resolve, reject) {
    // All worker errors are caught and re-emitted along with their associated
    // emitKey, so that we do not create multiple listeners for the same
    // 'task:error' event
    var errSub = worker.on('workerError:' + config.emitKey, function (_ref) {
      var msg = _ref.msg;
      var stack = _ref.stack;

      // Re-throw errors from the task
      var error = new Error(msg);
      // Set the stack to the one given to us by the worker
      error.stack = stack;
      errSub.dispose();
      // eslint-disable-next-line no-use-before-define
      responseSub.dispose();
      reject(error);
    });
    var responseSub = worker.on(config.emitKey, function (data) {
      errSub.dispose();
      responseSub.dispose();
      resolve(data);
    });
    // Send the job on to the worker
    try {
      worker.send(config);
    } catch (e) {
      errSub.dispose();
      responseSub.dispose();
      console.error(e);
    }
  });
});

exports.sendJob = sendJob;

var getDebugInfo = _asyncToGenerator(function* () {
  var textEditor = atom.workspace.getActiveTextEditor();
  var filePath = undefined;
  var editorScopes = undefined;
  if (atom.workspace.isTextEditor(textEditor)) {
    filePath = textEditor.getPath();
    editorScopes = textEditor.getLastCursor().getScopeDescriptor().getScopesArray();
  } else {
    // Somehow this can be called with no active TextEditor, impossible I know...
    filePath = 'unknown';
    editorScopes = ['unknown'];
  }
  var packagePath = atom.packages.resolvePackagePath('linter-eslint');
  var linterEslintMeta = undefined;
  if (packagePath === undefined) {
    // Apparently for some users the package path fails to resolve
    linterEslintMeta = { version: 'unknown!' };
  } else {
    // eslint-disable-next-line import/no-dynamic-require
    linterEslintMeta = require((0, _path.join)(packagePath, 'package.json'));
  }
  var config = atom.config.get('linter-eslint');
  var hoursSinceRestart = Math.round(process.uptime() / 3600 * 10) / 10;
  var returnVal = undefined;
  try {
    var response = yield sendJob({
      type: 'debug',
      config: config,
      filePath: filePath
    });
    returnVal = {
      atomVersion: atom.getVersion(),
      linterEslintVersion: linterEslintMeta.version,
      linterEslintConfig: config,
      // eslint-disable-next-line import/no-dynamic-require
      eslintVersion: require((0, _path.join)(response.path, 'package.json')).version,
      hoursSinceRestart: hoursSinceRestart,
      platform: process.platform,
      eslintType: response.type,
      eslintPath: response.path,
      editorScopes: editorScopes
    };
  } catch (error) {
    atom.notifications.addError('' + error);
  }
  return returnVal;
});

exports.getDebugInfo = getDebugInfo;

var generateDebugString = _asyncToGenerator(function* () {
  var debug = yield getDebugInfo();
  var details = ['Atom version: ' + debug.atomVersion, 'linter-eslint version: ' + debug.linterEslintVersion, 'ESLint version: ' + debug.eslintVersion, 'Hours since last Atom restart: ' + debug.hoursSinceRestart, 'Platform: ' + debug.platform, 'Using ' + debug.eslintType + ' ESLint from: ' + debug.eslintPath, 'Current file\'s scopes: ' + JSON.stringify(debug.editorScopes, null, 2), 'linter-eslint configuration: ' + JSON.stringify(debug.linterEslintConfig, null, 2)];
  return details.join('\n');
}

/**
 * Turn the given options into a Linter message array
 * @param  {TextEditor} textEditor The TextEditor to use to build the message
 * @param  {Object} options    The parameters used to fill in the message
 * @param  {string} [options.severity='error'] Can be one of: 'error', 'warning', 'info'
 * @param  {string} [options.excerpt=''] Short text to use in the message
 * @param  {string|Function} [options.description] Used to provide additional information
 * @return {Array}            Message to user generated from the parameters
 */
);

exports.generateDebugString = generateDebugString;
exports.generateUserMessage = generateUserMessage;
exports.handleError = handleError;

/**
 * Given a raw response from ESLint, this processes the messages into a format
 * compatible with the Linter API.
 * @param  {Object}     messages   The messages from ESLint's response
 * @param  {TextEditor} textEditor The Atom::TextEditor of the file the messages belong to
 * @param  {bool}       showRule   Whether to show the rule in the messages
 * @return {Promise}               The messages transformed into Linter messages
 */

var processESLintMessages = _asyncToGenerator(function* (messages, textEditor, showRule) {
  return Promise.all(messages.map(_asyncToGenerator(function* (_ref3) {
    var fatal = _ref3.fatal;
    var originalMessage = _ref3.message;
    var line = _ref3.line;
    var severity = _ref3.severity;
    var ruleId = _ref3.ruleId;
    var column = _ref3.column;
    var fix = _ref3.fix;
    var endLine = _ref3.endLine;
    var endColumn = _ref3.endColumn;

    var message = fatal ? originalMessage.split('\n')[0] : originalMessage;
    var filePath = textEditor.getPath();
    var textBuffer = textEditor.getBuffer();
    var linterFix = null;
    if (fix) {
      var fixRange = new _atom.Range(textBuffer.positionForCharacterIndex(fix.range[0]), textBuffer.positionForCharacterIndex(fix.range[1]));
      linterFix = {
        position: fixRange,
        replaceWith: fix.text
      };
    }
    var msgCol = undefined;
    var msgEndLine = undefined;
    var msgEndCol = undefined;
    var eslintFullRange = false;

    /*
     Note: ESLint positions are 1-indexed, while Atom expects 0-indexed,
     positions. We are subtracting 1 from these values here so we don't have to
     keep doing so in later uses.
     */
    var msgLine = line - 1;
    if (typeof endColumn !== 'undefined' && typeof endLine !== 'undefined') {
      eslintFullRange = true;
      // Here we always want the column to be a number
      msgCol = Math.max(0, column - 1);
      msgEndLine = endLine - 1;
      msgEndCol = endColumn - 1;
    } else {
      // We want msgCol to remain undefined if it was initially so
      // `generateRange` will give us a range over the entire line
      msgCol = typeof column !== 'undefined' ? column - 1 : column;
    }

    var ret = {
      severity: severity === 1 ? 'warning' : 'error',
      location: {
        file: filePath
      }
    };

    if (ruleId) {
      ret.url = rules.getRuleUrl(ruleId);
    }

    var range = undefined;
    try {
      if (eslintFullRange) {
        var buffer = textEditor.getBuffer();
        (0, _validateEditor.throwIfInvalidPoint)(buffer, msgLine, msgCol);
        (0, _validateEditor.throwIfInvalidPoint)(buffer, msgEndLine, msgEndCol);
        range = [[msgLine, msgCol], [msgEndLine, msgEndCol]];
      } else {
        range = (0, _atomLinter.generateRange)(textEditor, msgLine, msgCol);
      }
      ret.location.position = range;

      var ruleAppendix = showRule ? ' (' + (ruleId || 'Fatal') + ')' : '';
      ret.excerpt = '' + message + ruleAppendix;

      if (linterFix) {
        ret.solutions = [linterFix];
      }
    } catch (err) {
      ret = yield generateInvalidTrace({
        msgLine: msgLine,
        msgCol: msgCol,
        msgEndLine: msgEndLine,
        msgEndCol: msgEndCol,
        eslintFullRange: eslintFullRange,
        filePath: filePath,
        textEditor: textEditor,
        ruleId: ruleId,
        message: message
      });
    }

    return ret;
  })));
}

/**
 * Processes the response from the lint job
 * @param  {Object}     response   The raw response from the job
 * @param  {TextEditor} textEditor The Atom::TextEditor of the file the messages belong to
 * @param  {bool}       showRule   Whether to show the rule in the messages
 * @return {Promise}               The messages transformed into Linter messages
 */
);

exports.processESLintMessages = processESLintMessages;

var processJobResponse = _asyncToGenerator(function* (response, textEditor, showRule) {
  if (Object.prototype.hasOwnProperty.call(response, 'updatedRules')) {
    rules.replaceRules(response.updatedRules);
  }
  return processESLintMessages(response.messages, textEditor, showRule);
});

exports.processJobResponse = processJobResponse;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _path = require('path');

var _atomLinter = require('atom-linter');

var _cryptoRandomString = require('crypto-random-string');

var _cryptoRandomString2 = _interopRequireDefault(_cryptoRandomString);

// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions

var _atom = require('atom');

var _rules = require('./rules');

var _rules2 = _interopRequireDefault(_rules);

var _validateEditor = require('./validate/editor');

'use babel';

var rules = new _rules2['default']();
exports.rules = rules;
var worker = null;

/**
 * Start the worker process if it hasn't already been started
 */

function startWorker() {
  if (worker === null) {
    worker = new _atom.Task(require.resolve('./worker.js'));
  }

  if (worker.started) {
    // Worker start request has already been sent
    return;
  }
  // Send empty arguments as we don't use them in the worker
  worker.start([]);

  // NOTE: Modifies the Task of the worker, but it's the only clean way to track this
  worker.started = true;
}

/**
 * Forces the worker Task to kill itself
 */

function killWorker() {
  if (worker !== null) {
    worker.terminate();
    worker = null;
  }
}

function generateUserMessage(textEditor, options) {
  var _options$severity = options.severity;
  var severity = _options$severity === undefined ? 'error' : _options$severity;
  var _options$excerpt = options.excerpt;
  var excerpt = _options$excerpt === undefined ? '' : _options$excerpt;
  var description = options.description;

  return [{
    severity: severity,
    excerpt: excerpt,
    description: description,
    location: {
      file: textEditor.getPath(),
      position: (0, _atomLinter.generateRange)(textEditor)
    }
  }];
}

/**
 * Generates a message to the user in order to nicely display the Error being
 * thrown instead of depending on generic error handling.
 * @param  {TextEditor} textEditor The TextEditor to use to build the message
 * @param  {Error} error      Error to generate a message for
 * @return {Array}            Message to user generated from the Error
 */

function handleError(textEditor, error) {
  var stack = error.stack;
  var message = error.message;

  // Only show the first line of the message as the excerpt
  var excerpt = 'Error while running ESLint: ' + message.split('\n')[0] + '.';
  var description = '<div style="white-space: pre-wrap">' + message + '\n<hr />' + stack + '</div>';
  return generateUserMessage(textEditor, { severity: 'error', excerpt: excerpt, description: description });
}

var generateInvalidTrace = _asyncToGenerator(function* (_ref2) {
  var msgLine = _ref2.msgLine;
  var msgCol = _ref2.msgCol;
  var msgEndLine = _ref2.msgEndLine;
  var msgEndCol = _ref2.msgEndCol;
  var eslintFullRange = _ref2.eslintFullRange;
  var filePath = _ref2.filePath;
  var textEditor = _ref2.textEditor;
  var ruleId = _ref2.ruleId;
  var message = _ref2.message;

  var errMsgRange = msgLine + 1 + ':' + msgCol;
  if (eslintFullRange) {
    errMsgRange += ' - ' + (msgEndLine + 1) + ':' + (msgEndCol + 1);
  }
  var rangeText = 'Requested ' + (eslintFullRange ? 'start point' : 'range') + ': ' + errMsgRange;
  var issueURL = 'https://github.com/AtomLinter/linter-eslint/issues/new';
  var titleText = 'Invalid position given by \'' + ruleId + '\'';
  var title = encodeURIComponent(titleText);
  var body = encodeURIComponent(['ESLint returned a point that did not exist in the document being edited.', 'Rule: `' + ruleId + '`', rangeText, '', '', '<!-- If at all possible, please include code to reproduce this issue! -->', '', '', 'Debug information:', '```json', JSON.stringify((yield getDebugInfo()), null, 2), '```'].join('\n'));

  var location = {
    file: filePath,
    position: (0, _atomLinter.generateRange)(textEditor, 0)
  };
  var newIssueURL = issueURL + '?title=' + title + '&body=' + body;

  return {
    severity: 'error',
    excerpt: titleText + '. See the description for details. ' + 'Click the URL to open a new issue!',
    url: newIssueURL,
    location: location,
    description: rangeText + '\nOriginal message: ' + message
  };
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvbGludGVyLWVzbGludC9zcmMvaGVscGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUErQ3NCLE9BQU8scUJBQXRCLFdBQXVCLE1BQU0sRUFBRTtBQUNwQyxNQUFJLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFOzs7O0FBSTVDLGNBQVUsRUFBRSxDQUFBO0dBQ2I7OztBQUdELGFBQVcsRUFBRSxDQUFBOzs7Ozs7QUFNYixRQUFNLENBQUMsT0FBTyxHQUFHLHFDQUFtQixFQUFFLENBQUMsQ0FBQTs7QUFFdkMsU0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUs7Ozs7QUFJdEMsUUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLEVBQUUsa0JBQWdCLE1BQU0sQ0FBQyxPQUFPLEVBQUksVUFBQyxJQUFjLEVBQUs7VUFBakIsR0FBRyxHQUFMLElBQWMsQ0FBWixHQUFHO1VBQUUsS0FBSyxHQUFaLElBQWMsQ0FBUCxLQUFLOzs7QUFFckUsVUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7O0FBRTVCLFdBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO0FBQ25CLFlBQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQTs7QUFFaEIsaUJBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNyQixZQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7S0FDZCxDQUFDLENBQUE7QUFDRixRQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsVUFBQyxJQUFJLEVBQUs7QUFDdEQsWUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ2hCLGlCQUFXLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDckIsYUFBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ2QsQ0FBQyxDQUFBOztBQUVGLFFBQUk7QUFDRixZQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0tBQ3BCLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDVixZQUFNLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDaEIsaUJBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNyQixhQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO0tBQ2pCO0dBQ0YsQ0FBQyxDQUFBO0NBQ0g7Ozs7SUFFcUIsWUFBWSxxQkFBM0IsYUFBOEI7QUFDbkMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO0FBQ3ZELE1BQUksUUFBUSxZQUFBLENBQUE7QUFDWixNQUFJLFlBQVksWUFBQSxDQUFBO0FBQ2hCLE1BQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLEVBQUU7QUFDM0MsWUFBUSxHQUFHLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUMvQixnQkFBWSxHQUFHLFVBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFBO0dBQ2hGLE1BQU07O0FBRUwsWUFBUSxHQUFHLFNBQVMsQ0FBQTtBQUNwQixnQkFBWSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUE7R0FDM0I7QUFDRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxDQUFBO0FBQ3JFLE1BQUksZ0JBQWdCLFlBQUEsQ0FBQTtBQUNwQixNQUFJLFdBQVcsS0FBSyxTQUFTLEVBQUU7O0FBRTdCLG9CQUFnQixHQUFHLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFBO0dBQzNDLE1BQU07O0FBRUwsb0JBQWdCLEdBQUcsT0FBTyxDQUFDLGdCQUFLLFdBQVcsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFBO0dBQzlEO0FBQ0QsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUE7QUFDL0MsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEFBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLElBQUksR0FBSSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUE7QUFDekUsTUFBSSxTQUFTLFlBQUEsQ0FBQTtBQUNiLE1BQUk7QUFDRixRQUFNLFFBQVEsR0FBRyxNQUFNLE9BQU8sQ0FBQztBQUM3QixVQUFJLEVBQUUsT0FBTztBQUNiLFlBQU0sRUFBTixNQUFNO0FBQ04sY0FBUSxFQUFSLFFBQVE7S0FDVCxDQUFDLENBQUE7QUFDRixhQUFTLEdBQUc7QUFDVixpQkFBVyxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDOUIseUJBQW1CLEVBQUUsZ0JBQWdCLENBQUMsT0FBTztBQUM3Qyx3QkFBa0IsRUFBRSxNQUFNOztBQUUxQixtQkFBYSxFQUFFLE9BQU8sQ0FBQyxnQkFBSyxRQUFRLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUMsT0FBTztBQUNuRSx1QkFBaUIsRUFBakIsaUJBQWlCO0FBQ2pCLGNBQVEsRUFBRSxPQUFPLENBQUMsUUFBUTtBQUMxQixnQkFBVSxFQUFFLFFBQVEsQ0FBQyxJQUFJO0FBQ3pCLGdCQUFVLEVBQUUsUUFBUSxDQUFDLElBQUk7QUFDekIsa0JBQVksRUFBWixZQUFZO0tBQ2IsQ0FBQTtHQUNGLENBQUMsT0FBTyxLQUFLLEVBQUU7QUFDZCxRQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsTUFBSSxLQUFLLENBQUcsQ0FBQTtHQUN4QztBQUNELFNBQU8sU0FBUyxDQUFBO0NBQ2pCOzs7O0lBRXFCLG1CQUFtQixxQkFBbEMsYUFBcUM7QUFDMUMsTUFBTSxLQUFLLEdBQUcsTUFBTSxZQUFZLEVBQUUsQ0FBQTtBQUNsQyxNQUFNLE9BQU8sR0FBRyxvQkFDRyxLQUFLLENBQUMsV0FBVyw4QkFDUixLQUFLLENBQUMsbUJBQW1CLHVCQUNoQyxLQUFLLENBQUMsYUFBYSxzQ0FDSixLQUFLLENBQUMsaUJBQWlCLGlCQUM1QyxLQUFLLENBQUMsUUFBUSxhQUNsQixLQUFLLENBQUMsVUFBVSxzQkFBaUIsS0FBSyxDQUFDLFVBQVUsK0JBQ2hDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLG9DQUNyQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQ2xGLENBQUE7QUFDRCxTQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7Q0FDMUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBNEZxQixxQkFBcUIscUJBQXBDLFdBQXFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFO0FBQzFFLFNBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxtQkFBQyxXQUFPLEtBRXRDLEVBQUs7UUFESixLQUFLLEdBRGdDLEtBRXRDLENBREMsS0FBSztRQUFXLGVBQWUsR0FETSxLQUV0QyxDQURRLE9BQU87UUFBbUIsSUFBSSxHQURBLEtBRXRDLENBRGtDLElBQUk7UUFBRSxRQUFRLEdBRFYsS0FFdEMsQ0FEd0MsUUFBUTtRQUFFLE1BQU0sR0FEbEIsS0FFdEMsQ0FEa0QsTUFBTTtRQUFFLE1BQU0sR0FEMUIsS0FFdEMsQ0FEMEQsTUFBTTtRQUFFLEdBQUcsR0FEL0IsS0FFdEMsQ0FEa0UsR0FBRztRQUFFLE9BQU8sR0FEeEMsS0FFdEMsQ0FEdUUsT0FBTztRQUFFLFNBQVMsR0FEbkQsS0FFdEMsQ0FEZ0YsU0FBUzs7QUFFeEYsUUFBTSxPQUFPLEdBQUcsS0FBSyxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFBO0FBQ3hFLFFBQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNyQyxRQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUE7QUFDekMsUUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFBO0FBQ3BCLFFBQUksR0FBRyxFQUFFO0FBQ1AsVUFBTSxRQUFRLEdBQUcsZ0JBQ2YsVUFBVSxDQUFDLHlCQUF5QixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDbEQsVUFBVSxDQUFDLHlCQUF5QixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDbkQsQ0FBQTtBQUNELGVBQVMsR0FBRztBQUNWLGdCQUFRLEVBQUUsUUFBUTtBQUNsQixtQkFBVyxFQUFFLEdBQUcsQ0FBQyxJQUFJO09BQ3RCLENBQUE7S0FDRjtBQUNELFFBQUksTUFBTSxZQUFBLENBQUE7QUFDVixRQUFJLFVBQVUsWUFBQSxDQUFBO0FBQ2QsUUFBSSxTQUFTLFlBQUEsQ0FBQTtBQUNiLFFBQUksZUFBZSxHQUFHLEtBQUssQ0FBQTs7Ozs7OztBQU8zQixRQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFBO0FBQ3hCLFFBQUksT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLE9BQU8sT0FBTyxLQUFLLFdBQVcsRUFBRTtBQUN0RSxxQkFBZSxHQUFHLElBQUksQ0FBQTs7QUFFdEIsWUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQTtBQUNoQyxnQkFBVSxHQUFHLE9BQU8sR0FBRyxDQUFDLENBQUE7QUFDeEIsZUFBUyxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUE7S0FDMUIsTUFBTTs7O0FBR0wsWUFBTSxHQUFHLE9BQU8sTUFBTSxLQUFLLFdBQVcsR0FBRyxNQUFNLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQTtLQUM3RDs7QUFFRCxRQUFJLEdBQUcsR0FBRztBQUNSLGNBQVEsRUFBRSxRQUFRLEtBQUssQ0FBQyxHQUFHLFNBQVMsR0FBRyxPQUFPO0FBQzlDLGNBQVEsRUFBRTtBQUNSLFlBQUksRUFBRSxRQUFRO09BQ2Y7S0FDRixDQUFBOztBQUVELFFBQUksTUFBTSxFQUFFO0FBQ1YsU0FBRyxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0tBQ25DOztBQUVELFFBQUksS0FBSyxZQUFBLENBQUE7QUFDVCxRQUFJO0FBQ0YsVUFBSSxlQUFlLEVBQUU7QUFDbkIsWUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFBO0FBQ3JDLGlEQUFvQixNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFBO0FBQzVDLGlEQUFvQixNQUFNLEVBQUUsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFBO0FBQ2xELGFBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUE7T0FDckQsTUFBTTtBQUNMLGFBQUssR0FBRywrQkFBYyxVQUFVLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFBO09BQ25EO0FBQ0QsU0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFBOztBQUU3QixVQUFNLFlBQVksR0FBRyxRQUFRLFdBQVEsTUFBTSxJQUFJLE9BQU8sQ0FBQSxTQUFNLEVBQUUsQ0FBQTtBQUM5RCxTQUFHLENBQUMsT0FBTyxRQUFNLE9BQU8sR0FBRyxZQUFZLEFBQUUsQ0FBQTs7QUFFekMsVUFBSSxTQUFTLEVBQUU7QUFDYixXQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUE7T0FDNUI7S0FDRixDQUFDLE9BQU8sR0FBRyxFQUFFO0FBQ1osU0FBRyxHQUFHLE1BQU0sb0JBQW9CLENBQUM7QUFDL0IsZUFBTyxFQUFQLE9BQU87QUFDUCxjQUFNLEVBQU4sTUFBTTtBQUNOLGtCQUFVLEVBQVYsVUFBVTtBQUNWLGlCQUFTLEVBQVQsU0FBUztBQUNULHVCQUFlLEVBQWYsZUFBZTtBQUNmLGdCQUFRLEVBQVIsUUFBUTtBQUNSLGtCQUFVLEVBQVYsVUFBVTtBQUNWLGNBQU0sRUFBTixNQUFNO0FBQ04sZUFBTyxFQUFQLE9BQU87T0FDUixDQUFDLENBQUE7S0FDSDs7QUFFRCxXQUFPLEdBQUcsQ0FBQTtHQUNYLEVBQUMsQ0FBQyxDQUFBO0NBQ0o7Ozs7Ozs7Ozs7Ozs7SUFTcUIsa0JBQWtCLHFCQUFqQyxXQUFrQyxRQUFRLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRTtBQUN2RSxNQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsY0FBYyxDQUFDLEVBQUU7QUFDbEUsU0FBSyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUE7R0FDMUM7QUFDRCxTQUFPLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0NBQ3RFOzs7Ozs7OztvQkF6Vm9CLE1BQU07OzBCQUNHLGFBQWE7O2tDQUNaLHNCQUFzQjs7Ozs7O29CQUV6QixNQUFNOztxQkFDaEIsU0FBUzs7Ozs4QkFDUyxtQkFBbUI7O0FBUnZELFdBQVcsQ0FBQTs7QUFVSixJQUFNLEtBQUssR0FBRyx3QkFBVyxDQUFBOztBQUNoQyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUE7Ozs7OztBQUtWLFNBQVMsV0FBVyxHQUFHO0FBQzVCLE1BQUksTUFBTSxLQUFLLElBQUksRUFBRTtBQUNuQixVQUFNLEdBQUcsZUFBUyxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUE7R0FDbEQ7O0FBRUQsTUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFOztBQUVsQixXQUFNO0dBQ1A7O0FBRUQsUUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQTs7O0FBR2hCLFFBQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFBO0NBQ3RCOzs7Ozs7QUFLTSxTQUFTLFVBQVUsR0FBRztBQUMzQixNQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUU7QUFDbkIsVUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFBO0FBQ2xCLFVBQU0sR0FBRyxJQUFJLENBQUE7R0FDZDtDQUNGOztBQThITSxTQUFTLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUU7MEJBS25ELE9BQU8sQ0FIVCxRQUFRO01BQVIsUUFBUSxxQ0FBRyxPQUFPO3lCQUdoQixPQUFPLENBRlQsT0FBTztNQUFQLE9BQU8sb0NBQUcsRUFBRTtNQUNaLFdBQVcsR0FDVCxPQUFPLENBRFQsV0FBVzs7QUFFYixTQUFPLENBQUM7QUFDTixZQUFRLEVBQVIsUUFBUTtBQUNSLFdBQU8sRUFBUCxPQUFPO0FBQ1AsZUFBVyxFQUFYLFdBQVc7QUFDWCxZQUFRLEVBQUU7QUFDUixVQUFJLEVBQUUsVUFBVSxDQUFDLE9BQU8sRUFBRTtBQUMxQixjQUFRLEVBQUUsK0JBQWMsVUFBVSxDQUFDO0tBQ3BDO0dBQ0YsQ0FBQyxDQUFBO0NBQ0g7Ozs7Ozs7Ozs7QUFTTSxTQUFTLFdBQVcsQ0FBQyxVQUFVLEVBQUUsS0FBSyxFQUFFO01BQ3JDLEtBQUssR0FBYyxLQUFLLENBQXhCLEtBQUs7TUFBRSxPQUFPLEdBQUssS0FBSyxDQUFqQixPQUFPOzs7QUFFdEIsTUFBTSxPQUFPLG9DQUFrQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFHLENBQUE7QUFDeEUsTUFBTSxXQUFXLDJDQUF5QyxPQUFPLGdCQUFXLEtBQUssV0FBUSxDQUFBO0FBQ3pGLFNBQU8sbUJBQW1CLENBQUMsVUFBVSxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLFdBQVcsRUFBWCxXQUFXLEVBQUUsQ0FBQyxDQUFBO0NBQ3BGOztBQUVELElBQU0sb0JBQW9CLHFCQUFHLFdBQU8sS0FHbkMsRUFBSztNQUZKLE9BQU8sR0FEMkIsS0FHbkMsQ0FGQyxPQUFPO01BQUUsTUFBTSxHQURtQixLQUduQyxDQUZVLE1BQU07TUFBRSxVQUFVLEdBRE8sS0FHbkMsQ0FGa0IsVUFBVTtNQUFFLFNBQVMsR0FESixLQUduQyxDQUY4QixTQUFTO01BQ3RDLGVBQWUsR0FGbUIsS0FHbkMsQ0FEQyxlQUFlO01BQUUsUUFBUSxHQUZTLEtBR25DLENBRGtCLFFBQVE7TUFBRSxVQUFVLEdBRkgsS0FHbkMsQ0FENEIsVUFBVTtNQUFFLE1BQU0sR0FGWCxLQUduQyxDQUR3QyxNQUFNO01BQUUsT0FBTyxHQUZwQixLQUduQyxDQURnRCxPQUFPOztBQUV0RCxNQUFJLFdBQVcsR0FBTSxPQUFPLEdBQUcsQ0FBQyxTQUFJLE1BQU0sQUFBRSxDQUFBO0FBQzVDLE1BQUksZUFBZSxFQUFFO0FBQ25CLGVBQVcsYUFBVSxVQUFVLEdBQUcsQ0FBQyxDQUFBLFVBQUksU0FBUyxHQUFHLENBQUMsQ0FBQSxBQUFFLENBQUE7R0FDdkQ7QUFDRCxNQUFNLFNBQVMsbUJBQWdCLGVBQWUsR0FBRyxhQUFhLEdBQUcsT0FBTyxDQUFBLFVBQUssV0FBVyxBQUFFLENBQUE7QUFDMUYsTUFBTSxRQUFRLEdBQUcsd0RBQXdELENBQUE7QUFDekUsTUFBTSxTQUFTLG9DQUFpQyxNQUFNLE9BQUcsQ0FBQTtBQUN6RCxNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUMzQyxNQUFNLElBQUksR0FBRyxrQkFBa0IsQ0FBQyxDQUM5QiwwRUFBMEUsY0FDL0QsTUFBTSxRQUNqQixTQUFTLEVBQ1QsRUFBRSxFQUFFLEVBQUUsRUFDTiwyRUFBMkUsRUFDM0UsRUFBRSxFQUFFLEVBQUUsRUFDTixvQkFBb0IsRUFDcEIsU0FBUyxFQUNULElBQUksQ0FBQyxTQUFTLEVBQUMsTUFBTSxZQUFZLEVBQUUsQ0FBQSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsRUFDN0MsS0FBSyxDQUNOLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7O0FBRWIsTUFBTSxRQUFRLEdBQUc7QUFDZixRQUFJLEVBQUUsUUFBUTtBQUNkLFlBQVEsRUFBRSwrQkFBYyxVQUFVLEVBQUUsQ0FBQyxDQUFDO0dBQ3ZDLENBQUE7QUFDRCxNQUFNLFdBQVcsR0FBTSxRQUFRLGVBQVUsS0FBSyxjQUFTLElBQUksQUFBRSxDQUFBOztBQUU3RCxTQUFPO0FBQ0wsWUFBUSxFQUFFLE9BQU87QUFDakIsV0FBTyxFQUFFLEFBQUcsU0FBUywyQ0FDbkIsb0NBQW9DO0FBQ3RDLE9BQUcsRUFBRSxXQUFXO0FBQ2hCLFlBQVEsRUFBUixRQUFRO0FBQ1IsZUFBVyxFQUFLLFNBQVMsNEJBQXVCLE9BQU8sQUFBRTtHQUMxRCxDQUFBO0NBQ0YsQ0FBQSxDQUFBIiwiZmlsZSI6Ii9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvbGludGVyLWVzbGludC9zcmMvaGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgZ2VuZXJhdGVSYW5nZSB9IGZyb20gJ2F0b20tbGludGVyJ1xuaW1wb3J0IGNyeXB0b1JhbmRvbVN0cmluZyBmcm9tICdjcnlwdG8tcmFuZG9tLXN0cmluZydcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXMsIGltcG9ydC9leHRlbnNpb25zXG5pbXBvcnQgeyBSYW5nZSwgVGFzayB9IGZyb20gJ2F0b20nXG5pbXBvcnQgUnVsZXMgZnJvbSAnLi9ydWxlcydcbmltcG9ydCB7IHRocm93SWZJbnZhbGlkUG9pbnQgfSBmcm9tICcuL3ZhbGlkYXRlL2VkaXRvcidcblxuZXhwb3J0IGNvbnN0IHJ1bGVzID0gbmV3IFJ1bGVzKClcbmxldCB3b3JrZXIgPSBudWxsXG5cbi8qKlxuICogU3RhcnQgdGhlIHdvcmtlciBwcm9jZXNzIGlmIGl0IGhhc24ndCBhbHJlYWR5IGJlZW4gc3RhcnRlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gc3RhcnRXb3JrZXIoKSB7XG4gIGlmICh3b3JrZXIgPT09IG51bGwpIHtcbiAgICB3b3JrZXIgPSBuZXcgVGFzayhyZXF1aXJlLnJlc29sdmUoJy4vd29ya2VyLmpzJykpXG4gIH1cblxuICBpZiAod29ya2VyLnN0YXJ0ZWQpIHtcbiAgICAvLyBXb3JrZXIgc3RhcnQgcmVxdWVzdCBoYXMgYWxyZWFkeSBiZWVuIHNlbnRcbiAgICByZXR1cm5cbiAgfVxuICAvLyBTZW5kIGVtcHR5IGFyZ3VtZW50cyBhcyB3ZSBkb24ndCB1c2UgdGhlbSBpbiB0aGUgd29ya2VyXG4gIHdvcmtlci5zdGFydChbXSlcblxuICAvLyBOT1RFOiBNb2RpZmllcyB0aGUgVGFzayBvZiB0aGUgd29ya2VyLCBidXQgaXQncyB0aGUgb25seSBjbGVhbiB3YXkgdG8gdHJhY2sgdGhpc1xuICB3b3JrZXIuc3RhcnRlZCA9IHRydWVcbn1cblxuLyoqXG4gKiBGb3JjZXMgdGhlIHdvcmtlciBUYXNrIHRvIGtpbGwgaXRzZWxmXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBraWxsV29ya2VyKCkge1xuICBpZiAod29ya2VyICE9PSBudWxsKSB7XG4gICAgd29ya2VyLnRlcm1pbmF0ZSgpXG4gICAgd29ya2VyID0gbnVsbFxuICB9XG59XG5cbi8qKlxuICogU2VuZCBhIGpvYiB0byB0aGUgd29ya2VyIGFuZCByZXR1cm4gdGhlIHJlc3VsdHNcbiAqIEBwYXJhbSAge09iamVjdH0gY29uZmlnIENvbmZpZ3VyYXRpb24gZm9yIHRoZSBqb2IgdG8gc2VuZCB0byB0aGUgd29ya2VyXG4gKiBAcmV0dXJuIHtPYmplY3R8U3RyaW5nfEVycm9yfSAgICAgICAgVGhlIGRhdGEgcmV0dXJuZWQgZnJvbSB0aGUgd29ya2VyXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZW5kSm9iKGNvbmZpZykge1xuICBpZiAod29ya2VyICYmICF3b3JrZXIuY2hpbGRQcm9jZXNzLmNvbm5lY3RlZCkge1xuICAgIC8vIFNvbWV0aW1lcyB0aGUgd29ya2VyIGRpZXMgYW5kIGJlY29tZXMgZGlzY29ubmVjdGVkXG4gICAgLy8gV2hlbiB0aGF0IGhhcHBlbnMsIGl0IHNlZW1zIHRoYXQgdGhlcmUgaXMgbm8gd2F5IHRvIHJlY292ZXIgb3RoZXJcbiAgICAvLyB0aGFuIHRvIGtpbGwgdGhlIHdvcmtlciBhbmQgY3JlYXRlIGEgbmV3IG9uZS5cbiAgICBraWxsV29ya2VyKClcbiAgfVxuXG4gIC8vIEVuc3VyZSB0aGUgd29ya2VyIGlzIHN0YXJ0ZWRcbiAgc3RhcnRXb3JrZXIoKVxuXG4gIC8vIEV4cGFuZCB0aGUgY29uZmlnIHdpdGggYSB1bmlxdWUgSUQgdG8gZW1pdCBvblxuICAvLyBOT1RFOiBKb2JzIF9tdXN0XyBoYXZlIGEgdW5pcXVlIElEIGFzIHRoZXkgYXJlIGNvbXBsZXRlbHkgYXN5bmMgYW5kIHJlc3VsdHNcbiAgLy8gY2FuIGFycml2ZSBiYWNrIGluIGFueSBvcmRlci5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gIGNvbmZpZy5lbWl0S2V5ID0gY3J5cHRvUmFuZG9tU3RyaW5nKDEwKVxuXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgLy8gQWxsIHdvcmtlciBlcnJvcnMgYXJlIGNhdWdodCBhbmQgcmUtZW1pdHRlZCBhbG9uZyB3aXRoIHRoZWlyIGFzc29jaWF0ZWRcbiAgICAvLyBlbWl0S2V5LCBzbyB0aGF0IHdlIGRvIG5vdCBjcmVhdGUgbXVsdGlwbGUgbGlzdGVuZXJzIGZvciB0aGUgc2FtZVxuICAgIC8vICd0YXNrOmVycm9yJyBldmVudFxuICAgIGNvbnN0IGVyclN1YiA9IHdvcmtlci5vbihgd29ya2VyRXJyb3I6JHtjb25maWcuZW1pdEtleX1gLCAoeyBtc2csIHN0YWNrIH0pID0+IHtcbiAgICAgIC8vIFJlLXRocm93IGVycm9ycyBmcm9tIHRoZSB0YXNrXG4gICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihtc2cpXG4gICAgICAvLyBTZXQgdGhlIHN0YWNrIHRvIHRoZSBvbmUgZ2l2ZW4gdG8gdXMgYnkgdGhlIHdvcmtlclxuICAgICAgZXJyb3Iuc3RhY2sgPSBzdGFja1xuICAgICAgZXJyU3ViLmRpc3Bvc2UoKVxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVzZS1iZWZvcmUtZGVmaW5lXG4gICAgICByZXNwb25zZVN1Yi5kaXNwb3NlKClcbiAgICAgIHJlamVjdChlcnJvcilcbiAgICB9KVxuICAgIGNvbnN0IHJlc3BvbnNlU3ViID0gd29ya2VyLm9uKGNvbmZpZy5lbWl0S2V5LCAoZGF0YSkgPT4ge1xuICAgICAgZXJyU3ViLmRpc3Bvc2UoKVxuICAgICAgcmVzcG9uc2VTdWIuZGlzcG9zZSgpXG4gICAgICByZXNvbHZlKGRhdGEpXG4gICAgfSlcbiAgICAvLyBTZW5kIHRoZSBqb2Igb24gdG8gdGhlIHdvcmtlclxuICAgIHRyeSB7XG4gICAgICB3b3JrZXIuc2VuZChjb25maWcpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZXJyU3ViLmRpc3Bvc2UoKVxuICAgICAgcmVzcG9uc2VTdWIuZGlzcG9zZSgpXG4gICAgICBjb25zb2xlLmVycm9yKGUpXG4gICAgfVxuICB9KVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0RGVidWdJbmZvKCkge1xuICBjb25zdCB0ZXh0RWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gIGxldCBmaWxlUGF0aFxuICBsZXQgZWRpdG9yU2NvcGVzXG4gIGlmIChhdG9tLndvcmtzcGFjZS5pc1RleHRFZGl0b3IodGV4dEVkaXRvcikpIHtcbiAgICBmaWxlUGF0aCA9IHRleHRFZGl0b3IuZ2V0UGF0aCgpXG4gICAgZWRpdG9yU2NvcGVzID0gdGV4dEVkaXRvci5nZXRMYXN0Q3Vyc29yKCkuZ2V0U2NvcGVEZXNjcmlwdG9yKCkuZ2V0U2NvcGVzQXJyYXkoKVxuICB9IGVsc2Uge1xuICAgIC8vIFNvbWVob3cgdGhpcyBjYW4gYmUgY2FsbGVkIHdpdGggbm8gYWN0aXZlIFRleHRFZGl0b3IsIGltcG9zc2libGUgSSBrbm93Li4uXG4gICAgZmlsZVBhdGggPSAndW5rbm93bidcbiAgICBlZGl0b3JTY29wZXMgPSBbJ3Vua25vd24nXVxuICB9XG4gIGNvbnN0IHBhY2thZ2VQYXRoID0gYXRvbS5wYWNrYWdlcy5yZXNvbHZlUGFja2FnZVBhdGgoJ2xpbnRlci1lc2xpbnQnKVxuICBsZXQgbGludGVyRXNsaW50TWV0YVxuICBpZiAocGFja2FnZVBhdGggPT09IHVuZGVmaW5lZCkge1xuICAgIC8vIEFwcGFyZW50bHkgZm9yIHNvbWUgdXNlcnMgdGhlIHBhY2thZ2UgcGF0aCBmYWlscyB0byByZXNvbHZlXG4gICAgbGludGVyRXNsaW50TWV0YSA9IHsgdmVyc2lvbjogJ3Vua25vd24hJyB9XG4gIH0gZWxzZSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1keW5hbWljLXJlcXVpcmVcbiAgICBsaW50ZXJFc2xpbnRNZXRhID0gcmVxdWlyZShqb2luKHBhY2thZ2VQYXRoLCAncGFja2FnZS5qc29uJykpXG4gIH1cbiAgY29uc3QgY29uZmlnID0gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItZXNsaW50JylcbiAgY29uc3QgaG91cnNTaW5jZVJlc3RhcnQgPSBNYXRoLnJvdW5kKChwcm9jZXNzLnVwdGltZSgpIC8gMzYwMCkgKiAxMCkgLyAxMFxuICBsZXQgcmV0dXJuVmFsXG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZW5kSm9iKHtcbiAgICAgIHR5cGU6ICdkZWJ1ZycsXG4gICAgICBjb25maWcsXG4gICAgICBmaWxlUGF0aFxuICAgIH0pXG4gICAgcmV0dXJuVmFsID0ge1xuICAgICAgYXRvbVZlcnNpb246IGF0b20uZ2V0VmVyc2lvbigpLFxuICAgICAgbGludGVyRXNsaW50VmVyc2lvbjogbGludGVyRXNsaW50TWV0YS52ZXJzaW9uLFxuICAgICAgbGludGVyRXNsaW50Q29uZmlnOiBjb25maWcsXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWR5bmFtaWMtcmVxdWlyZVxuICAgICAgZXNsaW50VmVyc2lvbjogcmVxdWlyZShqb2luKHJlc3BvbnNlLnBhdGgsICdwYWNrYWdlLmpzb24nKSkudmVyc2lvbixcbiAgICAgIGhvdXJzU2luY2VSZXN0YXJ0LFxuICAgICAgcGxhdGZvcm06IHByb2Nlc3MucGxhdGZvcm0sXG4gICAgICBlc2xpbnRUeXBlOiByZXNwb25zZS50eXBlLFxuICAgICAgZXNsaW50UGF0aDogcmVzcG9uc2UucGF0aCxcbiAgICAgIGVkaXRvclNjb3BlcyxcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGAke2Vycm9yfWApXG4gIH1cbiAgcmV0dXJuIHJldHVyblZhbFxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2VuZXJhdGVEZWJ1Z1N0cmluZygpIHtcbiAgY29uc3QgZGVidWcgPSBhd2FpdCBnZXREZWJ1Z0luZm8oKVxuICBjb25zdCBkZXRhaWxzID0gW1xuICAgIGBBdG9tIHZlcnNpb246ICR7ZGVidWcuYXRvbVZlcnNpb259YCxcbiAgICBgbGludGVyLWVzbGludCB2ZXJzaW9uOiAke2RlYnVnLmxpbnRlckVzbGludFZlcnNpb259YCxcbiAgICBgRVNMaW50IHZlcnNpb246ICR7ZGVidWcuZXNsaW50VmVyc2lvbn1gLFxuICAgIGBIb3VycyBzaW5jZSBsYXN0IEF0b20gcmVzdGFydDogJHtkZWJ1Zy5ob3Vyc1NpbmNlUmVzdGFydH1gLFxuICAgIGBQbGF0Zm9ybTogJHtkZWJ1Zy5wbGF0Zm9ybX1gLFxuICAgIGBVc2luZyAke2RlYnVnLmVzbGludFR5cGV9IEVTTGludCBmcm9tOiAke2RlYnVnLmVzbGludFBhdGh9YCxcbiAgICBgQ3VycmVudCBmaWxlJ3Mgc2NvcGVzOiAke0pTT04uc3RyaW5naWZ5KGRlYnVnLmVkaXRvclNjb3BlcywgbnVsbCwgMil9YCxcbiAgICBgbGludGVyLWVzbGludCBjb25maWd1cmF0aW9uOiAke0pTT04uc3RyaW5naWZ5KGRlYnVnLmxpbnRlckVzbGludENvbmZpZywgbnVsbCwgMil9YFxuICBdXG4gIHJldHVybiBkZXRhaWxzLmpvaW4oJ1xcbicpXG59XG5cbi8qKlxuICogVHVybiB0aGUgZ2l2ZW4gb3B0aW9ucyBpbnRvIGEgTGludGVyIG1lc3NhZ2UgYXJyYXlcbiAqIEBwYXJhbSAge1RleHRFZGl0b3J9IHRleHRFZGl0b3IgVGhlIFRleHRFZGl0b3IgdG8gdXNlIHRvIGJ1aWxkIHRoZSBtZXNzYWdlXG4gKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnMgICAgVGhlIHBhcmFtZXRlcnMgdXNlZCB0byBmaWxsIGluIHRoZSBtZXNzYWdlXG4gKiBAcGFyYW0gIHtzdHJpbmd9IFtvcHRpb25zLnNldmVyaXR5PSdlcnJvciddIENhbiBiZSBvbmUgb2Y6ICdlcnJvcicsICd3YXJuaW5nJywgJ2luZm8nXG4gKiBAcGFyYW0gIHtzdHJpbmd9IFtvcHRpb25zLmV4Y2VycHQ9JyddIFNob3J0IHRleHQgdG8gdXNlIGluIHRoZSBtZXNzYWdlXG4gKiBAcGFyYW0gIHtzdHJpbmd8RnVuY3Rpb259IFtvcHRpb25zLmRlc2NyaXB0aW9uXSBVc2VkIHRvIHByb3ZpZGUgYWRkaXRpb25hbCBpbmZvcm1hdGlvblxuICogQHJldHVybiB7QXJyYXl9ICAgICAgICAgICAgTWVzc2FnZSB0byB1c2VyIGdlbmVyYXRlZCBmcm9tIHRoZSBwYXJhbWV0ZXJzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZVVzZXJNZXNzYWdlKHRleHRFZGl0b3IsIG9wdGlvbnMpIHtcbiAgY29uc3Qge1xuICAgIHNldmVyaXR5ID0gJ2Vycm9yJyxcbiAgICBleGNlcnB0ID0gJycsXG4gICAgZGVzY3JpcHRpb24sXG4gIH0gPSBvcHRpb25zXG4gIHJldHVybiBbe1xuICAgIHNldmVyaXR5LFxuICAgIGV4Y2VycHQsXG4gICAgZGVzY3JpcHRpb24sXG4gICAgbG9jYXRpb246IHtcbiAgICAgIGZpbGU6IHRleHRFZGl0b3IuZ2V0UGF0aCgpLFxuICAgICAgcG9zaXRpb246IGdlbmVyYXRlUmFuZ2UodGV4dEVkaXRvciksXG4gICAgfSxcbiAgfV1cbn1cblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBtZXNzYWdlIHRvIHRoZSB1c2VyIGluIG9yZGVyIHRvIG5pY2VseSBkaXNwbGF5IHRoZSBFcnJvciBiZWluZ1xuICogdGhyb3duIGluc3RlYWQgb2YgZGVwZW5kaW5nIG9uIGdlbmVyaWMgZXJyb3IgaGFuZGxpbmcuXG4gKiBAcGFyYW0gIHtUZXh0RWRpdG9yfSB0ZXh0RWRpdG9yIFRoZSBUZXh0RWRpdG9yIHRvIHVzZSB0byBidWlsZCB0aGUgbWVzc2FnZVxuICogQHBhcmFtICB7RXJyb3J9IGVycm9yICAgICAgRXJyb3IgdG8gZ2VuZXJhdGUgYSBtZXNzYWdlIGZvclxuICogQHJldHVybiB7QXJyYXl9ICAgICAgICAgICAgTWVzc2FnZSB0byB1c2VyIGdlbmVyYXRlZCBmcm9tIHRoZSBFcnJvclxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlRXJyb3IodGV4dEVkaXRvciwgZXJyb3IpIHtcbiAgY29uc3QgeyBzdGFjaywgbWVzc2FnZSB9ID0gZXJyb3JcbiAgLy8gT25seSBzaG93IHRoZSBmaXJzdCBsaW5lIG9mIHRoZSBtZXNzYWdlIGFzIHRoZSBleGNlcnB0XG4gIGNvbnN0IGV4Y2VycHQgPSBgRXJyb3Igd2hpbGUgcnVubmluZyBFU0xpbnQ6ICR7bWVzc2FnZS5zcGxpdCgnXFxuJylbMF19LmBcbiAgY29uc3QgZGVzY3JpcHRpb24gPSBgPGRpdiBzdHlsZT1cIndoaXRlLXNwYWNlOiBwcmUtd3JhcFwiPiR7bWVzc2FnZX1cXG48aHIgLz4ke3N0YWNrfTwvZGl2PmBcbiAgcmV0dXJuIGdlbmVyYXRlVXNlck1lc3NhZ2UodGV4dEVkaXRvciwgeyBzZXZlcml0eTogJ2Vycm9yJywgZXhjZXJwdCwgZGVzY3JpcHRpb24gfSlcbn1cblxuY29uc3QgZ2VuZXJhdGVJbnZhbGlkVHJhY2UgPSBhc3luYyAoe1xuICBtc2dMaW5lLCBtc2dDb2wsIG1zZ0VuZExpbmUsIG1zZ0VuZENvbCxcbiAgZXNsaW50RnVsbFJhbmdlLCBmaWxlUGF0aCwgdGV4dEVkaXRvciwgcnVsZUlkLCBtZXNzYWdlXG59KSA9PiB7XG4gIGxldCBlcnJNc2dSYW5nZSA9IGAke21zZ0xpbmUgKyAxfToke21zZ0NvbH1gXG4gIGlmIChlc2xpbnRGdWxsUmFuZ2UpIHtcbiAgICBlcnJNc2dSYW5nZSArPSBgIC0gJHttc2dFbmRMaW5lICsgMX06JHttc2dFbmRDb2wgKyAxfWBcbiAgfVxuICBjb25zdCByYW5nZVRleHQgPSBgUmVxdWVzdGVkICR7ZXNsaW50RnVsbFJhbmdlID8gJ3N0YXJ0IHBvaW50JyA6ICdyYW5nZSd9OiAke2Vyck1zZ1JhbmdlfWBcbiAgY29uc3QgaXNzdWVVUkwgPSAnaHR0cHM6Ly9naXRodWIuY29tL0F0b21MaW50ZXIvbGludGVyLWVzbGludC9pc3N1ZXMvbmV3J1xuICBjb25zdCB0aXRsZVRleHQgPSBgSW52YWxpZCBwb3NpdGlvbiBnaXZlbiBieSAnJHtydWxlSWR9J2BcbiAgY29uc3QgdGl0bGUgPSBlbmNvZGVVUklDb21wb25lbnQodGl0bGVUZXh0KVxuICBjb25zdCBib2R5ID0gZW5jb2RlVVJJQ29tcG9uZW50KFtcbiAgICAnRVNMaW50IHJldHVybmVkIGEgcG9pbnQgdGhhdCBkaWQgbm90IGV4aXN0IGluIHRoZSBkb2N1bWVudCBiZWluZyBlZGl0ZWQuJyxcbiAgICBgUnVsZTogXFxgJHtydWxlSWR9XFxgYCxcbiAgICByYW5nZVRleHQsXG4gICAgJycsICcnLFxuICAgICc8IS0tIElmIGF0IGFsbCBwb3NzaWJsZSwgcGxlYXNlIGluY2x1ZGUgY29kZSB0byByZXByb2R1Y2UgdGhpcyBpc3N1ZSEgLS0+JyxcbiAgICAnJywgJycsXG4gICAgJ0RlYnVnIGluZm9ybWF0aW9uOicsXG4gICAgJ2BgYGpzb24nLFxuICAgIEpTT04uc3RyaW5naWZ5KGF3YWl0IGdldERlYnVnSW5mbygpLCBudWxsLCAyKSxcbiAgICAnYGBgJ1xuICBdLmpvaW4oJ1xcbicpKVxuXG4gIGNvbnN0IGxvY2F0aW9uID0ge1xuICAgIGZpbGU6IGZpbGVQYXRoLFxuICAgIHBvc2l0aW9uOiBnZW5lcmF0ZVJhbmdlKHRleHRFZGl0b3IsIDApLFxuICB9XG4gIGNvbnN0IG5ld0lzc3VlVVJMID0gYCR7aXNzdWVVUkx9P3RpdGxlPSR7dGl0bGV9JmJvZHk9JHtib2R5fWBcblxuICByZXR1cm4ge1xuICAgIHNldmVyaXR5OiAnZXJyb3InLFxuICAgIGV4Y2VycHQ6IGAke3RpdGxlVGV4dH0uIFNlZSB0aGUgZGVzY3JpcHRpb24gZm9yIGRldGFpbHMuIGAgK1xuICAgICAgJ0NsaWNrIHRoZSBVUkwgdG8gb3BlbiBhIG5ldyBpc3N1ZSEnLFxuICAgIHVybDogbmV3SXNzdWVVUkwsXG4gICAgbG9jYXRpb24sXG4gICAgZGVzY3JpcHRpb246IGAke3JhbmdlVGV4dH1cXG5PcmlnaW5hbCBtZXNzYWdlOiAke21lc3NhZ2V9YFxuICB9XG59XG5cbi8qKlxuICogR2l2ZW4gYSByYXcgcmVzcG9uc2UgZnJvbSBFU0xpbnQsIHRoaXMgcHJvY2Vzc2VzIHRoZSBtZXNzYWdlcyBpbnRvIGEgZm9ybWF0XG4gKiBjb21wYXRpYmxlIHdpdGggdGhlIExpbnRlciBBUEkuXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICBtZXNzYWdlcyAgIFRoZSBtZXNzYWdlcyBmcm9tIEVTTGludCdzIHJlc3BvbnNlXG4gKiBAcGFyYW0gIHtUZXh0RWRpdG9yfSB0ZXh0RWRpdG9yIFRoZSBBdG9tOjpUZXh0RWRpdG9yIG9mIHRoZSBmaWxlIHRoZSBtZXNzYWdlcyBiZWxvbmcgdG9cbiAqIEBwYXJhbSAge2Jvb2x9ICAgICAgIHNob3dSdWxlICAgV2hldGhlciB0byBzaG93IHRoZSBydWxlIGluIHRoZSBtZXNzYWdlc1xuICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgICAgICAgICBUaGUgbWVzc2FnZXMgdHJhbnNmb3JtZWQgaW50byBMaW50ZXIgbWVzc2FnZXNcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHByb2Nlc3NFU0xpbnRNZXNzYWdlcyhtZXNzYWdlcywgdGV4dEVkaXRvciwgc2hvd1J1bGUpIHtcbiAgcmV0dXJuIFByb21pc2UuYWxsKG1lc3NhZ2VzLm1hcChhc3luYyAoe1xuICAgIGZhdGFsLCBtZXNzYWdlOiBvcmlnaW5hbE1lc3NhZ2UsIGxpbmUsIHNldmVyaXR5LCBydWxlSWQsIGNvbHVtbiwgZml4LCBlbmRMaW5lLCBlbmRDb2x1bW5cbiAgfSkgPT4ge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBmYXRhbCA/IG9yaWdpbmFsTWVzc2FnZS5zcGxpdCgnXFxuJylbMF0gOiBvcmlnaW5hbE1lc3NhZ2VcbiAgICBjb25zdCBmaWxlUGF0aCA9IHRleHRFZGl0b3IuZ2V0UGF0aCgpXG4gICAgY29uc3QgdGV4dEJ1ZmZlciA9IHRleHRFZGl0b3IuZ2V0QnVmZmVyKClcbiAgICBsZXQgbGludGVyRml4ID0gbnVsbFxuICAgIGlmIChmaXgpIHtcbiAgICAgIGNvbnN0IGZpeFJhbmdlID0gbmV3IFJhbmdlKFxuICAgICAgICB0ZXh0QnVmZmVyLnBvc2l0aW9uRm9yQ2hhcmFjdGVySW5kZXgoZml4LnJhbmdlWzBdKSxcbiAgICAgICAgdGV4dEJ1ZmZlci5wb3NpdGlvbkZvckNoYXJhY3RlckluZGV4KGZpeC5yYW5nZVsxXSlcbiAgICAgIClcbiAgICAgIGxpbnRlckZpeCA9IHtcbiAgICAgICAgcG9zaXRpb246IGZpeFJhbmdlLFxuICAgICAgICByZXBsYWNlV2l0aDogZml4LnRleHRcbiAgICAgIH1cbiAgICB9XG4gICAgbGV0IG1zZ0NvbFxuICAgIGxldCBtc2dFbmRMaW5lXG4gICAgbGV0IG1zZ0VuZENvbFxuICAgIGxldCBlc2xpbnRGdWxsUmFuZ2UgPSBmYWxzZVxuXG4gICAgLypcbiAgICAgTm90ZTogRVNMaW50IHBvc2l0aW9ucyBhcmUgMS1pbmRleGVkLCB3aGlsZSBBdG9tIGV4cGVjdHMgMC1pbmRleGVkLFxuICAgICBwb3NpdGlvbnMuIFdlIGFyZSBzdWJ0cmFjdGluZyAxIGZyb20gdGhlc2UgdmFsdWVzIGhlcmUgc28gd2UgZG9uJ3QgaGF2ZSB0b1xuICAgICBrZWVwIGRvaW5nIHNvIGluIGxhdGVyIHVzZXMuXG4gICAgICovXG4gICAgY29uc3QgbXNnTGluZSA9IGxpbmUgLSAxXG4gICAgaWYgKHR5cGVvZiBlbmRDb2x1bW4gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBlbmRMaW5lICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgZXNsaW50RnVsbFJhbmdlID0gdHJ1ZVxuICAgICAgLy8gSGVyZSB3ZSBhbHdheXMgd2FudCB0aGUgY29sdW1uIHRvIGJlIGEgbnVtYmVyXG4gICAgICBtc2dDb2wgPSBNYXRoLm1heCgwLCBjb2x1bW4gLSAxKVxuICAgICAgbXNnRW5kTGluZSA9IGVuZExpbmUgLSAxXG4gICAgICBtc2dFbmRDb2wgPSBlbmRDb2x1bW4gLSAxXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFdlIHdhbnQgbXNnQ29sIHRvIHJlbWFpbiB1bmRlZmluZWQgaWYgaXQgd2FzIGluaXRpYWxseSBzb1xuICAgICAgLy8gYGdlbmVyYXRlUmFuZ2VgIHdpbGwgZ2l2ZSB1cyBhIHJhbmdlIG92ZXIgdGhlIGVudGlyZSBsaW5lXG4gICAgICBtc2dDb2wgPSB0eXBlb2YgY29sdW1uICE9PSAndW5kZWZpbmVkJyA/IGNvbHVtbiAtIDEgOiBjb2x1bW5cbiAgICB9XG5cbiAgICBsZXQgcmV0ID0ge1xuICAgICAgc2V2ZXJpdHk6IHNldmVyaXR5ID09PSAxID8gJ3dhcm5pbmcnIDogJ2Vycm9yJyxcbiAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgIGZpbGU6IGZpbGVQYXRoLFxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChydWxlSWQpIHtcbiAgICAgIHJldC51cmwgPSBydWxlcy5nZXRSdWxlVXJsKHJ1bGVJZClcbiAgICB9XG5cbiAgICBsZXQgcmFuZ2VcbiAgICB0cnkge1xuICAgICAgaWYgKGVzbGludEZ1bGxSYW5nZSkge1xuICAgICAgICBjb25zdCBidWZmZXIgPSB0ZXh0RWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgICAgIHRocm93SWZJbnZhbGlkUG9pbnQoYnVmZmVyLCBtc2dMaW5lLCBtc2dDb2wpXG4gICAgICAgIHRocm93SWZJbnZhbGlkUG9pbnQoYnVmZmVyLCBtc2dFbmRMaW5lLCBtc2dFbmRDb2wpXG4gICAgICAgIHJhbmdlID0gW1ttc2dMaW5lLCBtc2dDb2xdLCBbbXNnRW5kTGluZSwgbXNnRW5kQ29sXV1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJhbmdlID0gZ2VuZXJhdGVSYW5nZSh0ZXh0RWRpdG9yLCBtc2dMaW5lLCBtc2dDb2wpXG4gICAgICB9XG4gICAgICByZXQubG9jYXRpb24ucG9zaXRpb24gPSByYW5nZVxuXG4gICAgICBjb25zdCBydWxlQXBwZW5kaXggPSBzaG93UnVsZSA/IGAgKCR7cnVsZUlkIHx8ICdGYXRhbCd9KWAgOiAnJ1xuICAgICAgcmV0LmV4Y2VycHQgPSBgJHttZXNzYWdlfSR7cnVsZUFwcGVuZGl4fWBcblxuICAgICAgaWYgKGxpbnRlckZpeCkge1xuICAgICAgICByZXQuc29sdXRpb25zID0gW2xpbnRlckZpeF1cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldCA9IGF3YWl0IGdlbmVyYXRlSW52YWxpZFRyYWNlKHtcbiAgICAgICAgbXNnTGluZSxcbiAgICAgICAgbXNnQ29sLFxuICAgICAgICBtc2dFbmRMaW5lLFxuICAgICAgICBtc2dFbmRDb2wsXG4gICAgICAgIGVzbGludEZ1bGxSYW5nZSxcbiAgICAgICAgZmlsZVBhdGgsXG4gICAgICAgIHRleHRFZGl0b3IsXG4gICAgICAgIHJ1bGVJZCxcbiAgICAgICAgbWVzc2FnZSxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIHJldFxuICB9KSlcbn1cblxuLyoqXG4gKiBQcm9jZXNzZXMgdGhlIHJlc3BvbnNlIGZyb20gdGhlIGxpbnQgam9iXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICByZXNwb25zZSAgIFRoZSByYXcgcmVzcG9uc2UgZnJvbSB0aGUgam9iXG4gKiBAcGFyYW0gIHtUZXh0RWRpdG9yfSB0ZXh0RWRpdG9yIFRoZSBBdG9tOjpUZXh0RWRpdG9yIG9mIHRoZSBmaWxlIHRoZSBtZXNzYWdlcyBiZWxvbmcgdG9cbiAqIEBwYXJhbSAge2Jvb2x9ICAgICAgIHNob3dSdWxlICAgV2hldGhlciB0byBzaG93IHRoZSBydWxlIGluIHRoZSBtZXNzYWdlc1xuICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgICAgICAgICBUaGUgbWVzc2FnZXMgdHJhbnNmb3JtZWQgaW50byBMaW50ZXIgbWVzc2FnZXNcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHByb2Nlc3NKb2JSZXNwb25zZShyZXNwb25zZSwgdGV4dEVkaXRvciwgc2hvd1J1bGUpIHtcbiAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChyZXNwb25zZSwgJ3VwZGF0ZWRSdWxlcycpKSB7XG4gICAgcnVsZXMucmVwbGFjZVJ1bGVzKHJlc3BvbnNlLnVwZGF0ZWRSdWxlcylcbiAgfVxuICByZXR1cm4gcHJvY2Vzc0VTTGludE1lc3NhZ2VzKHJlc3BvbnNlLm1lc3NhZ2VzLCB0ZXh0RWRpdG9yLCBzaG93UnVsZSlcbn1cbiJdfQ==