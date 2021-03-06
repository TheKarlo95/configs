function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */
/* eslint-env jasmine, atomtest */

/*
  This file contains verifying specs for:
  https://github.com/sindresorhus/atom-editorconfig/issues/128

  To apply the max_line_length-property the wrap-guide-package is being de/activated if needed,
  to avoid that two wrap-guides are being displayed at once. The past implementation assumed that
  changing the activation-state wouldn't be able to override a package-disablement. It turned out
  that the package activation-state must be guarded by a disablement-proof.
*/

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var projectRoot = _path2['default'].join(__dirname, 'fixtures');
var filePath = _path2['default'].join(projectRoot, 'test.' + _path2['default'].basename(__filename).split('-').shift());

describe('editorconfig', function () {
	var textEditor = undefined;

	beforeEach(function () {
		waitsForPromise(function () {
			return Promise.all([atom.packages.activatePackage('editorconfig'), atom.packages.disablePackage('wrap-guide'), atom.workspace.open(filePath)]).then(function (results) {
				textEditor = results[2];
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

	describe('Atom with disabled wrap-guide', function () {
		beforeEach(function () {
			Object.assign(textEditor.getBuffer().editorconfig.settings, {
				max_line_length: 'auto' // eslint-disable-line camelcase
			});
		});

		it('should not activate wrap-guide', function () {
			expect(atom.packages.isPackageActive('wrap-guide')).toEqual(false);
		});
	});
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvZWRpdG9yY29uZmlnL3NwZWMvaXNzMTI4LXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O2tCQWFlLElBQUk7Ozs7b0JBQ0YsTUFBTTs7OztBQUV2QixJQUFNLFdBQVcsR0FBRyxrQkFBSyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3JELElBQU0sUUFBUSxHQUFHLGtCQUFLLElBQUksQ0FDekIsV0FBVyxZQUNILGtCQUFLLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQ3BELENBQUM7O0FBRUYsUUFBUSxDQUFDLGNBQWMsRUFBRSxZQUFNO0FBQzlCLEtBQUksVUFBVSxZQUFBLENBQUM7O0FBRWYsV0FBVSxDQUFDLFlBQU07QUFDaEIsaUJBQWUsQ0FBQztVQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FDWCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsRUFDN0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLEVBQzFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUM3QixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsT0FBTyxFQUFJO0FBQ2xCLGNBQVUsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEIsQ0FBQztHQUFBLENBQ0YsQ0FBQztFQUNGLENBQUMsQ0FBQzs7QUFFSCxVQUFTLENBQUMsWUFBTTs7QUFFZixNQUFJLENBQUMsWUFBTTtBQUNWLG1CQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBQyxHQUFHLEVBQUUsS0FBSyxFQUFLO0FBQ2pDLFFBQUksQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFO0FBQzNCLHFCQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNwQjtJQUNELENBQUMsQ0FBQztHQUNILENBQUMsQ0FBQzs7QUFFSCxVQUFRLENBQUMsWUFBTTtBQUNkLE9BQUk7QUFDSCxXQUFPLGdCQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxLQUFLLENBQUM7SUFDaEQsQ0FBQyxPQUFPLEdBQUcsRUFBRTtBQUNiLFdBQU8sSUFBSSxDQUFDO0lBQ1o7R0FDRCxFQUFFLElBQUksZUFBYSxRQUFRLENBQUcsQ0FBQztFQUNoQyxDQUFDLENBQUM7O0FBRUgsU0FBUSxDQUFDLCtCQUErQixFQUFFLFlBQU07QUFDL0MsWUFBVSxDQUFDLFlBQU07QUFDaEIsU0FBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRTtBQUMzRCxtQkFBZSxFQUFFLE1BQU07SUFDdkIsQ0FBQyxDQUFDO0dBQ0gsQ0FBQyxDQUFDOztBQUVILElBQUUsQ0FBQyxnQ0FBZ0MsRUFBRSxZQUFNO0FBQzFDLFNBQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUNuRSxDQUFDLENBQUM7RUFDSCxDQUFDLENBQUM7Q0FDSCxDQUFDLENBQUMiLCJmaWxlIjoiL2hvbWUvdGhla2FybG85NS8uYXRvbS9wYWNrYWdlcy9lZGl0b3Jjb25maWcvc3BlYy9pc3MxMjgtc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cbi8qIGVzbGludC1lbnYgamFzbWluZSwgYXRvbXRlc3QgKi9cblxuLypcbiAgVGhpcyBmaWxlIGNvbnRhaW5zIHZlcmlmeWluZyBzcGVjcyBmb3I6XG4gIGh0dHBzOi8vZ2l0aHViLmNvbS9zaW5kcmVzb3JodXMvYXRvbS1lZGl0b3Jjb25maWcvaXNzdWVzLzEyOFxuXG4gIFRvIGFwcGx5IHRoZSBtYXhfbGluZV9sZW5ndGgtcHJvcGVydHkgdGhlIHdyYXAtZ3VpZGUtcGFja2FnZSBpcyBiZWluZyBkZS9hY3RpdmF0ZWQgaWYgbmVlZGVkLFxuICB0byBhdm9pZCB0aGF0IHR3byB3cmFwLWd1aWRlcyBhcmUgYmVpbmcgZGlzcGxheWVkIGF0IG9uY2UuIFRoZSBwYXN0IGltcGxlbWVudGF0aW9uIGFzc3VtZWQgdGhhdFxuICBjaGFuZ2luZyB0aGUgYWN0aXZhdGlvbi1zdGF0ZSB3b3VsZG4ndCBiZSBhYmxlIHRvIG92ZXJyaWRlIGEgcGFja2FnZS1kaXNhYmxlbWVudC4gSXQgdHVybmVkIG91dFxuICB0aGF0IHRoZSBwYWNrYWdlIGFjdGl2YXRpb24tc3RhdGUgbXVzdCBiZSBndWFyZGVkIGJ5IGEgZGlzYWJsZW1lbnQtcHJvb2YuXG4qL1xuXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmNvbnN0IHByb2plY3RSb290ID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJyk7XG5jb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihcblx0cHJvamVjdFJvb3QsXG5cdGB0ZXN0LiR7cGF0aC5iYXNlbmFtZShfX2ZpbGVuYW1lKS5zcGxpdCgnLScpLnNoaWZ0KCl9YFxuKTtcblxuZGVzY3JpYmUoJ2VkaXRvcmNvbmZpZycsICgpID0+IHtcblx0bGV0IHRleHRFZGl0b3I7XG5cblx0YmVmb3JlRWFjaCgoKSA9PiB7XG5cdFx0d2FpdHNGb3JQcm9taXNlKCgpID0+XG5cdFx0XHRQcm9taXNlLmFsbChbXG5cdFx0XHRcdGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdlZGl0b3Jjb25maWcnKSxcblx0XHRcdFx0YXRvbS5wYWNrYWdlcy5kaXNhYmxlUGFja2FnZSgnd3JhcC1ndWlkZScpLFxuXHRcdFx0XHRhdG9tLndvcmtzcGFjZS5vcGVuKGZpbGVQYXRoKVxuXHRcdFx0XSkudGhlbihyZXN1bHRzID0+IHtcblx0XHRcdFx0dGV4dEVkaXRvciA9IHJlc3VsdHNbMl07XG5cdFx0XHR9KVxuXHRcdCk7XG5cdH0pO1xuXG5cdGFmdGVyRWFjaCgoKSA9PiB7XG5cdFx0Ly8gcmVtb3ZlIHRoZSBjcmVhdGVkIGZpeHR1cmUsIGlmIGl0IGV4aXN0c1xuXHRcdHJ1bnMoKCkgPT4ge1xuXHRcdFx0ZnMuc3RhdChmaWxlUGF0aCwgKGVyciwgc3RhdHMpID0+IHtcblx0XHRcdFx0aWYgKCFlcnIgJiYgc3RhdHMuaXNGaWxlKCkpIHtcblx0XHRcdFx0XHRmcy51bmxpbmsoZmlsZVBhdGgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdHdhaXRzRm9yKCgpID0+IHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdHJldHVybiBmcy5zdGF0U3luYyhmaWxlUGF0aCkuaXNGaWxlKCkgPT09IGZhbHNlO1xuXHRcdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH0sIDUwMDAsIGByZW1vdmVkICR7ZmlsZVBhdGh9YCk7XG5cdH0pO1xuXG5cdGRlc2NyaWJlKCdBdG9tIHdpdGggZGlzYWJsZWQgd3JhcC1ndWlkZScsICgpID0+IHtcblx0XHRiZWZvcmVFYWNoKCgpID0+IHtcblx0XHRcdE9iamVjdC5hc3NpZ24odGV4dEVkaXRvci5nZXRCdWZmZXIoKS5lZGl0b3Jjb25maWcuc2V0dGluZ3MsIHtcblx0XHRcdFx0bWF4X2xpbmVfbGVuZ3RoOiAnYXV0bycgLy8gZXNsaW50LWRpc2FibGUtbGluZSBjYW1lbGNhc2Vcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0aXQoJ3Nob3VsZCBub3QgYWN0aXZhdGUgd3JhcC1ndWlkZScsICgpID0+IHtcblx0XHRcdGV4cGVjdChhdG9tLnBhY2thZ2VzLmlzUGFja2FnZUFjdGl2ZSgnd3JhcC1ndWlkZScpKS50b0VxdWFsKGZhbHNlKTtcblx0XHR9KTtcblx0fSk7XG59KTtcbiJdfQ==