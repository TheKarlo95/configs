Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var Searcher = (function () {
  function Searcher() {
    _classCallCheck(this, Searcher);
  }

  _createClass(Searcher, null, [{
    key: 'transformUnsavedMatch',
    value: function transformUnsavedMatch(match) {
      var allLines = match.match.input.split(/\r\n|\r|\n/);
      var lines = match.match.input.substring(0, match.match.index + 1).split(/\r\n|\r|\n/);
      var lineNumber = lines.length - 1;

      return {
        text: allLines[lineNumber],
        line: lineNumber,
        column: lines.pop().length
      };
    }
  }, {
    key: 'filterMatch',
    value: function filterMatch(match) {
      return match !== null && match.text.trim().length < 350;
    }
  }, {
    key: 'fixColumn',
    value: function fixColumn(match) {
      if (match.column === 1 && /^\s/.test(match.text) === false) {
        // ripgrep's bug
        match.column = 0;
      }

      var emptyChars = '';

      var matches = /^[\s.]/.exec(match.text.substring(match.column));
      if (matches) emptyChars = matches[0];

      return {
        text: match.text,
        fileName: match.fileName,
        line: match.line,
        column: match.column + emptyChars.length
      };
    }
  }, {
    key: 'atomBufferScan',
    value: function atomBufferScan(activeEditor, fileTypes, regex, iterator, callback) {
      // atomBufferScan just search opened files
      var editors = atom.workspace.getTextEditors().filter(function (x) {
        return !Object.is(activeEditor, x);
      });
      editors.unshift(activeEditor);
      callback(editors.map(function (editor) {
        var filePath = editor.getPath();
        if (filePath) {
          var fileExtension = '*.' + filePath.split('.').pop();
          if (fileTypes.includes(fileExtension)) {
            editor.scan(new RegExp(regex, 'ig'), function (match) {
              var item = Searcher.transformUnsavedMatch(match);
              item.fileName = filePath;
              iterator([Searcher.fixColumn(item)].filter(Searcher.filterMatch));
            });
          }
          return filePath;
        }
        return null;
      }).filter(function (x) {
        return x !== null;
      }));
    }
  }, {
    key: 'atomWorkspaceScan',
    value: function atomWorkspaceScan(activeEditor, scanPaths, fileTypes, regex, iterator, callback) {
      this.atomBufferScan(activeEditor, fileTypes, regex, iterator, function (openedFiles) {
        atom.workspace.scan(new RegExp(regex, 'ig'), { paths: fileTypes }, function (result) {
          if (openedFiles.includes(result.filePath)) {
            return null; // atom.workspace.scan can't set exclusions
          }
          iterator(result.matches.map(function (match) {
            return {
              text: match.lineText,
              fileName: result.filePath,
              line: match.range[0][0],
              column: match.range[0][1]
            };
          }).filter(Searcher.filterMatch).map(Searcher.fixColumn));
          return null;
        }).then(callback);
      });
    }
  }, {
    key: 'ripgrepScan',
    value: function ripgrepScan(activeEditor, scanPaths, fileTypes, regex, iterator, callback) {
      this.atomBufferScan(activeEditor, fileTypes, regex, iterator, function (openedFiles) {
        var args = fileTypes.map(function (x) {
          return '--glob=' + x;
        });
        args.push.apply(args, _toConsumableArray(openedFiles.map(function (x) {
          return '--glob=!' + x;
        })));
        args.push.apply(args, ['--line-number', '--column', '--no-ignore-vcs', '--ignore-case', regex]);
        args.push.apply(args, _toConsumableArray(scanPaths));

        var runRipgrep = _child_process2['default'].spawn('rg', args);

        runRipgrep.stdout.setEncoding('utf8');
        runRipgrep.stderr.setEncoding('utf8');

        runRipgrep.stdout.on('data', function (results) {
          iterator(results.split('\n').map(function (result) {
            if (result.trim().length) {
              var data = result.split(':');
              // Windows filepath will become ['C','Windows/blah'], so this fixes it.
              if (data[0].length === 1) {
                var driveLetter = data.shift();
                var path = data.shift();
                data.unshift(driveLetter + ':' + path);
              }
              return {
                text: result.substring([data[0], data[1], data[2]].join(':').length + 1),
                fileName: data[0],
                line: Number(data[1] - 1),
                column: Number(data[2])
              };
            }
            return null;
          }).filter(Searcher.filterMatch).map(Searcher.fixColumn));
        });

        runRipgrep.stderr.on('data', function (message) {
          if (message.includes('No files were searched')) {
            return null;
          }
          throw message;
        });

        runRipgrep.on('close', callback);

        runRipgrep.on('error', function (error) {
          if (error.code === 'ENOENT') {
            atom.notifications.addWarning('Plase install `ripgrep` first.');
          } else {
            throw error;
          }
        });

        setTimeout(runRipgrep.kill.bind(runRipgrep), 10 * 1000);
      });
    }
  }]);

  return Searcher;
})();

