function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions

var _atom = require('atom');

var _validateEditor = require('./validate/editor');

// Internal variables
'use babel';var idleCallbacks = new Set();

// Dependencies
// NOTE: We are not directly requiring these in order to reduce the time it
// takes to require this file as that causes delays in Atom loading this package
var path = undefined;
var helpers = undefined;
var workerHelpers = undefined;
var isConfigAtHomeRoot = undefined;

var loadDeps = function loadDeps() {
  if (!path) {
    path = require('path');
  }
  if (!helpers) {
    helpers = require('./helpers');
  }
  if (!workerHelpers) {
    workerHelpers = require('./worker-helpers');
  }
  if (!isConfigAtHomeRoot) {
    isConfigAtHomeRoot = require('./is-config-at-home-root');
  }
};

var makeIdleCallback = function makeIdleCallback(work) {
  var callbackId = undefined;
  var callBack = function callBack() {
    idleCallbacks['delete'](callbackId);
    work();
  };
  callbackId = window.requestIdleCallback(callBack);
  idleCallbacks.add(callbackId);
};

var scheduleIdleTasks = function scheduleIdleTasks() {
  var linterEslintInstallPeerPackages = function linterEslintInstallPeerPackages() {
    require('atom-package-deps').install('linter-eslint');
  };
  var linterEslintLoadDependencies = loadDeps;
  var linterEslintStartWorker = function linterEslintStartWorker() {
    loadDeps();
    helpers.startWorker();
  };

  if (!atom.inSpecMode()) {
    makeIdleCallback(linterEslintInstallPeerPackages);
    makeIdleCallback(linterEslintLoadDependencies);
    makeIdleCallback(linterEslintStartWorker);
  }
};

// Configuration
var scopes = [];
var showRule = undefined;
var lintHtmlFiles = undefined;
var ignoredRulesWhenModified = undefined;
var ignoredRulesWhenFixing = undefined;
var disableWhenNoEslintConfig = undefined;
var ignoreFixableRulesWhileTyping = undefined;

// Internal functions
/**
 * Given an Array or iterable containing a list of Rule IDs, return an Object
 * to be sent to ESLint's configuration that disables those rules.
 * @param  {[iterable]} ruleIds Iterable containing ruleIds to ignore
 * @return {Object}             Object containing properties for each rule to ignore
 */
var idsToIgnoredRules = function idsToIgnoredRules(ruleIds) {
  return Array.from(ruleIds).reduce(
  // 0 is the severity to turn off a rule
  function (ids, id) {
    return Object.assign(ids, _defineProperty({}, id, 0));
  }, {});
};

