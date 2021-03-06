/** @babel */
/* eslint-env jasmine, atomtest */

/*
	This file contains an informational output for the developer, help getting a
	performance-awareness.
*/

describe('editorconfig', function () {
	beforeEach(function () {
		waitsForPromise(function () {
			return atom.packages.activatePackage('editorconfig');
		});
	});

	it('should have been loaded fine', function () {
		var pack = atom.packages.getLoadedPackage('editorconfig');

		expect(pack).not.toBeUndefined();

		if (typeof pack !== 'undefined') {
			console.info('The package took ' + pack.loadTime + 'ms to load and ' + pack.activateTime + 'ms to activate.');
		}
	});
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvZWRpdG9yY29uZmlnL3NwZWMvYmVuY2htYXJrLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFRQSxRQUFRLENBQUMsY0FBYyxFQUFFLFlBQU07QUFDOUIsV0FBVSxDQUFDLFlBQU07QUFDaEIsaUJBQWUsQ0FBQztVQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQztHQUFBLENBQUMsQ0FBQztFQUNyRSxDQUFDLENBQUM7O0FBRUgsR0FBRSxDQUFDLDhCQUE4QixFQUFFLFlBQU07QUFDeEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsQ0FBQzs7QUFFNUQsUUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQzs7QUFFakMsTUFBSSxPQUFPLElBQUksS0FBSyxXQUFXLEVBQUU7QUFDaEMsVUFBTyxDQUFDLElBQUksdUJBQXFCLElBQUksQ0FBQyxRQUFRLHVCQUFrQixJQUFJLENBQUMsWUFBWSxxQkFBa0IsQ0FBQztHQUNwRztFQUNELENBQUMsQ0FBQztDQUNILENBQUMsQ0FBQyIsImZpbGUiOiIvaG9tZS90aGVrYXJsbzk1Ly5hdG9tL3BhY2thZ2VzL2VkaXRvcmNvbmZpZy9zcGVjL2JlbmNobWFyay1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuLyogZXNsaW50LWVudiBqYXNtaW5lLCBhdG9tdGVzdCAqL1xuXG4vKlxuXHRUaGlzIGZpbGUgY29udGFpbnMgYW4gaW5mb3JtYXRpb25hbCBvdXRwdXQgZm9yIHRoZSBkZXZlbG9wZXIsIGhlbHAgZ2V0dGluZyBhXG5cdHBlcmZvcm1hbmNlLWF3YXJlbmVzcy5cbiovXG5cbmRlc2NyaWJlKCdlZGl0b3Jjb25maWcnLCAoKSA9PiB7XG5cdGJlZm9yZUVhY2goKCkgPT4ge1xuXHRcdHdhaXRzRm9yUHJvbWlzZSgoKSA9PiBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnZWRpdG9yY29uZmlnJykpO1xuXHR9KTtcblxuXHRpdCgnc2hvdWxkIGhhdmUgYmVlbiBsb2FkZWQgZmluZScsICgpID0+IHtcblx0XHRjb25zdCBwYWNrID0gYXRvbS5wYWNrYWdlcy5nZXRMb2FkZWRQYWNrYWdlKCdlZGl0b3Jjb25maWcnKTtcblxuXHRcdGV4cGVjdChwYWNrKS5ub3QudG9CZVVuZGVmaW5lZCgpO1xuXG5cdFx0aWYgKHR5cGVvZiBwYWNrICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0Y29uc29sZS5pbmZvKGBUaGUgcGFja2FnZSB0b29rICR7cGFjay5sb2FkVGltZX1tcyB0byBsb2FkIGFuZCAke3BhY2suYWN0aXZhdGVUaW1lfW1zIHRvIGFjdGl2YXRlLmApO1xuXHRcdH1cblx0fSk7XG59KTtcbiJdfQ==