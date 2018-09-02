var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _specHelpers = require('../spec-helpers');

var _specHelpers2 = _interopRequireDefault(_specHelpers);

describe('JavaScript Goto Definition', function () {
  var _Array$from = Array.from([]);

  var _Array$from2 = _slicedToArray(_Array$from, 2);

  var editor = _Array$from2[0];
  var mainModule = _Array$from2[1];

  beforeEach(function () {
    waitsForPromise(function () {
      return _specHelpers2['default'].openFile('test.js');
    });
    runs(function () {
      var _helpers$getPackage = _specHelpers2['default'].getPackage();

      editor = _helpers$getPackage.editor;
      mainModule = _helpers$getPackage.mainModule;

      _specHelpers2['default'].nomalMode();
    });
  });

  it('no definition', function () {
    editor.setText('hello_world');
    editor.setCursorBufferPosition([0, 1]);

    expect(_specHelpers2['default'].getSelectedWord()).toEqual('hello_world');
    expect(_specHelpers2['default'].getFileTypes()).toContain('*.js');
    expect(_specHelpers2['default'].sendComand()).toBe(true);

    waitsForPromise(function () {
      return _specHelpers2['default'].waitsComplete();
    });

    expect(mainModule.definitionsView.items.length).toEqual(0);
  });

  it('find function', function () {
    editor.setText('function hello_world() {\n  return true;\n}\nhello_world');
    editor.setCursorBufferPosition([3, 1]);

    expect(_specHelpers2['default'].getSelectedWord()).toEqual('hello_world');
    expect(_specHelpers2['default'].getFileTypes()).toContain('*.js');
    expect(_specHelpers2['default'].sendComand()).toBe(true);

    waitsForPromise(function () {
      return _specHelpers2['default'].waitsComplete();
    });

    expect(mainModule.definitionsView.items.length).toEqual(1);
    expect(mainModule.definitionsView.items[0].line).toEqual(0);
    expect(mainModule.definitionsView.items[0].text).toContain('function hello_world() {');
  });

  it('find function and es6 class without saved', function () {
    editor.setText('function hello_world() {\n  return true;\n}\nclass hello_world {\n  hello_world(x, y) {\n    this.x = x;\n    this.y = y;\n  }\n}\nhello_world');
    editor.setCursorBufferPosition([10, 1]);

    expect(_specHelpers2['default'].getSelectedWord()).toEqual('hello_world');
    expect(_specHelpers2['default'].getFileTypes()).toContain('*.js');
    expect(_specHelpers2['default'].sendComand()).toBe(true);

    waitsForPromise(function () {
      return _specHelpers2['default'].waitsComplete();
    });

    expect(mainModule.definitionsView.items.length).toEqual(3);
    expect(mainModule.definitionsView.items[0].line).toEqual(0);
    expect(mainModule.definitionsView.items[0].text).toContain('function hello_world() {');

    expect(mainModule.definitionsView.items[1].line).toEqual(3);
    expect(mainModule.definitionsView.items[1].text).toContain('class hello_world {');

    expect(mainModule.definitionsView.items[2].line).toEqual(4);
    expect(mainModule.definitionsView.items[2].text).toContain('hello_world(x, y) {');
  });

  it('find function and es6 class with saved', function () {
    editor.setText('function hello_world() {\n  return true;\n}\nclass hello_world {\n  hello_world(x, y) {\n    this.x = x;\n    this.y = y;\n  }\n}\nhello_world');
    _specHelpers2['default'].editorSave();
    editor.setCursorBufferPosition([10, 1]);

    expect(_specHelpers2['default'].getSelectedWord()).toEqual('hello_world');
    expect(_specHelpers2['default'].getFileTypes()).toContain('*.js');
    expect(_specHelpers2['default'].sendComand()).toBe(true);

    waitsForPromise(function () {
      return _specHelpers2['default'].waitsComplete();
    });
    _specHelpers2['default'].editorDelete();

    expect(mainModule.definitionsView.items.length).toEqual(3);
    expect(mainModule.definitionsView.items[0].line).toEqual(0);
    expect(mainModule.definitionsView.items[0].text).toContain('function hello_world() {');

    expect(mainModule.definitionsView.items[1].line).toEqual(3);
    expect(mainModule.definitionsView.items[1].text).toContain('class hello_world {');

    expect(mainModule.definitionsView.items[2].line).toEqual(4);
    expect(mainModule.definitionsView.items[2].text).toContain('hello_world(x, y) {');
  });

  return it('performance mode find function and es6 class with saved', function () {
    _specHelpers2['default'].performanceMode();

    editor.setText('function hello_world() {\n  return true;\n}\nclass hello_world {\n  hello_world(x, y) {\n    this.x = x;\n    this.y = y;\n  }\n}\nhello_world');
    _specHelpers2['default'].editorSave();
    editor.setCursorBufferPosition([10, 1]);

    expect(_specHelpers2['default'].getSelectedWord()).toEqual('hello_world');
    expect(_specHelpers2['default'].getFileTypes()).toContain('*.js');
    expect(_specHelpers2['default'].sendComand()).toBe(true);

    waitsForPromise(function () {
      return _specHelpers2['default'].waitsComplete();
    });
    _specHelpers2['default'].editorDelete();

    expect(mainModule.definitionsView.items.length).toEqual(3);
    expect(mainModule.definitionsView.items[0].line).toEqual(0);
    expect(mainModule.definitionsView.items[0].text).toContain('function hello_world() {');

    expect(mainModule.definitionsView.items[1].line).toEqual(3);
    expect(mainModule.definitionsView.items[1].text).toContain('class hello_world {');

    expect(mainModule.definitionsView.items[2].line).toEqual(4);
    expect(mainModule.definitionsView.items[2].text).toContain('hello_world(x, y) {');
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvZ290by1kZWZpbml0aW9uL3NwZWMvZml4dHVyZXMvamF2YXNjcmlwdC1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OzsyQkFFb0IsaUJBQWlCOzs7O0FBRXJDLFFBQVEsQ0FBQyw0QkFBNEIsRUFBRSxZQUFNO29CQUNoQixLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQzs7OztNQUFwQyxNQUFNO01BQUUsVUFBVTs7QUFFdkIsWUFBVSxDQUFDLFlBQU07QUFDZixtQkFBZSxDQUFDO2FBQU0seUJBQVEsUUFBUSxDQUFDLFNBQVMsQ0FBQztLQUFBLENBQUMsQ0FBQztBQUNuRCxRQUFJLENBQUMsWUFBTTtnQ0FDaUIseUJBQVEsVUFBVSxFQUFFOztBQUEzQyxZQUFNLHVCQUFOLE1BQU07QUFBRSxnQkFBVSx1QkFBVixVQUFVOztBQUNyQiwrQkFBUSxTQUFTLEVBQUUsQ0FBQztLQUNyQixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7O0FBRUgsSUFBRSxDQUFDLGVBQWUsRUFBRSxZQUFNO0FBQ3hCLFVBQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDOUIsVUFBTSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRXZDLFVBQU0sQ0FBQyx5QkFBUSxlQUFlLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUN6RCxVQUFNLENBQUMseUJBQVEsWUFBWSxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDakQsVUFBTSxDQUFDLHlCQUFRLFVBQVUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUV4QyxtQkFBZSxDQUFDO2FBQU0seUJBQVEsYUFBYSxFQUFFO0tBQUEsQ0FBQyxDQUFDOztBQUUvQyxVQUFNLENBQUMsVUFBVSxDQUFDLGVB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QUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUQsVUFBTSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDOztBQUV2RixVQUFNLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVELFVBQU0sQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUMsQ0FBQzs7QUFFbEYsVUFBTSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1RCxVQUFNLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLHFCQUFxQixDQUFDLENBQUM7R0FDbkYsQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6Ii9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvZ290by1kZWZpbml0aW9uL3NwZWMvZml4dHVyZXMvamF2YXNjcmlwdC1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgaGVscGVycyBmcm9tICcuLi9zcGVjLWhlbHBlcnMnO1xuXG5kZXNjcmliZSgnSmF2YVNjcmlwdCBHb3RvIERlZmluaXRpb24nLCAoKSA9PiB7XG4gIGxldCBbZWRpdG9yLCBtYWluTW9kdWxlXSA9IEFycmF5LmZyb20oW10pO1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiBoZWxwZXJzLm9wZW5GaWxlKCd0ZXN0LmpzJykpO1xuICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgKHsgZWRpdG9yLCBtYWluTW9kdWxlIH0gPSBoZWxwZXJzLmdldFBhY2thZ2UoKSk7XG4gICAgICBoZWxwZXJzLm5vbWFsTW9kZSgpO1xuICAgIH0pO1xuICB9KTtcblxuICBpdCgnbm8gZGVmaW5pdGlvbicsICgpID0+IHtcbiAgICBlZGl0b3Iuc2V0VGV4dCgnaGVsbG9fd29ybGQnKTtcbiAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDFdKTtcblxuICAgIGV4cGVjdChoZWxwZXJzLmdldFNlbGVjdGVkV29yZCgpKS50b0VxdWFsKCdoZWxsb193b3JsZCcpO1xuICAgIGV4cGVjdChoZWxwZXJzLmdldEZpbGVUeXBlcygpKS50b0NvbnRhaW4oJyouanMnKTtcbiAgICBleHBlY3QoaGVscGVycy5zZW5kQ29tYW5kKCkpLnRvQmUodHJ1ZSk7XG5cbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4gaGVscGVycy53YWl0c0NvbXBsZXRlKCkpO1xuXG4gICAgZXhwZWN0KG1haW5Nb2R1bGUuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgfSk7XG5cbiAgaXQoJ2ZpbmQgZnVuY3Rpb24nLCAoKSA9PiB7XG4gICAgZWRpdG9yLnNldFRleHQoYFxcXG5mdW5jdGlvbiBoZWxsb193b3JsZCgpIHtcbiAgcmV0dXJuIHRydWU7XG59XG5oZWxsb193b3JsZFxcXG5gKTtcbiAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzMsIDFdKTtcblxuICAgIGV4cGVjdChoZWxwZXJzLmdldFNlbGVjdGVkV29yZCgpKS50b0VxdWFsKCdoZWxsb193b3JsZCcpO1xuICAgIGV4cGVjdChoZWxwZXJzLmdldEZpbGVUeXBlcygpKS50b0NvbnRhaW4oJyouanMnKTtcbiAgICBleHBlY3QoaGVscGVycy5zZW5kQ29tYW5kKCkpLnRvQmUodHJ1ZSk7XG5cbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4gaGVscGVycy53YWl0c0NvbXBsZXRlKCkpO1xuXG4gICAgZXhwZWN0KG1haW5Nb2R1bGUuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QobWFpbk1vZHVsZS5kZWZpbml0aW9uc1ZpZXcuaXRlbXNbMF0ubGluZSkudG9FcXVhbCgwKTtcbiAgICBleHBlY3QobWFpbk1vZHVsZS5kZWZpbml0aW9uc1ZpZXcuaXRlbXNbMF0udGV4dCkudG9Db250YWluKCdmdW5jdGlvbiBoZWxsb193b3JsZCgpIHsnKTtcbiAgfSk7XG5cbiAgaXQoJ2ZpbmQgZnVuY3Rpb24gYW5kIGVzNiBjbGFzcyB3aXRob3V0IHNhdmVkJywgKCkgPT4ge1xuICAgIGVkaXRvci5zZXRUZXh0KGBcXFxuZnVuY3Rpb24gaGVsbG9fd29ybGQoKSB7XG4gIHJldHVybiB0cnVlO1xufVxuY2xhc3MgaGVsbG9fd29ybGQge1xuICBoZWxsb193b3JsZCh4LCB5KSB7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICB9XG59XG5oZWxsb193b3JsZFxcXG5gKTtcbiAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzEwLCAxXSk7XG5cbiAgICBleHBlY3QoaGVscGVycy5nZXRTZWxlY3RlZFdvcmQoKSkudG9FcXVhbCgnaGVsbG9fd29ybGQnKTtcbiAgICBleHBlY3QoaGVscGVycy5nZXRGaWxlVHlwZXMoKSkudG9Db250YWluKCcqLmpzJyk7XG4gICAgZXhwZWN0KGhlbHBlcnMuc2VuZENvbWFuZCgpKS50b0JlKHRydWUpO1xuXG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IGhlbHBlcnMud2FpdHNDb21wbGV0ZSgpKTtcblxuICAgIGV4cGVjdChtYWluTW9kdWxlLmRlZmluaXRpb25zVmlldy5pdGVtcy5sZW5ndGgpLnRvRXF1YWwoMyk7XG4gICAgZXhwZWN0KG1haW5Nb2R1bGUuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zWzBdLmxpbmUpLnRvRXF1YWwoMCk7XG4gICAgZXhwZWN0KG1haW5Nb2R1bGUuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zWzBdLnRleHQpLnRvQ29udGFpbignZnVuY3Rpb24gaGVsbG9fd29ybGQoKSB7Jyk7XG5cbiAgICBleHBlY3QobWFpbk1vZHVsZS5kZWZpbml0aW9uc1ZpZXcuaXRlbXNbMV0ubGluZSkudG9FcXVhbCgzKTtcbiAgICBleHBlY3QobWFpbk1vZHVsZS5kZWZpbml0aW9uc1ZpZXcuaXRlbXNbMV0udGV4dCkudG9Db250YWluKCdjbGFzcyBoZWxsb193b3JsZCB7Jyk7XG5cbiAgICBleHBlY3QobWFpbk1vZHVsZS5kZWZpbml0aW9uc1ZpZXcuaXRlbXNbMl0ubGluZSkudG9FcXVhbCg0KTtcbiAgICBleHBlY3QobWFpbk1vZHVsZS5kZWZpbml0aW9uc1ZpZXcuaXRlbXNbMl0udGV4dCkudG9Db250YWluKCdoZWxsb193b3JsZCh4LCB5KSB7Jyk7XG4gIH0pO1xuXG4gIGl0KCdmaW5kIGZ1bmN0aW9uIGFuZCBlczYgY2xhc3Mgd2l0aCBzYXZlZCcsICgpID0+IHtcbiAgICBlZGl0b3Iuc2V0VGV4dChgXFxcbmZ1bmN0aW9uIGhlbGxvX3dvcmxkKCkge1xuICByZXR1cm4gdHJ1ZTtcbn1cbmNsYXNzIGhlbGxvX3dvcmxkIHtcbiAgaGVsbG9fd29ybGQoeCwgeSkge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgfVxufVxuaGVsbG9fd29ybGRcXFxuYCk7XG4gICAgaGVscGVycy5lZGl0b3JTYXZlKCk7XG4gICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFsxMCwgMV0pO1xuXG4gICAgZXhwZWN0KGhlbHBlcnMuZ2V0U2VsZWN0ZWRXb3JkKCkpLnRvRXF1YWwoJ2hlbGxvX3dvcmxkJyk7XG4gICAgZXhwZWN0KGhlbHBlcnMuZ2V0RmlsZVR5cGVzKCkpLnRvQ29udGFpbignKi5qcycpO1xuICAgIGV4cGVjdChoZWxwZXJzLnNlbmRDb21hbmQoKSkudG9CZSh0cnVlKTtcblxuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiBoZWxwZXJzLndhaXRzQ29tcGxldGUoKSk7XG4gICAgaGVscGVycy5lZGl0b3JEZWxldGUoKTtcblxuICAgIGV4cGVjdChtYWluTW9kdWxlLmRlZmluaXRpb25zVmlldy5pdGVtcy5sZW5ndGgpLnRvRXF1YWwoMyk7XG4gICAgZXhwZWN0KG1haW5Nb2R1bGUuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zWzBdLmxpbmUpLnRvRXF1YWwoMCk7XG4gICAgZXhwZWN0KG1haW5Nb2R1bGUuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zWzBdLnRleHQpLnRvQ29udGFpbignZnVuY3Rpb24gaGVsbG9fd29ybGQoKSB7Jyk7XG5cbiAgICBleHBlY3QobWFpbk1vZHVsZS5kZWZpbml0aW9uc1ZpZXcuaXRlbXNbMV0ubGluZSkudG9FcXVhbCgzKTtcbiAgICBleHBlY3QobWFpbk1vZHVsZS5kZWZpbml0aW9uc1ZpZXcuaXRlbXNbMV0udGV4dCkudG9Db250YWluKCdjbGFzcyBoZWxsb193b3JsZCB7Jyk7XG5cbiAgICBleHBlY3QobWFpbk1vZHVsZS5kZWZpbml0aW9uc1ZpZXcuaXRlbXNbMl0ubGluZSkudG9FcXVhbCg0KTtcbiAgICBleHBlY3QobWFpbk1vZHVsZS5kZWZpbml0aW9uc1ZpZXcuaXRlbXNbMl0udGV4dCkudG9Db250YWluKCdoZWxsb193b3JsZCh4LCB5KSB7Jyk7XG4gIH0pO1xuXG4gIHJldHVybiBpdCgncGVyZm9ybWFuY2UgbW9kZSBmaW5kIGZ1bmN0aW9uIGFuZCBlczYgY2xhc3Mgd2l0aCBzYXZlZCcsICgpID0+IHtcbiAgICBoZWxwZXJzLnBlcmZvcm1hbmNlTW9kZSgpO1xuXG4gICAgZWRpdG9yLnNldFRleHQoYFxcXG5mdW5jdGlvbiBoZWxsb193b3JsZCgpIHtcbiAgcmV0dXJuIHRydWU7XG59XG5jbGFzcyBoZWxsb193b3JsZCB7XG4gIGhlbGxvX3dvcmxkKHgsIHkpIHtcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gIH1cbn1cbmhlbGxvX3dvcmxkXFxcbmApO1xuICAgIGhlbHBlcnMuZWRpdG9yU2F2ZSgpO1xuICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMTAsIDFdKTtcblxuICAgIGV4cGVjdChoZWxwZXJzLmdldFNlbGVjdGVkV29yZCgpKS50b0VxdWFsKCdoZWxsb193b3JsZCcpO1xuICAgIGV4cGVjdChoZWxwZXJzLmdldEZpbGVUeXBlcygpKS50b0NvbnRhaW4oJyouanMnKTtcbiAgICBleHBlY3QoaGVscGVycy5zZW5kQ29tYW5kKCkpLnRvQmUodHJ1ZSk7XG5cbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4gaGVscGVycy53YWl0c0NvbXBsZXRlKCkpO1xuICAgIGhlbHBlcnMuZWRpdG9yRGVsZXRlKCk7XG5cbiAgICBleHBlY3QobWFpbk1vZHVsZS5kZWZpbml0aW9uc1ZpZXcuaXRlbXMubGVuZ3RoKS50b0VxdWFsKDMpO1xuICAgIGV4cGVjdChtYWluTW9kdWxlLmRlZmluaXRpb25zVmlldy5pdGVtc1swXS5saW5lKS50b0VxdWFsKDApO1xuICAgIGV4cGVjdChtYWluTW9kdWxlLmRlZmluaXRpb25zVmlldy5pdGVtc1swXS50ZXh0KS50b0NvbnRhaW4oJ2Z1bmN0aW9uIGhlbGxvX3dvcmxkKCkgeycpO1xuXG4gICAgZXhwZWN0KG1haW5Nb2R1bGUuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zWzFdLmxpbmUpLnRvRXF1YWwoMyk7XG4gICAgZXhwZWN0KG1haW5Nb2R1bGUuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zWzFdLnRleHQpLnRvQ29udGFpbignY2xhc3MgaGVsbG9fd29ybGQgeycpO1xuXG4gICAgZXhwZWN0KG1haW5Nb2R1bGUuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zWzJdLmxpbmUpLnRvRXF1YWwoNCk7XG4gICAgZXhwZWN0KG1haW5Nb2R1bGUuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zWzJdLnRleHQpLnRvQ29udGFpbignaGVsbG9fd29ybGQoeCwgeSkgeycpO1xuICB9KTtcbn0pO1xuIl19