/** @babel */
/* eslint-env jasmine, atomtest */

/*
  This file contains verifying specs for:
  https://github.com/sindresorhus/atom-editorconfig/issues/94
*/

var _commandsGenerate = require('../commands/generate');

describe('editorconfig with disabled whitespace-package', function () {
	beforeEach(function () {
		waitsForPromise(function () {
			return Promise.all([atom.packages.activatePackage('editorconfig')]);
		});
	});

	describe('when generating an .editorconfig', function () {
		it('shouldn\'t throw an exception', function () {
			expect(_commandsGenerate.init).not.toThrow();
		});
	});
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvZWRpdG9yY29uZmlnL3NwZWMvaXNzOTQtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztnQ0FRcUMsc0JBQXNCOztBQUUzRCxRQUFRLENBQUMsK0NBQStDLEVBQUUsWUFBTTtBQUMvRCxXQUFVLENBQUMsWUFBTTtBQUNoQixpQkFBZSxDQUFDO1VBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUNYLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxDQUM3QyxDQUFDO0dBQUEsQ0FBQyxDQUFDO0VBQ0wsQ0FBQyxDQUFDOztBQUVILFNBQVEsQ0FBQyxrQ0FBa0MsRUFBRSxZQUFNO0FBQ2xELElBQUUsQ0FBQywrQkFBK0IsRUFBRSxZQUFNO0FBQ3pDLFNBQU0sd0JBQWdCLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0dBQ3JDLENBQUMsQ0FBQztFQUNILENBQUMsQ0FBQztDQUNILENBQUMsQ0FBQyIsImZpbGUiOiIvaG9tZS90aGVrYXJsbzk1Ly5hdG9tL3BhY2thZ2VzL2VkaXRvcmNvbmZpZy9zcGVjL2lzczk0LXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG4vKiBlc2xpbnQtZW52IGphc21pbmUsIGF0b210ZXN0ICovXG5cbi8qXG4gIFRoaXMgZmlsZSBjb250YWlucyB2ZXJpZnlpbmcgc3BlY3MgZm9yOlxuICBodHRwczovL2dpdGh1Yi5jb20vc2luZHJlc29yaHVzL2F0b20tZWRpdG9yY29uZmlnL2lzc3Vlcy85NFxuKi9cblxuaW1wb3J0IHtpbml0IGFzIGdlbmVyYXRlQ29uZmlnfSBmcm9tICcuLi9jb21tYW5kcy9nZW5lcmF0ZSc7XG5cbmRlc2NyaWJlKCdlZGl0b3Jjb25maWcgd2l0aCBkaXNhYmxlZCB3aGl0ZXNwYWNlLXBhY2thZ2UnLCAoKSA9PiB7XG5cdGJlZm9yZUVhY2goKCkgPT4ge1xuXHRcdHdhaXRzRm9yUHJvbWlzZSgoKSA9PlxuXHRcdFx0UHJvbWlzZS5hbGwoW1xuXHRcdFx0XHRhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnZWRpdG9yY29uZmlnJylcblx0XHRcdF0pKTtcblx0fSk7XG5cblx0ZGVzY3JpYmUoJ3doZW4gZ2VuZXJhdGluZyBhbiAuZWRpdG9yY29uZmlnJywgKCkgPT4ge1xuXHRcdGl0KCdzaG91bGRuXFwndCB0aHJvdyBhbiBleGNlcHRpb24nLCAoKSA9PiB7XG5cdFx0XHRleHBlY3QoZ2VuZXJhdGVDb25maWcpLm5vdC50b1Rocm93KCk7XG5cdFx0fSk7XG5cdH0pO1xufSk7XG4iXX0=