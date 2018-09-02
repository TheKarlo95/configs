function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _jasmineFix = require('jasmine-fix');

var _libRegistry = require('../lib/registry');

var _libRegistry2 = _interopRequireDefault(_libRegistry);

describe('Registry', function () {
  var registry = undefined;

  beforeEach(function () {
    registry = new _libRegistry2['default']();
  });
  afterEach(function () {
    registry.dispose();
  });
  function validateOldTiles(oldTitles, titles) {
    expect(oldTitles.length).toBe(titles.length);

    titles.forEach(function (title, index) {
      expect(oldTitles[index].title).toBe(title);
      expect(oldTitles[index].duration === '1ms' || oldTitles[index].duration === '0ms').toBe(true);
    });
  }

  describe('handling of providers', function () {
    (0, _jasmineFix.it)('registers providers properly and clears them out when they die', function () {
      var provider = registry.create();
      expect(registry.providers.has(provider)).toBe(true);
      provider.dispose();
      expect(registry.providers.has(provider)).toBe(false);
    });
    (0, _jasmineFix.it)('emits update event properly', function () {
      var provider = registry.create();
      var update = jasmine.createSpy('update');
      registry.onDidUpdate(update);
      expect(update).not.toHaveBeenCalled();
      provider.add('Hey');
      provider.remove('Hey');
      provider.clear();
      expect(update).toHaveBeenCalled();
      expect(update.calls.length).toBe(2);
    });
    (0, _jasmineFix.it)('adds and returns sorted titles', _asyncToGenerator(function* () {
      var provider = registry.create();
      provider.add('Hey');
      yield (0, _jasmineFix.wait)(1);
      provider.add('Wow');
      yield (0, _jasmineFix.wait)(1);
      provider.add('Hello');
      expect(registry.getTilesActive()).toEqual(['Hey', 'Wow', 'Hello']);
    }));
    (0, _jasmineFix.it)('adds removed ones to history', _asyncToGenerator(function* () {
      var provider = registry.create();
      provider.add('Boy');
      yield (0, _jasmineFix.wait)(1);
      provider.add('Hey');
      expect(registry.getTilesActive()).toEqual(['Boy', 'Hey']);
      expect(registry.getTilesOld()).toEqual([]);

      provider.remove('Hey');
      expect(registry.getTilesActive()).toEqual(['Boy']);
      validateOldTiles(registry.getTilesOld(), ['Hey']);
    }));
    (0, _jasmineFix.it)('adds cleared ones to history', function () {
      var provider = registry.create();
      provider.add('Hello');
      provider.add('World');

      expect(registry.getTilesActive()).toEqual(['Hello', 'World']);
      expect(registry.getTilesOld()).toEqual([]);

      provider.clear();
      expect(registry.getTilesActive()).toEqual([]);
      validateOldTiles(registry.getTilesOld(), ['Hello', 'World']);
    });
  });
  describe('getTilesOld', function () {
    (0, _jasmineFix.it)('excludes active ones from history', function () {
      var provider = registry.create();
      provider.add('Yo CJ');
      provider.add('Murica');
      provider.remove('Yo CJ');
      provider.remove('Murica');
      provider.add('Yo CJ');

      validateOldTiles(registry.getTilesOld(), ['Murica']);
    });
    (0, _jasmineFix.it)('excludes duplicates and only returns the last one', function () {
      var provider = registry.create();

      provider.add('Some');
      provider.add('Things');
      provider.remove('Some');
      provider.remove('Things');
      provider.add('Some');
      provider.remove('Some');

      validateOldTiles(registry.getTilesOld(), ['Things', 'Some']);
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvYnVzeS1zaWduYWwvc3BlYy9yZWdpc3RyeS1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7MEJBRXlCLGFBQWE7OzJCQUNqQixpQkFBaUI7Ozs7QUFFdEMsUUFBUSxDQUFDLFVBQVUsRUFBRSxZQUFXO0FBQzlCLE1BQUksUUFBUSxZQUFBLENBQUE7O0FBRVosWUFBVSxDQUFDLFlBQVc7QUFDcEIsWUFBUSxHQUFHLDhCQUFjLENBQUE7R0FDMUIsQ0FBQyxDQUFBO0FBQ0YsV0FBUyxDQUFDLFlBQVc7QUFDbkIsWUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFBO0dBQ25CLENBQUMsQ0FBQTtBQUNGLFdBQVMsZ0JBQWdCLENBQUMsU0FBcUQsRUFBRSxNQUFxQixFQUFFO0FBQ3RHLFVBQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTs7QUFFNUMsVUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFTLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDcEMsWUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDMUMsWUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEtBQUssS0FBSyxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEtBQUssS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQzlGLENBQUMsQ0FBQTtHQUNIOztBQUVELFVBQVEsQ0FBQyx1QkFBdUIsRUFBRSxZQUFXO0FBQzNDLHdCQUFHLGdFQUFnRSxFQUFFLFlBQVc7QUFDOUUsVUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBQ2xDLFlBQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FB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QyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDdkIsY0FBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUN6QixjQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ3BCLGNBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7O0FBRXZCLHNCQUFnQixDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFBO0tBQzdELENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTtDQUNILENBQUMsQ0FBQSIsImZpbGUiOiIvaG9tZS90aGVrYXJsbzk1Ly5hdG9tL3BhY2thZ2VzL2J1c3ktc2lnbmFsL3NwZWMvcmVnaXN0cnktc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IGl0LCB3YWl0IH0gZnJvbSAnamFzbWluZS1maXgnXG5pbXBvcnQgUmVnaXN0cnkgZnJvbSAnLi4vbGliL3JlZ2lzdHJ5J1xuXG5kZXNjcmliZSgnUmVnaXN0cnknLCBmdW5jdGlvbigpIHtcbiAgbGV0IHJlZ2lzdHJ5XG5cbiAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcbiAgICByZWdpc3RyeSA9IG5ldyBSZWdpc3RyeSgpXG4gIH0pXG4gIGFmdGVyRWFjaChmdW5jdGlvbigpIHtcbiAgICByZWdpc3RyeS5kaXNwb3NlKClcbiAgfSlcbiAgZnVuY3Rpb24gdmFsaWRhdGVPbGRUaWxlcyhvbGRUaXRsZXM6IEFycmF5PHsgdGl0bGU6IHN0cmluZywgZHVyYXRpb246IHN0cmluZyB9PiwgdGl0bGVzOiBBcnJheTxzdHJpbmc+KSB7XG4gICAgZXhwZWN0KG9sZFRpdGxlcy5sZW5ndGgpLnRvQmUodGl0bGVzLmxlbmd0aClcblxuICAgIHRpdGxlcy5mb3JFYWNoKGZ1bmN0aW9uKHRpdGxlLCBpbmRleCkge1xuICAgICAgZXhwZWN0KG9sZFRpdGxlc1tpbmRleF0udGl0bGUpLnRvQmUodGl0bGUpXG4gICAgICBleHBlY3Qob2xkVGl0bGVzW2luZGV4XS5kdXJhdGlvbiA9PT0gJzFtcycgfHwgb2xkVGl0bGVzW2luZGV4XS5kdXJhdGlvbiA9PT0gJzBtcycpLnRvQmUodHJ1ZSlcbiAgICB9KVxuICB9XG5cbiAgZGVzY3JpYmUoJ2hhbmRsaW5nIG9mIHByb3ZpZGVycycsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdyZWdpc3RlcnMgcHJvdmlkZXJzIHByb3Blcmx5IGFuZCBjbGVhcnMgdGhlbSBvdXQgd2hlbiB0aGV5IGRpZScsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgcHJvdmlkZXIgPSByZWdpc3RyeS5jcmVhdGUoKVxuICAgICAgZXhwZWN0KHJlZ2lzdHJ5LnByb3ZpZGVycy5oYXMocHJvdmlkZXIpKS50b0JlKHRydWUpXG4gICAgICBwcm92aWRlci5kaXNwb3NlKClcbiAgICAgIGV4cGVjdChyZWdpc3RyeS5wcm92aWRlcnMuaGFzKHByb3ZpZGVyKSkudG9CZShmYWxzZSlcbiAgICB9KVxuICAgIGl0KCdlbWl0cyB1cGRhdGUgZXZlbnQgcHJvcGVybHknLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHByb3ZpZGVyID0gcmVnaXN0cnkuY3JlYXRlKClcbiAgICAgIGNvbnN0IHVwZGF0ZSA9IGphc21pbmUuY3JlYXRlU3B5KCd1cGRhdGUnKVxuICAgICAgcmVnaXN0cnkub25EaWRVcGRhdGUodXBkYXRlKVxuICAgICAgZXhwZWN0KHVwZGF0ZSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgcHJvdmlkZXIuYWRkKCdIZXknKVxuICAgICAgcHJvdmlkZXIucmVtb3ZlKCdIZXknKVxuICAgICAgcHJvdmlkZXIuY2xlYXIoKVxuICAgICAgZXhwZWN0KHVwZGF0ZSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICBleHBlY3QodXBkYXRlLmNhbGxzLmxlbmd0aCkudG9CZSgyKVxuICAgIH0pXG4gICAgaXQoJ2FkZHMgYW5kIHJldHVybnMgc29ydGVkIHRpdGxlcycsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgcHJvdmlkZXIgPSByZWdpc3RyeS5jcmVhdGUoKVxuICAgICAgcHJvdmlkZXIuYWRkKCdIZXknKVxuICAgICAgYXdhaXQgd2FpdCgxKVxuICAgICAgcHJvdmlkZXIuYWRkKCdXb3cnKVxuICAgICAgYXdhaXQgd2FpdCgxKVxuICAgICAgcHJvdmlkZXIuYWRkKCdIZWxsbycpXG4gICAgICBleHBlY3QocmVnaXN0cnkuZ2V0VGlsZXNBY3RpdmUoKSkudG9FcXVhbChbJ0hleScsICdXb3cnLCAnSGVsbG8nXSlcbiAgICB9KVxuICAgIGl0KCdhZGRzIHJlbW92ZWQgb25lcyB0byBoaXN0b3J5JywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBwcm92aWRlciA9IHJlZ2lzdHJ5LmNyZWF0ZSgpXG4gICAgICBwcm92aWRlci5hZGQoJ0JveScpXG4gICAgICBhd2FpdCB3YWl0KDEpXG4gICAgICBwcm92aWRlci5hZGQoJ0hleScpXG4gICAgICBleHBlY3QocmVnaXN0cnkuZ2V0VGlsZXNBY3RpdmUoKSkudG9FcXVhbChbJ0JveScsICdIZXknXSlcbiAgICAgIGV4cGVjdChyZWdpc3RyeS5nZXRUaWxlc09sZCgpKS50b0VxdWFsKFtdKVxuXG4gICAgICBwcm92aWRlci5yZW1vdmUoJ0hleScpXG4gICAgICBleHBlY3QocmVnaXN0cnkuZ2V0VGlsZXNBY3RpdmUoKSkudG9FcXVhbChbJ0JveSddKVxuICAgICAgdmFsaWRhdGVPbGRUaWxlcyhyZWdpc3RyeS5nZXRUaWxlc09sZCgpLCBbJ0hleSddKVxuICAgIH0pXG4gICAgaXQoJ2FkZHMgY2xlYXJlZCBvbmVzIHRvIGhpc3RvcnknLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHByb3ZpZGVyID0gcmVnaXN0cnkuY3JlYXRlKClcbiAgICAgIHByb3ZpZGVyLmFkZCgnSGVsbG8nKVxuICAgICAgcHJvdmlkZXIuYWRkKCdXb3JsZCcpXG5cbiAgICAgIGV4cGVjdChyZWdpc3RyeS5nZXRUaWxlc0FjdGl2ZSgpKS50b0VxdWFsKFsnSGVsbG8nLCAnV29ybGQnXSlcbiAgICAgIGV4cGVjdChyZWdpc3RyeS5nZXRUaWxlc09sZCgpKS50b0VxdWFsKFtdKVxuXG4gICAgICBwcm92aWRlci5jbGVhcigpXG4gICAgICBleHBlY3QocmVnaXN0cnkuZ2V0VGlsZXNBY3RpdmUoKSkudG9FcXVhbChbXSlcbiAgICAgIHZhbGlkYXRlT2xkVGlsZXMocmVnaXN0cnkuZ2V0VGlsZXNPbGQoKSwgWydIZWxsbycsICdXb3JsZCddKVxuICAgIH0pXG4gIH0pXG4gIGRlc2NyaWJlKCdnZXRUaWxlc09sZCcsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdleGNsdWRlcyBhY3RpdmUgb25lcyBmcm9tIGhpc3RvcnknLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHByb3ZpZGVyID0gcmVnaXN0cnkuY3JlYXRlKClcbiAgICAgIHByb3ZpZGVyLmFkZCgnWW8gQ0onKVxuICAgICAgcHJvdmlkZXIuYWRkKCdNdXJpY2EnKVxuICAgICAgcHJvdmlkZXIucmVtb3ZlKCdZbyBDSicpXG4gICAgICBwcm92aWRlci5yZW1vdmUoJ011cmljYScpXG4gICAgICBwcm92aWRlci5hZGQoJ1lvIENKJylcblxuICAgICAgdmFsaWRhdGVPbGRUaWxlcyhyZWdpc3RyeS5nZXRUaWxlc09sZCgpLCBbJ011cmljYSddKVxuICAgIH0pXG4gICAgaXQoJ2V4Y2x1ZGVzIGR1cGxpY2F0ZXMgYW5kIG9ubHkgcmV0dXJucyB0aGUgbGFzdCBvbmUnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHByb3ZpZGVyID0gcmVnaXN0cnkuY3JlYXRlKClcblxuICAgICAgcHJvdmlkZXIuYWRkKCdTb21lJylcbiAgICAgIHByb3ZpZGVyLmFkZCgnVGhpbmdzJylcbiAgICAgIHByb3ZpZGVyLnJlbW92ZSgnU29tZScpXG4gICAgICBwcm92aWRlci5yZW1vdmUoJ1RoaW5ncycpXG4gICAgICBwcm92aWRlci5hZGQoJ1NvbWUnKVxuICAgICAgcHJvdmlkZXIucmVtb3ZlKCdTb21lJylcblxuICAgICAgdmFsaWRhdGVPbGRUaWxlcyhyZWdpc3RyeS5nZXRUaWxlc09sZCgpLCBbJ1RoaW5ncycsICdTb21lJ10pXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=