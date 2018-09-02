var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libSvgPreviewView = require('../lib/svg-preview-view');

var _libSvgPreviewView2 = _interopRequireDefault(_libSvgPreviewView);

'use babel';

var atom = global.atom;
var afterEach = global.afterEach;
var describe = global.describe;
var it = global.it;
var expect = global.expect;
var beforeEach = global.beforeEach;
var jasmine = global.jasmine;
var runs = global.runs;
var waitsForPromise = global.waitsForPromise;

var preview = undefined;

describe('SvgPreviewView', function () {
  beforeEach(function () {
    var _atom$project$getDirectories = atom.project.getDirectories();

    var _atom$project$getDirectories2 = _slicedToArray(_atom$project$getDirectories, 1);

    var dir = _atom$project$getDirectories2[0];

    var filePath = dir != null ? dir.resolve('subdir/file.svg') : undefined;

    preview = new _libSvgPreviewView2['default']({ filePath: filePath });

    jasmine.attachToDOM(preview.element);
    atom.deserializers.add(_libSvgPreviewView2['default']);
  });

  afterEach(function () {
    return preview.destroy();
  });

  describe('::constructor', function () {
    it('shows a loading spinner and renders the svg', function () {
      preview.showLoading();
      expect(preview.find('.svg-spinner')).toExist();

      waitsForPromise(function () {
        return preview.renderSvg();
      });
      runs(function () {
        return expect(preview.find('.svg-spinner')).not.toExist();
      });
    });

    it('shows an error message when there is an error', function () {
      preview.showError('Not a real file');
      expect(preview.text()).toContain('Failed');
    });
  });

  describe('serialization', function () {
    var newPreview = null;

    afterEach(function () {
      return newPreview.destroy();
    });

    it('recreates the file when serialized/deserialized', function () {
      newPreview = atom.deserializers.deserialize(preview.serialize());
      jasmine.attachToDOM(newPreview.element);
      expect(newPreview.getPath()).toBe(preview.getPath());
    });

    it('serializes the editor id when opened for an editor', function () {
      preview.destroy();

      waitsForPromise(function () {
        return atom.workspace.open('new.svg');
      });
      runs(function () {
        preview = new _libSvgPreviewView2['default']({
          editorId: atom.workspace.getActiveTextEditor().id
        });
        jasmine.attachToDOM(preview.element);
        expect(preview.getPath()).toBe(atom.workspace.getActiveTextEditor().getPath());
        newPreview = atom.deserializers.deserialize(preview.serialize());
        jasmine.attachToDOM(newPreview.element);
        expect(newPreview.getPath()).toBe(preview.getPath());
      });
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvc3ZnLXByZXZpZXcvc3BlYy9zdmctcHJldmlldy12aWV3LXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztpQ0FFMkIseUJBQXlCOzs7O0FBRnBELFdBQVcsQ0FBQTs7SUFJSCxJQUFJLEdBQWtGLE1BQU0sQ0FBNUYsSUFBSTtJQUFFLFNBQVMsR0FBdUUsTUFBTSxDQUF0RixTQUFTO0lBQUUsUUFBUSxHQUE2RCxNQUFNLENBQTNFLFFBQVE7SUFBRSxFQUFFLEdBQXlELE1BQU0sQ0FBakUsRUFBRTtJQUFFLE1BQU0sR0FBaUQsTUFBTSxDQUE3RCxNQUFNO0lBQUUsVUFBVSxHQUFxQyxNQUFNLENBQXJELFVBQVU7SUFBRSxPQUFPLEdBQTRCLE1BQU0sQ0FBekMsT0FBTztJQUFFLElBQUksR0FBc0IsTUFBTSxDQUFoQyxJQUFJO0lBQUUsZUFBZSxHQUFLLE1BQU0sQ0FBMUIsZUFBZTs7QUFFekYsSUFBSSxPQUFPLFlBQUEsQ0FBQTs7QUFFWCxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsWUFBTTtBQUMvQixZQUFVLENBQUMsWUFBTTt1Q0FDQyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRTs7OztRQUFyQyxHQUFHOztBQUNYLFFBQU0sUUFBUSxHQUFHLEdBQUcsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLFNBQVMsQ0FBQTs7QUFFekUsV0FBTyxHQUFHLG1DQUFtQixFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsQ0FBQyxDQUFBOztBQUUxQyxXQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNwQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsZ0NBQWdCLENBQUE7R0FDdkMsQ0FBQyxDQUFBOztBQUVGLFdBQVMsQ0FBQztXQUFNLE9BQU8sQ0FBQyxPQUFPLEVBQUU7R0FBQSxDQUFDLENBQUE7O0FBRWxDLFVBQVEsQ0FBQyxlQUFlLEVBQUUsWUFBTTtBQUM5QixNQUFFLENBQUMsNkNBQTZDLEVBQUUsWUFBTTtBQUN0RCxhQUFPLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDckIsWUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTs7QUFFOUMscUJBQWUsQ0FBQztlQUFNLE9BQU8sQ0FBQyxTQUFTLEVBQUU7T0FBQSxDQUFDLENBQUE7QUFDMUMsVUFBSSxDQUFDO2VBQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFO09BQUEsQ0FBQyxDQUFBO0tBQy9ELENBQUMsQ0FBQTs7QUFFRixNQUFFLENBQUMsK0NBQStDLEVBQUUsWUFBTTtBQUN4RCxhQUFPLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLENBQUE7QUFDcEMsWUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtLQUMzQyxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLGVBQWUsRUFBRSxZQUFNO0FBQzlCLFFBQUksVUFBVSxHQUFHLElBQUksQ0FBQTs7QUFFckIsYUFBUyxDQUFDO2FBQU0sVUFBVSxDQUFDLE9BQU8sRUFBRTtLQUFBLENBQUMsQ0FBQTs7QUFFckMsTUFBRSxDQUFDLGlEQUFpRCxFQUFFLFlBQU07QUFDMUQsZ0JBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQTtBQUNoRSxhQUFPLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUN2QyxZQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO0tBQ3JELENBQUMsQ0FBQTs7QUFFRixNQUFFLENBQUMsb0RBQW9ELEVBQUUsWUFBTTtBQUM3RCxhQUFPLENBQUMsT0FBTyxFQUFFLENBQUE7O0FBRWpCLHFCQUFlLENBQUM7ZUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7T0FBQSxDQUFDLENBQUE7QUFDckQsVUFBSSxDQUFDLFlBQU07QUFDVCxlQUFPLEdBQUcsbUNBQW1CO0FBQzNCLGtCQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLEVBQUU7U0FDbEQsQ0FBQyxDQUFBO0FBQ0YsZUFBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDcEMsY0FBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQTtBQUM5RSxrQkFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFBO0FBQ2hFLGVBQU8sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3ZDLGNBQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7T0FDckQsQ0FBQyxDQUFBO0tBQ0gsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvc3ZnLXByZXZpZXcvc3BlYy9zdmctcHJldmlldy12aWV3LXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgU3ZnUHJldmlld1ZpZXcgZnJvbSAnLi4vbGliL3N2Zy1wcmV2aWV3LXZpZXcnXG5cbmNvbnN0IHsgYXRvbSwgYWZ0ZXJFYWNoLCBkZXNjcmliZSwgaXQsIGV4cGVjdCwgYmVmb3JlRWFjaCwgamFzbWluZSwgcnVucywgd2FpdHNGb3JQcm9taXNlIH0gPSBnbG9iYWxcblxubGV0IHByZXZpZXdcblxuZGVzY3JpYmUoJ1N2Z1ByZXZpZXdWaWV3JywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBjb25zdCBbIGRpciBdID0gYXRvbS5wcm9qZWN0LmdldERpcmVjdG9yaWVzKClcbiAgICBjb25zdCBmaWxlUGF0aCA9IGRpciAhPSBudWxsID8gZGlyLnJlc29sdmUoJ3N1YmRpci9maWxlLnN2ZycpIDogdW5kZWZpbmVkXG5cbiAgICBwcmV2aWV3ID0gbmV3IFN2Z1ByZXZpZXdWaWV3KHsgZmlsZVBhdGggfSlcblxuICAgIGphc21pbmUuYXR0YWNoVG9ET00ocHJldmlldy5lbGVtZW50KVxuICAgIGF0b20uZGVzZXJpYWxpemVycy5hZGQoU3ZnUHJldmlld1ZpZXcpXG4gIH0pXG5cbiAgYWZ0ZXJFYWNoKCgpID0+IHByZXZpZXcuZGVzdHJveSgpKVxuXG4gIGRlc2NyaWJlKCc6OmNvbnN0cnVjdG9yJywgKCkgPT4ge1xuICAgIGl0KCdzaG93cyBhIGxvYWRpbmcgc3Bpbm5lciBhbmQgcmVuZGVycyB0aGUgc3ZnJywgKCkgPT4ge1xuICAgICAgcHJldmlldy5zaG93TG9hZGluZygpXG4gICAgICBleHBlY3QocHJldmlldy5maW5kKCcuc3ZnLXNwaW5uZXInKSkudG9FeGlzdCgpXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiBwcmV2aWV3LnJlbmRlclN2ZygpKVxuICAgICAgcnVucygoKSA9PiBleHBlY3QocHJldmlldy5maW5kKCcuc3ZnLXNwaW5uZXInKSkubm90LnRvRXhpc3QoKSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3dzIGFuIGVycm9yIG1lc3NhZ2Ugd2hlbiB0aGVyZSBpcyBhbiBlcnJvcicsICgpID0+IHtcbiAgICAgIHByZXZpZXcuc2hvd0Vycm9yKCdOb3QgYSByZWFsIGZpbGUnKVxuICAgICAgZXhwZWN0KHByZXZpZXcudGV4dCgpKS50b0NvbnRhaW4oJ0ZhaWxlZCcpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnc2VyaWFsaXphdGlvbicsICgpID0+IHtcbiAgICBsZXQgbmV3UHJldmlldyA9IG51bGxcblxuICAgIGFmdGVyRWFjaCgoKSA9PiBuZXdQcmV2aWV3LmRlc3Ryb3koKSlcblxuICAgIGl0KCdyZWNyZWF0ZXMgdGhlIGZpbGUgd2hlbiBzZXJpYWxpemVkL2Rlc2VyaWFsaXplZCcsICgpID0+IHtcbiAgICAgIG5ld1ByZXZpZXcgPSBhdG9tLmRlc2VyaWFsaXplcnMuZGVzZXJpYWxpemUocHJldmlldy5zZXJpYWxpemUoKSlcbiAgICAgIGphc21pbmUuYXR0YWNoVG9ET00obmV3UHJldmlldy5lbGVtZW50KVxuICAgICAgZXhwZWN0KG5ld1ByZXZpZXcuZ2V0UGF0aCgpKS50b0JlKHByZXZpZXcuZ2V0UGF0aCgpKVxuICAgIH0pXG5cbiAgICBpdCgnc2VyaWFsaXplcyB0aGUgZWRpdG9yIGlkIHdoZW4gb3BlbmVkIGZvciBhbiBlZGl0b3InLCAoKSA9PiB7XG4gICAgICBwcmV2aWV3LmRlc3Ryb3koKVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4gYXRvbS53b3Jrc3BhY2Uub3BlbignbmV3LnN2ZycpKVxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIHByZXZpZXcgPSBuZXcgU3ZnUHJldmlld1ZpZXcoe1xuICAgICAgICAgIGVkaXRvcklkOiBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkuaWRcbiAgICAgICAgfSlcbiAgICAgICAgamFzbWluZS5hdHRhY2hUb0RPTShwcmV2aWV3LmVsZW1lbnQpXG4gICAgICAgIGV4cGVjdChwcmV2aWV3LmdldFBhdGgoKSkudG9CZShhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkuZ2V0UGF0aCgpKVxuICAgICAgICBuZXdQcmV2aWV3ID0gYXRvbS5kZXNlcmlhbGl6ZXJzLmRlc2VyaWFsaXplKHByZXZpZXcuc2VyaWFsaXplKCkpXG4gICAgICAgIGphc21pbmUuYXR0YWNoVG9ET00obmV3UHJldmlldy5lbGVtZW50KVxuICAgICAgICBleHBlY3QobmV3UHJldmlldy5nZXRQYXRoKCkpLnRvQmUocHJldmlldy5nZXRQYXRoKCkpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59KVxuIl19