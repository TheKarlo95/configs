function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _srcRules = require('../src/rules');

var _srcRules2 = _interopRequireDefault(_srcRules);

'use babel';

describe('The Rules class', function () {
  describe('replaceRules', function () {
    var ruleArray = [['foo', { meta: { fixable: true } }], ['bar', { meta: {} }]];

    it('adds new rules', function () {
      var rules = new _srcRules2['default']();
      expect(rules.getRules()).toEqual(new Map());
      rules.replaceRules(ruleArray);
      expect(rules.getRules()).toEqual(new Map(ruleArray));
    });

    it('removes old rules', function () {
      var rules = new _srcRules2['default']();
      rules.replaceRules(ruleArray);
      expect(rules.getRules()).toEqual(new Map(ruleArray));
      rules.replaceRules([]);
      expect(rules.getRules()).toEqual(new Map());
    });

    it('updates the fixableRules list', function () {
      var rules = new _srcRules2['default']();
      expect(rules.getFixableRules()).toEqual([]);
      rules.replaceRules(ruleArray);
      expect(rules.getFixableRules()).toEqual(['foo']);
    });
  });

  describe('getRuleUrl', function () {
    it('works with rules that define their own URL', function () {
      var rules = new _srcRules2['default']();
      rules.replaceRules([['foo', { meta: { docs: { url: 'bar' } } }]]);
      expect(rules.getRuleUrl('foo')).toBe('bar');
    });

    it('works with rules defined in eslint-rule-documentation', function () {
      var rules = new _srcRules2['default']();
      var url = 'https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-duplicates.md';
      expect(rules.getRuleUrl('import/no-duplicates')).toBe(url);
    });

    it('gives a fallback URL on how to add a rule URL', function () {
      var rules = new _srcRules2['default']();
      var url = 'https://github.com/jfmengels/eslint-rule-documentation/blob/master/contributing.md';
      expect(rules.getRuleUrl('foo/bar')).toBe(url);
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvbGludGVyLWVzbGludC9zcGVjL3J1bGVzLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7d0JBRWtCLGNBQWM7Ozs7QUFGaEMsV0FBVyxDQUFBOztBQUlYLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxZQUFNO0FBQ2hDLFVBQVEsQ0FBQyxjQUFjLEVBQUUsWUFBTTtBQUM3QixRQUFNLFNBQVMsR0FBRyxDQUNoQixDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQ3BDLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQ3RCLENBQUE7O0FBRUQsTUFBRSxDQUFDLGdCQUFnQixFQUFFLFlBQU07QUFDekIsVUFBTSxLQUFLLEdBQUcsMkJBQVcsQ0FBQTtBQUN6QixZQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQTtBQUMzQyxXQUFLLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQzdCLFlBQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtLQUNyRCxDQUFDLENBQUE7O0FBRUYsTUFBRSxDQUFDLG1CQUFtQixFQUFFLFlBQU07QUFDNUIsVUFBTSxLQUFLLEdBQUcsMkJBQVcsQ0FBQTtBQUN6QixXQUFLLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQzdCLFlBQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtBQUNwRCxXQUFLLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ3RCLFlBQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFBO0tBQzVDLENBQUMsQ0FBQTs7QUFFRixNQUFFLENBQUMsK0JBQStCLEVBQUUsWUFBTTtBQUN4QyxVQUFNLEtBQUssR0FBRywyQkFBVyxDQUFBO0FBQ3pCLFlBQU0sQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDM0MsV0FBSyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUM3QixZQUFNLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtLQUNqRCxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLFlBQVksRUFBRSxZQUFNO0FBQzNCLE1BQUUsQ0FBQyw0Q0FBNEMsRUFBRSxZQUFNO0FBQ3JELFVBQU0sS0FBSyxHQUFHLDJCQUFXLENBQUE7QUFDekIsV0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNqRSxZQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtLQUM1QyxDQUFDLENBQUE7O0FBRUYsTUFBRSxDQUFDLHVEQUF1RCxFQUFFLFlBQU07QUFDaEUsVUFBTSxLQUFLLEdBQUcsMkJBQVcsQ0FBQTtBQUN6QixVQUFNLEdBQUcsR0FBRywyRkFBMkYsQ0FBQTtBQUN2RyxZQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0tBQzNELENBQUMsQ0FBQTs7QUFFRixNQUFFLENBQUMsK0NBQStDLEVBQUUsWUFBTTtBQUN4RCxVQUFNLEtBQUssR0FBRywyQkFBVyxDQUFBO0FBQ3pCLFVBQU0sR0FBRyxHQUFHLG9GQUFvRixDQUFBO0FBQ2hHLFlBQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0tBQzlDLENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTtDQUNILENBQUMsQ0FBQSIsImZpbGUiOiIvaG9tZS90aGVrYXJsbzk1Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci1lc2xpbnQvc3BlYy9ydWxlcy1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IFJ1bGVzIGZyb20gJy4uL3NyYy9ydWxlcydcblxuZGVzY3JpYmUoJ1RoZSBSdWxlcyBjbGFzcycsICgpID0+IHtcbiAgZGVzY3JpYmUoJ3JlcGxhY2VSdWxlcycsICgpID0+IHtcbiAgICBjb25zdCBydWxlQXJyYXkgPSBbXG4gICAgICBbJ2ZvbycsIHsgbWV0YTogeyBmaXhhYmxlOiB0cnVlIH0gfV0sXG4gICAgICBbJ2JhcicsIHsgbWV0YToge30gfV1cbiAgICBdXG5cbiAgICBpdCgnYWRkcyBuZXcgcnVsZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBydWxlcyA9IG5ldyBSdWxlcygpXG4gICAgICBleHBlY3QocnVsZXMuZ2V0UnVsZXMoKSkudG9FcXVhbChuZXcgTWFwKCkpXG4gICAgICBydWxlcy5yZXBsYWNlUnVsZXMocnVsZUFycmF5KVxuICAgICAgZXhwZWN0KHJ1bGVzLmdldFJ1bGVzKCkpLnRvRXF1YWwobmV3IE1hcChydWxlQXJyYXkpKVxuICAgIH0pXG5cbiAgICBpdCgncmVtb3ZlcyBvbGQgcnVsZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBydWxlcyA9IG5ldyBSdWxlcygpXG4gICAgICBydWxlcy5yZXBsYWNlUnVsZXMocnVsZUFycmF5KVxuICAgICAgZXhwZWN0KHJ1bGVzLmdldFJ1bGVzKCkpLnRvRXF1YWwobmV3IE1hcChydWxlQXJyYXkpKVxuICAgICAgcnVsZXMucmVwbGFjZVJ1bGVzKFtdKVxuICAgICAgZXhwZWN0KHJ1bGVzLmdldFJ1bGVzKCkpLnRvRXF1YWwobmV3IE1hcCgpKVxuICAgIH0pXG5cbiAgICBpdCgndXBkYXRlcyB0aGUgZml4YWJsZVJ1bGVzIGxpc3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBydWxlcyA9IG5ldyBSdWxlcygpXG4gICAgICBleHBlY3QocnVsZXMuZ2V0Rml4YWJsZVJ1bGVzKCkpLnRvRXF1YWwoW10pXG4gICAgICBydWxlcy5yZXBsYWNlUnVsZXMocnVsZUFycmF5KVxuICAgICAgZXhwZWN0KHJ1bGVzLmdldEZpeGFibGVSdWxlcygpKS50b0VxdWFsKFsnZm9vJ10pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnZ2V0UnVsZVVybCcsICgpID0+IHtcbiAgICBpdCgnd29ya3Mgd2l0aCBydWxlcyB0aGF0IGRlZmluZSB0aGVpciBvd24gVVJMJywgKCkgPT4ge1xuICAgICAgY29uc3QgcnVsZXMgPSBuZXcgUnVsZXMoKVxuICAgICAgcnVsZXMucmVwbGFjZVJ1bGVzKFtbJ2ZvbycsIHsgbWV0YTogeyBkb2NzOiB7IHVybDogJ2JhcicgfSB9IH1dXSlcbiAgICAgIGV4cGVjdChydWxlcy5nZXRSdWxlVXJsKCdmb28nKSkudG9CZSgnYmFyJylcbiAgICB9KVxuXG4gICAgaXQoJ3dvcmtzIHdpdGggcnVsZXMgZGVmaW5lZCBpbiBlc2xpbnQtcnVsZS1kb2N1bWVudGF0aW9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgcnVsZXMgPSBuZXcgUnVsZXMoKVxuICAgICAgY29uc3QgdXJsID0gJ2h0dHBzOi8vZ2l0aHViLmNvbS9iZW5tb3NoZXIvZXNsaW50LXBsdWdpbi1pbXBvcnQvYmxvYi9tYXN0ZXIvZG9jcy9ydWxlcy9uby1kdXBsaWNhdGVzLm1kJ1xuICAgICAgZXhwZWN0KHJ1bGVzLmdldFJ1bGVVcmwoJ2ltcG9ydC9uby1kdXBsaWNhdGVzJykpLnRvQmUodXJsKVxuICAgIH0pXG5cbiAgICBpdCgnZ2l2ZXMgYSBmYWxsYmFjayBVUkwgb24gaG93IHRvIGFkZCBhIHJ1bGUgVVJMJywgKCkgPT4ge1xuICAgICAgY29uc3QgcnVsZXMgPSBuZXcgUnVsZXMoKVxuICAgICAgY29uc3QgdXJsID0gJ2h0dHBzOi8vZ2l0aHViLmNvbS9qZm1lbmdlbHMvZXNsaW50LXJ1bGUtZG9jdW1lbnRhdGlvbi9ibG9iL21hc3Rlci9jb250cmlidXRpbmcubWQnXG4gICAgICBleHBlY3QocnVsZXMuZ2V0UnVsZVVybCgnZm9vL2JhcicpKS50b0JlKHVybClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==