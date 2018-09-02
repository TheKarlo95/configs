function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */
/* eslint-env jasmine, atomtest */

/*
  This file contains verifying specs for:
  https://github.com/sindresorhus/atom-editorconfig/issues/132

  If the indent_size /or the tab_width is set to 0 Atom throws an exception.
*/

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var testPrefix = _path2['default'].basename(__filename).split('-').shift();
var projectRoot = _path2['default'].join(__dirname, 'fixtures', testPrefix);
var filePath = _path2['default'].join(projectRoot, 'test.' + testPrefix + 'a');
var filePath2 = _path2['default'].join(projectRoot, 'test.' + testPrefix + 'b');

describe('editorconfig', function () {
	var textEditors = [];

	beforeEach(function () {
		waitsForPromise(function () {
			return Promise.all([atom.packages.activatePackage('editorconfig'), atom.workspace.open(filePath), atom.workspace.open(filePath2)]).then(function (results) {
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
			_fs2['default'].stat(filePath2, function (err, stats) {
				if (!err && stats.isFile()) {
					_fs2['default'].unlink(filePath2);
				}
			});
		});

		waitsFor(function () {
			try {
				return _fs2['default'].statSync(filePath).isFile() === false && _fs2['default'].statSync(filePath2).isFile() === false;
			} catch (err) {
				return true;
			}
		}, 5000, 'removed ' + filePath + ' and ' + filePath2);
	});

	describe('EditorConfig', function () {
		it('should default zero indent_size and tab_width to auto', function () {
			expect(textEditors[0].getBuffer().editorconfig.settings.tab_width).toEqual('auto');
			expect(textEditors[1].getBuffer().editorconfig.settings.tab_width).toEqual('auto');
		});
	});
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvZWRpdG9yY29uZmlnL3NwZWMvaXNzMTMyLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O2tCQVVlLElBQUk7Ozs7b0JBQ0YsTUFBTTs7OztBQUV2QixJQUFNLFVBQVUsR0FBRyxrQkFBSyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2hFLElBQU0sV0FBVyxHQUFHLGtCQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ2pFLElBQU0sUUFBUSxHQUFHLGtCQUFLLElBQUksQ0FDekIsV0FBVyxZQUNILFVBQVUsT0FDbEIsQ0FBQztBQUNGLElBQU0sU0FBUyxHQUFHLGtCQUFLLElBQUksQ0FDMUIsV0FBVyxZQUNILFVBQVUsT0FDbEIsQ0FBQzs7QUFFRixRQUFRLENBQUMsY0FBYyxFQUFFLFlBQU07QUFDOUIsS0FBSSxXQUFXLEdBQUcsRUFBRSxDQUFDOztBQUVyQixXQUFVLENBQUMsWUFBTTtBQUNoQixpQkFBZSxDQUFDO1VBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUNYLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxFQUM3QyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFDN0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQzlCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxPQUFPLEVBQUk7QUFDbEIsZUFBVyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEMsQ0FBQztHQUFBLENBQ0YsQ0FBQztFQUNGLENBQUMsQ0FBQzs7QUFFSCxVQUFTLENBQUMsWUFBTTs7QUFFZixNQUFJLENBQUMsWUFBTTtBQUNWLG1CQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBQyxHQUFHLEVBQUUsS0FBSyxFQUFLO0FBQ2pDLFFBQUksQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFO0FBQzNCLHFCQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNwQjtJQUNELENBQUMsQ0FBQztBQUNILG1CQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBQyxHQUFHLEVBQUUsS0FBSyxFQUFLO0FBQ2xDLFFBQUksQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFO0FBQzNCLHFCQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUNyQjtJQUNELENBQUMsQ0FBQztHQUNILENBQUMsQ0FBQzs7QUFFSCxVQUFRLENBQUMsWUFBTTtBQUNkLE9BQUk7QUFDSCxXQUFPLGdCQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxLQUFLLElBQzlDLGdCQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxLQUFLLENBQUM7SUFDM0MsQ0FBQyxPQUFPLEdBQUcsRUFBRTtBQUNiLFdBQU8sSUFBSSxDQUFDO0lBQ1o7R0FDRCxFQUFFLElBQUksZUFBYSxRQUFRLGFBQVEsU0FBUyxDQUFHLENBQUM7RUFDakQsQ0FBQyxDQUFDOztBQUVILFNBQVEsQ0FBQyxjQUFjLEVBQUUsWUFBTTtBQUM5QixJQUFFLENBQUMsdURBQXVELEVBQUUsWUFBTTtBQUNqRSxTQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ25GLFNBQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7R0FDbkYsQ0FBQyxDQUFDO0VBQ0gsQ0FBQyxDQUFDO0NBQ0gsQ0FBQyxDQUFDIiwiZmlsZSI6Ii9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvZWRpdG9yY29uZmlnL3NwZWMvaXNzMTMyLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG4vKiBlc2xpbnQtZW52IGphc21pbmUsIGF0b210ZXN0ICovXG5cbi8qXG4gIFRoaXMgZmlsZSBjb250YWlucyB2ZXJpZnlpbmcgc3BlY3MgZm9yOlxuICBodHRwczovL2dpdGh1Yi5jb20vc2luZHJlc29yaHVzL2F0b20tZWRpdG9yY29uZmlnL2lzc3Vlcy8xMzJcblxuICBJZiB0aGUgaW5kZW50X3NpemUgL29yIHRoZSB0YWJfd2lkdGggaXMgc2V0IHRvIDAgQXRvbSB0aHJvd3MgYW4gZXhjZXB0aW9uLlxuKi9cblxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5jb25zdCB0ZXN0UHJlZml4ID0gcGF0aC5iYXNlbmFtZShfX2ZpbGVuYW1lKS5zcGxpdCgnLScpLnNoaWZ0KCk7XG5jb25zdCBwcm9qZWN0Um9vdCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycsIHRlc3RQcmVmaXgpO1xuY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4oXG5cdHByb2plY3RSb290LFxuXHRgdGVzdC4ke3Rlc3RQcmVmaXh9YWBcbik7XG5jb25zdCBmaWxlUGF0aDIgPSBwYXRoLmpvaW4oXG5cdHByb2plY3RSb290LFxuXHRgdGVzdC4ke3Rlc3RQcmVmaXh9YmBcbik7XG5cbmRlc2NyaWJlKCdlZGl0b3Jjb25maWcnLCAoKSA9PiB7XG5cdGxldCB0ZXh0RWRpdG9ycyA9IFtdO1xuXG5cdGJlZm9yZUVhY2goKCkgPT4ge1xuXHRcdHdhaXRzRm9yUHJvbWlzZSgoKSA9PlxuXHRcdFx0UHJvbWlzZS5hbGwoW1xuXHRcdFx0XHRhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnZWRpdG9yY29uZmlnJyksXG5cdFx0XHRcdGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZVBhdGgpLFxuXHRcdFx0XHRhdG9tLndvcmtzcGFjZS5vcGVuKGZpbGVQYXRoMilcblx0XHRcdF0pLnRoZW4ocmVzdWx0cyA9PiB7XG5cdFx0XHRcdHRleHRFZGl0b3JzID0gcmVzdWx0cy5zcGxpY2UoMSk7XG5cdFx0XHR9KVxuXHRcdCk7XG5cdH0pO1xuXG5cdGFmdGVyRWFjaCgoKSA9PiB7XG5cdFx0Ly8gcmVtb3ZlIHRoZSBjcmVhdGVkIGZpeHR1cmUsIGlmIGl0IGV4aXN0c1xuXHRcdHJ1bnMoKCkgPT4ge1xuXHRcdFx0ZnMuc3RhdChmaWxlUGF0aCwgKGVyciwgc3RhdHMpID0+IHtcblx0XHRcdFx0aWYgKCFlcnIgJiYgc3RhdHMuaXNGaWxlKCkpIHtcblx0XHRcdFx0XHRmcy51bmxpbmsoZmlsZVBhdGgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdGZzLnN0YXQoZmlsZVBhdGgyLCAoZXJyLCBzdGF0cykgPT4ge1xuXHRcdFx0XHRpZiAoIWVyciAmJiBzdGF0cy5pc0ZpbGUoKSkge1xuXHRcdFx0XHRcdGZzLnVubGluayhmaWxlUGF0aDIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdHdhaXRzRm9yKCgpID0+IHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdHJldHVybiBmcy5zdGF0U3luYyhmaWxlUGF0aCkuaXNGaWxlKCkgPT09IGZhbHNlICYmXG5cdFx0XHRcdFx0ZnMuc3RhdFN5bmMoZmlsZVBhdGgyKS5pc0ZpbGUoKSA9PT0gZmFsc2U7XG5cdFx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fSwgNTAwMCwgYHJlbW92ZWQgJHtmaWxlUGF0aH0gYW5kICR7ZmlsZVBhdGgyfWApO1xuXHR9KTtcblxuXHRkZXNjcmliZSgnRWRpdG9yQ29uZmlnJywgKCkgPT4ge1xuXHRcdGl0KCdzaG91bGQgZGVmYXVsdCB6ZXJvIGluZGVudF9zaXplIGFuZCB0YWJfd2lkdGggdG8gYXV0bycsICgpID0+IHtcblx0XHRcdGV4cGVjdCh0ZXh0RWRpdG9yc1swXS5nZXRCdWZmZXIoKS5lZGl0b3Jjb25maWcuc2V0dGluZ3MudGFiX3dpZHRoKS50b0VxdWFsKCdhdXRvJyk7XG5cdFx0XHRleHBlY3QodGV4dEVkaXRvcnNbMV0uZ2V0QnVmZmVyKCkuZWRpdG9yY29uZmlnLnNldHRpbmdzLnRhYl93aWR0aCkudG9FcXVhbCgnYXV0bycpO1xuXHRcdH0pO1xuXHR9KTtcbn0pO1xuIl19