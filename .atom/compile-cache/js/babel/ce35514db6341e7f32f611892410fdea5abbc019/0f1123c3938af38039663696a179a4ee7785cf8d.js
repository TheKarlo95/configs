function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */
/* eslint-env jasmine, atomtest */

/*
  This file contains verifying specs for:
  https://github.com/sindresorhus/atom-editorconfig/issues/4
*/

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var projectRoot = _path2['default'].join(__dirname, 'fixtures');
var filePath = _path2['default'].join(projectRoot, 'test.iss4');

describe('editorconfig', function () {
	var textEditor = undefined;
	var textWithFinalNewline = 'I am Providence.\n';
	var textWithoutFinalNewline = 'I am Providence.';

	beforeEach(function () {
		waitsForPromise(function () {
			return Promise.all([atom.packages.activatePackage('editorconfig'), atom.workspace.open(filePath)]).then(function (results) {
				textEditor = results[1];
			});
		});
	});

	afterEach(function () {
		// remove the created fixture, if it exists
		runs(function () {
			_fs2['default'].stat(filePath, function (err, stats) {
				if (!err && stats.isFile()) {
					_fs2['default'].unlink(filePath);
				}
			});
		});

		waitsFor(function () {
			try {
				return _fs2['default'].statSync(filePath).isFile() === false;
			} catch (err) {
				return true;
			}
		}, 5000, 'removed ' + filePath);
	});

	describe('Atom being set to insert **no** final newline', function () {
		beforeEach(function () {
			// eslint-disable-next-line camelcase
			textEditor.getBuffer().editorconfig.settings.insert_final_newline = false;
		});

		it('should leave the missing newline.', function () {
			textEditor.setText(textWithoutFinalNewline);
			textEditor.save();
			expect(textEditor.getText().length).toEqual(textWithoutFinalNewline.length);
		});
	});

	describe('Atom being set to insert final newline', function () {
		beforeEach(function () {
			// eslint-disable-next-line camelcase
			textEditor.getBuffer().editorconfig.settings.insert_final_newline = true;
			// eslint-disable-next-line camelcase
			textEditor.getBuffer().editorconfig.settings.end_of_line = '\n';
		});

		it('should insert a final newline.', function () {
			textEditor.setText(textWithoutFinalNewline);
			textEditor.save();
			expect(textEditor.getText().length).toEqual(textWithFinalNewline.length);
		});
	});
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvZWRpdG9yY29uZmlnL3NwZWMvaXNzNC1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7a0JBUWUsSUFBSTs7OztvQkFDRixNQUFNOzs7O0FBRXZCLElBQU0sV0FBVyxHQUFHLGtCQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDckQsSUFBTSxRQUFRLEdBQUcsa0JBQUssSUFBSSxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQzs7QUFFckQsUUFBUSxDQUFDLGNBQWMsRUFBRSxZQUFNO0FBQzlCLEtBQUksVUFBVSxZQUFBLENBQUM7QUFDZixLQUFNLG9CQUFvQixHQUFHLG9CQUFvQixDQUFDO0FBQ2xELEtBQU0sdUJBQXVCLEdBQUcsa0JBQWtCLENBQUM7O0FBRW5ELFdBQVUsQ0FBQyxZQUFNO0FBQ2hCLGlCQUFlLENBQUM7VUFDZixPQUFPLENBQUMsR0FBRyxDQUFDLENBQ1gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLEVBQzdDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUM3QixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsT0FBTyxFQUFJO0FBQ2xCLGNBQVUsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEIsQ0FBQztHQUFBLENBQ0YsQ0FBQztFQUNGLENBQUMsQ0FBQzs7QUFFSCxVQUFTLENBQUMsWUFBTTs7QUFFZixNQUFJLENBQUMsWUFBTTtBQUNWLG1CQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBQyxHQUFHLEVBQUUsS0FBSyxFQUFLO0FBQ2pDLFFBQUksQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFO0FBQzNCLHFCQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNwQjtJQUNELENBQUMsQ0FBQztHQUNILENBQUMsQ0FBQzs7QUFFSCxVQUFRLENBQUMsWUFBTTtBQUNkLE9BQUk7QUFDSCxXQUFPLGdCQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxLQUFLLENBQUM7SUFDaEQsQ0FBQyxPQUFPLEdBQUcsRUFBRTtBQUNiLFdBQU8sSUFBSSxDQUFDO0lBQ1o7R0FDRCxFQUFFLElBQUksZUFBYSxRQUFRLENBQUcsQ0FBQztFQUNoQyxDQUFDLENBQUM7O0FBRUgsU0FBUSxDQUFDLCtDQUErQyxFQUFFLFlBQU07QUFDL0QsWUFBVSxDQUFDLFlBQU07O0FBRWhCLGFBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLG9CQUFvQixHQUFHLEtBQUssQ0FBQztHQUMxRSxDQUFDLENBQUM7O0FBRUgsSUFBRSxDQUFDLG1DQUFtQyxFQUFFLFlBQU07QUFDN0MsYUFBVSxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQzVDLGFBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNsQixTQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUM1RSxDQUFDLENBQUM7RUFDSCxDQUFDLENBQUM7O0FBRUgsU0FBUSxDQUFDLHdDQUF3QyxFQUFFLFlBQU07QUFDeEQsWUFBVSxDQUFDLFlBQU07O0FBRWhCLGFBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQzs7QUFFekUsYUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztHQUNoRSxDQUFDLENBQUM7O0FBRUgsSUFBRSxDQUFDLGdDQUFnQyxFQUFFLFlBQU07QUFDMUMsYUFBVSxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQzVDLGFBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNsQixTQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUN6RSxDQUFDLENBQUM7RUFDSCxDQUFDLENBQUM7Q0FDSCxDQUFDLENBQUMiLCJmaWxlIjoiL2hvbWUvdGhla2FybG85NS8uYXRvbS9wYWNrYWdlcy9lZGl0b3Jjb25maWcvc3BlYy9pc3M0LXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG4vKiBlc2xpbnQtZW52IGphc21pbmUsIGF0b210ZXN0ICovXG5cbi8qXG4gIFRoaXMgZmlsZSBjb250YWlucyB2ZXJpZnlpbmcgc3BlY3MgZm9yOlxuICBodHRwczovL2dpdGh1Yi5jb20vc2luZHJlc29yaHVzL2F0b20tZWRpdG9yY29uZmlnL2lzc3Vlcy80XG4qL1xuXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmNvbnN0IHByb2plY3RSb290ID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJyk7XG5jb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihwcm9qZWN0Um9vdCwgJ3Rlc3QuaXNzNCcpO1xuXG5kZXNjcmliZSgnZWRpdG9yY29uZmlnJywgKCkgPT4ge1xuXHRsZXQgdGV4dEVkaXRvcjtcblx0Y29uc3QgdGV4dFdpdGhGaW5hbE5ld2xpbmUgPSAnSSBhbSBQcm92aWRlbmNlLlxcbic7XG5cdGNvbnN0IHRleHRXaXRob3V0RmluYWxOZXdsaW5lID0gJ0kgYW0gUHJvdmlkZW5jZS4nO1xuXG5cdGJlZm9yZUVhY2goKCkgPT4ge1xuXHRcdHdhaXRzRm9yUHJvbWlzZSgoKSA9PlxuXHRcdFx0UHJvbWlzZS5hbGwoW1xuXHRcdFx0XHRhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnZWRpdG9yY29uZmlnJyksXG5cdFx0XHRcdGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZVBhdGgpXG5cdFx0XHRdKS50aGVuKHJlc3VsdHMgPT4ge1xuXHRcdFx0XHR0ZXh0RWRpdG9yID0gcmVzdWx0c1sxXTtcblx0XHRcdH0pXG5cdFx0KTtcblx0fSk7XG5cblx0YWZ0ZXJFYWNoKCgpID0+IHtcblx0XHQvLyByZW1vdmUgdGhlIGNyZWF0ZWQgZml4dHVyZSwgaWYgaXQgZXhpc3RzXG5cdFx0cnVucygoKSA9PiB7XG5cdFx0XHRmcy5zdGF0KGZpbGVQYXRoLCAoZXJyLCBzdGF0cykgPT4ge1xuXHRcdFx0XHRpZiAoIWVyciAmJiBzdGF0cy5pc0ZpbGUoKSkge1xuXHRcdFx0XHRcdGZzLnVubGluayhmaWxlUGF0aCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0d2FpdHNGb3IoKCkgPT4ge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0cmV0dXJuIGZzLnN0YXRTeW5jKGZpbGVQYXRoKS5pc0ZpbGUoKSA9PT0gZmFsc2U7XG5cdFx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fSwgNTAwMCwgYHJlbW92ZWQgJHtmaWxlUGF0aH1gKTtcblx0fSk7XG5cblx0ZGVzY3JpYmUoJ0F0b20gYmVpbmcgc2V0IHRvIGluc2VydCAqKm5vKiogZmluYWwgbmV3bGluZScsICgpID0+IHtcblx0XHRiZWZvcmVFYWNoKCgpID0+IHtcblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjYW1lbGNhc2Vcblx0XHRcdHRleHRFZGl0b3IuZ2V0QnVmZmVyKCkuZWRpdG9yY29uZmlnLnNldHRpbmdzLmluc2VydF9maW5hbF9uZXdsaW5lID0gZmFsc2U7XG5cdFx0fSk7XG5cblx0XHRpdCgnc2hvdWxkIGxlYXZlIHRoZSBtaXNzaW5nIG5ld2xpbmUuJywgKCkgPT4ge1xuXHRcdFx0dGV4dEVkaXRvci5zZXRUZXh0KHRleHRXaXRob3V0RmluYWxOZXdsaW5lKTtcblx0XHRcdHRleHRFZGl0b3Iuc2F2ZSgpO1xuXHRcdFx0ZXhwZWN0KHRleHRFZGl0b3IuZ2V0VGV4dCgpLmxlbmd0aCkudG9FcXVhbCh0ZXh0V2l0aG91dEZpbmFsTmV3bGluZS5sZW5ndGgpO1xuXHRcdH0pO1xuXHR9KTtcblxuXHRkZXNjcmliZSgnQXRvbSBiZWluZyBzZXQgdG8gaW5zZXJ0IGZpbmFsIG5ld2xpbmUnLCAoKSA9PiB7XG5cdFx0YmVmb3JlRWFjaCgoKSA9PiB7XG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2FtZWxjYXNlXG5cdFx0XHR0ZXh0RWRpdG9yLmdldEJ1ZmZlcigpLmVkaXRvcmNvbmZpZy5zZXR0aW5ncy5pbnNlcnRfZmluYWxfbmV3bGluZSA9IHRydWU7XG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2FtZWxjYXNlXG5cdFx0XHR0ZXh0RWRpdG9yLmdldEJ1ZmZlcigpLmVkaXRvcmNvbmZpZy5zZXR0aW5ncy5lbmRfb2ZfbGluZSA9ICdcXG4nO1xuXHRcdH0pO1xuXG5cdFx0aXQoJ3Nob3VsZCBpbnNlcnQgYSBmaW5hbCBuZXdsaW5lLicsICgpID0+IHtcblx0XHRcdHRleHRFZGl0b3Iuc2V0VGV4dCh0ZXh0V2l0aG91dEZpbmFsTmV3bGluZSk7XG5cdFx0XHR0ZXh0RWRpdG9yLnNhdmUoKTtcblx0XHRcdGV4cGVjdCh0ZXh0RWRpdG9yLmdldFRleHQoKS5sZW5ndGgpLnRvRXF1YWwodGV4dFdpdGhGaW5hbE5ld2xpbmUubGVuZ3RoKTtcblx0XHR9KTtcblx0fSk7XG59KTtcbiJdfQ==