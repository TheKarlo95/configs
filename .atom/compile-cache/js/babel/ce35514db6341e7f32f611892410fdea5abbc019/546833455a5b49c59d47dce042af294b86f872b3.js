Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

/** @babel */

// eslint-disable-next-line

var _atom = require('atom');

var _definitionsView = require('./definitions-view');

var _definitionsView2 = _interopRequireDefault(_definitionsView);

var _searcher = require('./searcher');

var _searcher2 = _interopRequireDefault(_searcher);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

exports['default'] = {
  config: {
    contextMenuDisplayAtFirst: {
      type: 'boolean',
      'default': true
    },
    performanceMode: {
      type: 'boolean',
      'default': false
    },
    disableScopeNames: {
      type: 'array',
      description: 'Scope name list separated by comma(for example "source.js.jsx, source.go")',
      'default': []
    }
  },

  firstContextMenu: {
    'atom-text-editor': [{
      label: 'Goto Definition',
      command: 'goto-definition:go'
    }, {
      type: 'separator'
    }]
  },

  normalContextMenu: {
    'atom-text-editor': [{
      label: 'Goto Definition',
      command: 'goto-definition:go'
    }]
  },

  activate: function activate() {
    var _this = this;

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-text-editor', 'goto-definition:go', this.go.bind(this)));
    if (atom.config.get('goto-definition.contextMenuDisplayAtFirst')) {
      this.subscriptions.add(atom.contextMenu.add(this.firstContextMenu));
      atom.contextMenu.itemSets.unshift(atom.contextMenu.itemSets.pop());
    } else {
      this.subscriptions.add(atom.contextMenu.add(this.normalContextMenu));
    }
    this.subscriptions.add(atom.config.observe('goto-definition.disableScopeNames', function (value) {
      _this.disableScopeNames = new Set(value);
    }));
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
  },

  getSelectedWord: function getSelectedWord(editor, wordRegex) {
    return (editor.getSelectedText() || editor.getWordUnderCursor({
      wordRegex: wordRegex,
      includeNonWordCharacters: true
    })).replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  },

  getScanOptions: function getScanOptions(editor) {
    var filePath = editor.getPath();
    if (!filePath) {
      return {
        message: 'This file must be saved to disk .'
      };
    }
    var fileExtension = '*.' + filePath.split('.').pop();

    var scanGrammars = [];
    var scanRegexes = [];
    var scanFiles = [];
    var wordRegexes = [];
    var grammarNames = Object.keys(_config2['default']);
    for (var i = 0; i < grammarNames.length; i++) {
      var grammarName = grammarNames[i];
      var grammarOption = _config2['default'][grammarName];
      if (grammarOption.files.includes(fileExtension)) {
        if (grammarOption.dependencies) {
          grammarOption.dependencies.map(function (x) {
            return scanGrammars.push(x);
          });
        }

        scanGrammars.push(grammarName);
      }
    }
    for (var i = 0; i < scanGrammars.length; i++) {
      var _scanRegexes, _scanFiles;

      var grammarName = scanGrammars[i];
      var grammarOption = _config2['default'][grammarName];

      (_scanRegexes = scanRegexes).push.apply(_scanRegexes, _toConsumableArray(grammarOption.regexes.map(function (x) {
        return x.source;
      })));
      (_scanFiles = scanFiles).push.apply(_scanFiles, _toConsumableArray(grammarOption.files));
      wordRegexes.push(grammarOption.word.source);
    }

    if (scanRegexes.length === 0) {
      return {
        message: 'This language is not supported . Pull Request Welcome 👏.'
      };
    }

    wordRegexes = wordRegexes.filter(function (e, i, a) {
      return a.lastIndexOf(e) === i;
    }).join('|');
    var word = this.getSelectedWord(editor, new RegExp(wordRegexes, 'i'));
    if (!word.trim().length) {
      return {
        message: 'Unknown keyword .'
      };
    }

    scanRegexes = scanRegexes.filter(function (e, i, a) {
      return a.lastIndexOf(e) === i;
    });
    scanFiles = scanFiles.filter(function (e, i, a) {
      return a.lastIndexOf(e) === i;
    });

    return {
      regex: scanRegexes.join('|').replace(/{word}/g, word),
      fileTypes: scanFiles
    };
  },

  getProvider: function getProvider() {
    var _this2 = this;

    var avaiableFileExtensions = new Set(Object.keys(_config2['default']).map(function (key) {
      return _config2['default'][key].files;
    }).reduce(function (a, b) {
      return a.concat(b);
    }));
    return {
      providerName: 'goto-definition-hyperclick',
      wordRegExp: /[$0-9a-zA-Z_-]+/g,
      getSuggestionForWord: function getSuggestionForWord(editor, text, range) {
        if (!text) {
          return null;
        }

        var filePath = editor.getPath();
        if (!filePath) {
          return null;
        }
        var fileExtension = '*.' + filePath.split('.').pop();
        if (!avaiableFileExtensions.has(fileExtension)) {
          return null;
        }

        var _editor$getGrammar = editor.getGrammar();

        var scopeName = _editor$getGrammar.scopeName;

        if (_this2.disableScopeNames.has(scopeName)) {
          return null;
        }

        return {
          range: range,
          callback: function callback() {
            _this2.go(editor);
          }
        };
      }
    };
  },

  go: function go(editor) {
    var _this3 = this;

    var activeEditor = editor && editor.constructor.name === 'TextEditor' ? editor : atom.workspace.getActiveTextEditor();

    var _getScanOptions = this.getScanOptions(activeEditor);

    var regex = _getScanOptions.regex;
    var fileTypes = _getScanOptions.fileTypes;
    var message = _getScanOptions.message;

    if (!regex) {
      return atom.notifications.addWarning(message);
    }

    if (this.definitionsView) {
      this.definitionsView.cancel();
    }

    this.definitionsView = new _definitionsView2['default']();
    this.state = 'started';

    var iterator = function iterator(items) {
      _this3.state = 'searching';
      _this3.definitionsView.addItems(items);
    };

    var callback = function callback() {
      _this3.state = 'completed';
      if (_this3.definitionsView.items.length === 0) {
        _this3.definitionsView.show();
      } else if (_this3.definitionsView.items.length === 1) {
        _this3.definitionsView.confirmedFirst();
      }
    };

    var scanPaths = atom.project.getDirectories().map(function (x) {
      return x.path;
    });

    if (atom.config.get('goto-definition.performanceMode')) {
      _searcher2['default'].ripgrepScan(activeEditor, scanPaths, fileTypes, regex, iterator, callback);
    } else {
      _searcher2['default'].atomWorkspaceScan(activeEditor, scanPaths, fileTypes, regex, iterator, callback);
    }
    return null;
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvZ290by1kZWZpbml0aW9uL2xpYi9nb3RvLWRlZmluaXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O29CQUdvQyxNQUFNOzsrQkFDZCxvQkFBb0I7Ozs7d0JBQzNCLFlBQVk7Ozs7c0JBQ2QsVUFBVTs7OztxQkFFZDtBQUNiLFFBQU0sRUFBRTtBQUNOLDZCQUF5QixFQUFFO0FBQ3pCLFVBQUksRUFBRSxTQUFTO0FBQ2YsaUJBQVMsSUFBSTtLQUNkO0FBQ0QsbUJBQWUsRUFBRTtBQUNmLFVBQUksRUFBRSxTQUFTO0FBQ2YsaUJBQVMsS0FBSztLQUNmO0FBQ0QscUJBQWlCLEVBQUU7QUFDakIsVUFBSSxFQUFFLE9BQU87QUFDYixpQkFBVyxFQUFFLDRFQUE0RTtBQUN6RixpQkFBUyxFQUFFO0tBQ1o7R0FDRjs7QUFFRCxrQkFBZ0IsRUFBRTtBQUNoQixzQkFBa0IsRUFBRSxDQUNsQjtBQUNFLFdBQUssRUFBRSxpQkFBaUI7QUFDeEIsYUFBTyxFQUFFLG9CQUFvQjtLQUM5QixFQUFFO0FBQ0QsVUFBSSxFQUFFLFdBQVc7S0FDbEIsQ0FDRjtHQUNGOztBQUVELG1CQUFpQixFQUFFO0FBQ2pCLHNCQUFrQixFQUFFLENBQ2xCO0FBQ0UsV0FBSyxFQUFFLGlCQUFpQjtBQUN4QixhQUFPLEVBQUUsb0JBQW9CO0tBQzlCLENBQ0Y7R0FDRjs7QUFFRCxVQUFRLEVBQUEsb0JBQUc7OztBQUNULFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUM7QUFDL0MsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hHLFFBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMs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QUMzQyxlQUFLLGVBQWUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztPQUM3QixNQUFNLElBQUksT0FBSyxlQUFlLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDbEQsZUFBSyxlQUFlLENBQUMsY0FBYyxFQUFFLENBQUM7T0FDdkM7S0FDRixDQUFDOztBQUVGLFFBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQzthQUFJLENBQUMsQ0FBQyxJQUFJO0tBQUEsQ0FBQyxDQUFDOztBQUVqRSxRQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxDQUFDLEVBQUU7QUFDdEQsNEJBQVMsV0FBVyxDQUFDLFlBQVksRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDckYsTUFBTTtBQUNMLDRCQUFTLGlCQUFpQixDQUFDLFlBQVksRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDM0Y7QUFDRCxXQUFPLElBQUksQ0FBQztHQUNiO0NBQ0YiLCJmaWxlIjoiL2hvbWUvdGhla2FybG85NS8uYXRvbS9wYWNrYWdlcy9nb3RvLWRlZmluaXRpb24vbGliL2dvdG8tZGVmaW5pdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgRGVmaW5pdGlvbnNWaWV3IGZyb20gJy4vZGVmaW5pdGlvbnMtdmlldyc7XG5pbXBvcnQgU2VhcmNoZXIgZnJvbSAnLi9zZWFyY2hlcic7XG5pbXBvcnQgQ29uZmlnIGZyb20gJy4vY29uZmlnJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb25maWc6IHtcbiAgICBjb250ZXh0TWVudURpc3BsYXlBdEZpcnN0OiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgIH0sXG4gICAgcGVyZm9ybWFuY2VNb2RlOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB9LFxuICAgIGRpc2FibGVTY29wZU5hbWVzOiB7XG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgZGVzY3JpcHRpb246ICdTY29wZSBuYW1lIGxpc3Qgc2VwYXJhdGVkIGJ5IGNvbW1hKGZvciBleGFtcGxlIFwic291cmNlLmpzLmpzeCwgc291cmNlLmdvXCIpJyxcbiAgICAgIGRlZmF1bHQ6IFtdLFxuICAgIH0sXG4gIH0sXG5cbiAgZmlyc3RDb250ZXh0TWVudToge1xuICAgICdhdG9tLXRleHQtZWRpdG9yJzogW1xuICAgICAge1xuICAgICAgICBsYWJlbDogJ0dvdG8gRGVmaW5pdGlvbicsXG4gICAgICAgIGNvbW1hbmQ6ICdnb3RvLWRlZmluaXRpb246Z28nLFxuICAgICAgfSwge1xuICAgICAgICB0eXBlOiAnc2VwYXJhdG9yJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcblxuICBub3JtYWxDb250ZXh0TWVudToge1xuICAgICdhdG9tLXRleHQtZWRpdG9yJzogW1xuICAgICAge1xuICAgICAgICBsYWJlbDogJ0dvdG8gRGVmaW5pdGlvbicsXG4gICAgICAgIGNvbW1hbmQ6ICdnb3RvLWRlZmluaXRpb246Z28nLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuXG4gIGFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICdnb3RvLWRlZmluaXRpb246Z28nLCB0aGlzLmdvLmJpbmQodGhpcykpKTtcbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdnb3RvLWRlZmluaXRpb24uY29udGV4dE1lbnVEaXNwbGF5QXRGaXJzdCcpKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29udGV4dE1lbnUuYWRkKHRoaXMuZmlyc3RDb250ZXh0TWVudSkpO1xuICAgICAgYXRvbS5jb250ZXh0TWVudS5pdGVtU2V0cy51bnNoaWZ0KGF0b20uY29udGV4dE1lbnUuaXRlbVNldHMucG9wKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29udGV4dE1lbnUuYWRkKHRoaXMubm9ybWFsQ29udGV4dE1lbnUpKTtcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdnb3RvLWRlZmluaXRpb24uZGlzYWJsZVNjb3BlTmFtZXMnLCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuZGlzYWJsZVNjb3BlTmFtZXMgPSBuZXcgU2V0KHZhbHVlKTtcbiAgICB9KSk7XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICB9LFxuXG4gIGdldFNlbGVjdGVkV29yZChlZGl0b3IsIHdvcmRSZWdleCkge1xuICAgIHJldHVybiAoZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpIHx8IGVkaXRvci5nZXRXb3JkVW5kZXJDdXJzb3Ioe1xuICAgICAgd29yZFJlZ2V4LFxuICAgICAgaW5jbHVkZU5vbldvcmRDaGFyYWN0ZXJzOiB0cnVlLFxuICAgIH0pKS5yZXBsYWNlKC9bLS9cXFxcXiQqKz8uKCl8W1xcXXt9XS9nLCAnXFxcXCQmJyk7XG4gIH0sXG5cbiAgZ2V0U2Nhbk9wdGlvbnMoZWRpdG9yKSB7XG4gICAgY29uc3QgZmlsZVBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpO1xuICAgIGlmICghZmlsZVBhdGgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1lc3NhZ2U6ICdUaGlzIGZpbGUgbXVzdCBiZSBzYXZlZCB0byBkaXNrIC4nLFxuICAgICAgfTtcbiAgICB9XG4gICAgY29uc3QgZmlsZUV4dGVuc2lvbiA9IGAqLiR7ZmlsZVBhdGguc3BsaXQoJy4nKS5wb3AoKX1gO1xuXG4gICAgY29uc3Qgc2NhbkdyYW1tYXJzID0gW107XG4gICAgbGV0IHNjYW5SZWdleGVzID0gW107XG4gICAgbGV0IHNjYW5GaWxlcyA9IFtdO1xuICAgIGxldCB3b3JkUmVnZXhlcyA9IFtdO1xuICAgIGNvbnN0IGdyYW1tYXJOYW1lcyA9IE9iamVjdC5rZXlzKENvbmZpZyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncmFtbWFyTmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGdyYW1tYXJOYW1lID0gZ3JhbW1hck5hbWVzW2ldO1xuICAgICAgY29uc3QgZ3JhbW1hck9wdGlvbiA9IENvbmZpZ1tncmFtbWFyTmFtZV07XG4gICAgICBpZiAoZ3JhbW1hck9wdGlvbi5maWxlcy5pbmNsdWRlcyhmaWxlRXh0ZW5zaW9uKSkge1xuICAgICAgICBpZiAoZ3JhbW1hck9wdGlvbi5kZXBlbmRlbmNpZXMpIHtcbiAgICAgICAgICBncmFtbWFyT3B0aW9uLmRlcGVuZGVuY2llcy5tYXAoeCA9PiBzY2FuR3JhbW1hcnMucHVzaCh4KSk7XG4gICAgICAgIH1cblxuICAgICAgICBzY2FuR3JhbW1hcnMucHVzaChncmFtbWFyTmFtZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2NhbkdyYW1tYXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBncmFtbWFyTmFtZSA9IHNjYW5HcmFtbWFyc1tpXTtcbiAgICAgIGNvbnN0IGdyYW1tYXJPcHRpb24gPSBDb25maWdbZ3JhbW1hck5hbWVdO1xuXG4gICAgICBzY2FuUmVnZXhlcy5wdXNoKC4uLmdyYW1tYXJPcHRpb24ucmVnZXhlcy5tYXAoeCA9PiB4LnNvdXJjZSkpO1xuICAgICAgc2NhbkZpbGVzLnB1c2goLi4uZ3JhbW1hck9wdGlvbi5maWxlcyk7XG4gICAgICB3b3JkUmVnZXhlcy5wdXNoKGdyYW1tYXJPcHRpb24ud29yZC5zb3VyY2UpO1xuICAgIH1cblxuICAgIGlmIChzY2FuUmVnZXhlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1lc3NhZ2U6ICdUaGlzIGxhbmd1YWdlIGlzIG5vdCBzdXBwb3J0ZWQgLiBQdWxsIFJlcXVlc3QgV2VsY29tZSDwn5GPLicsXG4gICAgICB9O1xuICAgIH1cblxuICAgIHdvcmRSZWdleGVzID0gd29yZFJlZ2V4ZXMuZmlsdGVyKChlLCBpLCBhKSA9PiBhLmxhc3RJbmRleE9mKGUpID09PSBpKS5qb2luKCd8Jyk7XG4gICAgY29uc3Qgd29yZCA9IHRoaXMuZ2V0U2VsZWN0ZWRXb3JkKGVkaXRvciwgbmV3IFJlZ0V4cCh3b3JkUmVnZXhlcywgJ2knKSk7XG4gICAgaWYgKCF3b3JkLnRyaW0oKS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1lc3NhZ2U6ICdVbmtub3duIGtleXdvcmQgLicsXG4gICAgICB9O1xuICAgIH1cblxuICAgIHNjYW5SZWdleGVzID0gc2NhblJlZ2V4ZXMuZmlsdGVyKChlLCBpLCBhKSA9PiBhLmxhc3RJbmRleE9mKGUpID09PSBpKTtcbiAgICBzY2FuRmlsZXMgPSBzY2FuRmlsZXMuZmlsdGVyKChlLCBpLCBhKSA9PiBhLmxhc3RJbmRleE9mKGUpID09PSBpKTtcblxuICAgIHJldHVybiB7XG4gICAgICByZWdleDogc2NhblJlZ2V4ZXMuam9pbignfCcpLnJlcGxhY2UoL3t3b3JkfS9nLCB3b3JkKSxcbiAgICAgIGZpbGVUeXBlczogc2NhbkZpbGVzLFxuICAgIH07XG4gIH0sXG5cbiAgZ2V0UHJvdmlkZXIoKSB7XG4gICAgY29uc3QgYXZhaWFibGVGaWxlRXh0ZW5zaW9ucyA9IG5ldyBTZXQoT2JqZWN0LmtleXMoQ29uZmlnKVxuICAgICAgLm1hcChrZXkgPT4gQ29uZmlnW2tleV0uZmlsZXMpXG4gICAgICAucmVkdWNlKChhLCBiKSA9PiBhLmNvbmNhdChiKSkpO1xuICAgIHJldHVybiB7XG4gICAgICBwcm92aWRlck5hbWU6ICdnb3RvLWRlZmluaXRpb24taHlwZXJjbGljaycsXG4gICAgICB3b3JkUmVnRXhwOiAvWyQwLTlhLXpBLVpfLV0rL2csXG4gICAgICBnZXRTdWdnZXN0aW9uRm9yV29yZDogKGVkaXRvciwgdGV4dCwgcmFuZ2UpID0+IHtcbiAgICAgICAgaWYgKCF0ZXh0KSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKCk7XG4gICAgICAgIGlmICghZmlsZVBhdGgpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmaWxlRXh0ZW5zaW9uID0gYCouJHtmaWxlUGF0aC5zcGxpdCgnLicpLnBvcCgpfWA7XG4gICAgICAgIGlmICghYXZhaWFibGVGaWxlRXh0ZW5zaW9ucy5oYXMoZmlsZUV4dGVuc2lvbikpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHsgc2NvcGVOYW1lIH0gPSBlZGl0b3IuZ2V0R3JhbW1hcigpO1xuICAgICAgICBpZiAodGhpcy5kaXNhYmxlU2NvcGVOYW1lcy5oYXMoc2NvcGVOYW1lKSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICByYW5nZSxcbiAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5nbyhlZGl0b3IpO1xuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG5cbiAgZ28oZWRpdG9yKSB7XG4gICAgY29uc3QgYWN0aXZlRWRpdG9yID0gKFxuICAgICAgZWRpdG9yICYmIGVkaXRvci5jb25zdHJ1Y3Rvci5uYW1lID09PSAnVGV4dEVkaXRvcidcbiAgICApID8gZWRpdG9yIDogYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuXG4gICAgY29uc3QgeyByZWdleCwgZmlsZVR5cGVzLCBtZXNzYWdlIH0gPSB0aGlzLmdldFNjYW5PcHRpb25zKGFjdGl2ZUVkaXRvcik7XG4gICAgaWYgKCFyZWdleCkge1xuICAgICAgcmV0dXJuIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKG1lc3NhZ2UpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmRlZmluaXRpb25zVmlldykge1xuICAgICAgdGhpcy5kZWZpbml0aW9uc1ZpZXcuY2FuY2VsKCk7XG4gICAgfVxuXG4gICAgdGhpcy5kZWZpbml0aW9uc1ZpZXcgPSBuZXcgRGVmaW5pdGlvbnNWaWV3KCk7XG4gICAgdGhpcy5zdGF0ZSA9ICdzdGFydGVkJztcblxuICAgIGNvbnN0IGl0ZXJhdG9yID0gKGl0ZW1zKSA9PiB7XG4gICAgICB0aGlzLnN0YXRlID0gJ3NlYXJjaGluZyc7XG4gICAgICB0aGlzLmRlZmluaXRpb25zVmlldy5hZGRJdGVtcyhpdGVtcyk7XG4gICAgfTtcblxuICAgIGNvbnN0IGNhbGxiYWNrID0gKCkgPT4ge1xuICAgICAgdGhpcy5zdGF0ZSA9ICdjb21wbGV0ZWQnO1xuICAgICAgaWYgKHRoaXMuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzLmRlZmluaXRpb25zVmlldy5zaG93KCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICB0aGlzLmRlZmluaXRpb25zVmlldy5jb25maXJtZWRGaXJzdCgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBzY2FuUGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKS5tYXAoeCA9PiB4LnBhdGgpO1xuXG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnZ290by1kZWZpbml0aW9uLnBlcmZvcm1hbmNlTW9kZScpKSB7XG4gICAgICBTZWFyY2hlci5yaXBncmVwU2NhbihhY3RpdmVFZGl0b3IsIHNjYW5QYXRocywgZmlsZVR5cGVzLCByZWdleCwgaXRlcmF0b3IsIGNhbGxiYWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgU2VhcmNoZXIuYXRvbVdvcmtzcGFjZVNjYW4oYWN0aXZlRWRpdG9yLCBzY2FuUGF0aHMsIGZpbGVUeXBlcywgcmVnZXgsIGl0ZXJhdG9yLCBjYWxsYmFjayk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9LFxufTtcbiJdfQ==