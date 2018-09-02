/** @babel */
/* eslint-env jasmine, atomtest */

/*
  This file contains verifying specs for:
  https://github.com/sindresorhus/atom-editorconfig/issues/178
*/

var _libStatustileView = require('../lib/statustile-view');

describe('editorconfig with disabled status-bar package', function () {
	beforeEach(function () {
		waitsForPromise(function () {
			return Promise.all([atom.packages.activatePackage('editorconfig')]);
		});
	});

	describe('when updating the status bar icon', function () {
		it('shouldn\'t throw an exception', function () {
			expect(function () {
				return (0, _libStatustileView.updateIcon)('warning');
			}).not.toThrow();
		});
	});
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvZWRpdG9yY29uZmlnL3NwZWMvaXNzdWUtMTc4LXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7aUNBUXlCLHdCQUF3Qjs7QUFFakQsUUFBUSxDQUFDLCtDQUErQyxFQUFFLFlBQU07QUFDL0QsV0FBVSxDQUFDLFlBQU07QUFDaEIsaUJBQWUsQ0FBQztVQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FDWCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsQ0FDN0MsQ0FBQztHQUFBLENBQUMsQ0FBQztFQUNMLENBQUMsQ0FBQzs7QUFFSCxTQUFRLENBQUMsbUNBQW1DLEVBQUUsWUFBTTtBQUNuRCxJQUFFLENBQUMsK0JBQStCLEVBQUUsWUFBTTtBQUN6QyxTQUFNLENBQUM7V0FBTSxtQ0FBVyxTQUFTLENBQUM7SUFBQSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0dBQ2xELENBQUMsQ0FBQztFQUNILENBQUMsQ0FBQztDQUNILENBQUMsQ0FBQyIsImZpbGUiOiIvaG9tZS90aGVrYXJsbzk1Ly5hdG9tL3BhY2thZ2VzL2VkaXRvcmNvbmZpZy9zcGVjL2lzc3VlLTE3OC1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuLyogZXNsaW50LWVudiBqYXNtaW5lLCBhdG9tdGVzdCAqL1xuXG4vKlxuICBUaGlzIGZpbGUgY29udGFpbnMgdmVyaWZ5aW5nIHNwZWNzIGZvcjpcbiAgaHR0cHM6Ly9naXRodWIuY29tL3NpbmRyZXNvcmh1cy9hdG9tLWVkaXRvcmNvbmZpZy9pc3N1ZXMvMTc4XG4qL1xuXG5pbXBvcnQge3VwZGF0ZUljb259IGZyb20gJy4uL2xpYi9zdGF0dXN0aWxlLXZpZXcnO1xuXG5kZXNjcmliZSgnZWRpdG9yY29uZmlnIHdpdGggZGlzYWJsZWQgc3RhdHVzLWJhciBwYWNrYWdlJywgKCkgPT4ge1xuXHRiZWZvcmVFYWNoKCgpID0+IHtcblx0XHR3YWl0c0ZvclByb21pc2UoKCkgPT5cblx0XHRcdFByb21pc2UuYWxsKFtcblx0XHRcdFx0YXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2VkaXRvcmNvbmZpZycpXG5cdFx0XHRdKSk7XG5cdH0pO1xuXG5cdGRlc2NyaWJlKCd3aGVuIHVwZGF0aW5nIHRoZSBzdGF0dXMgYmFyIGljb24nLCAoKSA9PiB7XG5cdFx0aXQoJ3Nob3VsZG5cXCd0IHRocm93IGFuIGV4Y2VwdGlvbicsICgpID0+IHtcblx0XHRcdGV4cGVjdCgoKSA9PiB1cGRhdGVJY29uKCd3YXJuaW5nJykpLm5vdC50b1Rocm93KCk7XG5cdFx0fSk7XG5cdH0pO1xufSk7XG4iXX0=