exports['default'] = Searcher;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvZ290by1kZWZpbml0aW9uL2xpYi9zZWFyY2hlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs2QkFFeUIsZUFBZTs7OztJQUVuQixRQUFRO1dBQVIsUUFBUTswQkFBUixRQUFROzs7ZUFBUixRQUFROztXQUVDLCtCQUFDLEtBQUssRUFBRTtBQUNsQyxVQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDdkQsVUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDeEYsVUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7O0FBRXBDLGFBQU87QUFDTCxZQUFJLEVBQUUsUUFBUSxDQUFDLFVBQVUsQ0FBQztBQUMxQixZQUFJLEVBQUUsVUFBVTtBQUNoQixjQUFNLEVBQUUsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU07T0FDM0IsQ0FBQztLQUNIOzs7V0FFaUIscUJBQUMsS0FBSyxFQUFFO0FBQ3hCLGFBQVEsS0FBSyxLQUFLLElBQUksSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUU7S0FDM0Q7OztXQUVlLG1CQUFDLEtBQUssRUFBRTtBQUN0QixVQUFJLEFBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxBQUFDLEVBQUU7O0FBQzlELGFBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO09BQ2xCOztBQUVE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LENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7U0FDMUQsQ0FBQyxDQUFDOztBQUVILGtCQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBQyxPQUFPLEVBQUs7QUFDeEMsY0FBSSxPQUFPLENBQUMsUUFBUSxDQUFDLHdCQUF3QixDQUFDLEVBQUU7QUFDOUMsbUJBQU8sSUFBSSxDQUFDO1dBQ2I7QUFDRCxnQkFBTSxPQUFPLENBQUM7U0FDZixDQUFDLENBQUM7O0FBRUgsa0JBQVUsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDOztBQUVqQyxrQkFBVSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDaEMsY0FBSSxLQUFLLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtBQUMzQixnQkFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztXQUNqRSxNQUFNO0FBQ0wsa0JBQU0sS0FBSyxDQUFDO1dBQ2I7U0FDRixDQUFDLENBQUM7O0FBRUgsa0JBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7T0FDekQsQ0FBQyxDQUFDO0tBQ0o7OztTQWpJa0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiL2hvbWUvdGhla2FybG85NS8uYXRvbS9wYWNrYWdlcy9nb3RvLWRlZmluaXRpb24vbGliL3NlYXJjaGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgQ2hpbGRQcm9jZXNzIGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWFyY2hlciB7XG5cbiAgc3RhdGljIHRyYW5zZm9ybVVuc2F2ZWRNYXRjaChtYXRjaCkge1xuICAgIGNvbnN0IGFsbExpbmVzID0gbWF0Y2gubWF0Y2guaW5wdXQuc3BsaXQoL1xcclxcbnxcXHJ8XFxuLyk7XG4gICAgY29uc3QgbGluZXMgPSBtYXRjaC5tYXRjaC5pbnB1dC5zdWJzdHJpbmcoMCwgbWF0Y2gubWF0Y2guaW5kZXggKyAxKS5zcGxpdCgvXFxyXFxufFxccnxcXG4vKTtcbiAgICBjb25zdCBsaW5lTnVtYmVyID0gbGluZXMubGVuZ3RoIC0gMTtcblxuICAgIHJldHVybiB7XG4gICAgICB0ZXh0OiBhbGxMaW5lc1tsaW5lTnVtYmVyXSxcbiAgICAgIGxpbmU6IGxpbmVOdW1iZXIsXG4gICAgICBjb2x1bW46IGxpbmVzLnBvcCgpLmxlbmd0aCxcbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGZpbHRlck1hdGNoKG1hdGNoKSB7XG4gICAgcmV0dXJuIChtYXRjaCAhPT0gbnVsbCAmJiBtYXRjaC50ZXh0LnRyaW0oKS5sZW5ndGggPCAzNTApO1xuICB9XG5cbiAgc3RhdGljIGZpeENvbHVtbihtYXRjaCkge1xuICAgIGlmICgobWF0Y2guY29sdW1uID09PSAxKSAmJiAoL15cXHMvLnRlc3QobWF0Y2gudGV4dCkgPT09IGZhbHNlKSkgeyAvLyByaXBncmVwJ3MgYnVnXG4gICAgICBtYXRjaC5jb2x1bW4gPSAwO1xuICAgIH1cblxuICAgIGxldCBlbXB0eUNoYXJzID0gJyc7XG5cbiAgICBjb25zdCBtYXRjaGVzID0gL15bXFxzLl0vLmV4ZWMobWF0Y2gudGV4dC5zdWJzdHJpbmcobWF0Y2guY29sdW1uKSk7XG4gICAgaWYgKG1hdGNoZXMpIGVtcHR5Q2hhcnMgPSBtYXRjaGVzWzBdO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRleHQ6IG1hdGNoLnRleHQsXG4gICAgICBmaWxlTmFtZTogbWF0Y2guZmlsZU5hbWUsXG4gICAgICBsaW5lOiBtYXRjaC5saW5lLFxuICAgICAgY29sdW1uOiBtYXRjaC5jb2x1bW4gKyBlbXB0eUNoYXJzLmxlbmd0aCxcbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGF0b21CdWZmZXJTY2FuKGFjdGl2ZUVkaXRvciwgZmlsZVR5cGVzLCByZWdleCwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgLy8gYXRvbUJ1ZmZlclNjYW4ganVzdCBzZWFyY2ggb3BlbmVkIGZpbGVzXG4gICAgY29uc3QgZWRpdG9ycyA9IGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCkuZmlsdGVyKHggPT4gIU9iamVjdC5pcyhhY3RpdmVFZGl0b3IsIHgpKTtcbiAgICBlZGl0b3JzLnVuc2hpZnQoYWN0aXZlRWRpdG9yKTtcbiAgICBjYWxsYmFjayhlZGl0b3JzLm1hcCgoZWRpdG9yKSA9PiB7XG4gICAgICBjb25zdCBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKCk7XG4gICAgICBpZiAoZmlsZVBhdGgpIHtcbiAgICAgICAgY29uc3QgZmlsZUV4dGVuc2lvbiA9IGAqLiR7ZmlsZVBhdGguc3BsaXQoJy4nKS5wb3AoKX1gO1xuICAgICAgICBpZiAoZmlsZVR5cGVzLmluY2x1ZGVzKGZpbGVFeHRlbnNpb24pKSB7XG4gICAgICAgICAgZWRpdG9yLnNjYW4obmV3IFJlZ0V4cChyZWdleCwgJ2lnJyksIChtYXRjaCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaXRlbSA9IFNlYXJjaGVyLnRyYW5zZm9ybVVuc2F2ZWRNYXRjaChtYXRjaCk7XG4gICAgICAgICAgICBpdGVtLmZpbGVOYW1lID0gZmlsZVBhdGg7XG4gICAgICAgICAgICBpdGVyYXRvcihbU2VhcmNoZXIuZml4Q29sdW1uKGl0ZW0pXS5maWx0ZXIoU2VhcmNoZXIuZmlsdGVyTWF0Y2gpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmlsZVBhdGg7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KS5maWx0ZXIoeCA9PiB4ICE9PSBudWxsKSk7XG4gIH1cblxuICBzdGF0aWMgYXRvbVdvcmtzcGFjZVNjYW4oYWN0aXZlRWRpdG9yLCBzY2FuUGF0aHMsIGZpbGVUeXBlcywgcmVnZXgsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgIHRoaXMuYXRvbUJ1ZmZlclNjYW4oYWN0aXZlRWRpdG9yLCBmaWxlVHlwZXMsIHJlZ2V4LCBpdGVyYXRvciwgKG9wZW5lZEZpbGVzKSA9PiB7XG4gICAgICBhdG9tLndvcmtzcGFjZS5zY2FuKG5ldyBSZWdFeHAocmVnZXgsICdpZycpLCB7IHBhdGhzOiBmaWxlVHlwZXMgfSwgKHJlc3VsdCkgPT4ge1xuICAgICAgICBpZiAob3BlbmVkRmlsZXMuaW5jbHVkZXMocmVzdWx0LmZpbGVQYXRoKSkge1xuICAgICAgICAgIHJldHVybiBudWxsOyAvLyBhdG9tLndvcmtzcGFjZS5zY2FuIGNhbid0IHNldCBleGNsdXNpb25zXG4gICAgICAgIH1cbiAgICAgICAgaXRlcmF0b3IocmVzdWx0Lm1hdGNoZXMubWFwKG1hdGNoID0+ICh7XG4gICAgICAgICAgdGV4dDogbWF0Y2gubGluZVRleHQsXG4gICAgICAgICAgZmlsZU5hbWU6IHJlc3VsdC5maWxlUGF0aCxcbiAgICAgICAgICBsaW5lOiBtYXRjaC5yYW5nZVswXVswXSxcbiAgICAgICAgICBjb2x1bW46IG1hdGNoLnJhbmdlWzBdWzFdLFxuICAgICAgICB9KSkuZmlsdGVyKFNlYXJjaGVyLmZpbHRlck1hdGNoKS5tYXAoU2VhcmNoZXIuZml4Q29sdW1uKSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSkudGhlbihjYWxsYmFjayk7XG4gICAgfSk7XG4gIH1cblxuXG4gIHN0YXRpYyByaXBncmVwU2NhbihhY3RpdmVFZGl0b3IsIHNjYW5QYXRocywgZmlsZVR5cGVzLCByZWdleCwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5hdG9tQnVmZmVyU2NhbihhY3RpdmVFZGl0b3IsIGZpbGVUeXBlcywgcmVnZXgsIGl0ZXJhdG9yLCAob3BlbmVkRmlsZXMpID0+IHtcbiAgICAgIGNvbnN0IGFyZ3MgPSBmaWxlVHlwZXMubWFwKHggPT4gYC0tZ2xvYj0ke3h9YCk7XG4gICAgICBhcmdzLnB1c2goLi4ub3BlbmVkRmlsZXMubWFwKHggPT4gYC0tZ2xvYj0hJHt4fWApKTtcbiAgICAgIGFyZ3MucHVzaCguLi5bXG4gICAgICAgICctLWxpbmUtbnVtYmVyJywgJy0tY29sdW1uJywgJy0tbm8taWdub3JlLXZjcycsICctLWlnbm9yZS1jYXNlJywgcmVnZXgsXG4gICAgICBdKTtcbiAgICAgIGFyZ3MucHVzaCguLi5zY2FuUGF0aHMpO1xuXG4gICAgICBjb25zdCBydW5SaXBncmVwID0gQ2hpbGRQcm9jZXNzLnNwYXduKCdyZycsIGFyZ3MpO1xuXG4gICAgICBydW5SaXBncmVwLnN0ZG91dC5zZXRFbmNvZGluZygndXRmOCcpO1xuICAgICAgcnVuUmlwZ3JlcC5zdGRlcnIuc2V0RW5jb2RpbmcoJ3V0ZjgnKTtcblxuICAgICAgcnVuUmlwZ3JlcC5zdGRvdXQub24oJ2RhdGEnLCAocmVzdWx0cykgPT4ge1xuICAgICAgICBpdGVyYXRvcihyZXN1bHRzLnNwbGl0KCdcXG4nKS5tYXAoKHJlc3VsdCkgPT4ge1xuICAgICAgICAgIGlmIChyZXN1bHQudHJpbSgpLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHJlc3VsdC5zcGxpdCgnOicpO1xuICAgICAgICAgICAgLy8gV2luZG93cyBmaWxlcGF0aCB3aWxsIGJlY29tZSBbJ0MnLCdXaW5kb3dzL2JsYWgnXSwgc28gdGhpcyBmaXhlcyBpdC5cbiAgICAgICAgICAgIGlmIChkYXRhWzBdLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICBjb25zdCBkcml2ZUxldHRlciA9IGRhdGEuc2hpZnQoKTtcbiAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IGRhdGEuc2hpZnQoKTtcbiAgICAgICAgICAgICAgZGF0YS51bnNoaWZ0KGAke2RyaXZlTGV0dGVyfToke3BhdGh9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB0ZXh0OiByZXN1bHQuc3Vic3RyaW5nKFtkYXRhWzBdLCBkYXRhWzFdLCBkYXRhWzJdXS5qb2luKCc6JykubGVuZ3RoICsgMSksXG4gICAgICAgICAgICAgIGZpbGVOYW1lOiBkYXRhWzBdLFxuICAgICAgICAgICAgICBsaW5lOiBOdW1iZXIoZGF0YVsxXSAtIDEpLFxuICAgICAgICAgICAgICBjb2x1bW46IE51bWJlcihkYXRhWzJdKSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9KS5maWx0ZXIoU2VhcmNoZXIuZmlsdGVyTWF0Y2gpLm1hcChTZWFyY2hlci5maXhDb2x1bW4pKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5SaXBncmVwLnN0ZGVyci5vbignZGF0YScsIChtZXNzYWdlKSA9PiB7XG4gICAgICAgIGlmIChtZXNzYWdlLmluY2x1ZGVzKCdObyBmaWxlcyB3ZXJlIHNlYXJjaGVkJykpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBtZXNzYWdlO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1blJpcGdyZXAub24oJ2Nsb3NlJywgY2FsbGJhY2spO1xuXG4gICAgICBydW5SaXBncmVwLm9uKCdlcnJvcicsIChlcnJvcikgPT4ge1xuICAgICAgICBpZiAoZXJyb3IuY29kZSA9PT0gJ0VOT0VOVCcpIHtcbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZygnUGxhc2UgaW5zdGFsbCBgcmlwZ3JlcGAgZmlyc3QuJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBzZXRUaW1lb3V0KHJ1blJpcGdyZXAua2lsbC5iaW5kKHJ1blJpcGdyZXApLCAxMCAqIDEwMDApO1xuICAgIH0pO1xuICB9XG5cbn1cbiJdfQ==