function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libProvider = require('../lib/provider');

var _libProvider2 = _interopRequireDefault(_libProvider);

describe('Provider', function () {
  var provider = undefined;

  beforeEach(function () {
    provider = new _libProvider2['default']();
  });
  afterEach(function () {
    provider.dispose();
  });

  it('emits add event properly', function () {
    var timesTriggered = 0;

    provider.onDidAdd(function (title) {
      if (timesTriggered === 0) {
        expect(title).toBe('First');
      } else if (timesTriggered === 1) {
        expect(title).toBe('Second');
      } else if (timesTriggered === 2) {
        expect(title).toBe('Third');
      } else {
        expect(false).toBe(true);
      }
      timesTriggered++;
    });
    expect(timesTriggered).toBe(0);
    provider.add('First');
    expect(timesTriggered).toBe(1);
    provider.add('Second');
    expect(timesTriggered).toBe(2);
    provider.add('Third');
    expect(timesTriggered).toBe(3);
  });
  it('emits remove event properly', function () {
    var timesTriggered = 0;

    provider.onDidRemove(function (title) {
      if (timesTriggered === 0) {
        expect(title).toBe('First');
      } else if (timesTriggered === 1) {
        expect(title).toBe('Second');
      } else if (timesTriggered === 2) {
        expect(title).toBe('Third');
      } else {
        expect(false).toBe(true);
      }
      timesTriggered++;
    });

    expect(timesTriggered).toBe(0);
    provider.remove('First');
    expect(timesTriggered).toBe(1);
    provider.remove('Second');
    expect(timesTriggered).toBe(2);
    provider.remove('Third');
    expect(timesTriggered).toBe(3);
  });
  it('emits clear event properly', function () {
    var timesTriggered = 0;

    provider.onDidClear(function () {
      timesTriggered++;
    });

    expect(timesTriggered).toBe(0);
    provider.clear();
    expect(timesTriggered).toBe(1);
    provider.clear();
    expect(timesTriggered).toBe(2);
    provider.clear();
    expect(timesTriggered).toBe(3);
    provider.clear();
    expect(timesTriggered).toBe(4);
  });
  it('emits destroy event properly', function () {
    var timesTriggered = 0;

    provider.onDidDispose(function () {
      timesTriggered++;
    });

    expect(timesTriggered).toBe(0);
    provider.dispose();
    expect(timesTriggered).toBe(1);
    provider.dispose();
    expect(timesTriggered).toBe(1);
    provider.dispose();
    expect(timesTriggered).toBe(1);
    provider.dispose();
    expect(timesTriggered).toBe(1);
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvYnVzeS1zaWduYWwvc3BlYy9wcm92aWRlci1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OzJCQUVxQixpQkFBaUI7Ozs7QUFFdEMsUUFBUSxDQUFDLFVBQVUsRUFBRSxZQUFXO0FBQzlCLE1BQUksUUFBUSxZQUFBLENBQUE7O0FBRVosWUFBVSxDQUFDLFlBQVc7QUFDcEIsWUFBUSxHQUFHLDhCQUFjLENBQUE7R0FDMUIsQ0FBQyxDQUFBO0FBQ0YsV0FBUyxDQUFDLFlBQVc7QUFDbkIsWUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFBO0dBQ25CLENBQUMsQ0FBQTs7QUFFRixJQUFFLENBQUMsMEJBQTBCLEVBQUUsWUFBVztBQUN4QyxRQUFJLGNBQWMsR0FBRyxDQUFDLENBQUE7O0FBRXRCLFlBQVEsQ0FBQyxRQUFRLENBQUMsVUFBUyxLQUFLLEVBQUU7QUFDaEMsVUFBSSxjQUFjLEtBQUssQ0FBQyxFQUFFO0FBQ3hCLGNBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7T0FDNUIsTUFBTSxJQUFJLGNBQWMsS0FBSyxDQUFDLEVBQUU7QUFDL0IsY0FBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQUM3QixNQUFNLElBQUksY0FBYyxLQUFLLENBQUMsRUFBRTtBQUMvQixjQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO09BQzVCLE1BQU07QUFDTCxjQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO09BQ3pCO0FBQ0Qsb0JBQWMsRUFBRSxDQUFBO0tBQ2pCLENBQUMsQ0FBQTtBQUNGLFVBQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDOUIsWUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMs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Q0FBQTs7QUFFRixVQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzlCLFlBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNsQixVQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzlCLFlBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNsQixVQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzlCLFlBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNsQixVQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzlCLFlBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNsQixVQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0dBQy9CLENBQUMsQ0FBQTtDQUNILENBQUMsQ0FBQSIsImZpbGUiOiIvaG9tZS90aGVrYXJsbzk1Ly5hdG9tL3BhY2thZ2VzL2J1c3ktc2lnbmFsL3NwZWMvcHJvdmlkZXItc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBQcm92aWRlciBmcm9tICcuLi9saWIvcHJvdmlkZXInXG5cbmRlc2NyaWJlKCdQcm92aWRlcicsIGZ1bmN0aW9uKCkge1xuICBsZXQgcHJvdmlkZXJcblxuICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgIHByb3ZpZGVyID0gbmV3IFByb3ZpZGVyKClcbiAgfSlcbiAgYWZ0ZXJFYWNoKGZ1bmN0aW9uKCkge1xuICAgIHByb3ZpZGVyLmRpc3Bvc2UoKVxuICB9KVxuXG4gIGl0KCdlbWl0cyBhZGQgZXZlbnQgcHJvcGVybHknLCBmdW5jdGlvbigpIHtcbiAgICBsZXQgdGltZXNUcmlnZ2VyZWQgPSAwXG5cbiAgICBwcm92aWRlci5vbkRpZEFkZChmdW5jdGlvbih0aXRsZSkge1xuICAgICAgaWYgKHRpbWVzVHJpZ2dlcmVkID09PSAwKSB7XG4gICAgICAgIGV4cGVjdCh0aXRsZSkudG9CZSgnRmlyc3QnKVxuICAgICAgfSBlbHNlIGlmICh0aW1lc1RyaWdnZXJlZCA9PT0gMSkge1xuICAgICAgICBleHBlY3QodGl0bGUpLnRvQmUoJ1NlY29uZCcpXG4gICAgICB9IGVsc2UgaWYgKHRpbWVzVHJpZ2dlcmVkID09PSAyKSB7XG4gICAgICAgIGV4cGVjdCh0aXRsZSkudG9CZSgnVGhpcmQnKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXhwZWN0KGZhbHNlKS50b0JlKHRydWUpXG4gICAgICB9XG4gICAgICB0aW1lc1RyaWdnZXJlZCsrXG4gICAgfSlcbiAgICBleHBlY3QodGltZXNUcmlnZ2VyZWQpLnRvQmUoMClcbiAgICBwcm92aWRlci5hZGQoJ0ZpcnN0JylcbiAgICBleHBlY3QodGltZXNUcmlnZ2VyZWQpLnRvQmUoMSlcbiAgICBwcm92aWRlci5hZGQoJ1NlY29uZCcpXG4gICAgZXhwZWN0KHRpbWVzVHJpZ2dlcmVkKS50b0JlKDIpXG4gICAgcHJvdmlkZXIuYWRkKCdUaGlyZCcpXG4gICAgZXhwZWN0KHRpbWVzVHJpZ2dlcmVkKS50b0JlKDMpXG4gIH0pXG4gIGl0KCdlbWl0cyByZW1vdmUgZXZlbnQgcHJvcGVybHknLCBmdW5jdGlvbigpIHtcbiAgICBsZXQgdGltZXNUcmlnZ2VyZWQgPSAwXG5cbiAgICBwcm92aWRlci5vbkRpZFJlbW92ZShmdW5jdGlvbih0aXRsZSkge1xuICAgICAgaWYgKHRpbWVzVHJpZ2dlcmVkID09PSAwKSB7XG4gICAgICAgIGV4cGVjdCh0aXRsZSkudG9CZSgnRmlyc3QnKVxuICAgICAgfSBlbHNlIGlmICh0aW1lc1RyaWdnZXJlZCA9PT0gMSkge1xuICAgICAgICBleHBlY3QodGl0bGUpLnRvQmUoJ1NlY29uZCcpXG4gICAgICB9IGVsc2UgaWYgKHRpbWVzVHJpZ2dlcmVkID09PSAyKSB7XG4gICAgICAgIGV4cGVjdCh0aXRsZSkudG9CZSgnVGhpcmQnKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXhwZWN0KGZhbHNlKS50b0JlKHRydWUpXG4gICAgICB9XG4gICAgICB0aW1lc1RyaWdnZXJlZCsrXG4gICAgfSlcblxuICAgIGV4cGVjdCh0aW1lc1RyaWdnZXJlZCkudG9CZSgwKVxuICAgIHByb3ZpZGVyLnJlbW92ZSgnRmlyc3QnKVxuICAgIGV4cGVjdCh0aW1lc1RyaWdnZXJlZCkudG9CZSgxKVxuICAgIHByb3ZpZGVyLnJlbW92ZSgnU2Vjb25kJylcbiAgICBleHBlY3QodGltZXNUcmlnZ2VyZWQpLnRvQmUoMilcbiAgICBwcm92aWRlci5yZW1vdmUoJ1RoaXJkJylcbiAgICBleHBlY3QodGltZXNUcmlnZ2VyZWQpLnRvQmUoMylcbiAgfSlcbiAgaXQoJ2VtaXRzIGNsZWFyIGV2ZW50IHByb3Blcmx5JywgZnVuY3Rpb24oKSB7XG4gICAgbGV0IHRpbWVzVHJpZ2dlcmVkID0gMFxuXG4gICAgcHJvdmlkZXIub25EaWRDbGVhcihmdW5jdGlvbigpIHtcbiAgICAgIHRpbWVzVHJpZ2dlcmVkKytcbiAgICB9KVxuXG4gICAgZXhwZWN0KHRpbWVzVHJpZ2dlcmVkKS50b0JlKDApXG4gICAgcHJvdmlkZXIuY2xlYXIoKVxuICAgIGV4cGVjdCh0aW1lc1RyaWdnZXJlZCkudG9CZSgxKVxuICAgIHByb3ZpZGVyLmNsZWFyKClcbiAgICBleHBlY3QodGltZXNUcmlnZ2VyZWQpLnRvQmUoMilcbiAgICBwcm92aWRlci5jbGVhcigpXG4gICAgZXhwZWN0KHRpbWVzVHJpZ2dlcmVkKS50b0JlKDMpXG4gICAgcHJvdmlkZXIuY2xlYXIoKVxuICAgIGV4cGVjdCh0aW1lc1RyaWdnZXJlZCkudG9CZSg0KVxuICB9KVxuICBpdCgnZW1pdHMgZGVzdHJveSBldmVudCBwcm9wZXJseScsIGZ1bmN0aW9uKCkge1xuICAgIGxldCB0aW1lc1RyaWdnZXJlZCA9IDBcblxuICAgIHByb3ZpZGVyLm9uRGlkRGlzcG9zZShmdW5jdGlvbigpIHtcbiAgICAgIHRpbWVzVHJpZ2dlcmVkKytcbiAgICB9KVxuXG4gICAgZXhwZWN0KHRpbWVzVHJpZ2dlcmVkKS50b0JlKDApXG4gICAgcHJvdmlkZXIuZGlzcG9zZSgpXG4gICAgZXhwZWN0KHRpbWVzVHJpZ2dlcmVkKS50b0JlKDEpXG4gICAgcHJvdmlkZXIuZGlzcG9zZSgpXG4gICAgZXhwZWN0KHRpbWVzVHJpZ2dlcmVkKS50b0JlKDEpXG4gICAgcHJvdmlkZXIuZGlzcG9zZSgpXG4gICAgZXhwZWN0KHRpbWVzVHJpZ2dlcmVkKS50b0JlKDEpXG4gICAgcHJvdmlkZXIuZGlzcG9zZSgpXG4gICAgZXhwZWN0KHRpbWVzVHJpZ2dlcmVkKS50b0JlKDEpXG4gIH0pXG59KVxuIl19