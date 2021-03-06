function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */
/* eslint-env jasmine, atomtest */

/*
  This file contains verifying specs for:
  https://github.com/sindresorhus/atom-editorconfig/issues/148

  If the max_line_length is redisabled additional instances of the
  base-wrap-guide are added
*/

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var testPrefix = _path2['default'].basename(__filename).split('-').shift();
var projectRoot = _path2['default'].join(__dirname, 'fixtures', testPrefix);
var filePath = _path2['default'].join(projectRoot, 'test.' + testPrefix);

describe('editorconfig', function () {
	var textEditor = undefined;
	var editorDom = undefined;

	beforeEach(function () {
		waitsForPromise(function () {
			return Promise.all([atom.packages.activatePackage('editorconfig'), atom.packages.activatePackage('wrap-guide'), atom.workspace.open(filePath)]).then(function (results) {
				textEditor = results.pop();
				editorDom = atom.views.getView(textEditor);
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

	describe('EditorConfig', function () {
		it('should assure no additional wrapGuides are created', function () {
			var ecfg = textEditor.getBuffer().editorconfig;
			var wgCount = function wgCount() {
				return editorDom.querySelectorAll('* /deep/ .wrap-guide').length;
			};

			expect(wgCount()).toBe(1);
			// eslint-disable-next-line camelcase
			ecfg.settings.max_line_length = 30;
			ecfg.applySettings();
			expect(wgCount()).toBe(1);
			// eslint-disable-next-line camelcase
			ecfg.settings.max_line_length = 'auto';
			ecfg.applySettings();
			expect(wgCount()).toBe(1);
			// eslint-disable-next-line camelcase
			ecfg.settings.max_line_length = 30;
			ecfg.applySettings();
			expect(wgCount()).toBe(1);
			// eslint-disable-next-line camelcase
			ecfg.settings.max_line_length = 'auto';
			ecfg.applySettings();
			expect(wgCount()).toBe(1);
		});
	});
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvZWRpdG9yY29uZmlnL3NwZWMvaXNzMTQ4LXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztrQkFXZSxJQUFJOzs7O29CQUNGLE1BQU07Ozs7QUFFdkIsSUFBTSxVQUFVLEdBQUcsa0JBQUssUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNoRSxJQUFNLFdBQVcsR0FBRyxrQkFBSyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNqRSxJQUFNLFFBQVEsR0FBRyxrQkFBSyxJQUFJLENBQUMsV0FBVyxZQUFVLFVBQVUsQ0FBRyxDQUFDOztBQUU5RCxRQUFRLENBQUMsY0FBYyxFQUFFLFlBQU07QUFDOUIsS0FBSSxVQUFVLFlBQUEsQ0FBQztBQUNmLEtBQUksU0FBUyxZQUFBLENBQUM7O0FBRWQsV0FBVSxDQUFDLFlBQU07QUFDaEIsaUJBQWUsQ0FBQztVQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FDWCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsRUFDN0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLEVBQzNDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUM3QixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsT0FBTyxFQUFJO0FBQ2xCLGNBQVUsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDM0IsYUFBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzNDLENBQUM7R0FBQSxDQUNGLENBQUM7RUFDRixDQUFDLENBQUM7O0FBRUgsVUFBUyxDQUFDLFlBQU07O0FBRWYsTUFBSSxDQUFDLFlBQU07QUFDVixtQkFBRyxJQUFJLENBQUMsUUFBUSxFQUFFLFVBQUMsR0FBRyxFQUFFLEtBQUssRUFBSztBQUNqQyxRQUFJLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRTtBQUMzQixxQkFBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDcEI7SUFDRCxDQUFDLENBQUM7R0FDSCxDQUFDLENBQUM7O0FBRUgsVUFBUSxDQUFDLFlBQU07QUFDZCxPQUFJO0FBQ0gsV0FBTyxnQkFBRyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLEtBQUssS0FBSyxDQUFDO0lBQ2hELENBQUMsT0FBTyxHQUFHLEVBQUU7QUFDYixXQUFPLElBQUksQ0FBQztJQUNaO0dBQ0QsRUFBRSxJQUFJLGVBQWEsUUFBUSxDQUFHLENBQUM7RUFDaEMsQ0FBQyxDQUFDOztBQUVILFNBQVEsQ0FBQyxjQUFjLEVBQUUsWUFBTTtBQUM5QixJQUFFLENBQUMsb0RBQW9ELEVBQUUsWUFBTTtBQUM5RCxPQUFNLElBQUksR0FBRyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUMsWUFBWSxDQUFDO0FBQ2pELE9BQU0sT0FBTyxHQUFHLFNBQVYsT0FBTyxHQUFTO0FBQ3JCLFdBQU8sU0FBUyxDQUNaLGdCQUFnQixDQUFDLHNCQUFzQixDQUFDLENBQ3hDLE1BQU0sQ0FBQztJQUNYLENBQUM7O0FBRUYsU0FBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUUxQixPQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7QUFDbkMsT0FBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0FBQ3JCLFNBQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFMUIsT0FBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDO0FBQ3ZDLE9BQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztBQUNyQixTQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRTFCLE9BQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztBQUNuQyxPQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7QUFDckIsU0FBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUUxQixPQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUM7QUFDdkMsT0FBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0FBQ3JCLFNBQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUMxQixDQUFDLENBQUM7RUFDSCxDQUFDLENBQUM7Q0FDSCxDQUFDLENBQUMiLCJmaWxlIjoiL2hvbWUvdGhla2FybG85NS8uYXRvbS9wYWNrYWdlcy9lZGl0b3Jjb25maWcvc3BlYy9pc3MxNDgtc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cbi8qIGVzbGludC1lbnYgamFzbWluZSwgYXRvbXRlc3QgKi9cblxuLypcbiAgVGhpcyBmaWxlIGNvbnRhaW5zIHZlcmlmeWluZyBzcGVjcyBmb3I6XG4gIGh0dHBzOi8vZ2l0aHViLmNvbS9zaW5kcmVzb3JodXMvYXRvbS1lZGl0b3Jjb25maWcvaXNzdWVzLzE0OFxuXG4gIElmIHRoZSBtYXhfbGluZV9sZW5ndGggaXMgcmVkaXNhYmxlZCBhZGRpdGlvbmFsIGluc3RhbmNlcyBvZiB0aGVcbiAgYmFzZS13cmFwLWd1aWRlIGFyZSBhZGRlZFxuKi9cblxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5jb25zdCB0ZXN0UHJlZml4ID0gcGF0aC5iYXNlbmFtZShfX2ZpbGVuYW1lKS5zcGxpdCgnLScpLnNoaWZ0KCk7XG5jb25zdCBwcm9qZWN0Um9vdCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycsIHRlc3RQcmVmaXgpO1xuY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4ocHJvamVjdFJvb3QsIGB0ZXN0LiR7dGVzdFByZWZpeH1gKTtcblxuZGVzY3JpYmUoJ2VkaXRvcmNvbmZpZycsICgpID0+IHtcblx0bGV0IHRleHRFZGl0b3I7XG5cdGxldCBlZGl0b3JEb207XG5cblx0YmVmb3JlRWFjaCgoKSA9PiB7XG5cdFx0d2FpdHNGb3JQcm9taXNlKCgpID0+XG5cdFx0XHRQcm9taXNlLmFsbChbXG5cdFx0XHRcdGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdlZGl0b3Jjb25maWcnKSxcblx0XHRcdFx0YXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ3dyYXAtZ3VpZGUnKSxcblx0XHRcdFx0YXRvbS53b3Jrc3BhY2Uub3BlbihmaWxlUGF0aClcblx0XHRcdF0pLnRoZW4ocmVzdWx0cyA9PiB7XG5cdFx0XHRcdHRleHRFZGl0b3IgPSByZXN1bHRzLnBvcCgpO1xuXHRcdFx0XHRlZGl0b3JEb20gPSBhdG9tLnZpZXdzLmdldFZpZXcodGV4dEVkaXRvcik7XG5cdFx0XHR9KVxuXHRcdCk7XG5cdH0pO1xuXG5cdGFmdGVyRWFjaCgoKSA9PiB7XG5cdFx0Ly8gcmVtb3ZlIHRoZSBjcmVhdGVkIGZpeHR1cmUsIGlmIGl0IGV4aXN0c1xuXHRcdHJ1bnMoKCkgPT4ge1xuXHRcdFx0ZnMuc3RhdChmaWxlUGF0aCwgKGVyciwgc3RhdHMpID0+IHtcblx0XHRcdFx0aWYgKCFlcnIgJiYgc3RhdHMuaXNGaWxlKCkpIHtcblx0XHRcdFx0XHRmcy51bmxpbmsoZmlsZVBhdGgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdHdhaXRzRm9yKCgpID0+IHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdHJldHVybiBmcy5zdGF0U3luYyhmaWxlUGF0aCkuaXNGaWxlKCkgPT09IGZhbHNlO1xuXHRcdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH0sIDUwMDAsIGByZW1vdmVkICR7ZmlsZVBhdGh9YCk7XG5cdH0pO1xuXG5cdGRlc2NyaWJlKCdFZGl0b3JDb25maWcnLCAoKSA9PiB7XG5cdFx0aXQoJ3Nob3VsZCBhc3N1cmUgbm8gYWRkaXRpb25hbCB3cmFwR3VpZGVzIGFyZSBjcmVhdGVkJywgKCkgPT4ge1xuXHRcdFx0Y29uc3QgZWNmZyA9IHRleHRFZGl0b3IuZ2V0QnVmZmVyKCkuZWRpdG9yY29uZmlnO1xuXHRcdFx0Y29uc3Qgd2dDb3VudCA9ICgpID0+IHtcblx0XHRcdFx0cmV0dXJuIGVkaXRvckRvbVxuXHRcdFx0XHRcdFx0XHQucXVlcnlTZWxlY3RvckFsbCgnKiAvZGVlcC8gLndyYXAtZ3VpZGUnKVxuXHRcdFx0XHRcdFx0XHQubGVuZ3RoO1xuXHRcdFx0fTtcblxuXHRcdFx0ZXhwZWN0KHdnQ291bnQoKSkudG9CZSgxKTtcblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjYW1lbGNhc2Vcblx0XHRcdGVjZmcuc2V0dGluZ3MubWF4X2xpbmVfbGVuZ3RoID0gMzA7XG5cdFx0XHRlY2ZnLmFwcGx5U2V0dGluZ3MoKTtcblx0XHRcdGV4cGVjdCh3Z0NvdW50KCkpLnRvQmUoMSk7XG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2FtZWxjYXNlXG5cdFx0XHRlY2ZnLnNldHRpbmdzLm1heF9saW5lX2xlbmd0aCA9ICdhdXRvJztcblx0XHRcdGVjZmcuYXBwbHlTZXR0aW5ncygpO1xuXHRcdFx0ZXhwZWN0KHdnQ291bnQoKSkudG9CZSgxKTtcblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjYW1lbGNhc2Vcblx0XHRcdGVjZmcuc2V0dGluZ3MubWF4X2xpbmVfbGVuZ3RoID0gMzA7XG5cdFx0XHRlY2ZnLmFwcGx5U2V0dGluZ3MoKTtcblx0XHRcdGV4cGVjdCh3Z0NvdW50KCkpLnRvQmUoMSk7XG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2FtZWxjYXNlXG5cdFx0XHRlY2ZnLnNldHRpbmdzLm1heF9saW5lX2xlbmd0aCA9ICdhdXRvJztcblx0XHRcdGVjZmcuYXBwbHlTZXR0aW5ncygpO1xuXHRcdFx0ZXhwZWN0KHdnQ291bnQoKSkudG9CZSgxKTtcblx0XHR9KTtcblx0fSk7XG59KTtcbiJdfQ==