function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */
/* eslint-env jasmine, atomtest */

/*
	This file contains verifying specs for:
	https://github.com/sindresorhus/atom-editorconfig/issues/157

	The current implementation resets the tabType without respecting Atom's default implementation
	where - in the case there's no tabType prescribed - at first is checked if the file already
	uses a specific tabType. Then thesetting isbeing chosen by the content's scope.
*/

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var testPrefix = _path2['default'].basename(__filename).split('-').shift();
var projectRoot = _path2['default'].join(__dirname, 'fixtures', testPrefix);
var filePath = _path2['default'].join(projectRoot, 'test.' + testPrefix);

var snippetWithSoftTabs = '    this is it\n  let us go on.';
var snippetWithHardTabs = '\t\tthis is it\n\tlet us go on.';

describe('editorconfig', function () {
	var textEditor = undefined;

	beforeEach(function () {
		waitsForPromise(function () {
			return Promise.all([atom.packages.activatePackage('editorconfig'), atom.workspace.open(filePath)]).then(function (results) {
				textEditor = results.pop();
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
		it('should consult editor.usesSoftTabs in case tabType is set to auto', function () {
			var configOptions = { scope: textEditor.getRootScopeDescriptor() };
			var ecfg = textEditor.getBuffer().editorconfig;

			// eslint-disable-next-line camelcase
			ecfg.settings.indent_style = 'auto';

			atom.config.set('editor.softTabs', true, configOptions);
			textEditor.setText(snippetWithHardTabs);
			ecfg.applySettings();

			expect(textEditor.getSoftTabs()).toBeFalsy();

			atom.config.set('editor.softTabs', false, configOptions);
			textEditor.setText(snippetWithSoftTabs);
			ecfg.applySettings();

			expect(textEditor.getSoftTabs()).toBeTruthy();
		});
	});
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvZWRpdG9yY29uZmlnL3NwZWMvaXNzMTU3LXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7a0JBWWUsSUFBSTs7OztvQkFDRixNQUFNOzs7O0FBRXZCLElBQU0sVUFBVSxHQUFHLGtCQUFLLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDaEUsSUFBTSxXQUFXLEdBQUcsa0JBQUssSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDakUsSUFBTSxRQUFRLEdBQUcsa0JBQUssSUFBSSxDQUFDLFdBQVcsWUFBVSxVQUFVLENBQUcsQ0FBQzs7QUFFOUQsSUFBTSxtQkFBbUIsR0FBRyxpQ0FBaUMsQ0FBQztBQUM5RCxJQUFNLG1CQUFtQixHQUFHLGlDQUFpQyxDQUFDOztBQUU5RCxRQUFRLENBQUMsY0FBYyxFQUFFLFlBQU07QUFDOUIsS0FBSSxVQUFVLFlBQUEsQ0FBQzs7QUFFZixXQUFVLENBQUMsWUFBTTtBQUNoQixpQkFBZSxDQUFDO1VBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUNYLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxFQUM3QyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FDN0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLE9BQU8sRUFBSTtBQUNsQixjQUFVLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzNCLENBQUM7R0FBQSxDQUNGLENBQUM7RUFDRixDQUFDLENBQUM7O0FBRUgsVUFBUyxDQUFDLFlBQU07O0FBRWYsTUFBSSxDQUFDLFlBQU07QUFDVixtQkFBRyxJQUFJLENBQUMsUUFBUSxFQUFFLFVBQUMsR0FBRyxFQUFFLEtBQUssRUFBSztBQUNqQyxRQUFJLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRTtBQUMzQixxQkFBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDcEI7SUFDRCxDQUFDLENBQUM7R0FDSCxDQUFDLENBQUM7O0FBRUgsVUFBUSxDQUFDLFlBQU07QUFDZCxPQUFJO0FBQ0gsV0FBTyxnQkFBRyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLEtBQUssS0FBSyxDQUFDO0lBQ2hELENBQUMsT0FBTyxHQUFHLEVBQUU7QUFDYixXQUFPLElBQUksQ0FBQztJQUNaO0dBQ0QsRUFBRSxJQUFJLGVBQWEsUUFBUSxDQUFHLENBQUM7RUFDaEMsQ0FBQyxDQUFDOztBQUVILFNBQVEsQ0FBQyxjQUFjLEVBQUUsWUFBTTtBQUM5QixJQUFFLENBQUMsbUVBQW1FLEVBQUUsWUFBTTtBQUM3RSxPQUFNLGFBQWEsR0FBRyxFQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsc0JBQXNCLEVBQUUsRUFBQyxDQUFDO0FBQ25FLE9BQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxZQUFZLENBQUM7OztBQUdqRCxPQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUM7O0FBRXBDLE9BQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztBQUN4RCxhQUFVLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDeEMsT0FBSSxDQUFDLGFBQWEsRUFBRSxDQUFDOztBQUVyQixTQUFNLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7O0FBRTdDLE9BQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztBQUN6RCxhQUFVLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDeEMsT0FBSSxDQUFDLGFBQWEsRUFBRSxDQUFDOztBQUVyQixTQUFNLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7R0FDOUMsQ0FBQyxDQUFDO0VBQ0gsQ0FBQyxDQUFDO0NBQ0gsQ0FBQyxDQUFDIiwiZmlsZSI6Ii9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvZWRpdG9yY29uZmlnL3NwZWMvaXNzMTU3LXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG4vKiBlc2xpbnQtZW52IGphc21pbmUsIGF0b210ZXN0ICovXG5cbi8qXG5cdFRoaXMgZmlsZSBjb250YWlucyB2ZXJpZnlpbmcgc3BlY3MgZm9yOlxuXHRodHRwczovL2dpdGh1Yi5jb20vc2luZHJlc29yaHVzL2F0b20tZWRpdG9yY29uZmlnL2lzc3Vlcy8xNTdcblxuXHRUaGUgY3VycmVudCBpbXBsZW1lbnRhdGlvbiByZXNldHMgdGhlIHRhYlR5cGUgd2l0aG91dCByZXNwZWN0aW5nIEF0b20ncyBkZWZhdWx0IGltcGxlbWVudGF0aW9uXG5cdHdoZXJlIC0gaW4gdGhlIGNhc2UgdGhlcmUncyBubyB0YWJUeXBlIHByZXNjcmliZWQgLSBhdCBmaXJzdCBpcyBjaGVja2VkIGlmIHRoZSBmaWxlIGFscmVhZHlcblx0dXNlcyBhIHNwZWNpZmljIHRhYlR5cGUuIFRoZW4gdGhlc2V0dGluZyBpc2JlaW5nIGNob3NlbiBieSB0aGUgY29udGVudCdzIHNjb3BlLlxuKi9cblxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5jb25zdCB0ZXN0UHJlZml4ID0gcGF0aC5iYXNlbmFtZShfX2ZpbGVuYW1lKS5zcGxpdCgnLScpLnNoaWZ0KCk7XG5jb25zdCBwcm9qZWN0Um9vdCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycsIHRlc3RQcmVmaXgpO1xuY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4ocHJvamVjdFJvb3QsIGB0ZXN0LiR7dGVzdFByZWZpeH1gKTtcblxuY29uc3Qgc25pcHBldFdpdGhTb2Z0VGFicyA9ICcgICAgdGhpcyBpcyBpdFxcbiAgbGV0IHVzIGdvIG9uLic7XG5jb25zdCBzbmlwcGV0V2l0aEhhcmRUYWJzID0gJ1xcdFxcdHRoaXMgaXMgaXRcXG5cXHRsZXQgdXMgZ28gb24uJztcblxuZGVzY3JpYmUoJ2VkaXRvcmNvbmZpZycsICgpID0+IHtcblx0bGV0IHRleHRFZGl0b3I7XG5cblx0YmVmb3JlRWFjaCgoKSA9PiB7XG5cdFx0d2FpdHNGb3JQcm9taXNlKCgpID0+XG5cdFx0XHRQcm9taXNlLmFsbChbXG5cdFx0XHRcdGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdlZGl0b3Jjb25maWcnKSxcblx0XHRcdFx0YXRvbS53b3Jrc3BhY2Uub3BlbihmaWxlUGF0aClcblx0XHRcdF0pLnRoZW4ocmVzdWx0cyA9PiB7XG5cdFx0XHRcdHRleHRFZGl0b3IgPSByZXN1bHRzLnBvcCgpO1xuXHRcdFx0fSlcblx0XHQpO1xuXHR9KTtcblxuXHRhZnRlckVhY2goKCkgPT4ge1xuXHRcdC8vIHJlbW92ZSB0aGUgY3JlYXRlZCBmaXh0dXJlLCBpZiBpdCBleGlzdHNcblx0XHRydW5zKCgpID0+IHtcblx0XHRcdGZzLnN0YXQoZmlsZVBhdGgsIChlcnIsIHN0YXRzKSA9PiB7XG5cdFx0XHRcdGlmICghZXJyICYmIHN0YXRzLmlzRmlsZSgpKSB7XG5cdFx0XHRcdFx0ZnMudW5saW5rKGZpbGVQYXRoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHR3YWl0c0ZvcigoKSA9PiB7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRyZXR1cm4gZnMuc3RhdFN5bmMoZmlsZVBhdGgpLmlzRmlsZSgpID09PSBmYWxzZTtcblx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9LCA1MDAwLCBgcmVtb3ZlZCAke2ZpbGVQYXRofWApO1xuXHR9KTtcblxuXHRkZXNjcmliZSgnRWRpdG9yQ29uZmlnJywgKCkgPT4ge1xuXHRcdGl0KCdzaG91bGQgY29uc3VsdCBlZGl0b3IudXNlc1NvZnRUYWJzIGluIGNhc2UgdGFiVHlwZSBpcyBzZXQgdG8gYXV0bycsICgpID0+IHtcblx0XHRcdGNvbnN0IGNvbmZpZ09wdGlvbnMgPSB7c2NvcGU6IHRleHRFZGl0b3IuZ2V0Um9vdFNjb3BlRGVzY3JpcHRvcigpfTtcblx0XHRcdGNvbnN0IGVjZmcgPSB0ZXh0RWRpdG9yLmdldEJ1ZmZlcigpLmVkaXRvcmNvbmZpZztcblxuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNhbWVsY2FzZVxuXHRcdFx0ZWNmZy5zZXR0aW5ncy5pbmRlbnRfc3R5bGUgPSAnYXV0byc7XG5cblx0XHRcdGF0b20uY29uZmlnLnNldCgnZWRpdG9yLnNvZnRUYWJzJywgdHJ1ZSwgY29uZmlnT3B0aW9ucyk7XG5cdFx0XHR0ZXh0RWRpdG9yLnNldFRleHQoc25pcHBldFdpdGhIYXJkVGFicyk7XG5cdFx0XHRlY2ZnLmFwcGx5U2V0dGluZ3MoKTtcblxuXHRcdFx0ZXhwZWN0KHRleHRFZGl0b3IuZ2V0U29mdFRhYnMoKSkudG9CZUZhbHN5KCk7XG5cblx0XHRcdGF0b20uY29uZmlnLnNldCgnZWRpdG9yLnNvZnRUYWJzJywgZmFsc2UsIGNvbmZpZ09wdGlvbnMpO1xuXHRcdFx0dGV4dEVkaXRvci5zZXRUZXh0KHNuaXBwZXRXaXRoU29mdFRhYnMpO1xuXHRcdFx0ZWNmZy5hcHBseVNldHRpbmdzKCk7XG5cblx0XHRcdGV4cGVjdCh0ZXh0RWRpdG9yLmdldFNvZnRUYWJzKCkpLnRvQmVUcnV0aHkoKTtcblx0XHR9KTtcblx0fSk7XG59KTtcbiJdfQ==