function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _atom = require('atom');

// eslint-disable-next-line no-unused-vars

var _jasmineFix = require('jasmine-fix');

var _libEditor = require('../lib/editor');

var _libEditor2 = _interopRequireDefault(_libEditor);

var _helpers = require('./helpers');

describe('Editor', function () {
  var editor = undefined;
  var message = undefined;
  var textEditor = undefined;

  (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
    message = (0, _helpers.getMessage)();
    message.range = [[2, 0], [2, 1]];
    message.filePath = __filename;
    yield atom.workspace.open(__filename);
    textEditor = atom.workspace.getActiveTextEditor();
    editor = new _libEditor2['default'](textEditor);
    atom.packages.loadPackage('linter-ui-default');
  }));
  (0, _jasmineFix.afterEach)(function () {
    editor.dispose();
    atom.workspace.destroyActivePaneItem();
  });

  describe('apply', function () {
    (0, _jasmineFix.it)('applies the messages to the editor', function () {
      expect(textEditor.getBuffer().getMarkerCount()).toBe(0);
      editor.apply([message], []);
      expect(textEditor.getBuffer().getMarkerCount()).toBe(1);
      editor.apply([], [message]);
      expect(textEditor.getBuffer().getMarkerCount()).toBe(0);
    });
    (0, _jasmineFix.it)('makes sure that the message is updated if text is manipulated', function () {
      expect(textEditor.getBuffer().getMarkerCount()).toBe(0);
      editor.apply([message], []);
      expect(textEditor.getBuffer().getMarkerCount()).toBe(1);
      expect(_atom.Range.fromObject(message.range)).toEqual({
        start: { row: 2, column: 0 },
        end: { row: 2, column: 1 }
      });
      textEditor.getBuffer().insert([2, 0], 'Hello');
      expect(_atom.Range.fromObject(message.range)).toEqual({
        start: { row: 2, column: 0 },
        end: { row: 2, column: 6 }
      });
      editor.apply([], [message]);
      expect(_atom.Range.fromObject(message.range)).toEqual({
        start: { row: 2, column: 0 },
        end: { row: 2, column: 6 }
      });
      expect(textEditor.getBuffer().getMarkerCount()).toBe(0);
    });
  });
  describe('Response to config', function () {
    (0, _jasmineFix.it)('responds to `gutterPosition`', function () {
      atom.config.set('linter-ui-default.gutterPosition', 'Left');
      expect(editor.gutter && editor.gutter.priority).toBe(-100);
      atom.config.set('linter-ui-default.gutterPosition', 'Right');
      expect(editor.gutter && editor.gutter.priority).toBe(100);
    });
    (0, _jasmineFix.it)('responds to `showDecorations`', function () {
      atom.config.set('linter-ui-default.showDecorations', false);
      expect(editor.gutter).toBe(null);
      atom.config.set('linter-ui-default.showDecorations', true);
      expect(editor.gutter).not.toBe(null);
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvc3BlYy9lZGl0b3Itc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O29CQUVzQixNQUFNOzs7OzBCQUV5QixhQUFhOzt5QkFDL0MsZUFBZTs7Ozt1QkFDUCxXQUFXOztBQUV0QyxRQUFRLENBQUMsUUFBUSxFQUFFLFlBQVc7QUFDNUIsTUFBSSxNQUFNLFlBQUEsQ0FBQTtBQUNWLE1BQUksT0FBTyxZQUFBLENBQUE7QUFDWCxNQUFJLFVBQVUsWUFBQSxDQUFBOztBQUVkLGdEQUFXLGFBQWlCO0FBQzFCLFdBQU8sR0FBRywwQkFBWSxDQUFBO0FBQ3RCLFdBQU8sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ2hDLFdBQU8sQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFBO0FBQzdCLFVBQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDckMsY0FBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQTtBQUNqRCxVQUFNLEdBQUcsMkJBQVcsVUFBVSxDQUFDLENBQUE7QUFDL0IsUUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtHQUMvQyxFQUFDLENBQUE7QUFDRiw2QkFBVSxZQUFXO0FBQ25CLFVBQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNoQixRQUFJLENBQUMsU0FBUyxDQUFDLHFCQUFxQixFQUFFLENBQUE7R0FDdkMsQ0FBQyxDQUFBOztBQUVGLFVBQVEsQ0FBQyxPQUFPLEVBQUUsWUFBVztBQUMzQix3QkFBRyxvQ0FBb0MsRUFBRSxZQUFXO0FBQ2xELFlBQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUMs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QUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtLQUMxRCxDQUFDLENBQUE7QUFDRix3QkFBRywrQkFBK0IsRUFBRSxZQUFXO0FBQzdDLFVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxFQUFFLEtBQUssQ0FBQyxDQUFBO0FBQzNELFlBQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ2hDLFVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQzFELFlBQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUNyQyxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL2hvbWUvdGhla2FybG85NS8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9zcGVjL2VkaXRvci1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgUmFuZ2UgfSBmcm9tICdhdG9tJ1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG5pbXBvcnQgeyBpdCwgZml0LCB3YWl0LCBiZWZvcmVFYWNoLCBhZnRlckVhY2ggfSBmcm9tICdqYXNtaW5lLWZpeCdcbmltcG9ydCBFZGl0b3IgZnJvbSAnLi4vbGliL2VkaXRvcidcbmltcG9ydCB7IGdldE1lc3NhZ2UgfSBmcm9tICcuL2hlbHBlcnMnXG5cbmRlc2NyaWJlKCdFZGl0b3InLCBmdW5jdGlvbigpIHtcbiAgbGV0IGVkaXRvclxuICBsZXQgbWVzc2FnZVxuICBsZXQgdGV4dEVkaXRvclxuXG4gIGJlZm9yZUVhY2goYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgbWVzc2FnZSA9IGdldE1lc3NhZ2UoKVxuICAgIG1lc3NhZ2UucmFuZ2UgPSBbWzIsIDBdLCBbMiwgMV1dXG4gICAgbWVzc2FnZS5maWxlUGF0aCA9IF9fZmlsZW5hbWVcbiAgICBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKF9fZmlsZW5hbWUpXG4gICAgdGV4dEVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGVkaXRvciA9IG5ldyBFZGl0b3IodGV4dEVkaXRvcilcbiAgICBhdG9tLnBhY2thZ2VzLmxvYWRQYWNrYWdlKCdsaW50ZXItdWktZGVmYXVsdCcpXG4gIH0pXG4gIGFmdGVyRWFjaChmdW5jdGlvbigpIHtcbiAgICBlZGl0b3IuZGlzcG9zZSgpXG4gICAgYXRvbS53b3Jrc3BhY2UuZGVzdHJveUFjdGl2ZVBhbmVJdGVtKClcbiAgfSlcblxuICBkZXNjcmliZSgnYXBwbHknLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnYXBwbGllcyB0aGUgbWVzc2FnZXMgdG8gdGhlIGVkaXRvcicsIGZ1bmN0aW9uKCkge1xuICAgICAgZXhwZWN0KHRleHRFZGl0b3IuZ2V0QnVmZmVyKCkuZ2V0TWFya2VyQ291bnQoKSkudG9CZSgwKVxuICAgICAgZWRpdG9yLmFwcGx5KFttZXNzYWdlXSwgW10pXG4gICAgICBleHBlY3QodGV4dEVkaXRvci5nZXRCdWZmZXIoKS5nZXRNYXJrZXJDb3VudCgpKS50b0JlKDEpXG4gICAgICBlZGl0b3IuYXBwbHkoW10sIFttZXNzYWdlXSlcbiAgICAgIGV4cGVjdCh0ZXh0RWRpdG9yLmdldEJ1ZmZlcigpLmdldE1hcmtlckNvdW50KCkpLnRvQmUoMClcbiAgICB9KVxuICAgIGl0KCdtYWtlcyBzdXJlIHRoYXQgdGhlIG1lc3NhZ2UgaXMgdXBkYXRlZCBpZiB0ZXh0IGlzIG1hbmlwdWxhdGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICBleHBlY3QodGV4dEVkaXRvci5nZXRCdWZmZXIoKS5nZXRNYXJrZXJDb3VudCgpKS50b0JlKDApXG4gICAgICBlZGl0b3IuYXBwbHkoW21lc3NhZ2VdLCBbXSlcbiAgICAgIGV4cGVjdCh0ZXh0RWRpdG9yLmdldEJ1ZmZlcigpLmdldE1hcmtlckNvdW50KCkpLnRvQmUoMSlcbiAgICAgIGV4cGVjdChSYW5nZS5mcm9tT2JqZWN0KG1lc3NhZ2UucmFuZ2UpKS50b0VxdWFsKHtcbiAgICAgICAgc3RhcnQ6IHsgcm93OiAyLCBjb2x1bW46IDAgfSxcbiAgICAgICAgZW5kOiB7IHJvdzogMiwgY29sdW1uOiAxIH0sXG4gICAgICB9KVxuICAgICAgdGV4dEVkaXRvci5nZXRCdWZmZXIoKS5pbnNlcnQoWzIsIDBdLCAnSGVsbG8nKVxuICAgICAgZXhwZWN0KFJhbmdlLmZyb21PYmplY3QobWVzc2FnZS5yYW5nZSkpLnRvRXF1YWwoe1xuICAgICAgICBzdGFydDogeyByb3c6IDIsIGNvbHVtbjogMCB9LFxuICAgICAgICBlbmQ6IHsgcm93OiAyLCBjb2x1bW46IDYgfSxcbiAgICAgIH0pXG4gICAgICBlZGl0b3IuYXBwbHkoW10sIFttZXNzYWdlXSlcbiAgICAgIGV4cGVjdChSYW5nZS5mcm9tT2JqZWN0KG1lc3NhZ2UucmFuZ2UpKS50b0VxdWFsKHtcbiAgICAgICAgc3RhcnQ6IHsgcm93OiAyLCBjb2x1bW46IDAgfSxcbiAgICAgICAgZW5kOiB7IHJvdzogMiwgY29sdW1uOiA2IH0sXG4gICAgICB9KVxuICAgICAgZXhwZWN0KHRleHRFZGl0b3IuZ2V0QnVmZmVyKCkuZ2V0TWFya2VyQ291bnQoKSkudG9CZSgwKVxuICAgIH0pXG4gIH0pXG4gIGRlc2NyaWJlKCdSZXNwb25zZSB0byBjb25maWcnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgncmVzcG9uZHMgdG8gYGd1dHRlclBvc2l0aW9uYCcsIGZ1bmN0aW9uKCkge1xuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItdWktZGVmYXVsdC5ndXR0ZXJQb3NpdGlvbicsICdMZWZ0JylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ3V0dGVyICYmIGVkaXRvci5ndXR0ZXIucHJpb3JpdHkpLnRvQmUoLTEwMClcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLXVpLWRlZmF1bHQuZ3V0dGVyUG9zaXRpb24nLCAnUmlnaHQnKVxuICAgICAgZXhwZWN0KGVkaXRvci5ndXR0ZXIgJiYgZWRpdG9yLmd1dHRlci5wcmlvcml0eSkudG9CZSgxMDApXG4gICAgfSlcbiAgICBpdCgncmVzcG9uZHMgdG8gYHNob3dEZWNvcmF0aW9uc2AnLCBmdW5jdGlvbigpIHtcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLXVpLWRlZmF1bHQuc2hvd0RlY29yYXRpb25zJywgZmFsc2UpXG4gICAgICBleHBlY3QoZWRpdG9yLmd1dHRlcikudG9CZShudWxsKVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItdWktZGVmYXVsdC5zaG93RGVjb3JhdGlvbnMnLCB0cnVlKVxuICAgICAgZXhwZWN0KGVkaXRvci5ndXR0ZXIpLm5vdC50b0JlKG51bGwpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=