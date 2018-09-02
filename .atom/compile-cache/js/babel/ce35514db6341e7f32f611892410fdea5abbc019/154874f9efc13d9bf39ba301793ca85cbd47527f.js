function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* eslint-env jasmine */

var _libIndex = require('../lib/index');

var _libIndex2 = _interopRequireDefault(_libIndex);

'use babel';

describe('lib/index.js', function () {
    describe('sanity checks', function () {
        // This is mostly to ensure that I added everything on the git commit
        it('should not explode upon loading', function () {
            expect(typeof _libIndex2['default'].config === 'object').toBe(true);
            expect(typeof _libIndex2['default'].activate === 'function').toBe(true);
            expect(typeof _libIndex2['default'].deactivate === 'function').toBe(true);
            expect(typeof _libIndex2['default'].provide === 'function').toBe(true);
        });
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzLWltcG9ydC9zcGVjL2luZGV4LXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozt3QkFHbUIsY0FBYzs7OztBQUhqQyxXQUFXLENBQUE7O0FBS1gsUUFBUSxDQUFDLGNBQWMsRUFBRSxZQUFXO0FBQ2hDLFlBQVEsQ0FBQyxlQUFlLEVBQUUsWUFBVzs7QUFFakMsVUFBRSxDQUFDLGlDQUFpQyxFQUFFLFlBQVc7QUFDN0Msa0JBQU0sQ0FBQyxPQUFPLHNCQUFPLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDckQsa0JBQU0sQ0FBQyxPQUFPLHNCQUFPLFFBQVEsS0FBSyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekQsa0JBQU0sQ0FBQyxPQUFPLHNCQUFPLFVBQVUsS0FBSyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDM0Qsa0JBQU0sQ0FBQyxPQUFPLHNCQUFPLE9BQU8sS0FBSyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDM0QsQ0FBQyxDQUFDO0tBQ04sQ0FBQyxDQUFDO0NBQ04sQ0FBQyxDQUFDIiwiZmlsZSI6Ii9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzLWltcG9ydC9zcGVjL2luZGV4LXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuLyogZXNsaW50LWVudiBqYXNtaW5lICovXG5cbmltcG9ydCBwbHVnaW4gZnJvbSAnLi4vbGliL2luZGV4JztcblxuZGVzY3JpYmUoJ2xpYi9pbmRleC5qcycsIGZ1bmN0aW9uKCkge1xuICAgIGRlc2NyaWJlKCdzYW5pdHkgY2hlY2tzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIFRoaXMgaXMgbW9zdGx5IHRvIGVuc3VyZSB0aGF0IEkgYWRkZWQgZXZlcnl0aGluZyBvbiB0aGUgZ2l0IGNvbW1pdFxuICAgICAgICBpdCgnc2hvdWxkIG5vdCBleHBsb2RlIHVwb24gbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXhwZWN0KHR5cGVvZiBwbHVnaW4uY29uZmlnID09PSAnb2JqZWN0JykudG9CZSh0cnVlKTtcbiAgICAgICAgICAgIGV4cGVjdCh0eXBlb2YgcGx1Z2luLmFjdGl2YXRlID09PSAnZnVuY3Rpb24nKS50b0JlKHRydWUpO1xuICAgICAgICAgICAgZXhwZWN0KHR5cGVvZiBwbHVnaW4uZGVhY3RpdmF0ZSA9PT0gJ2Z1bmN0aW9uJykudG9CZSh0cnVlKTtcbiAgICAgICAgICAgIGV4cGVjdCh0eXBlb2YgcGx1Z2luLnByb3ZpZGUgPT09ICdmdW5jdGlvbicpLnRvQmUodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG4iXX0=