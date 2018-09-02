function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */
/* eslint-env jasmine, atomtest */

/*
  This file contains verifying specs for:
  https://github.com/sindresorhus/atom-editorconfig/issues/118
*/

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var testPrefix = _path2['default'].basename(__filename).split('-').shift();
var projectRoot = _path2['default'].join(__dirname, 'fixtures');
var filePath = _path2['default'].join(projectRoot, 'test.' + testPrefix);

describe('editorconfig', function () {
	var textEditor = undefined;
	var textWithoutTrailingWhitespaces = 'I\nam\nProvidence.';
	var textWithManyTrailingWhitespaces = 'I  \t  \nam  \t  \nProvidence.';

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

	describe('Atom being set to remove trailing whitespaces', function () {
		beforeEach(function () {
			// eslint-disable-next-line camelcase
			textEditor.getBuffer().editorconfig.settings.trim_trailing_whitespace = true;
			// eslint-disable-next-line camelcase
			textEditor.getBuffer().editorconfig.settings.insert_final_newline = false;
		});

		it('should strip trailing whitespaces on save.', function () {
			textEditor.setText(textWithManyTrailingWhitespaces);
			textEditor.save();
			expect(textEditor.getText().length).toEqual(textWithoutTrailingWhitespaces.length);
		});
	});
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvZWRpdG9yY29uZmlnL3NwZWMvaXNzMTE4LXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztrQkFRZSxJQUFJOzs7O29CQUNGLE1BQU07Ozs7QUFFdkIsSUFBTSxVQUFVLEdBQUcsa0JBQUssUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNoRSxJQUFNLFdBQVcsR0FBRyxrQkFBSyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3JELElBQU0sUUFBUSxHQUFHLGtCQUFLLElBQUksQ0FBQyxXQUFXLFlBQVUsVUFBVSxDQUFHLENBQUM7O0FBRTlELFFBQVEsQ0FBQyxjQUFjLEVBQUUsWUFBTTtBQUM5QixLQUFJLFVBQVUsWUFBQSxDQUFDO0FBQ2YsS0FBTSw4QkFBOEIsR0FBRyxvQkFBb0IsQ0FBQztBQUM1RCxLQUFNLCtCQUErQixHQUFHLGdDQUFnQyxDQUFDOztBQUV6RSxXQUFVLENBQUMsWUFBTTtBQUNoQixpQkFBZSxDQUFDO1VBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUNYLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxFQUM3QyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FDN0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLE9BQU8sRUFBSTtBQUNsQixjQUFVLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hCLENBQUM7R0FBQSxDQUNGLENBQUM7RUFDRixDQUFDLENBQUM7O0FBRUgsVUFBUyxDQUFDLFlBQU07O0FBRWYsTUFBSSxDQUFDLFlBQU07QUFDVixtQkFBRyxJQUFJLENBQUMsUUFBUSxFQUFFLFVBQUMsR0FBRyxFQUFFLEtBQUssRUFBSztBQUNqQyxRQUFJLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRTtBQUMzQixxQkFBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDcEI7SUFDRCxDQUFDLENBQUM7R0FDSCxDQUFDLENBQUM7O0FBRUgsVUFBUSxDQUFDLFlBQU07QUFDZCxPQUFJO0FBQ0gsV0FBTyxnQkFBRyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLEtBQUssS0FBSyxDQUFDO0lBQ2hELENBQUMsT0FBTyxHQUFHLEVBQUU7QUFDYixXQUFPLElBQUksQ0FBQztJQUNaO0dBQ0QsRUFBRSxJQUFJLGVBQWEsUUFBUSxDQUFHLENBQUM7RUFDaEMsQ0FBQyxDQUFDOztBQUVILFNBQVEsQ0FBQywrQ0FBK0MsRUFBRSxZQUFNO0FBQy9ELFlBQVUsQ0FBQyxZQUFNOztBQUVoQixhQUFVLENBQUMsU0FBUyxFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUM7O0FBRTdFLGFBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLG9CQUFvQixHQUFHLEtBQUssQ0FBQztHQUMxRSxDQUFDLENBQUM7O0FBRUgsSUFBRSxDQUFDLDRDQUE0QyxFQUFFLFlBQU07QUFDdEQsYUFBVSxDQUFDLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0FBQ3BELGFBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNsQixTQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUNuRixDQUFDLENBQUM7RUFDSCxDQUFDLENBQUM7Q0FDSCxDQUFDLENBQUMiLCJmaWxlIjoiL2hvbWUvdGhla2FybG85NS8uYXRvbS9wYWNrYWdlcy9lZGl0b3Jjb25maWcvc3BlYy9pc3MxMTgtc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cbi8qIGVzbGludC1lbnYgamFzbWluZSwgYXRvbXRlc3QgKi9cblxuLypcbiAgVGhpcyBmaWxlIGNvbnRhaW5zIHZlcmlmeWluZyBzcGVjcyBmb3I6XG4gIGh0dHBzOi8vZ2l0aHViLmNvbS9zaW5kcmVzb3JodXMvYXRvbS1lZGl0b3Jjb25maWcvaXNzdWVzLzExOFxuKi9cblxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5jb25zdCB0ZXN0UHJlZml4ID0gcGF0aC5iYXNlbmFtZShfX2ZpbGVuYW1lKS5zcGxpdCgnLScpLnNoaWZ0KCk7XG5jb25zdCBwcm9qZWN0Um9vdCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycpO1xuY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4ocHJvamVjdFJvb3QsIGB0ZXN0LiR7dGVzdFByZWZpeH1gKTtcblxuZGVzY3JpYmUoJ2VkaXRvcmNvbmZpZycsICgpID0+IHtcblx0bGV0IHRleHRFZGl0b3I7XG5cdGNvbnN0IHRleHRXaXRob3V0VHJhaWxpbmdXaGl0ZXNwYWNlcyA9ICdJXFxuYW1cXG5Qcm92aWRlbmNlLic7XG5cdGNvbnN0IHRleHRXaXRoTWFueVRyYWlsaW5nV2hpdGVzcGFjZXMgPSAnSSAgXFx0ICBcXG5hbSAgXFx0ICBcXG5Qcm92aWRlbmNlLic7XG5cblx0YmVmb3JlRWFjaCgoKSA9PiB7XG5cdFx0d2FpdHNGb3JQcm9taXNlKCgpID0+XG5cdFx0XHRQcm9taXNlLmFsbChbXG5cdFx0XHRcdGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdlZGl0b3Jjb25maWcnKSxcblx0XHRcdFx0YXRvbS53b3Jrc3BhY2Uub3BlbihmaWxlUGF0aClcblx0XHRcdF0pLnRoZW4ocmVzdWx0cyA9PiB7XG5cdFx0XHRcdHRleHRFZGl0b3IgPSByZXN1bHRzWzFdO1xuXHRcdFx0fSlcblx0XHQpO1xuXHR9KTtcblxuXHRhZnRlckVhY2goKCkgPT4ge1xuXHRcdC8vIHJlbW92ZSB0aGUgY3JlYXRlZCBmaXh0dXJlLCBpZiBpdCBleGlzdHNcblx0XHRydW5zKCgpID0+IHtcblx0XHRcdGZzLnN0YXQoZmlsZVBhdGgsIChlcnIsIHN0YXRzKSA9PiB7XG5cdFx0XHRcdGlmICghZXJyICYmIHN0YXRzLmlzRmlsZSgpKSB7XG5cdFx0XHRcdFx0ZnMudW5saW5rKGZpbGVQYXRoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHR3YWl0c0ZvcigoKSA9PiB7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRyZXR1cm4gZnMuc3RhdFN5bmMoZmlsZVBhdGgpLmlzRmlsZSgpID09PSBmYWxzZTtcblx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9LCA1MDAwLCBgcmVtb3ZlZCAke2ZpbGVQYXRofWApO1xuXHR9KTtcblxuXHRkZXNjcmliZSgnQXRvbSBiZWluZyBzZXQgdG8gcmVtb3ZlIHRyYWlsaW5nIHdoaXRlc3BhY2VzJywgKCkgPT4ge1xuXHRcdGJlZm9yZUVhY2goKCkgPT4ge1xuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNhbWVsY2FzZVxuXHRcdFx0dGV4dEVkaXRvci5nZXRCdWZmZXIoKS5lZGl0b3Jjb25maWcuc2V0dGluZ3MudHJpbV90cmFpbGluZ193aGl0ZXNwYWNlID0gdHJ1ZTtcblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjYW1lbGNhc2Vcblx0XHRcdHRleHRFZGl0b3IuZ2V0QnVmZmVyKCkuZWRpdG9yY29uZmlnLnNldHRpbmdzLmluc2VydF9maW5hbF9uZXdsaW5lID0gZmFsc2U7XG5cdFx0fSk7XG5cblx0XHRpdCgnc2hvdWxkIHN0cmlwIHRyYWlsaW5nIHdoaXRlc3BhY2VzIG9uIHNhdmUuJywgKCkgPT4ge1xuXHRcdFx0dGV4dEVkaXRvci5zZXRUZXh0KHRleHRXaXRoTWFueVRyYWlsaW5nV2hpdGVzcGFjZXMpO1xuXHRcdFx0dGV4dEVkaXRvci5zYXZlKCk7XG5cdFx0XHRleHBlY3QodGV4dEVkaXRvci5nZXRUZXh0KCkubGVuZ3RoKS50b0VxdWFsKHRleHRXaXRob3V0VHJhaWxpbmdXaGl0ZXNwYWNlcy5sZW5ndGgpO1xuXHRcdH0pO1xuXHR9KTtcbn0pO1xuIl19