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
      // Dispose of the notificaiton subscription
      notificationSub.dispose();
      resolve(notification);
    };
    // Subscribe to Atom's notifications
    notificationSub = atom.notifications.onDidAddNotification(newNotification);
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

// eslint-disable-next-line no-unused-vars

var _jasmineFix = require('jasmine-fix');

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _libMain = require('../lib/main');

var _libMain2 = _interopRequireDefault(_libMain);

'use babel';

var goodPath = path.join(__dirname, 'fixtures', 'good.js');
var bitwisePath = path.join(__dirname, 'fixtures', 'bitwise', 'bitwise.js');

describe('The JSHint provider for Linter', function () {
  var _linter$provideLinter = _libMain2['default'].provideLinter();

  var lint = _linter$provideLinter.lint;

  (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
    yield atom.packages.activatePackage('linter-jshint');
    yield atom.packages.activatePackage('language-javascript');
  }));

  (0, _jasmineFix.it)('should be in the packages list', function () {
    return expect(atom.packages.isPackageLoaded('linter-jshint')).toBe(true);
  });

  (0, _jasmineFix.it)('should be an active package', function () {
    return expect(atom.packages.isPackageActive('linter-jshint')).toBe(true);
  });

  describe('shows errors in a file with issues', function () {
    var editor = null;

    (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
      editor = yield atom.workspace.open(bitwisePath);
    }));

    (0, _jasmineFix.it)('verifies the first message', _asyncToGenerator(function* () {
      var expected = "W016 - Unexpected use of '&'.";

      var messages = yield lint(editor);
      expect(messages[0].severity).toBe('warning');
      expect(messages[0].excerpt).toBe(expected);
      expect(messages[0].location.file).toBe(bitwisePath);
      expect(messages[0].location.position).toEqual([[0, 10], [0, 13]]);
    }));
  });

  (0, _jasmineFix.it)('finds nothing wrong with an empty file', _asyncToGenerator(function* () {
    var emptyPath = path.join(__dirname, 'fixtures', 'empty.js');
    var editor = yield atom.workspace.open(emptyPath);
    var messages = yield lint(editor);
    expect(messages.length).toBe(0);
  }));

  (0, _jasmineFix.it)('finds nothing wrong with a valid file', _asyncToGenerator(function* () {
    var editor = yield atom.workspace.open(goodPath);
    var messages = yield lint(editor);
    expect(messages.length).toBe(0);
  }));

  describe('shows syntax errors', function () {
    var syntaxPath = path.join(__dirname, 'fixtures', 'syntax', 'badSyntax.js');
    var editor = null;

    (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
      editor = yield atom.workspace.open(syntaxPath);
    }));

    (0, _jasmineFix.it)('verifies the first message', _asyncToGenerator(function* () {
      var message = 'E006 - Unexpected early end of program.';
      var messages = yield lint(editor);
      expect(messages[0].severity).toBe('error');
      expect(messages[0].excerpt).toBe(message);
      expect(messages[0].location.file).toBe(syntaxPath);
      expect(messages[0].location.position).toEqual([[0, 10], [0, 11]]);
    }));
  });

  describe('handles .jshintignore files', function () {
    var checkMessage = function checkMessage(message, filePath) {
      var expected = "W098 - 'foo' is defined but never used.";

      expect(message.severity).toBe('warning');
      expect(message.excerpt).toBe(expected);
      expect(message.location.file).toBe(filePath);
      expect(message.location.position).toEqual([[0, 4], [0, 7]]);
    };

    (0, _jasmineFix.it)('works when in the same directory', _asyncToGenerator(function* () {
      var ignoreDir = path.join(__dirname, 'fixtures', 'ignore');
      var checkedPath = path.join(ignoreDir, 'checked.js');
      var ignoredPath = path.join(ignoreDir, 'ignored.js');
      var checkEditor = yield atom.workspace.open(checkedPath);
      var ignoreEditor = yield atom.workspace.open(ignoredPath);
      var checkMessages = yield lint(checkEditor);
      var ignoreMessages = yield lint(ignoreEditor);

      expect(checkMessages.length).toBe(1);
      checkMessage(checkMessages[0], checkedPath);

      expect(ignoreMessages.length).toBe(0);
    }));

    (0, _jasmineFix.it)('handles relative paths in .jshintignore', _asyncToGenerator(function* () {
      var ignoreDir = path.join(__dirname, 'fixtures', 'ignore-relative', 'js');
      var checkedPath = path.join(ignoreDir, 'checked.js');
      var ignoredPath = path.join(ignoreDir, 'ignored.js');
      var checkEditor = yield atom.workspace.open(checkedPath);
      var ignoreEditor = yield atom.workspace.open(ignoredPath);
      var checkMessages = yield lint(checkEditor);
      var ignoreMessages = yield lint(ignoreEditor);

      expect(checkMessages.length).toBe(1);
      checkMessage(checkMessages[0], checkedPath);

      expect(ignoreMessages.length).toBe(0);
    }));
  });

  describe('prints debugging information with the `debug` command', function () {
    var editor = undefined;
    var expectedMessage = 'linter-jshint:: Debugging information';
    (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
      editor = yield atom.workspace.open(goodPath);
    }));

    (0, _jasmineFix.it)('shows an info notification', _asyncToGenerator(function* () {
      atom.commands.dispatch(atom.views.getView(editor), 'linter-jshint:debug');
      var notification = yield getNotification(expectedMessage);

      expect(notification.getMessage()).toBe(expectedMessage);
      expect(notification.getType()).toEqual('info');
    }));

    (0, _jasmineFix.it)('includes debugging information in the details', _asyncToGenerator(function* () {
      atom.commands.dispatch(atom.views.getView(editor), 'linter-jshint:debug');
      var notification = yield getNotification(expectedMessage);
      var detail = notification.getDetail();

      expect(detail.includes('Atom version: ' + atom.getVersion())).toBe(true);
      expect(detail.includes('linter-jshint version:')).toBe(true);
      expect(detail.includes('Platform: ' + process.platform)).toBe(true);
      expect(detail.includes('linter-jshint configuration:')).toBe(true);
    }));
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvbGludGVyLWpzaGludC9zcGVjL2xpbnRlci1qc2hpbnQtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiSUFVZSxlQUFlLHFCQUE5QixXQUErQixlQUFlLEVBQUU7QUFDOUMsU0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBSztBQUM5QixRQUFJLGVBQWUsWUFBQSxDQUFDO0FBQ3BCLFFBQU0sZUFBZSxHQUFHLFNBQWxCLGVBQWUsQ0FBSSxZQUFZLEVBQUs7QUFDeEMsVUFBSSxZQUFZLENBQUMsVUFBVSxFQUFFLEtBQUssZUFBZSxFQUFFOzs7O0FBSWpELGVBQU87T0FDUjs7QUFFRCxxQkFBZSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzFCLGFBQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUN2QixDQUFDOztBQUVGLG1CQUFlLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxlQUFlLENBQUMsQ0FBQztHQUM1RSxDQUFDLENBQUM7Q0FDSjs7Ozs7Ozs7OzswQkF4Qm9ELGFBQWE7O29CQUM1QyxNQUFNOztJQUFoQixJQUFJOzt1QkFDRyxhQUFhOzs7O0FBTGhDLFdBQVcsQ0FBQzs7QUFPWixJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDN0QsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQzs7QUFxQjlFLFFBQVEsQ0FBQyxnQ0FBZ0MsRUFBRSxZQUFNOzhCQUM5QixxQkFBTyxhQUFhLEVBQUU7O01BQS9CLElBQUkseUJBQUosSUFBSTs7QUFFWixnREFBVyxhQUFZO0FBQ3JCLFVBQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDckQsVUFBTSxJ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Q0FBQyxDQUFDIiwiZmlsZSI6Ii9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvbGludGVyLWpzaGludC9zcGVjL2xpbnRlci1qc2hpbnQtc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbmltcG9ydCB7IGl0LCBmaXQsIHdhaXQsIGJlZm9yZUVhY2gsIGFmdGVyRWFjaCB9IGZyb20gJ2phc21pbmUtZml4JztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgbGludGVyIGZyb20gJy4uL2xpYi9tYWluJztcblxuY29uc3QgZ29vZFBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMnLCAnZ29vZC5qcycpO1xuY29uc3QgYml0d2lzZVBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMnLCAnYml0d2lzZScsICdiaXR3aXNlLmpzJyk7XG5cbmFzeW5jIGZ1bmN0aW9uIGdldE5vdGlmaWNhdGlvbihleHBlY3RlZE1lc3NhZ2UpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgbGV0IG5vdGlmaWNhdGlvblN1YjtcbiAgICBjb25zdCBuZXdOb3RpZmljYXRpb24gPSAobm90aWZpY2F0aW9uKSA9PiB7XG4gICAgICBpZiAobm90aWZpY2F0aW9uLmdldE1lc3NhZ2UoKSAhPT0gZXhwZWN0ZWRNZXNzYWdlKSB7XG4gICAgICAgIC8vIEFzIHRoZSBzcGVjcyBleGVjdXRlIGFzeW5jaHJvbm91c2x5LCBpdCdzIHBvc3NpYmxlIGEgbm90aWZpY2F0aW9uXG4gICAgICAgIC8vIGZyb20gYSBkaWZmZXJlbnQgc3BlYyB3YXMgZ3JhYmJlZCwgaWYgdGhlIG1lc3NhZ2UgZG9lc24ndCBtYXRjaCB3aGF0XG4gICAgICAgIC8vIGlzIGV4cGVjdGVkIHNpbXBseSByZXR1cm4gYW5kIGtlZXAgd2FpdGluZyBmb3IgdGhlIG5leHQgbWVzc2FnZS5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gRGlzcG9zZSBvZiB0aGUgbm90aWZpY2FpdG9uIHN1YnNjcmlwdGlvblxuICAgICAgbm90aWZpY2F0aW9uU3ViLmRpc3Bvc2UoKTtcbiAgICAgIHJlc29sdmUobm90aWZpY2F0aW9uKTtcbiAgICB9O1xuICAgIC8vIFN1YnNjcmliZSB0byBBdG9tJ3Mgbm90aWZpY2F0aW9uc1xuICAgIG5vdGlmaWNhdGlvblN1YiA9IGF0b20ubm90aWZpY2F0aW9ucy5vbkRpZEFkZE5vdGlmaWNhdGlvbihuZXdOb3RpZmljYXRpb24pO1xuICB9KTtcbn1cblxuZGVzY3JpYmUoJ1RoZSBKU0hpbnQgcHJvdmlkZXIgZm9yIExpbnRlcicsICgpID0+IHtcbiAgY29uc3QgeyBsaW50IH0gPSBsaW50ZXIucHJvdmlkZUxpbnRlcigpO1xuXG4gIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdsaW50ZXItanNoaW50Jyk7XG4gICAgYXdhaXQgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xhbmd1YWdlLWphdmFzY3JpcHQnKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBiZSBpbiB0aGUgcGFja2FnZXMgbGlzdCcsICgpID0+XG4gICAgZXhwZWN0KGF0b20ucGFja2FnZXMuaXNQYWNrYWdlTG9hZGVkKCdsaW50ZXItanNoaW50JykpLnRvQmUodHJ1ZSkpO1xuXG4gIGl0KCdzaG91bGQgYmUgYW4gYWN0aXZlIHBhY2thZ2UnLCAoKSA9PlxuICAgIGV4cGVjdChhdG9tLnBhY2thZ2VzLmlzUGFja2FnZUFjdGl2ZSgnbGludGVyLWpzaGludCcpKS50b0JlKHRydWUpKTtcblxuICBkZXNjcmliZSgnc2hvd3MgZXJyb3JzIGluIGEgZmlsZSB3aXRoIGlzc3VlcycsICgpID0+IHtcbiAgICBsZXQgZWRpdG9yID0gbnVsbDtcblxuICAgIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgZWRpdG9yID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihiaXR3aXNlUGF0aCk7XG4gICAgfSk7XG5cbiAgICBpdCgndmVyaWZpZXMgdGhlIGZpcnN0IG1lc3NhZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBleHBlY3RlZCA9IFwiVzAxNiAtIFVuZXhwZWN0ZWQgdXNlIG9mICcmJy5cIjtcblxuICAgICAgY29uc3QgbWVzc2FnZXMgPSBhd2FpdCBsaW50KGVkaXRvcik7XG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0uc2V2ZXJpdHkpLnRvQmUoJ3dhcm5pbmcnKTtcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5leGNlcnB0KS50b0JlKGV4cGVjdGVkKTtcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5sb2NhdGlvbi5maWxlKS50b0JlKGJpdHdpc2VQYXRoKTtcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5sb2NhdGlvbi5wb3NpdGlvbikudG9FcXVhbChbWzAsIDEwXSwgWzAsIDEzXV0pO1xuICAgIH0pO1xuICB9KTtcblxuICBpdCgnZmluZHMgbm90aGluZyB3cm9uZyB3aXRoIGFuIGVtcHR5IGZpbGUnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgZW1wdHlQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJywgJ2VtcHR5LmpzJyk7XG4gICAgY29uc3QgZWRpdG9yID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihlbXB0eVBhdGgpO1xuICAgIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgbGludChlZGl0b3IpO1xuICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmUoMCk7XG4gIH0pO1xuXG4gIGl0KCdmaW5kcyBub3RoaW5nIHdyb25nIHdpdGggYSB2YWxpZCBmaWxlJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGVkaXRvciA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oZ29vZFBhdGgpO1xuICAgIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgbGludChlZGl0b3IpO1xuICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmUoMCk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdzaG93cyBzeW50YXggZXJyb3JzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN5bnRheFBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMnLCAnc3ludGF4JywgJ2JhZFN5bnRheC5qcycpO1xuICAgIGxldCBlZGl0b3IgPSBudWxsO1xuXG4gICAgYmVmb3JlRWFjaChhc3luYyAoKSA9PiB7XG4gICAgICBlZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKHN5bnRheFBhdGgpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3ZlcmlmaWVzIHRoZSBmaXJzdCBtZXNzYWdlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgbWVzc2FnZSA9ICdFMDA2IC0gVW5leHBlY3RlZCBlYXJseSBlbmQgb2YgcHJvZ3JhbS4nO1xuICAgICAgY29uc3QgbWVzc2FnZXMgPSBhd2FpdCBsaW50KGVkaXRvcik7XG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0uc2V2ZXJpdHkpLnRvQmUoJ2Vycm9yJyk7XG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0uZXhjZXJwdCkudG9CZShtZXNzYWdlKTtcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5sb2NhdGlvbi5maWxlKS50b0JlKHN5bnRheFBhdGgpO1xuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmxvY2F0aW9uLnBvc2l0aW9uKS50b0VxdWFsKFtbMCwgMTBdLCBbMCwgMTFdXSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdoYW5kbGVzIC5qc2hpbnRpZ25vcmUgZmlsZXMnLCAoKSA9PiB7XG4gICAgY29uc3QgY2hlY2tNZXNzYWdlID0gKG1lc3NhZ2UsIGZpbGVQYXRoKSA9PiB7XG4gICAgICBjb25zdCBleHBlY3RlZCA9IFwiVzA5OCAtICdmb28nIGlzIGRlZmluZWQgYnV0IG5ldmVyIHVzZWQuXCI7XG5cbiAgICAgIGV4cGVjdChtZXNzYWdlLnNldmVyaXR5KS50b0JlKCd3YXJuaW5nJyk7XG4gICAgICBleHBlY3QobWVzc2FnZS5leGNlcnB0KS50b0JlKGV4cGVjdGVkKTtcbiAgICAgIGV4cGVjdChtZXNzYWdlLmxvY2F0aW9uLmZpbGUpLnRvQmUoZmlsZVBhdGgpO1xuICAgICAgZXhwZWN0KG1lc3NhZ2UubG9jYXRpb24ucG9zaXRpb24pLnRvRXF1YWwoW1swLCA0XSwgWzAsIDddXSk7XG4gICAgfTtcblxuICAgIGl0KCd3b3JrcyB3aGVuIGluIHRoZSBzYW1lIGRpcmVjdG9yeScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGlnbm9yZURpciA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycsICdpZ25vcmUnKTtcbiAgICAgIGNvbnN0IGNoZWNrZWRQYXRoID0gcGF0aC5qb2luKGlnbm9yZURpciwgJ2NoZWNrZWQuanMnKTtcbiAgICAgIGNvbnN0IGlnbm9yZWRQYXRoID0gcGF0aC5qb2luKGlnbm9yZURpciwgJ2lnbm9yZWQuanMnKTtcbiAgICAgIGNvbnN0IGNoZWNrRWRpdG9yID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihjaGVja2VkUGF0aCk7XG4gICAgICBjb25zdCBpZ25vcmVFZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKGlnbm9yZWRQYXRoKTtcbiAgICAgIGNvbnN0IGNoZWNrTWVzc2FnZXMgPSBhd2FpdCBsaW50KGNoZWNrRWRpdG9yKTtcbiAgICAgIGNvbnN0IGlnbm9yZU1lc3NhZ2VzID0gYXdhaXQgbGludChpZ25vcmVFZGl0b3IpO1xuXG4gICAgICBleHBlY3QoY2hlY2tNZXNzYWdlcy5sZW5ndGgpLnRvQmUoMSk7XG4gICAgICBjaGVja01lc3NhZ2UoY2hlY2tNZXNzYWdlc1swXSwgY2hlY2tlZFBhdGgpO1xuXG4gICAgICBleHBlY3QoaWdub3JlTWVzc2FnZXMubGVuZ3RoKS50b0JlKDApO1xuICAgIH0pO1xuXG4gICAgaXQoJ2hhbmRsZXMgcmVsYXRpdmUgcGF0aHMgaW4gLmpzaGludGlnbm9yZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGlnbm9yZURpciA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycsICdpZ25vcmUtcmVsYXRpdmUnLCAnanMnKTtcbiAgICAgIGNvbnN0IGNoZWNrZWRQYXRoID0gcGF0aC5qb2luKGlnbm9yZURpciwgJ2NoZWNrZWQuanMnKTtcbiAgICAgIGNvbnN0IGlnbm9yZWRQYXRoID0gcGF0aC5qb2luKGlnbm9yZURpciwgJ2lnbm9yZWQuanMnKTtcbiAgICAgIGNvbnN0IGNoZWNrRWRpdG9yID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihjaGVja2VkUGF0aCk7XG4gICAgICBjb25zdCBpZ25vcmVFZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKGlnbm9yZWRQYXRoKTtcbiAgICAgIGNvbnN0IGNoZWNrTWVzc2FnZXMgPSBhd2FpdCBsaW50KGNoZWNrRWRpdG9yKTtcbiAgICAgIGNvbnN0IGlnbm9yZU1lc3NhZ2VzID0gYXdhaXQgbGludChpZ25vcmVFZGl0b3IpO1xuXG4gICAgICBleHBlY3QoY2hlY2tNZXNzYWdlcy5sZW5ndGgpLnRvQmUoMSk7XG4gICAgICBjaGVja01lc3NhZ2UoY2hlY2tNZXNzYWdlc1swXSwgY2hlY2tlZFBhdGgpO1xuXG4gICAgICBleHBlY3QoaWdub3JlTWVzc2FnZXMubGVuZ3RoKS50b0JlKDApO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgncHJpbnRzIGRlYnVnZ2luZyBpbmZvcm1hdGlvbiB3aXRoIHRoZSBgZGVidWdgIGNvbW1hbmQnLCAoKSA9PiB7XG4gICAgbGV0IGVkaXRvcjtcbiAgICBjb25zdCBleHBlY3RlZE1lc3NhZ2UgPSAnbGludGVyLWpzaGludDo6IERlYnVnZ2luZyBpbmZvcm1hdGlvbic7XG4gICAgYmVmb3JlRWFjaChhc3luYyAoKSA9PiB7XG4gICAgICBlZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKGdvb2RQYXRoKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG93cyBhbiBpbmZvIG5vdGlmaWNhdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvciksICdsaW50ZXItanNoaW50OmRlYnVnJyk7XG4gICAgICBjb25zdCBub3RpZmljYXRpb24gPSBhd2FpdCBnZXROb3RpZmljYXRpb24oZXhwZWN0ZWRNZXNzYWdlKTtcblxuICAgICAgZXhwZWN0KG5vdGlmaWNhdGlvbi5nZXRNZXNzYWdlKCkpLnRvQmUoZXhwZWN0ZWRNZXNzYWdlKTtcbiAgICAgIGV4cGVjdChub3RpZmljYXRpb24uZ2V0VHlwZSgpKS50b0VxdWFsKCdpbmZvJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnaW5jbHVkZXMgZGVidWdnaW5nIGluZm9ybWF0aW9uIGluIHRoZSBkZXRhaWxzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKSwgJ2xpbnRlci1qc2hpbnQ6ZGVidWcnKTtcbiAgICAgIGNvbnN0IG5vdGlmaWNhdGlvbiA9IGF3YWl0IGdldE5vdGlmaWNhdGlvbihleHBlY3RlZE1lc3NhZ2UpO1xuICAgICAgY29uc3QgZGV0YWlsID0gbm90aWZpY2F0aW9uLmdldERldGFpbCgpO1xuXG4gICAgICBleHBlY3QoZGV0YWlsLmluY2x1ZGVzKGBBdG9tIHZlcnNpb246ICR7YXRvbS5nZXRWZXJzaW9uKCl9YCkpLnRvQmUodHJ1ZSk7XG4gICAgICBleHBlY3QoZGV0YWlsLmluY2x1ZGVzKCdsaW50ZXItanNoaW50IHZlcnNpb246JykpLnRvQmUodHJ1ZSk7XG4gICAgICBleHBlY3QoZGV0YWlsLmluY2x1ZGVzKGBQbGF0Zm9ybTogJHtwcm9jZXNzLnBsYXRmb3JtfWApKS50b0JlKHRydWUpO1xuICAgICAgZXhwZWN0KGRldGFpbC5pbmNsdWRlcygnbGludGVyLWpzaGludCBjb25maWd1cmF0aW9uOicpKS50b0JlKHRydWUpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19