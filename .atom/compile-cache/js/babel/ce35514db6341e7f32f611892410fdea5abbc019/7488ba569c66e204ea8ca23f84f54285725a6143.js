var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */
/* eslint-env jasmine, atomtest */

/*
	This file contains verifying specs for:
	https://github.com/sindresorhus/atom-editorconfig/issues/85
*/

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var projectRoot = _path2['default'].join(__dirname, 'fixtures', 'iss85');
var filePath = _path2['default'].join(projectRoot, 'test.iss85');
var ecfgPath = _path2['default'].join(projectRoot, '.editorconfig');

var getEcfgForTabWith = function getEcfgForTabWith(tabWidth) {
	return 'root = true\n[*.iss85]\ntab_width = ' + tabWidth + '\n';
};

describe('editorconfig', function () {
	var fileEditor = undefined;
	var ecfgEditor = undefined;

	beforeEach(function () {
		waitsForPromise(function () {
			return Promise.all([atom.packages.activatePackage('editorconfig'), atom.workspace.open(filePath), atom.workspace.open(ecfgPath)]).then(function (results) {
				var _results = _slicedToArray(results, 3);

				fileEditor = _results[1];
				ecfgEditor = _results[2];
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

	xdescribe('Editing an corresponding .editorconfig', function () {
		it('should change the editorconfig-settings in other fileEditors', function () {
			fileEditor.save();
			ecfgEditor.getBuffer().setText(getEcfgForTabWith(85));
			ecfgEditor.save();
			expect(fileEditor.getBuffer().editorconfig.settings.tab_width).toEqual(85);

			ecfgEditor.getBuffer().setText(getEcfgForTabWith(2));
			ecfgEditor.save();
			expect(fileEditor.getBuffer().editorconfig.settings.tab_width).toEqual(2);
		});
	});
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvZWRpdG9yY29uZmlnL3NwZWMvaXNzODUtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7a0JBUWUsSUFBSTs7OztvQkFDRixNQUFNOzs7O0FBRXZCLElBQU0sV0FBVyxHQUFHLGtCQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzlELElBQU0sUUFBUSxHQUFHLGtCQUFLLElBQUksQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDdEQsSUFBTSxRQUFRLEdBQUcsa0JBQUssSUFBSSxDQUFDLFdBQVcsRUFBRSxlQUFlLENBQUMsQ0FBQzs7QUFFekQsSUFBTSxpQkFBaUIsR0FBRyxTQUFwQixpQkFBaUIsQ0FBRyxRQUFRLEVBQUk7QUFDckMsaURBQThDLFFBQVEsUUFBSztDQUMzRCxDQUFDOztBQUVGLFFBQVEsQ0FBQyxjQUFjLEVBQUUsWUFBTTtBQUM5QixLQUFJLFVBQVUsWUFBQSxDQUFDO0FBQ2YsS0FBSSxVQUFVLFlBQUEsQ0FBQzs7QUFFZixXQUFVLENBQUMsWUFBTTtBQUNoQixpQkFBZSxDQUFDO1VBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUNYLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxFQUM3QyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFDN0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQzdCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxPQUFPLEVBQUk7a0NBQ1csT0FBTzs7QUFBakMsY0FBVTtBQUFFLGNBQVU7SUFDekIsQ0FBQztHQUFBLENBQ0YsQ0FBQztFQUNGLENBQUMsQ0FBQzs7QUFFSCxVQUFTLENBQUMsWUFBTTs7QUFFZixNQUFJLENBQUMsWUFBTTtBQUNWLG1CQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBQyxHQUFHLEVBQUUsS0FBSyxFQUFLO0FBQ2pDLFFBQUksQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFO0FBQzNCLHFCQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNwQjtJQUNELENBQUMsQ0FBQztHQUNILENBQUMsQ0FBQzs7QUFFSCxVQUFRLENBQUMsWUFBTTtBQUNkLE9BQUk7QUFDSCxXQUFRLGdCQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxLQUFLLENBQUU7SUFDbEQsQ0FBQyxPQUFPLEdBQUcsRUFBRTtBQUNiLFdBQU8sSUFBSSxDQUFDO0lBQ1o7R0FDRCxFQUFFLElBQUksZUFBYSxRQUFRLENBQUcsQ0FBQztFQUNoQyxDQUFDLENBQUM7O0FBRUgsVUFBUyxDQUFDLHdDQUF3QyxFQUFFLFlBQU07QUFDekQsSUFBRSxDQUFDLDhEQUE4RCxFQUFFLFlBQU07QUFDeEUsYUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2xCLGFBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN0RCxhQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDbEIsU0FBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQzs7QUFFM0UsYUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JELGFBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNsQixTQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQzFFLENBQUMsQ0FBQztFQUNILENBQUMsQ0FBQztDQUNILENBQUMsQ0FBQyIsImZpbGUiOiIvaG9tZS90aGVrYXJsbzk1Ly5hdG9tL3BhY2thZ2VzL2VkaXRvcmNvbmZpZy9zcGVjL2lzczg1LXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG4vKiBlc2xpbnQtZW52IGphc21pbmUsIGF0b210ZXN0ICovXG5cbi8qXG5cdFRoaXMgZmlsZSBjb250YWlucyB2ZXJpZnlpbmcgc3BlY3MgZm9yOlxuXHRodHRwczovL2dpdGh1Yi5jb20vc2luZHJlc29yaHVzL2F0b20tZWRpdG9yY29uZmlnL2lzc3Vlcy84NVxuKi9cblxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5jb25zdCBwcm9qZWN0Um9vdCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycsICdpc3M4NScpO1xuY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4ocHJvamVjdFJvb3QsICd0ZXN0Lmlzczg1Jyk7XG5jb25zdCBlY2ZnUGF0aCA9IHBhdGguam9pbihwcm9qZWN0Um9vdCwgJy5lZGl0b3Jjb25maWcnKTtcblxuY29uc3QgZ2V0RWNmZ0ZvclRhYldpdGggPSB0YWJXaWR0aCA9PiB7XG5cdHJldHVybiBgcm9vdCA9IHRydWVcXG5bKi5pc3M4NV1cXG50YWJfd2lkdGggPSAke3RhYldpZHRofVxcbmA7XG59O1xuXG5kZXNjcmliZSgnZWRpdG9yY29uZmlnJywgKCkgPT4ge1xuXHRsZXQgZmlsZUVkaXRvcjtcblx0bGV0IGVjZmdFZGl0b3I7XG5cblx0YmVmb3JlRWFjaCgoKSA9PiB7XG5cdFx0d2FpdHNGb3JQcm9taXNlKCgpID0+XG5cdFx0XHRQcm9taXNlLmFsbChbXG5cdFx0XHRcdGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdlZGl0b3Jjb25maWcnKSxcblx0XHRcdFx0YXRvbS53b3Jrc3BhY2Uub3BlbihmaWxlUGF0aCksXG5cdFx0XHRcdGF0b20ud29ya3NwYWNlLm9wZW4oZWNmZ1BhdGgpXG5cdFx0XHRdKS50aGVuKHJlc3VsdHMgPT4ge1xuXHRcdFx0XHRbLCBmaWxlRWRpdG9yLCBlY2ZnRWRpdG9yXSA9IHJlc3VsdHM7XG5cdFx0XHR9KVxuXHRcdCk7XG5cdH0pO1xuXG5cdGFmdGVyRWFjaCgoKSA9PiB7XG5cdFx0Ly8gcmVtb3ZlIHRoZSBjcmVhdGVkIGZpeHR1cmUsIGlmIGl0IGV4aXN0c1xuXHRcdHJ1bnMoKCkgPT4ge1xuXHRcdFx0ZnMuc3RhdChmaWxlUGF0aCwgKGVyciwgc3RhdHMpID0+IHtcblx0XHRcdFx0aWYgKCFlcnIgJiYgc3RhdHMuaXNGaWxlKCkpIHtcblx0XHRcdFx0XHRmcy51bmxpbmsoZmlsZVBhdGgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdHdhaXRzRm9yKCgpID0+IHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdHJldHVybiAoZnMuc3RhdFN5bmMoZmlsZVBhdGgpLmlzRmlsZSgpID09PSBmYWxzZSk7XG5cdFx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fSwgNTAwMCwgYHJlbW92ZWQgJHtmaWxlUGF0aH1gKTtcblx0fSk7XG5cblx0eGRlc2NyaWJlKCdFZGl0aW5nIGFuIGNvcnJlc3BvbmRpbmcgLmVkaXRvcmNvbmZpZycsICgpID0+IHtcblx0XHRpdCgnc2hvdWxkIGNoYW5nZSB0aGUgZWRpdG9yY29uZmlnLXNldHRpbmdzIGluIG90aGVyIGZpbGVFZGl0b3JzJywgKCkgPT4ge1xuXHRcdFx0ZmlsZUVkaXRvci5zYXZlKCk7XG5cdFx0XHRlY2ZnRWRpdG9yLmdldEJ1ZmZlcigpLnNldFRleHQoZ2V0RWNmZ0ZvclRhYldpdGgoODUpKTtcblx0XHRcdGVjZmdFZGl0b3Iuc2F2ZSgpO1xuXHRcdFx0ZXhwZWN0KGZpbGVFZGl0b3IuZ2V0QnVmZmVyKCkuZWRpdG9yY29uZmlnLnNldHRpbmdzLnRhYl93aWR0aCkudG9FcXVhbCg4NSk7XG5cblx0XHRcdGVjZmdFZGl0b3IuZ2V0QnVmZmVyKCkuc2V0VGV4dChnZXRFY2ZnRm9yVGFiV2l0aCgyKSk7XG5cdFx0XHRlY2ZnRWRpdG9yLnNhdmUoKTtcblx0XHRcdGV4cGVjdChmaWxlRWRpdG9yLmdldEJ1ZmZlcigpLmVkaXRvcmNvbmZpZy5zZXR0aW5ncy50YWJfd2lkdGgpLnRvRXF1YWwoMik7XG5cdFx0fSk7XG5cdH0pO1xufSk7XG4iXX0=