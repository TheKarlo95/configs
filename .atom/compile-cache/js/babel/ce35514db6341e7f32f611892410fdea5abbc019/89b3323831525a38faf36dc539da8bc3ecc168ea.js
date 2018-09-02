function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */
/* eslint-env jasmine, atomtest */

/*
  This file contains verifying specs for:
  https://github.com/sindresorhus/atom-editorconfig/issues/3
*/

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var projectRoot = _path2['default'].join(__dirname, 'fixtures');
var filePath = _path2['default'].join(projectRoot, 'test.iss3');

describe('when saving a file with trailing whitespaces', function () {
	var textEditor = undefined;
	var textWithTrailingWhitespaces = 'I am Providence. \t\t  \n';
	var textWithoutTraillingWhitespaces = 'I am Providence.\n';

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

	describe('Atom being set to leave trailing whitespaces', function () {
		it('should leave the trailing whitespaces.', function () {
			// eslint-disable-next-line camelcase
			textEditor.getBuffer().editorconfig.settings.insert_final_newline = true;
			// eslint-disable-next-line camelcase
			textEditor.getBuffer().editorconfig.settings.trim_trailing_whitespace = false;
			textEditor.setText(textWithTrailingWhitespaces);
			textEditor.save();
			expect(textEditor.getText().length).toEqual(textWithTrailingWhitespaces.length);
		});
	});

	describe('Atom being set to strip trailing whitespaces', function () {
		it('should remove the trailing whitespaces.', function () {
			// eslint-disable-next-line camelcase
			textEditor.getBuffer().editorconfig.settings.insert_final_newline = true;
			// eslint-disable-next-line camelcase
			textEditor.getBuffer().editorconfig.settings.trim_trailing_whitespace = true;
			textEditor.setText(textWithTrailingWhitespaces);
			textEditor.save();
			expect(textEditor.getText().length).toEqual(textWithoutTraillingWhitespaces.length);
		});
	});
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvZWRpdG9yY29uZmlnL3NwZWMvaXNzMy1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7a0JBUWUsSUFBSTs7OztvQkFDRixNQUFNOzs7O0FBRXZCLElBQU0sV0FBVyxHQUFHLGtCQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDckQsSUFBTSxRQUFRLEdBQUcsa0JBQUssSUFBSSxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQzs7QUFFckQsUUFBUSxDQUFDLDhDQUE4QyxFQUFFLFlBQU07QUFDOUQsS0FBSSxVQUFVLFlBQUEsQ0FBQztBQUNmLEtBQU0sMkJBQTJCLEdBQUcsMkJBQTJCLENBQUM7QUFDaEUsS0FBTSwrQkFBK0IsR0FBRyxvQkFBb0IsQ0FBQzs7QUFFN0QsV0FBVSxDQUFDLFlBQU07QUFDaEIsaUJBQWUsQ0FBQztVQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FDWCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsRUFDN0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQzdCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxPQUFPLEVBQUk7QUFDbEIsY0FBVSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4QixDQUFDO0dBQUEsQ0FDRixDQUFDO0VBQ0YsQ0FBQyxDQUFDOztBQUVILFVBQVMsQ0FBQyxZQUFNOztBQUVmLE1BQUksQ0FBQyxZQUFNO0FBQ1YsbUJBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUs7QUFDakMsUUFBSSxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLEVBQUU7QUFDM0IscUJBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ3BCO0lBQ0QsQ0FBQyxDQUFDO0dBQ0gsQ0FBQyxDQUFDOztBQUVILFVBQVEsQ0FBQyxZQUFNO0FBQ2QsT0FBSTtBQUNILFdBQU8sZ0JBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxLQUFLLEtBQUssQ0FBQztJQUNoRCxDQUFDLE9BQU8sR0FBRyxFQUFFO0FBQ2IsV0FBTyxJQUFJLENBQUM7SUFDWjtHQUNELEVBQUUsSUFBSSxlQUFhLFFBQVEsQ0FBRyxDQUFDO0VBQ2hDLENBQUMsQ0FBQzs7QUFFSCxTQUFRLENBQUMsOENBQThDLEVBQUUsWUFBTTtBQUM5RCxJQUFFLENBQUMsd0NBQXdDLEVBQUUsWUFBTTs7QUFFbEQsYUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDOztBQUV6RSxhQUFVLENBQUMsU0FBUyxFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsR0FBRyxLQUFLLENBQUM7QUFDOUUsYUFBVSxDQUFDLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQ2hELGFBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNsQixTQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUNoRixDQUFDLENBQUM7RUFDSCxDQUFDLENBQUM7O0FBRUgsU0FBUSxDQUFDLDhDQUE4QyxFQUFFLFlBQU07QUFDOUQsSUFBRSxDQUFDLHlDQUF5QyxFQUFFLFlBQU07O0FBRW5ELGFBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQzs7QUFFekUsYUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFDO0FBQzdFLGFBQVUsQ0FBQyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUNoRCxhQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDbEIsU0FBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsK0JBQStCLENBQUMsTUFBTSxDQUFDLENBQUM7R0FDcEYsQ0FBQyxDQUFDO0VBQ0gsQ0FBQyxDQUFDO0NBQ0gsQ0FBQyxDQUFDIiwiZmlsZSI6Ii9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvZWRpdG9yY29uZmlnL3NwZWMvaXNzMy1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuLyogZXNsaW50LWVudiBqYXNtaW5lLCBhdG9tdGVzdCAqL1xuXG4vKlxuICBUaGlzIGZpbGUgY29udGFpbnMgdmVyaWZ5aW5nIHNwZWNzIGZvcjpcbiAgaHR0cHM6Ly9naXRodWIuY29tL3NpbmRyZXNvcmh1cy9hdG9tLWVkaXRvcmNvbmZpZy9pc3N1ZXMvM1xuKi9cblxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5jb25zdCBwcm9qZWN0Um9vdCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycpO1xuY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4ocHJvamVjdFJvb3QsICd0ZXN0LmlzczMnKTtcblxuZGVzY3JpYmUoJ3doZW4gc2F2aW5nIGEgZmlsZSB3aXRoIHRyYWlsaW5nIHdoaXRlc3BhY2VzJywgKCkgPT4ge1xuXHRsZXQgdGV4dEVkaXRvcjtcblx0Y29uc3QgdGV4dFdpdGhUcmFpbGluZ1doaXRlc3BhY2VzID0gJ0kgYW0gUHJvdmlkZW5jZS4gXFx0XFx0ICBcXG4nO1xuXHRjb25zdCB0ZXh0V2l0aG91dFRyYWlsbGluZ1doaXRlc3BhY2VzID0gJ0kgYW0gUHJvdmlkZW5jZS5cXG4nO1xuXG5cdGJlZm9yZUVhY2goKCkgPT4ge1xuXHRcdHdhaXRzRm9yUHJvbWlzZSgoKSA9PlxuXHRcdFx0UHJvbWlzZS5hbGwoW1xuXHRcdFx0XHRhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnZWRpdG9yY29uZmlnJyksXG5cdFx0XHRcdGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZVBhdGgpXG5cdFx0XHRdKS50aGVuKHJlc3VsdHMgPT4ge1xuXHRcdFx0XHR0ZXh0RWRpdG9yID0gcmVzdWx0c1sxXTtcblx0XHRcdH0pXG5cdFx0KTtcblx0fSk7XG5cblx0YWZ0ZXJFYWNoKCgpID0+IHtcblx0XHQvLyByZW1vdmUgdGhlIGNyZWF0ZWQgZml4dHVyZSwgaWYgaXQgZXhpc3RzXG5cdFx0cnVucygoKSA9PiB7XG5cdFx0XHRmcy5zdGF0KGZpbGVQYXRoLCAoZXJyLCBzdGF0cykgPT4ge1xuXHRcdFx0XHRpZiAoIWVyciAmJiBzdGF0cy5pc0ZpbGUoKSkge1xuXHRcdFx0XHRcdGZzLnVubGluayhmaWxlUGF0aCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0d2FpdHNGb3IoKCkgPT4ge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0cmV0dXJuIGZzLnN0YXRTeW5jKGZpbGVQYXRoKS5pc0ZpbGUoKSA9PT0gZmFsc2U7XG5cdFx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fSwgNTAwMCwgYHJlbW92ZWQgJHtmaWxlUGF0aH1gKTtcblx0fSk7XG5cblx0ZGVzY3JpYmUoJ0F0b20gYmVpbmcgc2V0IHRvIGxlYXZlIHRyYWlsaW5nIHdoaXRlc3BhY2VzJywgKCkgPT4ge1xuXHRcdGl0KCdzaG91bGQgbGVhdmUgdGhlIHRyYWlsaW5nIHdoaXRlc3BhY2VzLicsICgpID0+IHtcblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjYW1lbGNhc2Vcblx0XHRcdHRleHRFZGl0b3IuZ2V0QnVmZmVyKCkuZWRpdG9yY29uZmlnLnNldHRpbmdzLmluc2VydF9maW5hbF9uZXdsaW5lID0gdHJ1ZTtcblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjYW1lbGNhc2Vcblx0XHRcdHRleHRFZGl0b3IuZ2V0QnVmZmVyKCkuZWRpdG9yY29uZmlnLnNldHRpbmdzLnRyaW1fdHJhaWxpbmdfd2hpdGVzcGFjZSA9IGZhbHNlO1xuXHRcdFx0dGV4dEVkaXRvci5zZXRUZXh0KHRleHRXaXRoVHJhaWxpbmdXaGl0ZXNwYWNlcyk7XG5cdFx0XHR0ZXh0RWRpdG9yLnNhdmUoKTtcblx0XHRcdGV4cGVjdCh0ZXh0RWRpdG9yLmdldFRleHQoKS5sZW5ndGgpLnRvRXF1YWwodGV4dFdpdGhUcmFpbGluZ1doaXRlc3BhY2VzLmxlbmd0aCk7XG5cdFx0fSk7XG5cdH0pO1xuXG5cdGRlc2NyaWJlKCdBdG9tIGJlaW5nIHNldCB0byBzdHJpcCB0cmFpbGluZyB3aGl0ZXNwYWNlcycsICgpID0+IHtcblx0XHRpdCgnc2hvdWxkIHJlbW92ZSB0aGUgdHJhaWxpbmcgd2hpdGVzcGFjZXMuJywgKCkgPT4ge1xuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNhbWVsY2FzZVxuXHRcdFx0dGV4dEVkaXRvci5nZXRCdWZmZXIoKS5lZGl0b3Jjb25maWcuc2V0dGluZ3MuaW5zZXJ0X2ZpbmFsX25ld2xpbmUgPSB0cnVlO1xuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNhbWVsY2FzZVxuXHRcdFx0dGV4dEVkaXRvci5nZXRCdWZmZXIoKS5lZGl0b3Jjb25maWcuc2V0dGluZ3MudHJpbV90cmFpbGluZ193aGl0ZXNwYWNlID0gdHJ1ZTtcblx0XHRcdHRleHRFZGl0b3Iuc2V0VGV4dCh0ZXh0V2l0aFRyYWlsaW5nV2hpdGVzcGFjZXMpO1xuXHRcdFx0dGV4dEVkaXRvci5zYXZlKCk7XG5cdFx0XHRleHBlY3QodGV4dEVkaXRvci5nZXRUZXh0KCkubGVuZ3RoKS50b0VxdWFsKHRleHRXaXRob3V0VHJhaWxsaW5nV2hpdGVzcGFjZXMubGVuZ3RoKTtcblx0XHR9KTtcblx0fSk7XG59KTtcbiJdfQ==