function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libGreeter = require('../lib/greeter');

var _libGreeter2 = _interopRequireDefault(_libGreeter);

describe('Greeter', function () {
  var greeter = undefined;

  beforeEach(function () {
    greeter = new _libGreeter2['default']();
  });
  afterEach(function () {
    greeter.dispose();
  });

  it('Lifecycle (::activate && ::dispose)', function () {
    expect(atom.notifications.getNotifications().length).toBe(0);
    greeter.showWelcome();
    expect(atom.notifications.getNotifications().length).toBe(1);
    expect(atom.notifications.getNotifications()[0].dismissed).toBe(false);
    greeter.dispose();
    expect(atom.notifications.getNotifications().length).toBe(1);
    expect(atom.notifications.getNotifications()[0].dismissed).toBe(true);
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvbGludGVyL3NwZWMvZ3JlZXRlci1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OzBCQUVvQixnQkFBZ0I7Ozs7QUFFcEMsUUFBUSxDQUFDLFNBQVMsRUFBRSxZQUFXO0FBQzdCLE1BQUksT0FBTyxZQUFBLENBQUE7O0FBRVgsWUFBVSxDQUFDLFlBQVc7QUFDcEIsV0FBTyxHQUFHLDZCQUFhLENBQUE7R0FDeEIsQ0FBQyxDQUFBO0FBQ0YsV0FBUyxDQUFDLFlBQVc7QUFDbkIsV0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO0dBQ2xCLENBQUMsQ0FBQTs7QUFFRixJQUFFLENBQUMscUNBQXFDLEVBQUUsWUFBVztBQUNuRCxVQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUM1RCxXQUFPLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDckIsVUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDNUQsVUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDdEUsV0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ2pCLFVBQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzVELFVBQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0dBQ3RFLENBQUMsQ0FBQTtDQUNILENBQUMsQ0FBQSIsImZpbGUiOiIvaG9tZS90aGVrYXJsbzk1Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL2dyZWV0ZXItc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBHcmVldGVyIGZyb20gJy4uL2xpYi9ncmVldGVyJ1xuXG5kZXNjcmliZSgnR3JlZXRlcicsIGZ1bmN0aW9uKCkge1xuICBsZXQgZ3JlZXRlclxuXG4gIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgZ3JlZXRlciA9IG5ldyBHcmVldGVyKClcbiAgfSlcbiAgYWZ0ZXJFYWNoKGZ1bmN0aW9uKCkge1xuICAgIGdyZWV0ZXIuZGlzcG9zZSgpXG4gIH0pXG5cbiAgaXQoJ0xpZmVjeWNsZSAoOjphY3RpdmF0ZSAmJiA6OmRpc3Bvc2UpJywgZnVuY3Rpb24oKSB7XG4gICAgZXhwZWN0KGF0b20ubm90aWZpY2F0aW9ucy5nZXROb3RpZmljYXRpb25zKCkubGVuZ3RoKS50b0JlKDApXG4gICAgZ3JlZXRlci5zaG93V2VsY29tZSgpXG4gICAgZXhwZWN0KGF0b20ubm90aWZpY2F0aW9ucy5nZXROb3RpZmljYXRpb25zKCkubGVuZ3RoKS50b0JlKDEpXG4gICAgZXhwZWN0KGF0b20ubm90aWZpY2F0aW9ucy5nZXROb3RpZmljYXRpb25zKClbMF0uZGlzbWlzc2VkKS50b0JlKGZhbHNlKVxuICAgIGdyZWV0ZXIuZGlzcG9zZSgpXG4gICAgZXhwZWN0KGF0b20ubm90aWZpY2F0aW9ucy5nZXROb3RpZmljYXRpb25zKCkubGVuZ3RoKS50b0JlKDEpXG4gICAgZXhwZWN0KGF0b20ubm90aWZpY2F0aW9ucy5nZXROb3RpZmljYXRpb25zKClbMF0uZGlzbWlzc2VkKS50b0JlKHRydWUpXG4gIH0pXG59KVxuIl19