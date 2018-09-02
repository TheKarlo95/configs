function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */
/* eslint-env jasmine, atomtest */

/*
  This file contains verifying specs for:
  https://github.com/sindresorhus/atom-editorconfig/issues/139

  If the max_line_length is set to 0 tha wrapGuide is set to 1.
*/

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var testPrefix = _path2['default'].basename(__filename).split('-').shift();
var projectRoot = _path2['default'].join(__dirname, 'fixtures', testPrefix);
var filePath = _path2['default'].join(projectRoot, 'test.' + testPrefix);

describe('editorconfig', function () {
	var textEditors = [];

	beforeEach(function () {
		waitsForPromise(function () {
			return Promise.all([atom.packages.activatePackage('editorconfig'), atom.workspace.open(filePath)]).then(function (results) {
				textEditors = results.splice(1);
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
		it('should default zero max_line_length to auto', function () {
			expect(textEditors[0].getBuffer().editorconfig.settings.max_line_length).toEqual('auto');
		});
	});
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvZWRpdG9yY29uZmlnL3NwZWMvaXNzMTM5LXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O2tCQVVlLElBQUk7Ozs7b0JBQ0YsTUFBTTs7OztBQUV2QixJQUFNLFVBQVUsR0FBRyxrQkFBSyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2hFLElBQU0sV0FBVyxHQUFHLGtCQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ2pFLElBQU0sUUFBUSxHQUFHLGtCQUFLLElBQUksQ0FBQyxXQUFXLFlBQVUsVUFBVSxDQUFHLENBQUM7O0FBRTlELFFBQVEsQ0FBQyxjQUFjLEVBQUUsWUFBTTtBQUM5QixLQUFJLFdBQVcsR0FBRyxFQUFFLENBQUM7O0FBRXJCLFdBQVUsQ0FBQyxZQUFNO0FBQ2hCLGlCQUFlLENBQUM7VUFDZixPQUFPLENBQUMsR0FBRyxDQUFDLENBQ1gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLEVBQzdDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUM3QixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsT0FBTyxFQUFJO0FBQ2xCLGVBQVcsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7R0FBQSxDQUNGLENBQUM7RUFDRixDQUFDLENBQUM7O0FBRUgsVUFBUyxDQUFDLFlBQU07O0FBRWYsTUFBSSxDQUFDLFlBQU07QUFDVixtQkFBRyxJQUFJLENBQUMsUUFBUSxFQUFFLFVBQUMsR0FBRyxFQUFFLEtBQUssRUFBSztBQUNqQyxRQUFJLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRTtBQUMzQixxQkFBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDcEI7SUFDRCxDQUFDLENBQUM7R0FDSCxDQUFDLENBQUM7O0FBRUgsVUFBUSxDQUFDLFlBQU07QUFDZCxPQUFJO0FBQ0gsV0FBTyxnQkFBRyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLEtBQUssS0FBSyxDQUFDO0lBQ2hELENBQUMsT0FBTyxHQUFHLEVBQUU7QUFDYixXQUFPLElBQUksQ0FBQztJQUNaO0dBQ0QsRUFBRSxJQUFJLGVBQWEsUUFBUSxDQUFHLENBQUM7RUFDaEMsQ0FBQyxDQUFDOztBQUVILFNBQVEsQ0FBQyxjQUFjLEVBQUUsWUFBTTtBQUM5QixJQUFFLENBQUMsNkNBQTZDLEVBQUUsWUFBTTtBQUN2RCxTQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0dBQ3pGLENBQUMsQ0FBQztFQUNILENBQUMsQ0FBQztDQUNILENBQUMsQ0FBQyIsImZpbGUiOiIvaG9tZS90aGVrYXJsbzk1Ly5hdG9tL3BhY2thZ2VzL2VkaXRvcmNvbmZpZy9zcGVjL2lzczEzOS1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuLyogZXNsaW50LWVudiBqYXNtaW5lLCBhdG9tdGVzdCAqL1xuXG4vKlxuICBUaGlzIGZpbGUgY29udGFpbnMgdmVyaWZ5aW5nIHNwZWNzIGZvcjpcbiAgaHR0cHM6Ly9naXRodWIuY29tL3NpbmRyZXNvcmh1cy9hdG9tLWVkaXRvcmNvbmZpZy9pc3N1ZXMvMTM5XG5cbiAgSWYgdGhlIG1heF9saW5lX2xlbmd0aCBpcyBzZXQgdG8gMCB0aGEgd3JhcEd1aWRlIGlzIHNldCB0byAxLlxuKi9cblxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5jb25zdCB0ZXN0UHJlZml4ID0gcGF0aC5iYXNlbmFtZShfX2ZpbGVuYW1lKS5zcGxpdCgnLScpLnNoaWZ0KCk7XG5jb25zdCBwcm9qZWN0Um9vdCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycsIHRlc3RQcmVmaXgpO1xuY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4ocHJvamVjdFJvb3QsIGB0ZXN0LiR7dGVzdFByZWZpeH1gKTtcblxuZGVzY3JpYmUoJ2VkaXRvcmNvbmZpZycsICgpID0+IHtcblx0bGV0IHRleHRFZGl0b3JzID0gW107XG5cblx0YmVmb3JlRWFjaCgoKSA9PiB7XG5cdFx0d2FpdHNGb3JQcm9taXNlKCgpID0+XG5cdFx0XHRQcm9taXNlLmFsbChbXG5cdFx0XHRcdGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdlZGl0b3Jjb25maWcnKSxcblx0XHRcdFx0YXRvbS53b3Jrc3BhY2Uub3BlbihmaWxlUGF0aClcblx0XHRcdF0pLnRoZW4ocmVzdWx0cyA9PiB7XG5cdFx0XHRcdHRleHRFZGl0b3JzID0gcmVzdWx0cy5zcGxpY2UoMSk7XG5cdFx0XHR9KVxuXHRcdCk7XG5cdH0pO1xuXG5cdGFmdGVyRWFjaCgoKSA9PiB7XG5cdFx0Ly8gcmVtb3ZlIHRoZSBjcmVhdGVkIGZpeHR1cmUsIGlmIGl0IGV4aXN0c1xuXHRcdHJ1bnMoKCkgPT4ge1xuXHRcdFx0ZnMuc3RhdChmaWxlUGF0aCwgKGVyciwgc3RhdHMpID0+IHtcblx0XHRcdFx0aWYgKCFlcnIgJiYgc3RhdHMuaXNGaWxlKCkpIHtcblx0XHRcdFx0XHRmcy51bmxpbmsoZmlsZVBhdGgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdHdhaXRzRm9yKCgpID0+IHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdHJldHVybiBmcy5zdGF0U3luYyhmaWxlUGF0aCkuaXNGaWxlKCkgPT09IGZhbHNlO1xuXHRcdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH0sIDUwMDAsIGByZW1vdmVkICR7ZmlsZVBhdGh9YCk7XG5cdH0pO1xuXG5cdGRlc2NyaWJlKCdFZGl0b3JDb25maWcnLCAoKSA9PiB7XG5cdFx0aXQoJ3Nob3VsZCBkZWZhdWx0IHplcm8gbWF4X2xpbmVfbGVuZ3RoIHRvIGF1dG8nLCAoKSA9PiB7XG5cdFx0XHRleHBlY3QodGV4dEVkaXRvcnNbMF0uZ2V0QnVmZmVyKCkuZWRpdG9yY29uZmlnLnNldHRpbmdzLm1heF9saW5lX2xlbmd0aCkudG9FcXVhbCgnYXV0bycpO1xuXHRcdH0pO1xuXHR9KTtcbn0pO1xuIl19