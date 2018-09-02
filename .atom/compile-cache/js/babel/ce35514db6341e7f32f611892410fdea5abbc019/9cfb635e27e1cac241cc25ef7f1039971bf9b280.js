var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _specHelpers = require('../spec-helpers');

var _specHelpers2 = _interopRequireDefault(_specHelpers);

describe('Python Goto Definition', function () {
  var _Array$from = Array.from([]);

  var _Array$from2 = _slicedToArray(_Array$from, 2);

  var editor = _Array$from2[0];
  var mainModule = _Array$from2[1];

  beforeEach(function () {
    waitsForPromise(function () {
      return _specHelpers2['default'].openFile('test.py');
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
    expect(_specHelpers2['default'].getFileTypes()).toContain('*.py');
    expect(_specHelpers2['default'].sendComand()).toBe(true);

    waitsForPromise(function () {
      return _specHelpers2['default'].waitsComplete();
    });

    expect(mainModule.definitionsView.items.length).toEqual(0);
  });

  it('find function', function () {
    editor.setText('def hello_world():\n  return True\nhello_world');
    editor.setCursorBufferPosition([3, 1]);

    expect(_specHelpers2['default'].getSelectedWord()).toEqual('hello_world');
    expect(_specHelpers2['default'].getFileTypes()).toContain('*.py');
    expect(_specHelpers2['default'].sendComand()).toBe(true);

    waitsForPromise(function () {
      return _specHelpers2['default'].waitsComplete();
    });

    expect(mainModule.definitionsView.items.length).toEqual(1);
    expect(mainModule.definitionsView.items[0].line).toEqual(0);
    expect(mainModule.definitionsView.items[0].text).toContain('def hello_world():');
  });

  it('find function and class without saved', function () {
    editor.setText('class hello_world(object):\n  def hello_world(self):\n    pass\nhello_world');
    editor.setCursorBufferPosition([4, 1]);

    expect(_specHelpers2['default'].getSelectedWord()).toEqual('hello_world');
    expect(_specHelpers2['default'].getFileTypes()).toContain('*.py');
    expect(_specHelpers2['default'].sendComand()).toBe(true);

    waitsForPromise(function () {
      return _specHelpers2['default'].waitsComplete();
    });

    expect(mainModule.definitionsView.items.length).toEqual(2);
    expect(mainModule.definitionsView.items[0].line).toEqual(0);
    expect(mainModule.definitionsView.items[0].text).toContain('class hello_world(object):');
    expect(mainModule.definitionsView.items[1].line).toEqual(1);
    expect(mainModule.definitionsView.items[1].text).toContain('def hello_world(self):');
  });

  it('find function and class with saved', function () {
    editor.setText('class hello_world(object):\n  def hello_world(self):\n    pass\nhello_world');
    _specHelpers2['default'].editorSave();
    editor.setCursorBufferPosition([4, 1]);

    expect(_specHelpers2['default'].getSelectedWord()).toEqual('hello_world');
    expect(_specHelpers2['default'].getFileTypes()).toContain('*.py');
    expect(_specHelpers2['default'].sendComand()).toBe(true);

    waitsForPromise(function () {
      return _specHelpers2['default'].waitsComplete();
    });
    _specHelpers2['default'].editorDelete();

    expect(mainModule.definitionsView.items.length).toEqual(2);
    expect(mainModule.definitionsView.items[0].line).toEqual(0);
    expect(mainModule.definitionsView.items[0].text).toContain('class hello_world(object):');
    expect(mainModule.definitionsView.items[1].line).toEqual(1);
    expect(mainModule.definitionsView.items[1].text).toContain('def hello_world(self):');
  });

  it('performance mode find function and class with saved', function () {
    _specHelpers2['default'].performanceMode();

    editor.setText('class hello_world(object):\n  def hello_world(self):\n    pass\nhello_world');
    _specHelpers2['default'].editorSave();
    editor.setCursorBufferPosition([4, 1]);

    expect(_specHelpers2['default'].getSelectedWord()).toEqual('hello_world');
    expect(_specHelpers2['default'].getFileTypes()).toContain('*.py');
    expect(_specHelpers2['default'].sendComand()).toBe(true);

    waitsForPromise(function () {
      return _specHelpers2['default'].waitsComplete();
    });
    _specHelpers2['default'].editorDelete();

    expect(mainModule.definitionsView.items.length).toEqual(2);
    expect(mainModule.definitionsView.items[0].line).toEqual(0);
    expect(mainModule.definitionsView.items[0].text).toContain('class hello_world(object):');
    expect(mainModule.definitionsView.items[1].line).toEqual(1);
    expect(mainModule.definitionsView.items[1].text).toContain('def hello_world(self):');
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvZ290by1kZWZpbml0aW9uL3NwZWMvZml4dHVyZXMvcHl0aG9uLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OzJCQUVvQixpQkFBaUI7Ozs7QUFFckMsUUFBUSxDQUFDLHdCQUF3QixFQUFFLFlBQU07b0JBQ1osS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7Ozs7TUFBcEMsTUFBTTtNQUFFLFVBQVU7O0FBRXZCLFlBQVUsQ0FBQyxZQUFNO0FBQ2YsbUJBQWUsQ0FBQzthQUFNLHlCQUFRLFFBQVEsQ0FBQyxTQUFTLENBQUM7S0FBQSxDQUFDLENBQUM7QUFDbkQsUUFBSSxDQUFDLFlBQU07Z0NBQ2lCLHlCQUFRLFVBQVUsRUFBRTs7QUFBM0MsWUFBTSx1QkFBTixNQUFNO0FBQUUsZ0JBQVUsdUJBQVYsVUFBVTs7QUFDckIsK0JBQVEsU0FBUyxFQUFFLENBQUM7S0FDckIsQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDOztBQUVILElBQUUsQ0FBQyxlQUFlLEVBQUUsWUFBTTtBQUN4QixVQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzlCLFVBQU0sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUV2QyxVQUFNLENBQUMseUJBQVEsZUFBZSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDekQsVUFBTSxDQUFDLHlCQUFRLFlBQVksRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2pELFVBQU0sQ0FBQyx5QkFBUSxVQUFVLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFeEMsbUJBQWUsQ0FBQzthQUFNLHlCQUFRLGFBQWEsRUFBRTtLQUFBLENBQUMsQ0FBQzs7QUFFL0MsVUFBTSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENB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IjoiL2hvbWUvdGhla2FybG85NS8uYXRvbS9wYWNrYWdlcy9nb3RvLWRlZmluaXRpb24vc3BlYy9maXh0dXJlcy9weXRob24tc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IGhlbHBlcnMgZnJvbSAnLi4vc3BlYy1oZWxwZXJzJztcblxuZGVzY3JpYmUoJ1B5dGhvbiBHb3RvIERlZmluaXRpb24nLCAoKSA9PiB7XG4gIGxldCBbZWRpdG9yLCBtYWluTW9kdWxlXSA9IEFycmF5LmZyb20oW10pO1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiBoZWxwZXJzLm9wZW5GaWxlKCd0ZXN0LnB5JykpO1xuICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgKHsgZWRpdG9yLCBtYWluTW9kdWxlIH0gPSBoZWxwZXJzLmdldFBhY2thZ2UoKSk7XG4gICAgICBoZWxwZXJzLm5vbWFsTW9kZSgpO1xuICAgIH0pO1xuICB9KTtcblxuICBpdCgnbm8gZGVmaW5pdGlvbicsICgpID0+IHtcbiAgICBlZGl0b3Iuc2V0VGV4dCgnaGVsbG9fd29ybGQnKTtcbiAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDFdKTtcblxuICAgIGV4cGVjdChoZWxwZXJzLmdldFNlbGVjdGVkV29yZCgpKS50b0VxdWFsKCdoZWxsb193b3JsZCcpO1xuICAgIGV4cGVjdChoZWxwZXJzLmdldEZpbGVUeXBlcygpKS50b0NvbnRhaW4oJyoucHknKTtcbiAgICBleHBlY3QoaGVscGVycy5zZW5kQ29tYW5kKCkpLnRvQmUodHJ1ZSk7XG5cbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4gaGVscGVycy53YWl0c0NvbXBsZXRlKCkpO1xuXG4gICAgZXhwZWN0KG1haW5Nb2R1bGUuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgfSk7XG5cbiAgaXQoJ2ZpbmQgZnVuY3Rpb24nLCAoKSA9PiB7XG4gICAgZWRpdG9yLnNldFRleHQoYFxcXG5kZWYgaGVsbG9fd29ybGQoKTpcbiAgcmV0dXJuIFRydWVcbmhlbGxvX3dvcmxkXFxcbmApO1xuICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMywgMV0pO1xuXG4gICAgZXhwZWN0KGhlbHBlcnMuZ2V0U2VsZWN0ZWRXb3JkKCkpLnRvRXF1YWwoJ2hlbGxvX3dvcmxkJyk7XG4gICAgZXhwZWN0KGhlbHBlcnMuZ2V0RmlsZVR5cGVzKCkpLnRvQ29udGFpbignKi5weScpO1xuICAgIGV4cGVjdChoZWxwZXJzLnNlbmRDb21hbmQoKSkudG9CZSh0cnVlKTtcblxuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiBoZWxwZXJzLndhaXRzQ29tcGxldGUoKSk7XG5cbiAgICBleHBlY3QobWFpbk1vZHVsZS5kZWZpbml0aW9uc1ZpZXcuaXRlbXMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChtYWluTW9kdWxlLmRlZmluaXRpb25zVmlldy5pdGVtc1swXS5saW5lKS50b0VxdWFsKDApO1xuICAgIGV4cGVjdChtYWluTW9kdWxlLmRlZmluaXRpb25zVmlldy5pdGVtc1swXS50ZXh0KS50b0NvbnRhaW4oJ2RlZiBoZWxsb193b3JsZCgpOicpO1xuICB9KTtcblxuICBpdCgnZmluZCBmdW5jdGlvbiBhbmQgY2xhc3Mgd2l0aG91dCBzYXZlZCcsICgpID0+IHtcbiAgICBlZGl0b3Iuc2V0VGV4dChgXFxcbmNsYXNzIGhlbGxvX3dvcmxkKG9iamVjdCk6XG4gIGRlZiBoZWxsb193b3JsZChzZWxmKTpcbiAgICBwYXNzXG5oZWxsb193b3JsZFxcXG5gKTtcbiAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzQsIDFdKTtcblxuICAgIGV4cGVjdChoZWxwZXJzLmdldFNlbGVjdGVkV29yZCgpKS50b0VxdWFsKCdoZWxsb193b3JsZCcpO1xuICAgIGV4cGVjdChoZWxwZXJzLmdldEZpbGVUeXBlcygpKS50b0NvbnRhaW4oJyoucHknKTtcbiAgICBleHBlY3QoaGVscGVycy5zZW5kQ29tYW5kKCkpLnRvQmUodHJ1ZSk7XG5cbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4gaGVscGVycy53YWl0c0NvbXBsZXRlKCkpO1xuXG4gICAgZXhwZWN0KG1haW5Nb2R1bGUuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zLmxlbmd0aCkudG9FcXVhbCgyKTtcbiAgICBleHBlY3QobWFpbk1vZHVsZS5kZWZpbml0aW9uc1ZpZXcuaXRlbXNbMF0ubGluZSkudG9FcXVhbCgwKTtcbiAgICBleHBlY3QobWFpbk1vZHVsZS5kZWZpbml0aW9uc1ZpZXcuaXRlbXNbMF0udGV4dCkudG9Db250YWluKCdjbGFzcyBoZWxsb193b3JsZChvYmplY3QpOicpO1xuICAgIGV4cGVjdChtYWluTW9kdWxlLmRlZmluaXRpb25zVmlldy5pdGVtc1sxXS5saW5lKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChtYWluTW9kdWxlLmRlZmluaXRpb25zVmlldy5pdGVtc1sxXS50ZXh0KS50b0NvbnRhaW4oJ2RlZiBoZWxsb193b3JsZChzZWxmKTonKTtcbiAgfSk7XG5cbiAgaXQoJ2ZpbmQgZnVuY3Rpb24gYW5kIGNsYXNzIHdpdGggc2F2ZWQnLCAoKSA9PiB7XG4gICAgZWRpdG9yLnNldFRleHQoYFxcXG5jbGFzcyBoZWxsb193b3JsZChvYmplY3QpOlxuICBkZWYgaGVsbG9fd29ybGQoc2VsZik6XG4gICAgcGFzc1xuaGVsbG9fd29ybGRcXFxuYCk7XG4gICAgaGVscGVycy5lZGl0b3JTYXZlKCk7XG4gICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFs0LCAxXSk7XG5cbiAgICBleHBlY3QoaGVscGVycy5nZXRTZWxlY3RlZFdvcmQoKSkudG9FcXVhbCgnaGVsbG9fd29ybGQnKTtcbiAgICBleHBlY3QoaGVscGVycy5nZXRGaWxlVHlwZXMoKSkudG9Db250YWluKCcqLnB5Jyk7XG4gICAgZXhwZWN0KGhlbHBlcnMuc2VuZENvbWFuZCgpKS50b0JlKHRydWUpO1xuXG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IGhlbHBlcnMud2FpdHNDb21wbGV0ZSgpKTtcbiAgICBoZWxwZXJzLmVkaXRvckRlbGV0ZSgpO1xuXG4gICAgZXhwZWN0KG1haW5Nb2R1bGUuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zLmxlbmd0aCkudG9FcXVhbCgyKTtcbiAgICBleHBlY3QobWFpbk1vZHVsZS5kZWZpbml0aW9uc1ZpZXcuaXRlbXNbMF0ubGluZSkudG9FcXVhbCgwKTtcbiAgICBleHBlY3QobWFpbk1vZHVsZS5kZWZpbml0aW9uc1ZpZXcuaXRlbXNbMF0udGV4dCkudG9Db250YWluKCdjbGFzcyBoZWxsb193b3JsZChvYmplY3QpOicpO1xuICAgIGV4cGVjdChtYWluTW9kdWxlLmRlZmluaXRpb25zVmlldy5pdGVtc1sxXS5saW5lKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChtYWluTW9kdWxlLmRlZmluaXRpb25zVmlldy5pdGVtc1sxXS50ZXh0KS50b0NvbnRhaW4oJ2RlZiBoZWxsb193b3JsZChzZWxmKTonKTtcbiAgfSk7XG5cbiAgaXQoJ3BlcmZvcm1hbmNlIG1vZGUgZmluZCBmdW5jdGlvbiBhbmQgY2xhc3Mgd2l0aCBzYXZlZCcsICgpID0+IHtcbiAgICBoZWxwZXJzLnBlcmZvcm1hbmNlTW9kZSgpO1xuXG4gICAgZWRpdG9yLnNldFRleHQoYFxcXG5jbGFzcyBoZWxsb193b3JsZChvYmplY3QpOlxuICBkZWYgaGVsbG9fd29ybGQoc2VsZik6XG4gICAgcGFzc1xuaGVsbG9fd29ybGRcXFxuYCk7XG4gICAgaGVscGVycy5lZGl0b3JTYXZlKCk7XG4gICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFs0LCAxXSk7XG5cbiAgICBleHBlY3QoaGVscGVycy5nZXRTZWxlY3RlZFdvcmQoKSkudG9FcXVhbCgnaGVsbG9fd29ybGQnKTtcbiAgICBleHBlY3QoaGVscGVycy5nZXRGaWxlVHlwZXMoKSkudG9Db250YWluKCcqLnB5Jyk7XG4gICAgZXhwZWN0KGhlbHBlcnMuc2VuZENvbWFuZCgpKS50b0JlKHRydWUpO1xuXG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IGhlbHBlcnMud2FpdHNDb21wbGV0ZSgpKTtcbiAgICBoZWxwZXJzLmVkaXRvckRlbGV0ZSgpO1xuXG4gICAgZXhwZWN0KG1haW5Nb2R1bGUuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zLmxlbmd0aCkudG9FcXVhbCgyKTtcbiAgICBleHBlY3QobWFpbk1vZHVsZS5kZWZpbml0aW9uc1ZpZXcuaXRlbXNbMF0ubGluZSkudG9FcXVhbCgwKTtcbiAgICBleHBlY3QobWFpbk1vZHVsZS5kZWZpbml0aW9uc1ZpZXcuaXRlbXNbMF0udGV4dCkudG9Db250YWluKCdjbGFzcyBoZWxsb193b3JsZChvYmplY3QpOicpO1xuICAgIGV4cGVjdChtYWluTW9kdWxlLmRlZmluaXRpb25zVmlldy5pdGVtc1sxXS5saW5lKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChtYWluTW9kdWxlLmRlZmluaXRpb25zVmlldy5pdGVtc1sxXS50ZXh0KS50b0NvbnRhaW4oJ2RlZiBoZWxsb193b3JsZChzZWxmKTonKTtcbiAgfSk7XG59KTtcbiJdfQ==