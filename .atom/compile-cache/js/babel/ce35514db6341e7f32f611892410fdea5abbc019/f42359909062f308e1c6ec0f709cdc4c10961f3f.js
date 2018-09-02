function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _path = require('path');

var path = _interopRequireWildcard(_path);

// NOTE: If using 'fit' you must add it to the list below!

var _jasmineFix = require('jasmine-fix');

// eslint-disable-line import/no-extraneous-dependencies

var _libMain = require('../lib/main');

var _libMain2 = _interopRequireDefault(_libMain);

// Fixture paths
'use babel';

var invalidPath = path.join(__dirname, 'fixtures', 'invalid', 'invalid.ts');
var noConfigPath = path.join(__dirname, 'fixtures', 'no-config', 'noConfig.ts');
var validPath = path.join(__dirname, 'fixtures', 'valid', 'valid.ts');
var validTypecheckedPath = path.join(__dirname, 'fixtures', 'valid-typechecked', 'valid-typechecked.ts');
var invalidTypecheckedPath = path.join(__dirname, 'fixtures', 'invalid-typechecked', 'invalid-typechecked.ts');

describe('The TSLint provider for Linter', function () {
  var _linterTslint$provideLinter = _libMain2['default'].provideLinter();

  var lint = _linterTslint$provideLinter.lint;

  (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
    yield atom.packages.activatePackage('linter-tslint');
  }));

  describe('When the package is activated', function () {
    describe('When dealing with typechecking off (no semantic rules)', function () {
      (0, _jasmineFix.it)('finds nothing wrong with a valid file', _asyncToGenerator(function* () {
        var editor = yield atom.workspace.open(validPath);
        var result = yield lint(editor);
        expect(result.length).toBe(0);
      }));

      (0, _jasmineFix.it)('handles messages from TSLint', _asyncToGenerator(function* () {
        var expectedMsgRegEx = /Missing semicolon \(<a href=".*">semicolon<\/a>\)/;
        var editor = yield atom.workspace.open(invalidPath);
        var result = yield lint(editor);
        expect(result.length).toBe(1);
        expect(result[0].type).toBe('warning');
        expect(expectedMsgRegEx.test(result[0].html)).toBeTruthy();
        expect(result[0].text).not.toBeDefined();
        expect(result[0].filePath).toBe(invalidPath);
        expect(result[0].range).toEqual([[0, 14], [0, 14]]);
      }));

      (0, _jasmineFix.it)('handles undefined filepath', _asyncToGenerator(function* () {
        var editor = yield atom.workspace.open();
        var result = yield lint(editor);
        expect(result).toBeNull();
      }));

      (0, _jasmineFix.it)('finishes validatation even when there is no tslint.json', _asyncToGenerator(function* () {
        var editor = yield atom.workspace.open(noConfigPath);
        yield lint(editor);
      }));
    });

    describe('When dealing with typechecking on (with semantic rules)', function () {
      (0, _jasmineFix.beforeEach)(function () {
        atom.config.set('linter-tslint.enableSemanticRules', true);
      });

      afterEach(function () {
        atom.config.set('linter-tslint.enableSemanticRules', false);
      });

      (0, _jasmineFix.it)('finds nothing wrong with a valid file', _asyncToGenerator(function* () {
        var editor = yield atom.workspace.open(validTypecheckedPath);
        var result = yield lint(editor);
        expect(result.length).toBe(0);
      }));

      (0, _jasmineFix.it)('handles messages from TSLint', _asyncToGenerator(function* () {
        var expectedMsgRegEx = /This expression is unnecessarily compared to a boolean. Just use it directly. \(<a href=".*">no-boolean-literal-compare<\/a>\)/;
        var editor = yield atom.workspace.open(invalidTypecheckedPath);
        var result = yield lint(editor);
        expect(result.length).toBe(1);
        expect(result[0].type).toBe('error');
        expect(expectedMsgRegEx.test(result[0].html)).toBeTruthy();
        expect(result[0].text).not.toBeDefined();
        expect(result[0].filePath).toBe(invalidTypecheckedPath);
        expect(result[0].range).toEqual([[1, 0], [1, 1]]);
      }));
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvbGludGVyLXRzbGludC9zcGVjL2xpbnRlci10c2xpbnQtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7b0JBRXNCLE1BQU07O0lBQWhCLElBQUk7Ozs7MEJBRWUsYUFBYTs7Ozt1QkFDbkIsYUFBYTs7Ozs7QUFMdEMsV0FBVyxDQUFDOztBQVFaLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDOUUsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUNsRixJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3hFLElBQU0sb0JBQW9CLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLG1CQUFtQixFQUFFLHNCQUFzQixDQUFDLENBQUM7QUFDM0csSUFBTSxzQkFBc0IsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUscUJBQXFCLEVBQUUsd0JBQXdCLENBQUMsQ0FBQzs7QUFFakgsUUFBUSxDQUFDLGdDQUFnQyxFQUFFLFlBQU07b0NBQzlCLHFCQUFhLGFBQWEsRUFBRTs7TUFBckMsSUFBSSwrQkFBSixJQUFJOztBQUVaLGdEQUFXLGFBQVk7QUFDckIsVUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsQ0FBQztHQUN0RCxFQUFDLENBQUM7O0FBRUgsVUFBUSxDQUFDLCtCQUErQixFQUFFLFlBQU07QUFDOUMsWUFBUSxDQUFDLHdEQUF3RCxFQUFFLFlBQU07QUFDdkUsMEJBQUcsdUNBQXVDLG9C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QUFFSCwwQkFBRyw4QkFBOEIsb0JBQUUsYUFBWTtBQUM3QyxZQUFNLGdCQUFnQixHQUFHLGdJQUFnSSxDQUFDO0FBQzFKLFlBQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUNqRSxZQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNsQyxjQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5QixjQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNyQyxjQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQzNELGNBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ3pDLGNBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDeEQsY0FBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7T0FDbkQsRUFBQyxDQUFDO0tBQ0osQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6Ii9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvbGludGVyLXRzbGludC9zcGVjL2xpbnRlci10c2xpbnQtc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuLy8gTk9URTogSWYgdXNpbmcgJ2ZpdCcgeW91IG11c3QgYWRkIGl0IHRvIHRoZSBsaXN0IGJlbG93IVxuaW1wb3J0IHsgYmVmb3JlRWFjaCwgaXQgfSBmcm9tICdqYXNtaW5lLWZpeCc7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgbGludGVyVHNsaW50IGZyb20gJy4uL2xpYi9tYWluJztcblxuLy8gRml4dHVyZSBwYXRoc1xuY29uc3QgaW52YWxpZFBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMnLCAnaW52YWxpZCcsICdpbnZhbGlkLnRzJyk7XG5jb25zdCBub0NvbmZpZ1BhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMnLCAnbm8tY29uZmlnJywgJ25vQ29uZmlnLnRzJyk7XG5jb25zdCB2YWxpZFBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMnLCAndmFsaWQnLCAndmFsaWQudHMnKTtcbmNvbnN0IHZhbGlkVHlwZWNoZWNrZWRQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJywgJ3ZhbGlkLXR5cGVjaGVja2VkJywgJ3ZhbGlkLXR5cGVjaGVja2VkLnRzJyk7XG5jb25zdCBpbnZhbGlkVHlwZWNoZWNrZWRQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJywgJ2ludmFsaWQtdHlwZWNoZWNrZWQnLCAnaW52YWxpZC10eXBlY2hlY2tlZC50cycpO1xuXG5kZXNjcmliZSgnVGhlIFRTTGludCBwcm92aWRlciBmb3IgTGludGVyJywgKCkgPT4ge1xuICBjb25zdCB7IGxpbnQgfSA9IGxpbnRlclRzbGludC5wcm92aWRlTGludGVyKCk7XG5cbiAgYmVmb3JlRWFjaChhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xpbnRlci10c2xpbnQnKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ1doZW4gdGhlIHBhY2thZ2UgaXMgYWN0aXZhdGVkJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdXaGVuIGRlYWxpbmcgd2l0aCB0eXBlY2hlY2tpbmcgb2ZmIChubyBzZW1hbnRpYyBydWxlcyknLCAoKSA9PiB7XG4gICAgICBpdCgnZmluZHMgbm90aGluZyB3cm9uZyB3aXRoIGEgdmFsaWQgZmlsZScsIGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgZWRpdG9yID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3Blbih2YWxpZFBhdGgpO1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBsaW50KGVkaXRvcik7XG4gICAgICAgIGV4cGVjdChyZXN1bHQubGVuZ3RoKS50b0JlKDApO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdoYW5kbGVzIG1lc3NhZ2VzIGZyb20gVFNMaW50JywgYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBleHBlY3RlZE1zZ1JlZ0V4ID0gL01pc3Npbmcgc2VtaWNvbG9uIFxcKDxhIGhyZWY9XCIuKlwiPnNlbWljb2xvbjxcXC9hPlxcKS87XG4gICAgICAgIGNvbnN0IGVkaXRvciA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oaW52YWxpZFBhdGgpO1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBsaW50KGVkaXRvcik7XG4gICAgICAgIGV4cGVjdChyZXN1bHQubGVuZ3RoKS50b0JlKDEpO1xuICAgICAgICBleHBlY3QocmVzdWx0WzBdLnR5cGUpLnRvQmUoJ3dhcm5pbmcnKTtcbiAgICAgICAgZXhwZWN0KGV4cGVjdGVkTXNnUmVnRXgudGVzdChyZXN1bHRbMF0uaHRtbCkpLnRvQmVUcnV0aHkoKTtcbiAgICAgICAgZXhwZWN0KHJlc3VsdFswXS50ZXh0KS5ub3QudG9CZURlZmluZWQoKTtcbiAgICAgICAgZXhwZWN0KHJlc3VsdFswXS5maWxlUGF0aCkudG9CZShpbnZhbGlkUGF0aCk7XG4gICAgICAgIGV4cGVjdChyZXN1bHRbMF0ucmFuZ2UpLnRvRXF1YWwoW1swLCAxNF0sIFswLCAxNF1dKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnaGFuZGxlcyB1bmRlZmluZWQgZmlsZXBhdGgnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGVkaXRvciA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oKTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgbGludChlZGl0b3IpO1xuICAgICAgICBleHBlY3QocmVzdWx0KS50b0JlTnVsbCgpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdmaW5pc2hlcyB2YWxpZGF0YXRpb24gZXZlbiB3aGVuIHRoZXJlIGlzIG5vIHRzbGludC5qc29uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBlZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKG5vQ29uZmlnUGF0aCk7XG4gICAgICAgIGF3YWl0IGxpbnQoZWRpdG9yKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ1doZW4gZGVhbGluZyB3aXRoIHR5cGVjaGVja2luZyBvbiAod2l0aCBzZW1hbnRpYyBydWxlcyknLCAoKSA9PiB7XG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItdHNsaW50LmVuYWJsZVNlbWFudGljUnVsZXMnLCB0cnVlKTtcbiAgICAgIH0pO1xuXG4gICAgICBhZnRlckVhY2goKCkgPT4ge1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci10c2xpbnQuZW5hYmxlU2VtYW50aWNSdWxlcycsIGZhbHNlKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnZmluZHMgbm90aGluZyB3cm9uZyB3aXRoIGEgdmFsaWQgZmlsZScsIGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgZWRpdG9yID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3Blbih2YWxpZFR5cGVjaGVja2VkUGF0aCk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGxpbnQoZWRpdG9yKTtcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5sZW5ndGgpLnRvQmUoMCk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ2hhbmRsZXMgbWVzc2FnZXMgZnJvbSBUU0xpbnQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGV4cGVjdGVkTXNnUmVnRXggPSAvVGhpcyBleHByZXNzaW9uIGlzIHVubmVjZXNzYXJpbHkgY29tcGFyZWQgdG8gYSBib29sZWFuLiBKdXN0IHVzZSBpdCBkaXJlY3RseS4gXFwoPGEgaHJlZj1cIi4qXCI+bm8tYm9vbGVhbi1saXRlcmFsLWNvbXBhcmU8XFwvYT5cXCkvO1xuICAgICAgICBjb25zdCBlZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKGludmFsaWRUeXBlY2hlY2tlZFBhdGgpO1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBsaW50KGVkaXRvcik7XG4gICAgICAgIGV4cGVjdChyZXN1bHQubGVuZ3RoKS50b0JlKDEpO1xuICAgICAgICBleHBlY3QocmVzdWx0WzBdLnR5cGUpLnRvQmUoJ2Vycm9yJyk7XG4gICAgICAgIGV4cGVjdChleHBlY3RlZE1zZ1JlZ0V4LnRlc3QocmVzdWx0WzBdLmh0bWwpKS50b0JlVHJ1dGh5KCk7XG4gICAgICAgIGV4cGVjdChyZXN1bHRbMF0udGV4dCkubm90LnRvQmVEZWZpbmVkKCk7XG4gICAgICAgIGV4cGVjdChyZXN1bHRbMF0uZmlsZVBhdGgpLnRvQmUoaW52YWxpZFR5cGVjaGVja2VkUGF0aCk7XG4gICAgICAgIGV4cGVjdChyZXN1bHRbMF0ucmFuZ2UpLnRvRXF1YWwoW1sxLCAwXSwgWzEsIDFdXSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==