module.exports = {
  activate: function activate() {
    var _this = this;

    this.subscriptions = new _atom.CompositeDisposable();

    /**
     * FIXME: Deprecated eslintRulesDir{String} option in favor of
     * eslintRulesDirs{Array<String>}. Remove in the next major release,
     * in v8.5.0, or after 2018-04.
     */
    var oldRulesdir = atom.config.get('linter-eslint.eslintRulesDir');
    if (oldRulesdir) {
      var rulesDirs = atom.config.get('linter-eslint.eslintRulesDirs');
      if (rulesDirs.length === 0) {
        atom.config.set('linter-eslint.eslintRulesDirs', [oldRulesdir]);
      }
      atom.config.unset('linter-eslint.eslintRulesDir');
    }

    var embeddedScope = 'source.js.embedded.html';
    this.subscriptions.add(atom.config.observe('linter-eslint.lintHtmlFiles', function (value) {
      lintHtmlFiles = value;
      if (lintHtmlFiles) {
        scopes.push(embeddedScope);
      } else if (scopes.indexOf(embeddedScope) !== -1) {
        scopes.splice(scopes.indexOf(embeddedScope), 1);
      }
    }));

    this.subscriptions.add(atom.config.observe('linter-eslint.scopes', function (value) {
      // Remove any old scopes
      scopes.splice(0, scopes.length);
      // Add the current scopes
      Array.prototype.push.apply(scopes, value);
      // Ensure HTML linting still works if the setting is updated
      if (lintHtmlFiles && !scopes.includes(embeddedScope)) {
        scopes.push(embeddedScope);
      }
    }));

    this.subscriptions.add(atom.workspace.observeTextEditors(function (editor) {
      editor.onDidSave(_asyncToGenerator(function* () {
        if ((0, _validateEditor.hasValidScope)(editor, scopes) && atom.config.get('linter-eslint.fixOnSave')) {
          yield _this.fixJob(true);
        }
      }));
    }));

    this.subscriptions.add(atom.commands.add('atom-text-editor', {
      'linter-eslint:debug': _asyncToGenerator(function* () {
        loadDeps();
        var debugString = yield helpers.generateDebugString();
        var notificationOptions = { detail: debugString, dismissable: true };
        atom.notifications.addInfo('linter-eslint debugging information', notificationOptions);
      })
    }));

    this.subscriptions.add(atom.commands.add('atom-text-editor', {
      'linter-eslint:fix-file': _asyncToGenerator(function* () {
        yield _this.fixJob();
      })
    }));

    this.subscriptions.add(atom.config.observe('linter-eslint.showRuleIdInMessage', function (value) {
      showRule = value;
    }));

    this.subscriptions.add(atom.config.observe('linter-eslint.disableWhenNoEslintConfig', function (value) {
      disableWhenNoEslintConfig = value;
    }));

    this.subscriptions.add(atom.config.observe('linter-eslint.rulesToSilenceWhileTyping', function (ids) {
      ignoredRulesWhenModified = ids;
    }));

    this.subscriptions.add(atom.config.observe('linter-eslint.rulesToDisableWhileFixing', function (ids) {
      ignoredRulesWhenFixing = idsToIgnoredRules(ids);
    }));

    this.subscriptions.add(atom.config.observe('linter-eslint.ignoreFixableRulesWhileTyping', function (value) {
      ignoreFixableRulesWhileTyping = value;
    }));

    this.subscriptions.add(atom.contextMenu.add({
      'atom-text-editor:not(.mini), .overlayer': [{
        label: 'ESLint Fix',
        command: 'linter-eslint:fix-file',
        shouldDisplay: function shouldDisplay(evt) {
          var activeEditor = atom.workspace.getActiveTextEditor();
          if (!activeEditor) {
            return false;
          }
          // Black magic!
          // Compares the private component property of the active TextEditor
          //   against the components of the elements
          var evtIsActiveEditor = evt.path.some(function (elem) {
            return(
              // Atom v1.19.0+
              elem.component && activeEditor.component && elem.component === activeEditor.component
            );
          });
          // Only show if it was the active editor and it is a valid scope
          return evtIsActiveEditor && (0, _validateEditor.hasValidScope)(activeEditor, scopes);
        }
      }]
    }));

    scheduleIdleTasks();
  },

  deactivate: function deactivate() {
    idleCallbacks.forEach(function (callbackID) {
      return window.cancelIdleCallback(callbackID);
    });
    idleCallbacks.clear();
    if (helpers) {
      // If the helpers module hasn't been loaded then there was no chance a
      // worker was started anyway.
      helpers.killWorker();
    }
    this.subscriptions.dispose();
  },

  provideLinter: function provideLinter() {
    return {
      name: 'ESLint',
      grammarScopes: scopes,
      scope: 'file',
      lintsOnChange: true,
      lint: _asyncToGenerator(function* (textEditor) {
        if (!atom.workspace.isTextEditor(textEditor)) {
          // If we somehow get fed an invalid TextEditor just immediately return
          return null;
        }

        var filePath = textEditor.getPath();
        if (!filePath) {
          // The editor currently has no path, we can't report messages back to
          // Linter so just return null
          return null;
        }

        loadDeps();

        if (filePath.includes('://')) {
          // If the path is a URL (Nuclide remote file) return a message
          // telling the user we are unable to work on remote files.
          return helpers.generateUserMessage(textEditor, {
            severity: 'warning',
            excerpt: 'Remote file open, linter-eslint is disabled for this file.'
          });
        }

        var text = textEditor.getText();

        var rules = {};
        if (textEditor.isModified()) {
          if (ignoreFixableRulesWhileTyping) {
            (function () {
              // Note that the fixable rules will only have values after the first lint job
              var ignoredRules = new Set(helpers.rules.getFixableRules());
              ignoredRulesWhenModified.forEach(function (ruleId) {
                return ignoredRules.add(ruleId);
              });
              rules = idsToIgnoredRules(ignoredRules);
            })();
          } else {
            rules = idsToIgnoredRules(ignoredRulesWhenModified);
          }
        }

        try {
          var response = yield helpers.sendJob({
            type: 'lint',
            contents: text,
            config: atom.config.get('linter-eslint'),
            rules: rules,
            filePath: filePath,
            projectPath: atom.project.relativizePath(filePath)[0] || ''
          });
          if (textEditor.getText() !== text) {
            /*
            The editor text has been modified since the lint was triggered,
            as we can't be sure that the results will map properly back to
            the new contents, simply return `null` to tell the
            `provideLinter` consumer not to update the saved results.
            */
            return null;
          }
          return helpers.processJobResponse(response, textEditor, showRule);
        } catch (error) {
          return helpers.handleError(textEditor, error);
        }
      })
    };
  },

  fixJob: _asyncToGenerator(function* () {
    var isSave = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    var textEditor = atom.workspace.getActiveTextEditor();

    if (!textEditor || !atom.workspace.isTextEditor(textEditor)) {
      // Silently return if the TextEditor is invalid
      return;
    }

    loadDeps();

    if (textEditor.isModified()) {
      // Abort for invalid or unsaved text editors
      var message = 'Linter-ESLint: Please save before fixing';
      atom.notifications.addError(message);
    }

    var filePath = textEditor.getPath();
    var fileDir = path.dirname(filePath);
    var projectPath = atom.project.relativizePath(filePath)[0];

    // Get the text from the editor, so we can use executeOnText
    var text = textEditor.getText();
    // Do not try to make fixes on an empty file
    if (text.length === 0) {
      return;
    }

    // Do not try to fix if linting should be disabled
    var configPath = workerHelpers.getConfigPath(fileDir);
    var noProjectConfig = configPath === null || isConfigAtHomeRoot(configPath);
    if (noProjectConfig && disableWhenNoEslintConfig) {
      return;
    }

    var rules = {};
    if (Object.keys(ignoredRulesWhenFixing).length > 0) {
      rules = ignoredRulesWhenFixing;
    }

    try {
      var response = yield helpers.sendJob({
        type: 'fix',
        config: atom.config.get('linter-eslint'),
        contents: text,
        rules: rules,
        filePath: filePath,
        projectPath: projectPath
      });
      if (!isSave) {
        atom.notifications.addSuccess(response);
      }
    } catch (err) {
      atom.notifications.addWarning(err.message);
    }
  })
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvbGludGVyLWVzbGludC9zcmMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7b0JBR29DLE1BQU07OzhCQUNaLG1CQUFtQjs7O0FBSmpELFdBQVcsQ0FBQSxBQU9YLElBQU0sYUFBYSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7Ozs7O0FBSy9CLElBQUksSUFBSSxZQUFBLENBQUE7QUFDUixJQUFJLE9BQU8sWUFBQSxDQUFBO0FBQ1gsSUFBSSxhQUFhLFlBQUEsQ0FBQTtBQUNqQixJQUFJLGtCQUFrQixZQUFBLENBQUE7O0FBRXRCLElBQU0sUUFBUSxHQUFHLFNBQVgsUUFBUSxHQUFTO0FBQ3JCLE1BQUksQ0FBQyxJQUFJLEVBQUU7QUFDVCxRQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0dBQ3ZCO0FBQ0QsTUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNaLFdBQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7R0FDL0I7QUFDRCxNQUFJLENBQUMsYUFBYSxFQUFFO0FBQ2xCLGlCQUFhLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUE7R0FDNUM7QUFDRCxNQUFJLENBQUMsa0JBQWtCLEVBQUU7QUFDdkIsc0JBQWtCLEdBQUcsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUE7R0FDekQ7Q0FDRixDQUFBOztBQUVELElBQU0sZ0JBQWdCLEdBQUcsU0FBbkIsZ0JBQWdCLENBQUksSUFBSSxFQUFLO0FBQ2pDLE1BQUksVUFBVSxZQUFBLENBQUE7QUFDZCxNQUFNLFFBQVEsR0FBRyxTQUFYLFFBQVEsR0FBUztBQUNyQixpQkFBYSxVQUFPLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDaEMsUUFBSSxFQUFFLENBQUE7R0FDUCxDQUFBO0FBQ0QsWUFBVSxHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUNqRCxlQUFhLENBQUMsR0FB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Q0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUE7S0FDM0M7R0FDRixDQUFBO0NBQ0YsQ0FBQSIsImZpbGUiOiIvaG9tZS90aGVrYXJsbzk1Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci1lc2xpbnQvc3JjL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzLCBpbXBvcnQvZXh0ZW5zaW9uc1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgeyBoYXNWYWxpZFNjb3BlIH0gZnJvbSAnLi92YWxpZGF0ZS9lZGl0b3InXG5cbi8vIEludGVybmFsIHZhcmlhYmxlc1xuY29uc3QgaWRsZUNhbGxiYWNrcyA9IG5ldyBTZXQoKVxuXG4vLyBEZXBlbmRlbmNpZXNcbi8vIE5PVEU6IFdlIGFyZSBub3QgZGlyZWN0bHkgcmVxdWlyaW5nIHRoZXNlIGluIG9yZGVyIHRvIHJlZHVjZSB0aGUgdGltZSBpdFxuLy8gdGFrZXMgdG8gcmVxdWlyZSB0aGlzIGZpbGUgYXMgdGhhdCBjYXVzZXMgZGVsYXlzIGluIEF0b20gbG9hZGluZyB0aGlzIHBhY2thZ2VcbmxldCBwYXRoXG5sZXQgaGVscGVyc1xubGV0IHdvcmtlckhlbHBlcnNcbmxldCBpc0NvbmZpZ0F0SG9tZVJvb3RcblxuY29uc3QgbG9hZERlcHMgPSAoKSA9PiB7XG4gIGlmICghcGF0aCkge1xuICAgIHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgfVxuICBpZiAoIWhlbHBlcnMpIHtcbiAgICBoZWxwZXJzID0gcmVxdWlyZSgnLi9oZWxwZXJzJylcbiAgfVxuICBpZiAoIXdvcmtlckhlbHBlcnMpIHtcbiAgICB3b3JrZXJIZWxwZXJzID0gcmVxdWlyZSgnLi93b3JrZXItaGVscGVycycpXG4gIH1cbiAgaWYgKCFpc0NvbmZpZ0F0SG9tZVJvb3QpIHtcbiAgICBpc0NvbmZpZ0F0SG9tZVJvb3QgPSByZXF1aXJlKCcuL2lzLWNvbmZpZy1hdC1ob21lLXJvb3QnKVxuICB9XG59XG5cbmNvbnN0IG1ha2VJZGxlQ2FsbGJhY2sgPSAod29yaykgPT4ge1xuICBsZXQgY2FsbGJhY2tJZFxuICBjb25zdCBjYWxsQmFjayA9ICgpID0+IHtcbiAgICBpZGxlQ2FsbGJhY2tzLmRlbGV0ZShjYWxsYmFja0lkKVxuICAgIHdvcmsoKVxuICB9XG4gIGNhbGxiYWNrSWQgPSB3aW5kb3cucmVxdWVzdElkbGVDYWxsYmFjayhjYWxsQmFjaylcbiAgaWRsZUNhbGxiYWNrcy5hZGQoY2FsbGJhY2tJZClcbn1cblxuY29uc3Qgc2NoZWR1bGVJZGxlVGFza3MgPSAoKSA9PiB7XG4gIGNvbnN0IGxpbnRlckVzbGludEluc3RhbGxQZWVyUGFja2FnZXMgPSAoKSA9PiB7XG4gICAgcmVxdWlyZSgnYXRvbS1wYWNrYWdlLWRlcHMnKS5pbnN0YWxsKCdsaW50ZXItZXNsaW50JylcbiAgfVxuICBjb25zdCBsaW50ZXJFc2xpbnRMb2FkRGVwZW5kZW5jaWVzID0gbG9hZERlcHNcbiAgY29uc3QgbGludGVyRXNsaW50U3RhcnRXb3JrZXIgPSAoKSA9PiB7XG4gICAgbG9hZERlcHMoKVxuICAgIGhlbHBlcnMuc3RhcnRXb3JrZXIoKVxuICB9XG5cbiAgaWYgKCFhdG9tLmluU3BlY01vZGUoKSkge1xuICAgIG1ha2VJZGxlQ2FsbGJhY2sobGludGVyRXNsaW50SW5zdGFsbFBlZXJQYWNrYWdlcylcbiAgICBtYWtlSWRsZUNhbGxiYWNrKGxpbnRlckVzbGludExvYWREZXBlbmRlbmNpZXMpXG4gICAgbWFrZUlkbGVDYWxsYmFjayhsaW50ZXJFc2xpbnRTdGFydFdvcmtlcilcbiAgfVxufVxuXG4vLyBDb25maWd1cmF0aW9uXG5jb25zdCBzY29wZXMgPSBbXVxubGV0IHNob3dSdWxlXG5sZXQgbGludEh0bWxGaWxlc1xubGV0IGlnbm9yZWRSdWxlc1doZW5Nb2RpZmllZFxubGV0IGlnbm9yZWRSdWxlc1doZW5GaXhpbmdcbmxldCBkaXNhYmxlV2hlbk5vRXNsaW50Q29uZmlnXG5sZXQgaWdub3JlRml4YWJsZVJ1bGVzV2hpbGVUeXBpbmdcblxuLy8gSW50ZXJuYWwgZnVuY3Rpb25zXG4vKipcbiAqIEdpdmVuIGFuIEFycmF5IG9yIGl0ZXJhYmxlIGNvbnRhaW5pbmcgYSBsaXN0IG9mIFJ1bGUgSURzLCByZXR1cm4gYW4gT2JqZWN0XG4gKiB0byBiZSBzZW50IHRvIEVTTGludCdzIGNvbmZpZ3VyYXRpb24gdGhhdCBkaXNhYmxlcyB0aG9zZSBydWxlcy5cbiAqIEBwYXJhbSAge1tpdGVyYWJsZV19IHJ1bGVJZHMgSXRlcmFibGUgY29udGFpbmluZyBydWxlSWRzIHRvIGlnbm9yZVxuICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgICBPYmplY3QgY29udGFpbmluZyBwcm9wZXJ0aWVzIGZvciBlYWNoIHJ1bGUgdG8gaWdub3JlXG4gKi9cbmNvbnN0IGlkc1RvSWdub3JlZFJ1bGVzID0gcnVsZUlkcyA9PlxuICBBcnJheS5mcm9tKHJ1bGVJZHMpLnJlZHVjZShcbiAgICAvLyAwIGlzIHRoZSBzZXZlcml0eSB0byB0dXJuIG9mZiBhIHJ1bGVcbiAgICAoaWRzLCBpZCkgPT4gT2JqZWN0LmFzc2lnbihpZHMsIHsgW2lkXTogMCB9KVxuICAgICwge31cbiAgKVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICAvKipcbiAgICAgKiBGSVhNRTogRGVwcmVjYXRlZCBlc2xpbnRSdWxlc0RpcntTdHJpbmd9IG9wdGlvbiBpbiBmYXZvciBvZlxuICAgICAqIGVzbGludFJ1bGVzRGlyc3tBcnJheTxTdHJpbmc+fS4gUmVtb3ZlIGluIHRoZSBuZXh0IG1ham9yIHJlbGVhc2UsXG4gICAgICogaW4gdjguNS4wLCBvciBhZnRlciAyMDE4LTA0LlxuICAgICAqL1xuICAgIGNvbnN0IG9sZFJ1bGVzZGlyID0gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItZXNsaW50LmVzbGludFJ1bGVzRGlyJylcbiAgICBpZiAob2xkUnVsZXNkaXIpIHtcbiAgICAgIGNvbnN0IHJ1bGVzRGlycyA9IGF0b20uY29uZmlnLmdldCgnbGludGVyLWVzbGludC5lc2xpbnRSdWxlc0RpcnMnKVxuICAgICAgaWYgKHJ1bGVzRGlycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItZXNsaW50LmVzbGludFJ1bGVzRGlycycsIFtvbGRSdWxlc2Rpcl0pXG4gICAgICB9XG4gICAgICBhdG9tLmNvbmZpZy51bnNldCgnbGludGVyLWVzbGludC5lc2xpbnRSdWxlc0RpcicpXG4gICAgfVxuXG4gICAgY29uc3QgZW1iZWRkZWRTY29wZSA9ICdzb3VyY2UuanMuZW1iZWRkZWQuaHRtbCdcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoXG4gICAgICAnbGludGVyLWVzbGludC5saW50SHRtbEZpbGVzJyxcbiAgICAgICh2YWx1ZSkgPT4ge1xuICAgICAgICBsaW50SHRtbEZpbGVzID0gdmFsdWVcbiAgICAgICAgaWYgKGxpbnRIdG1sRmlsZXMpIHtcbiAgICAgICAgICBzY29wZXMucHVzaChlbWJlZGRlZFNjb3BlKVxuICAgICAgICB9IGVsc2UgaWYgKHNjb3Blcy5pbmRleE9mKGVtYmVkZGVkU2NvcGUpICE9PSAtMSkge1xuICAgICAgICAgIHNjb3Blcy5zcGxpY2Uoc2NvcGVzLmluZGV4T2YoZW1iZWRkZWRTY29wZSksIDEpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKFxuICAgICAgJ2xpbnRlci1lc2xpbnQuc2NvcGVzJyxcbiAgICAgICh2YWx1ZSkgPT4ge1xuICAgICAgICAvLyBSZW1vdmUgYW55IG9sZCBzY29wZXNcbiAgICAgICAgc2NvcGVzLnNwbGljZSgwLCBzY29wZXMubGVuZ3RoKVxuICAgICAgICAvLyBBZGQgdGhlIGN1cnJlbnQgc2NvcGVzXG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHNjb3BlcywgdmFsdWUpXG4gICAgICAgIC8vIEVuc3VyZSBIVE1MIGxpbnRpbmcgc3RpbGwgd29ya3MgaWYgdGhlIHNldHRpbmcgaXMgdXBkYXRlZFxuICAgICAgICBpZiAobGludEh0bWxGaWxlcyAmJiAhc2NvcGVzLmluY2x1ZGVzKGVtYmVkZGVkU2NvcGUpKSB7XG4gICAgICAgICAgc2NvcGVzLnB1c2goZW1iZWRkZWRTY29wZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICkpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycygoZWRpdG9yKSA9PiB7XG4gICAgICBlZGl0b3Iub25EaWRTYXZlKGFzeW5jICgpID0+IHtcbiAgICAgICAgaWYgKGhhc1ZhbGlkU2NvcGUoZWRpdG9yLCBzY29wZXMpXG4gICAgICAgICAgJiYgYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItZXNsaW50LmZpeE9uU2F2ZScpXG4gICAgICAgICkge1xuICAgICAgICAgIGF3YWl0IHRoaXMuZml4Sm9iKHRydWUpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSkpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywge1xuICAgICAgJ2xpbnRlci1lc2xpbnQ6ZGVidWcnOiBhc3luYyAoKSA9PiB7XG4gICAgICAgIGxvYWREZXBzKClcbiAgICAgICAgY29uc3QgZGVidWdTdHJpbmcgPSBhd2FpdCBoZWxwZXJzLmdlbmVyYXRlRGVidWdTdHJpbmcoKVxuICAgICAgICBjb25zdCBub3RpZmljYXRpb25PcHRpb25zID0geyBkZXRhaWw6IGRlYnVnU3RyaW5nLCBkaXNtaXNzYWJsZTogdHJ1ZSB9XG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKCdsaW50ZXItZXNsaW50IGRlYnVnZ2luZyBpbmZvcm1hdGlvbicsIG5vdGlmaWNhdGlvbk9wdGlvbnMpXG4gICAgICB9XG4gICAgfSkpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywge1xuICAgICAgJ2xpbnRlci1lc2xpbnQ6Zml4LWZpbGUnOiBhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IHRoaXMuZml4Sm9iKClcbiAgICAgIH1cbiAgICB9KSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZShcbiAgICAgICdsaW50ZXItZXNsaW50LnNob3dSdWxlSWRJbk1lc3NhZ2UnLFxuICAgICAgKHZhbHVlKSA9PiB7IHNob3dSdWxlID0gdmFsdWUgfVxuICAgICkpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoXG4gICAgICAnbGludGVyLWVzbGludC5kaXNhYmxlV2hlbk5vRXNsaW50Q29uZmlnJyxcbiAgICAgICh2YWx1ZSkgPT4geyBkaXNhYmxlV2hlbk5vRXNsaW50Q29uZmlnID0gdmFsdWUgfVxuICAgICkpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoXG4gICAgICAnbGludGVyLWVzbGludC5ydWxlc1RvU2lsZW5jZVdoaWxlVHlwaW5nJyxcbiAgICAgIChpZHMpID0+IHsgaWdub3JlZFJ1bGVzV2hlbk1vZGlmaWVkID0gaWRzIH1cbiAgICApKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKFxuICAgICAgJ2xpbnRlci1lc2xpbnQucnVsZXNUb0Rpc2FibGVXaGlsZUZpeGluZycsXG4gICAgICAoaWRzKSA9PiB7IGlnbm9yZWRSdWxlc1doZW5GaXhpbmcgPSBpZHNUb0lnbm9yZWRSdWxlcyhpZHMpIH1cbiAgICApKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKFxuICAgICAgJ2xpbnRlci1lc2xpbnQuaWdub3JlRml4YWJsZVJ1bGVzV2hpbGVUeXBpbmcnLFxuICAgICAgKHZhbHVlKSA9PiB7IGlnbm9yZUZpeGFibGVSdWxlc1doaWxlVHlwaW5nID0gdmFsdWUgfVxuICAgICkpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29udGV4dE1lbnUuYWRkKHtcbiAgICAgICdhdG9tLXRleHQtZWRpdG9yOm5vdCgubWluaSksIC5vdmVybGF5ZXInOiBbe1xuICAgICAgICBsYWJlbDogJ0VTTGludCBGaXgnLFxuICAgICAgICBjb21tYW5kOiAnbGludGVyLWVzbGludDpmaXgtZmlsZScsXG4gICAgICAgIHNob3VsZERpc3BsYXk6IChldnQpID0+IHtcbiAgICAgICAgICBjb25zdCBhY3RpdmVFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgICBpZiAoIWFjdGl2ZUVkaXRvcikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIEJsYWNrIG1hZ2ljIVxuICAgICAgICAgIC8vIENvbXBhcmVzIHRoZSBwcml2YXRlIGNvbXBvbmVudCBwcm9wZXJ0eSBvZiB0aGUgYWN0aXZlIFRleHRFZGl0b3JcbiAgICAgICAgICAvLyAgIGFnYWluc3QgdGhlIGNvbXBvbmVudHMgb2YgdGhlIGVsZW1lbnRzXG4gICAgICAgICAgY29uc3QgZXZ0SXNBY3RpdmVFZGl0b3IgPSBldnQucGF0aC5zb21lKGVsZW0gPT5cbiAgICAgICAgICAgIC8vIEF0b20gdjEuMTkuMCtcbiAgICAgICAgICAgIChlbGVtLmNvbXBvbmVudCAmJiBhY3RpdmVFZGl0b3IuY29tcG9uZW50ICYmXG4gICAgICAgICAgICAgIGVsZW0uY29tcG9uZW50ID09PSBhY3RpdmVFZGl0b3IuY29tcG9uZW50KSlcbiAgICAgICAgICAvLyBPbmx5IHNob3cgaWYgaXQgd2FzIHRoZSBhY3RpdmUgZWRpdG9yIGFuZCBpdCBpcyBhIHZhbGlkIHNjb3BlXG4gICAgICAgICAgcmV0dXJuIGV2dElzQWN0aXZlRWRpdG9yICYmIGhhc1ZhbGlkU2NvcGUoYWN0aXZlRWRpdG9yLCBzY29wZXMpXG4gICAgICAgIH1cbiAgICAgIH1dXG4gICAgfSkpXG5cbiAgICBzY2hlZHVsZUlkbGVUYXNrcygpXG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICBpZGxlQ2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2tJRCA9PiB3aW5kb3cuY2FuY2VsSWRsZUNhbGxiYWNrKGNhbGxiYWNrSUQpKVxuICAgIGlkbGVDYWxsYmFja3MuY2xlYXIoKVxuICAgIGlmIChoZWxwZXJzKSB7XG4gICAgICAvLyBJZiB0aGUgaGVscGVycyBtb2R1bGUgaGFzbid0IGJlZW4gbG9hZGVkIHRoZW4gdGhlcmUgd2FzIG5vIGNoYW5jZSBhXG4gICAgICAvLyB3b3JrZXIgd2FzIHN0YXJ0ZWQgYW55d2F5LlxuICAgICAgaGVscGVycy5raWxsV29ya2VyKClcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9LFxuXG4gIHByb3ZpZGVMaW50ZXIoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICdFU0xpbnQnLFxuICAgICAgZ3JhbW1hclNjb3Blczogc2NvcGVzLFxuICAgICAgc2NvcGU6ICdmaWxlJyxcbiAgICAgIGxpbnRzT25DaGFuZ2U6IHRydWUsXG4gICAgICBsaW50OiBhc3luYyAodGV4dEVkaXRvcikgPT4ge1xuICAgICAgICBpZiAoIWF0b20ud29ya3NwYWNlLmlzVGV4dEVkaXRvcih0ZXh0RWRpdG9yKSkge1xuICAgICAgICAgIC8vIElmIHdlIHNvbWVob3cgZ2V0IGZlZCBhbiBpbnZhbGlkIFRleHRFZGl0b3IganVzdCBpbW1lZGlhdGVseSByZXR1cm5cbiAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSB0ZXh0RWRpdG9yLmdldFBhdGgoKVxuICAgICAgICBpZiAoIWZpbGVQYXRoKSB7XG4gICAgICAgICAgLy8gVGhlIGVkaXRvciBjdXJyZW50bHkgaGFzIG5vIHBhdGgsIHdlIGNhbid0IHJlcG9ydCBtZXNzYWdlcyBiYWNrIHRvXG4gICAgICAgICAgLy8gTGludGVyIHNvIGp1c3QgcmV0dXJuIG51bGxcbiAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG5cbiAgICAgICAgbG9hZERlcHMoKVxuXG4gICAgICAgIGlmIChmaWxlUGF0aC5pbmNsdWRlcygnOi8vJykpIHtcbiAgICAgICAgICAvLyBJZiB0aGUgcGF0aCBpcyBhIFVSTCAoTnVjbGlkZSByZW1vdGUgZmlsZSkgcmV0dXJuIGEgbWVzc2FnZVxuICAgICAgICAgIC8vIHRlbGxpbmcgdGhlIHVzZXIgd2UgYXJlIHVuYWJsZSB0byB3b3JrIG9uIHJlbW90ZSBmaWxlcy5cbiAgICAgICAgICByZXR1cm4gaGVscGVycy5nZW5lcmF0ZVVzZXJNZXNzYWdlKHRleHRFZGl0b3IsIHtcbiAgICAgICAgICAgIHNldmVyaXR5OiAnd2FybmluZycsXG4gICAgICAgICAgICBleGNlcnB0OiAnUmVtb3RlIGZpbGUgb3BlbiwgbGludGVyLWVzbGludCBpcyBkaXNhYmxlZCBmb3IgdGhpcyBmaWxlLicsXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRleHQgPSB0ZXh0RWRpdG9yLmdldFRleHQoKVxuXG4gICAgICAgIGxldCBydWxlcyA9IHt9XG4gICAgICAgIGlmICh0ZXh0RWRpdG9yLmlzTW9kaWZpZWQoKSkge1xuICAgICAgICAgIGlmIChpZ25vcmVGaXhhYmxlUnVsZXNXaGlsZVR5cGluZykge1xuICAgICAgICAgICAgLy8gTm90ZSB0aGF0IHRoZSBmaXhhYmxlIHJ1bGVzIHdpbGwgb25seSBoYXZlIHZhbHVlcyBhZnRlciB0aGUgZmlyc3QgbGludCBqb2JcbiAgICAgICAgICAgIGNvbnN0IGlnbm9yZWRSdWxlcyA9IG5ldyBTZXQoaGVscGVycy5ydWxlcy5nZXRGaXhhYmxlUnVsZXMoKSlcbiAgICAgICAgICAgIGlnbm9yZWRSdWxlc1doZW5Nb2RpZmllZC5mb3JFYWNoKHJ1bGVJZCA9PiBpZ25vcmVkUnVsZXMuYWRkKHJ1bGVJZCkpXG4gICAgICAgICAgICBydWxlcyA9IGlkc1RvSWdub3JlZFJ1bGVzKGlnbm9yZWRSdWxlcylcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcnVsZXMgPSBpZHNUb0lnbm9yZWRSdWxlcyhpZ25vcmVkUnVsZXNXaGVuTW9kaWZpZWQpXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGhlbHBlcnMuc2VuZEpvYih7XG4gICAgICAgICAgICB0eXBlOiAnbGludCcsXG4gICAgICAgICAgICBjb250ZW50czogdGV4dCxcbiAgICAgICAgICAgIGNvbmZpZzogYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItZXNsaW50JyksXG4gICAgICAgICAgICBydWxlcyxcbiAgICAgICAgICAgIGZpbGVQYXRoLFxuICAgICAgICAgICAgcHJvamVjdFBhdGg6IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmaWxlUGF0aClbMF0gfHwgJydcbiAgICAgICAgICB9KVxuICAgICAgICAgIGlmICh0ZXh0RWRpdG9yLmdldFRleHQoKSAhPT0gdGV4dCkge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIFRoZSBlZGl0b3IgdGV4dCBoYXMgYmVlbiBtb2RpZmllZCBzaW5jZSB0aGUgbGludCB3YXMgdHJpZ2dlcmVkLFxuICAgICAgICAgICAgYXMgd2UgY2FuJ3QgYmUgc3VyZSB0aGF0IHRoZSByZXN1bHRzIHdpbGwgbWFwIHByb3Blcmx5IGJhY2sgdG9cbiAgICAgICAgICAgIHRoZSBuZXcgY29udGVudHMsIHNpbXBseSByZXR1cm4gYG51bGxgIHRvIHRlbGwgdGhlXG4gICAgICAgICAgICBgcHJvdmlkZUxpbnRlcmAgY29uc3VtZXIgbm90IHRvIHVwZGF0ZSB0aGUgc2F2ZWQgcmVzdWx0cy5cbiAgICAgICAgICAgICovXG4gICAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gaGVscGVycy5wcm9jZXNzSm9iUmVzcG9uc2UocmVzcG9uc2UsIHRleHRFZGl0b3IsIHNob3dSdWxlKVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIHJldHVybiBoZWxwZXJzLmhhbmRsZUVycm9yKHRleHRFZGl0b3IsIGVycm9yKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIGFzeW5jIGZpeEpvYihpc1NhdmUgPSBmYWxzZSkge1xuICAgIGNvbnN0IHRleHRFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICAgIGlmICghdGV4dEVkaXRvciB8fCAhYXRvbS53b3Jrc3BhY2UuaXNUZXh0RWRpdG9yKHRleHRFZGl0b3IpKSB7XG4gICAgICAvLyBTaWxlbnRseSByZXR1cm4gaWYgdGhlIFRleHRFZGl0b3IgaXMgaW52YWxpZFxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgbG9hZERlcHMoKVxuXG4gICAgaWYgKHRleHRFZGl0b3IuaXNNb2RpZmllZCgpKSB7XG4gICAgICAvLyBBYm9ydCBmb3IgaW52YWxpZCBvciB1bnNhdmVkIHRleHQgZWRpdG9yc1xuICAgICAgY29uc3QgbWVzc2FnZSA9ICdMaW50ZXItRVNMaW50OiBQbGVhc2Ugc2F2ZSBiZWZvcmUgZml4aW5nJ1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKG1lc3NhZ2UpXG4gICAgfVxuXG4gICAgY29uc3QgZmlsZVBhdGggPSB0ZXh0RWRpdG9yLmdldFBhdGgoKVxuICAgIGNvbnN0IGZpbGVEaXIgPSBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpXG4gICAgY29uc3QgcHJvamVjdFBhdGggPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZmlsZVBhdGgpWzBdXG5cbiAgICAvLyBHZXQgdGhlIHRleHQgZnJvbSB0aGUgZWRpdG9yLCBzbyB3ZSBjYW4gdXNlIGV4ZWN1dGVPblRleHRcbiAgICBjb25zdCB0ZXh0ID0gdGV4dEVkaXRvci5nZXRUZXh0KClcbiAgICAvLyBEbyBub3QgdHJ5IHRvIG1ha2UgZml4ZXMgb24gYW4gZW1wdHkgZmlsZVxuICAgIGlmICh0ZXh0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gRG8gbm90IHRyeSB0byBmaXggaWYgbGludGluZyBzaG91bGQgYmUgZGlzYWJsZWRcbiAgICBjb25zdCBjb25maWdQYXRoID0gd29ya2VySGVscGVycy5nZXRDb25maWdQYXRoKGZpbGVEaXIpXG4gICAgY29uc3Qgbm9Qcm9qZWN0Q29uZmlnID0gKGNvbmZpZ1BhdGggPT09IG51bGwgfHwgaXNDb25maWdBdEhvbWVSb290KGNvbmZpZ1BhdGgpKVxuICAgIGlmIChub1Byb2plY3RDb25maWcgJiYgZGlzYWJsZVdoZW5Ob0VzbGludENvbmZpZykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgbGV0IHJ1bGVzID0ge31cbiAgICBpZiAoT2JqZWN0LmtleXMoaWdub3JlZFJ1bGVzV2hlbkZpeGluZykubGVuZ3RoID4gMCkge1xuICAgICAgcnVsZXMgPSBpZ25vcmVkUnVsZXNXaGVuRml4aW5nXG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgaGVscGVycy5zZW5kSm9iKHtcbiAgICAgICAgdHlwZTogJ2ZpeCcsXG4gICAgICAgIGNvbmZpZzogYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItZXNsaW50JyksXG4gICAgICAgIGNvbnRlbnRzOiB0ZXh0LFxuICAgICAgICBydWxlcyxcbiAgICAgICAgZmlsZVBhdGgsXG4gICAgICAgIHByb2plY3RQYXRoXG4gICAgICB9KVxuICAgICAgaWYgKCFpc1NhdmUpIHtcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MocmVzcG9uc2UpXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhlcnIubWVzc2FnZSlcbiAgICB9XG4gIH0sXG59XG4iXX0=