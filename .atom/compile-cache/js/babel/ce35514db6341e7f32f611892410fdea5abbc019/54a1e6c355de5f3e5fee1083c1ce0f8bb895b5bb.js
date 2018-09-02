function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _srcValidateThrow = require('../../src/validate/throw');

var _srcValidateThrow2 = _interopRequireDefault(_srcValidateThrow);

'use babel';

describe('throwIfFail', function () {
  it('throws an error when given falsey value', function () {
    var message = 'bad smurf';
    var caught = false;

    try {
      (0, _srcValidateThrow2['default'])(message, false);
    } catch (e) {
      caught = true;
      expect(e.message).toBe('bad smurf');
    }
    expect(caught).toBe(true);
  });

  it('does not throw when given truthy value', function () {
    var message = 'this message is ignored';
    expect((0, _srcValidateThrow2['default'])(message, true)).toBe(true);
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvbGludGVyLWVzbGludC9zcGVjL3ZhbGlkYXRlL3Rocm93LXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Z0NBRXdCLDBCQUEwQjs7OztBQUZsRCxXQUFXLENBQUE7O0FBSVgsUUFBUSxDQUFDLGFBQWEsRUFBRSxZQUFNO0FBQzVCLElBQUUsQ0FBQyx5Q0FBeUMsRUFBRSxZQUFNO0FBQ2xELFFBQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQTtBQUMzQixRQUFJLE1BQU0sR0FBRyxLQUFLLENBQUE7O0FBRWxCLFFBQUk7QUFDRix5Q0FBWSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUE7S0FDNUIsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNWLFlBQU0sR0FBRyxJQUFJLENBQUE7QUFDYixZQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtLQUNwQztBQUNELFVBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDMUIsQ0FBQyxDQUFBOztBQUVGLElBQUUsQ0FBQyx3Q0FBd0MsRUFBRSxZQUFNO0FBQ2pELFFBQU0sT0FBTyxHQUFHLHlCQUF5QixDQUFBO0FBQ3pDLFVBQU0sQ0FBQyxtQ0FBWSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDOUMsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvbGludGVyLWVzbGludC9zcGVjL3ZhbGlkYXRlL3Rocm93LXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgdGhyb3dJZkZhaWwgZnJvbSAnLi4vLi4vc3JjL3ZhbGlkYXRlL3Rocm93J1xuXG5kZXNjcmliZSgndGhyb3dJZkZhaWwnLCAoKSA9PiB7XG4gIGl0KCd0aHJvd3MgYW4gZXJyb3Igd2hlbiBnaXZlbiBmYWxzZXkgdmFsdWUnLCAoKSA9PiB7XG4gICAgY29uc3QgbWVzc2FnZSA9ICdiYWQgc211cmYnXG4gICAgbGV0IGNhdWdodCA9IGZhbHNlXG5cbiAgICB0cnkge1xuICAgICAgdGhyb3dJZkZhaWwobWVzc2FnZSwgZmFsc2UpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY2F1Z2h0ID0gdHJ1ZVxuICAgICAgZXhwZWN0KGUubWVzc2FnZSkudG9CZSgnYmFkIHNtdXJmJylcbiAgICB9XG4gICAgZXhwZWN0KGNhdWdodCkudG9CZSh0cnVlKVxuICB9KVxuXG4gIGl0KCdkb2VzIG5vdCB0aHJvdyB3aGVuIGdpdmVuIHRydXRoeSB2YWx1ZScsICgpID0+IHtcbiAgICBjb25zdCBtZXNzYWdlID0gJ3RoaXMgbWVzc2FnZSBpcyBpZ25vcmVkJ1xuICAgIGV4cGVjdCh0aHJvd0lmRmFpbChtZXNzYWdlLCB0cnVlKSkudG9CZSh0cnVlKVxuICB9KVxufSlcbiJdfQ==