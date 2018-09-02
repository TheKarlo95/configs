var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _temp = require('temp');

var _temp2 = _interopRequireDefault(_temp);

var _wrench = require('wrench');

var _wrench2 = _interopRequireDefault(_wrench);

var _libSvgPreviewView = require('../lib/svg-preview-view');

var _libSvgPreviewView2 = _interopRequireDefault(_libSvgPreviewView);

var _atom = require('atom');

'use babel';

var atom = global.atom;
var describe = global.describe;
var it = global.it;
var expect = global.expect;
var beforeEach = global.beforeEach;
var jasmine = global.jasmine;
var waitsFor = global.waitsFor;
var runs = global.runs;
var spyOn = global.spyOn;
var waitsForPromise = global.waitsForPromise;

describe('SVG preview package', function () {
  var preview = undefined,
      editor = undefined,
      workspaceElement = undefined;

  beforeEach(function () {
    var fixturesPath = _path2['default'].join(__dirname, 'fixtures');
    var tempPath = _temp2['default'].mkdirSync('atom');

    _wrench2['default'].copyDirSyncRecursive(fixturesPath, tempPath, { forceDelete: true });
    atom.project.setPaths([tempPath]);
    jasmine.useRealClock();

    workspaceElement = atom.views.getView(atom.workspace);
    jasmine.attachToDOM(workspaceElement);

    atom.deserializers.add(_libSvgPreviewView2['default']);

    waitsForPromise(function () {
      return atom.packages.activatePackage('svg-preview');
    });
  });

  var expectPreviewInSplitPane = function expectPreviewInSplitPane() {
    waitsFor('svg editor to be created', function () {
      editor = atom.workspace.getPanes()[0].getActiveItem();
      return editor;
    });

    waitsFor('svg preview to be created', function () {
      preview = atom.workspace.getPanes()[1].getActiveItem();
      return preview;
    });
    runs(function () {
      expect(editor).toBeInstanceOf(_atom.TextEditor);
      expect(preview).toBeInstanceOf(_libSvgPreviewView2['default']);
      expect(preview.getPath()).toBe(atom.workspace.getActivePaneItem().getPath());
    });
  };

  // TODO come up with a better solution
  var runsAfter = function runsAfter(time, fn) {
    return waitsForPromise(function () {
      return new Promise(function (resolve) {
        return setTimeout(resolve, time);
      }).then(fn);
    });
  };

  describe('when a preview has not been created for the file', function () {
    it('displays a svg preview in a split pane', function () {
      waitsForPromise(function () {
        return atom.workspace.open('subdir/file.svg');
      });
      runs(function () {
        return atom.commands.dispatch(workspaceElement, 'svg-preview:toggle');
      });

      expectPreviewInSplitPane();
      runs(function () {
        var _atom$workspace$getPanes = atom.workspace.getPanes();

        var _atom$workspace$getPanes2 = _slicedToArray(_atom$workspace$getPanes, 1);

        var editorPane = _atom$workspace$getPanes2[0];

        expect(editorPane.getItems()).toHaveLength(1);
        expect(editorPane.isActive()).toBe(true);
      });
    });

    describe("when the editor's path does not exist", function () {
      it('splits the current pane to the right with a svg preview for the file', function () {
        waitsForPromise(function () {
          return atom.workspace.open('new.svg');
        });
        runs(function () {
          return atom.commands.dispatch(workspaceElement, 'svg-preview:toggle');
        });
        expectPreviewInSplitPane();
      });
    });

    describe('when the editor does not have a path', function () {
      it('splits the current pane to the right with a svg preview for the file', function () {
        waitsForPromise(function () {
          return atom.workspace.open('');
        });
        runs(function () {
          return atom.commands.dispatch(workspaceElement, 'svg-preview:toggle');
        });
        expectPreviewInSplitPane();
      });
    });

    describe('when the path contains a space', function () {
      it('renders the preview', function () {
        waitsForPromise(function () {
          return atom.workspace.open('subdir/file with space.svg');
        });
        runs(function () {
          return atom.commands.dispatch(workspaceElement, 'svg-preview:toggle');
        });
        expectPreviewInSplitPane();
      });
    });

    describe('when the path contains accented characters', function () {
      it('renders the preview', function () {
        waitsForPromise(function () {
          return atom.workspace.open('subdir/áccéntéd.svg');
        });
        runs(function () {
          return atom.commands.dispatch(workspaceElement, 'svg-preview:toggle');
        });
        expectPreviewInSplitPane();
      });
    });
  });

  describe('when a preview has been created for the file', function (done) {
    beforeEach(function () {
      waitsForPromise(function () {
        return atom.workspace.open('subdir/file.svg');
      });
      runs(function () {
        return atom.commands.dispatch(workspaceElement, 'svg-preview:toggle');
      });
      expectPreviewInSplitPane();
    });

    it('closes the existing preview when toggle is triggered a second time on the editor', function () {
      atom.commands.dispatch(workspaceElement, 'svg-preview:toggle');

      // TODO come up with a better solution
      runsAfter(100, function () {
        var _atom$workspace$getCenter$getPanes = atom.workspace.getCenter().getPanes();

        var _atom$workspace$getCenter$getPanes2 = _slicedToArray(_atom$workspace$getCenter$getPanes, 2);

        var editorPane = _atom$workspace$getCenter$getPanes2[0];
        var previewPane = _atom$workspace$getCenter$getPanes2[1];

        expect(editorPane.isActive()).toBe(true);
        expect(previewPane.getActiveItem()).toBeUndefined();
      });
    });

    it('closes the existing preview when toggle is triggered on it and it has focus', function () {
      var _atom$workspace$getPanes3 = atom.workspace.getPanes();

      var _atom$workspace$getPanes32 = _slicedToArray(_atom$workspace$getPanes3, 2);

      var previewPane = _atom$workspace$getPanes32[1];

      previewPane.activate();
      atom.commands.dispatch(workspaceElement, 'svg-preview:toggle');

      runsAfter(100, function () {
        expect(previewPane.getActiveItem()).toBeUndefined();
      });
    });

    describe('when the editor is modified', function () {
      it('invokes ::onDidChangeSvg listeners', function () {
        var svgEditor = atom.workspace.getActiveTextEditor();
        var listener = jasmine.createSpy('didChangeSvgListener');

        preview.onDidChangeSvg(listener);

        runs(function () {
          return svgEditor.setText('<svg></svg>');
        });
        waitsFor('::onDidChangeSvg handler to be called', function () {
          return listener.callCount > 0;
        });
      });

      describe('when the preview is in the active pane but is not the active item', function () {
        it('re-renders the preview but does not make it active', function () {
          var svgEditor = atom.workspace.getActiveTextEditor();

          var _atom$workspace$getPanes4 = atom.workspace.getPanes();

          var _atom$workspace$getPanes42 = _slicedToArray(_atom$workspace$getPanes4, 2);

          var previewPane = _atom$workspace$getPanes42[1];

          var preview = previewPane.itemAtIndex(0);

          previewPane.activate();

          waitsForPromise(function () {
            return atom.workspace.open();
          });
          runs(function () {
            return svgEditor.setText('<svg></svg>');
          });

          waitsFor(function () {
            return preview.find('.image-canvas').html().match(/<svg[^>]*><\/svg>/);
          });
          runs(function () {
            expect(previewPane.isActive()).toBe(true);
            expect(previewPane.getActiveItem()).not.toBe(preview);
          });
        });
      });

      describe('when the preview is not the active item and not in the active pane', function () {
        it('re-renders the preview and makes it active', function () {
          var svgEditor = atom.workspace.getActiveTextEditor();

          var _atom$workspace$getPanes5 = atom.workspace.getPanes();

          var _atom$workspace$getPanes52 = _slicedToArray(_atom$workspace$getPanes5, 2);

          var editorPane = _atom$workspace$getPanes52[0];
          var previewPane = _atom$workspace$getPanes52[1];

          var preview = previewPane.itemAtIndex(0);

          previewPane.splitRight({ copyActiveItem: true });
          previewPane.activate();

          var didChange = false;
          preview.onDidChangeSvg(function () {
            didChange = true;
            return didChange;
          });

          waitsForPromise(function () {
            return atom.workspace.open();
          });
          runs(function () {
            editorPane.activate();
            return svgEditor.setText('<svg></svg>');
          });

          waitsFor(function () {
            return didChange;
          });
          runs(function () {
            expect(editorPane.isActive()).toBe(true);
            expect(previewPane.getActiveItem()).toBe(preview);
          });
        });
      });

      describe('when the liveUpdate config is set to false', function () {
        it('only re-renders the svg when the editor is saved, not when the contents are modified', function () {
          atom.config.set('svg-preview.liveUpdate', false);
          var didStopChangingHandler = jasmine.createSpy('didStopChangingHandler');

          atom.workspace.getActiveTextEditor().getBuffer().onDidStopChanging(didStopChangingHandler);
          atom.workspace.getActiveTextEditor().setText('<svg foo="bar"></svg>');

          waitsFor(function () {
            return didStopChangingHandler.callCount > 0;
          });
          runs(function () {
            expect(preview.find('.image-canvas').html()).not.toContain('<svg foo="bar"');
            atom.workspace.getActiveTextEditor().save();
          });

          waitsFor(function () {
            return preview.find('.image-canvas').html().match(/<svg foo="bar"[^>]*><\/svg>/);
          });
        });
      });
    });
  });

  describe('when the svg preview view is requested by file URI', function () {
    it('opens a preview editor and watches the file for changes', function () {
      waitsForPromise('atom.workspace.open promise to be resolved', function () {
        var filePath = atom.project.getDirectories()[0].resolve('subdir/file.svg');
        return atom.workspace.open('svg-preview://' + filePath);
      });
      runs(function () {
        preview = atom.workspace.getActivePaneItem();
        expect(preview).toBeInstanceOf(_libSvgPreviewView2['default']);
        spyOn(preview, 'renderSvgText');
        preview.file.emitter.emit('did-change');
      });

      waitsFor('svg to be re-rendered after file changed', function () {
        return preview.renderSvgText.callCount > 0;
      });
    });
  });

  describe("when the editor's grammar it not enabled for preview", function () {
    it('does not open the svg preview', function () {
      atom.config.set('svg-preview.grammars', []);

      waitsForPromise(function () {
        return atom.workspace.open('subdir/file.svg');
      });
      runs(function () {
        spyOn(atom.workspace, 'open').andCallThrough();
        atom.commands.dispatch(workspaceElement, 'svg-preview:toggle');
        expect(atom.workspace.open).not.toHaveBeenCalled();
      });
    });
  });

  describe("when the editor's path changes on #win32 and #darwin", function () {
    it("updates the preview's title", function () {
      var titleChangedCallback = jasmine.createSpy('titleChangedCallback');

      waitsForPromise(function () {
        return atom.workspace.open('subdir/file.svg');
      });
      runs(function () {
        return atom.commands.dispatch(workspaceElement, 'svg-preview:toggle');
      });

      expectPreviewInSplitPane();
      runs(function () {
        expect(preview.getTitle()).toBe('file.svg Preview');
        preview.onDidChangeTitle(titleChangedCallback);
        return _fsPlus2['default'].renameSync(atom.workspace.getActiveTextEditor().getPath(), _path2['default'].join(_path2['default'].dirname(atom.workspace.getActiveTextEditor().getPath()), 'file2.svg'));
      });

      waitsFor(function () {
        return preview.getTitle() === 'file2.svg Preview';
      });
      runs(function () {
        return expect(titleChangedCallback).toHaveBeenCalled();
      });
    });
  });

  describe('when the URI opened does not have a svg-preview protocol', function () {
    it('does not throw an error trying to decode the URI (regression)', function () {
      waitsForPromise(function () {
        return atom.workspace.open('%');
      });
      runs(function () {
        return expect(atom.workspace.getActiveTextEditor()).toBeTruthy();
      });
    });
  });

  describe('when svg-preview:export-to-png is triggered', function () {
    beforeEach(function () {
      var fixturesPath = undefined,
          tempPath = undefined,
          workspaceElement = undefined;
      fixturesPath = _path2['default'].join(__dirname, 'fixtures');
      tempPath = _temp2['default'].mkdirSync('atom');
      _wrench2['default'].copyDirSyncRecursive(fixturesPath, tempPath, {
        forceDelete: true
      });
      atom.project.setPaths([tempPath]);
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
    });

    it('saves a PNG and opens it', function () {
      var outputPath = _temp2['default'].path() + 'subdir/file with space.png';
      var previewPaneItem = null;

      waitsForPromise(function () {
        return atom.workspace.open('subdir/file with space.svg');
      });
      runs(function () {
        return atom.commands.dispatch(workspaceElement, 'svg-preview:toggle');
      });

      waitsFor(function () {
        previewPaneItem = atom.workspace.getPanes()[1].getActiveItem();
        return previewPaneItem;
      });
      runs(function () {
        spyOn(atom, 'showSaveDialogSync').andReturn(outputPath);
        atom.commands.dispatch(previewPaneItem.element, 'svg-preview:export-to-png');
      });

      waitsFor(function () {
        return _fsPlus2['default'].existsSync(outputPath);
      });
      runs(function () {
        expect(_fsPlus2['default'].isFileSync(outputPath)).toBe(true);

        var writtenFile = _fsPlus2['default'].readFileSync(outputPath);
        expect(writtenFile).toContain('PNG');
      });
    });

    it('saves a JPEG and opens it', function () {
      var outputPath = _temp2['default'].path() + 'subdir/file with space.jpeg';
      var previewPaneItem = null;

      waitsForPromise(function () {
        return atom.workspace.open('subdir/file with space.svg');
      });
      runs(function () {
        return atom.commands.dispatch(workspaceElement, 'svg-preview:toggle');
      });

      waitsFor(function () {
        previewPaneItem = atom.workspace.getPanes()[1].getActiveItem();
        return previewPaneItem;
      });
      runs(function () {
        spyOn(atom, 'showSaveDialogSync').andReturn(outputPath);
        atom.commands.dispatch(previewPaneItem.element, 'svg-preview:export-to-jpeg');
      });

      waitsFor(function () {
        return _fsPlus2['default'].existsSync(outputPath);
      });
      runs(function () {
        var writtenFile = undefined;
        expect(_fsPlus2['default'].isFileSync(outputPath)).toBe(true);
        writtenFile = _fsPlus2['default'].readFileSync(outputPath);
        expect(writtenFile).toContain('JFIF');
      });
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvc3ZnLXByZXZpZXcvc3BlYy9zdmctcHJldmlldy1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7b0JBRWlCLE1BQU07Ozs7c0JBQ1IsU0FBUzs7OztvQkFDUCxNQUFNOzs7O3NCQUNKLFFBQVE7Ozs7aUNBQ0EseUJBQXlCOzs7O29CQUN6QixNQUFNOztBQVBqQyxXQUFXLENBQUE7O0lBU0gsSUFBSSxHQUF3RixNQUFNLENBQWxHLElBQUk7SUFBRSxRQUFRLEdBQThFLE1BQU0sQ0FBNUYsUUFBUTtJQUFFLEVBQUUsR0FBMEUsTUFBTSxDQUFsRixFQUFFO0lBQUUsTUFBTSxHQUFrRSxNQUFNLENBQTlFLE1BQU07SUFBRSxVQUFVLEdBQXNELE1BQU0sQ0FBdEUsVUFBVTtJQUFFLE9BQU8sR0FBNkMsTUFBTSxDQUExRCxPQUFPO0lBQUUsUUFBUSxHQUFtQyxNQUFNLENBQWpELFFBQVE7SUFBRSxJQUFJLEdBQTZCLE1BQU0sQ0FBdkMsSUFBSTtJQUFFLEtBQUssR0FBc0IsTUFBTSxDQUFqQyxLQUFLO0lBQUUsZUFBZSxHQUFLLE1BQU0sQ0FBMUIsZUFBZTs7QUFFL0YsUUFBUSxDQUFDLHFCQUFxQixFQUFFLFlBQU07QUFDcEMsTUFBSSxPQUFPLFlBQUE7TUFBRSxNQUFNLFlBQUE7TUFBRSxnQkFBZ0IsWUFBQSxDQUFBOztBQUVyQyxZQUFVLENBQUMsWUFBTTtBQUNmLFFBQU0sWUFBWSxHQUFHLGtCQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUE7QUFDckQsUUFBTSxRQUFRLEdBQUcsa0JBQUssU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFBOztBQUV2Qyx3QkFBTyxvQkFBb0IsQ0FBQyxZQUFZLEVBQUUsUUFBUSxFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7QUFDMUUsUUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENB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QUFHLFVBQVUsQ0FBQyxVQUFVLENBQUM7T0FBQSxDQUFDLENBQUE7QUFDekMsVUFBSSxDQUFDLFlBQU07QUFDVCxZQUFJLFdBQVcsWUFBQSxDQUFBO0FBQ2YsY0FBTSxDQUFDLG9CQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUM1QyxtQkFBVyxHQUFHLG9CQUFHLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUN6QyxjQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFBO09BQ3RDLENBQUMsQ0FBQTtLQUNILENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTtDQUNILENBQUMsQ0FBQSIsImZpbGUiOiIvaG9tZS90aGVrYXJsbzk1Ly5hdG9tL3BhY2thZ2VzL3N2Zy1wcmV2aWV3L3NwZWMvc3ZnLXByZXZpZXctc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgZnMgZnJvbSAnZnMtcGx1cydcbmltcG9ydCB0ZW1wIGZyb20gJ3RlbXAnXG5pbXBvcnQgd3JlbmNoIGZyb20gJ3dyZW5jaCdcbmltcG9ydCBTdmdQcmV2aWV3VmlldyBmcm9tICcuLi9saWIvc3ZnLXByZXZpZXctdmlldydcbmltcG9ydCB7IFRleHRFZGl0b3IgfSBmcm9tICdhdG9tJ1xuXG5jb25zdCB7IGF0b20sIGRlc2NyaWJlLCBpdCwgZXhwZWN0LCBiZWZvcmVFYWNoLCBqYXNtaW5lLCB3YWl0c0ZvciwgcnVucywgc3B5T24sIHdhaXRzRm9yUHJvbWlzZSB9ID0gZ2xvYmFsXG5cbmRlc2NyaWJlKCdTVkcgcHJldmlldyBwYWNrYWdlJywgKCkgPT4ge1xuICBsZXQgcHJldmlldywgZWRpdG9yLCB3b3Jrc3BhY2VFbGVtZW50XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgY29uc3QgZml4dHVyZXNQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJylcbiAgICBjb25zdCB0ZW1wUGF0aCA9IHRlbXAubWtkaXJTeW5jKCdhdG9tJylcblxuICAgIHdyZW5jaC5jb3B5RGlyU3luY1JlY3Vyc2l2ZShmaXh0dXJlc1BhdGgsIHRlbXBQYXRoLCB7IGZvcmNlRGVsZXRlOiB0cnVlIH0pXG4gICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzKFt0ZW1wUGF0aF0pXG4gICAgamFzbWluZS51c2VSZWFsQ2xvY2soKVxuXG4gICAgd29ya3NwYWNlRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSlcbiAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHdvcmtzcGFjZUVsZW1lbnQpXG5cbiAgICBhdG9tLmRlc2VyaWFsaXplcnMuYWRkKFN2Z1ByZXZpZXdWaWV3KVxuXG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgIHJldHVybiBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnc3ZnLXByZXZpZXcnKVxuICAgIH0pXG4gIH0pXG5cbiAgY29uc3QgZXhwZWN0UHJldmlld0luU3BsaXRQYW5lID0gZnVuY3Rpb24gKCkge1xuICAgIHdhaXRzRm9yKCdzdmcgZWRpdG9yIHRvIGJlIGNyZWF0ZWQnLCAoKSA9PiB7XG4gICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRQYW5lcygpWzBdLmdldEFjdGl2ZUl0ZW0oKVxuICAgICAgcmV0dXJuIGVkaXRvclxuICAgIH0pXG5cbiAgICB3YWl0c0Zvcignc3ZnIHByZXZpZXcgdG8gYmUgY3JlYXRlZCcsICgpID0+IHtcbiAgICAgIHByZXZpZXcgPSBhdG9tLndvcmtzcGFjZS5nZXRQYW5lcygpWzFdLmdldEFjdGl2ZUl0ZW0oKVxuICAgICAgcmV0dXJuIHByZXZpZXdcbiAgICB9KVxuICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgZXhwZWN0KGVkaXRvcikudG9CZUluc3RhbmNlT2YoVGV4dEVkaXRvcilcbiAgICAgIGV4cGVjdChwcmV2aWV3KS50b0JlSW5zdGFuY2VPZihTdmdQcmV2aWV3VmlldylcbiAgICAgIGV4cGVjdChwcmV2aWV3LmdldFBhdGgoKSkudG9CZShhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpLmdldFBhdGgoKSlcbiAgICB9KVxuICB9XG5cbiAgLy8gVE9ETyBjb21lIHVwIHdpdGggYSBiZXR0ZXIgc29sdXRpb25cbiAgY29uc3QgcnVuc0FmdGVyID0gKHRpbWUsIGZuKSA9PiB3YWl0c0ZvclByb21pc2UoKCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGltZSkpLnRoZW4oZm4pKVxuXG4gIGRlc2NyaWJlKCd3aGVuIGEgcHJldmlldyBoYXMgbm90IGJlZW4gY3JlYXRlZCBmb3IgdGhlIGZpbGUnLCAoKSA9PiB7XG4gICAgaXQoJ2Rpc3BsYXlzIGEgc3ZnIHByZXZpZXcgaW4gYSBzcGxpdCBwYW5lJywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IGF0b20ud29ya3NwYWNlLm9wZW4oJ3N1YmRpci9maWxlLnN2ZycpKVxuICAgICAgcnVucygoKSA9PiBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdzdmctcHJldmlldzp0b2dnbGUnKSlcblxuICAgICAgZXhwZWN0UHJldmlld0luU3BsaXRQYW5lKClcbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBjb25zdCBbIGVkaXRvclBhbmUgXSA9IGF0b20ud29ya3NwYWNlLmdldFBhbmVzKClcblxuICAgICAgICBleHBlY3QoZWRpdG9yUGFuZS5nZXRJdGVtcygpKS50b0hhdmVMZW5ndGgoMSlcbiAgICAgICAgZXhwZWN0KGVkaXRvclBhbmUuaXNBY3RpdmUoKSkudG9CZSh0cnVlKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoXCJ3aGVuIHRoZSBlZGl0b3IncyBwYXRoIGRvZXMgbm90IGV4aXN0XCIsICgpID0+IHtcbiAgICAgIGl0KCdzcGxpdHMgdGhlIGN1cnJlbnQgcGFuZSB0byB0aGUgcmlnaHQgd2l0aCBhIHN2ZyBwcmV2aWV3IGZvciB0aGUgZmlsZScsICgpID0+IHtcbiAgICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IGF0b20ud29ya3NwYWNlLm9wZW4oJ25ldy5zdmcnKSlcbiAgICAgICAgcnVucygoKSA9PiBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdzdmctcHJldmlldzp0b2dnbGUnKSlcbiAgICAgICAgZXhwZWN0UHJldmlld0luU3BsaXRQYW5lKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCd3aGVuIHRoZSBlZGl0b3IgZG9lcyBub3QgaGF2ZSBhIHBhdGgnLCAoKSA9PiB7XG4gICAgICBpdCgnc3BsaXRzIHRoZSBjdXJyZW50IHBhbmUgdG8gdGhlIHJpZ2h0IHdpdGggYSBzdmcgcHJldmlldyBmb3IgdGhlIGZpbGUnLCAoKSA9PiB7XG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiBhdG9tLndvcmtzcGFjZS5vcGVuKCcnKSlcbiAgICAgICAgcnVucygoKSA9PiBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdzdmctcHJldmlldzp0b2dnbGUnKSlcbiAgICAgICAgZXhwZWN0UHJldmlld0luU3BsaXRQYW5lKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCd3aGVuIHRoZSBwYXRoIGNvbnRhaW5zIGEgc3BhY2UnLCAoKSA9PiB7XG4gICAgICBpdCgncmVuZGVycyB0aGUgcHJldmlldycsICgpID0+IHtcbiAgICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IGF0b20ud29ya3NwYWNlLm9wZW4oJ3N1YmRpci9maWxlIHdpdGggc3BhY2Uuc3ZnJykpXG4gICAgICAgIHJ1bnMoKCkgPT4gYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnc3ZnLXByZXZpZXc6dG9nZ2xlJykpXG4gICAgICAgIGV4cGVjdFByZXZpZXdJblNwbGl0UGFuZSgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnd2hlbiB0aGUgcGF0aCBjb250YWlucyBhY2NlbnRlZCBjaGFyYWN0ZXJzJywgKCkgPT4ge1xuICAgICAgaXQoJ3JlbmRlcnMgdGhlIHByZXZpZXcnLCAoKSA9PiB7XG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiBhdG9tLndvcmtzcGFjZS5vcGVuKCdzdWJkaXIvw6FjY8OpbnTDqWQuc3ZnJykpXG4gICAgICAgIHJ1bnMoKCkgPT4gYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnc3ZnLXByZXZpZXc6dG9nZ2xlJykpXG4gICAgICAgIGV4cGVjdFByZXZpZXdJblNwbGl0UGFuZSgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3doZW4gYSBwcmV2aWV3IGhhcyBiZWVuIGNyZWF0ZWQgZm9yIHRoZSBmaWxlJywgKGRvbmUpID0+IHtcbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiBhdG9tLndvcmtzcGFjZS5vcGVuKCdzdWJkaXIvZmlsZS5zdmcnKSlcbiAgICAgIHJ1bnMoKCkgPT4gYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnc3ZnLXByZXZpZXc6dG9nZ2xlJykpXG4gICAgICBleHBlY3RQcmV2aWV3SW5TcGxpdFBhbmUoKVxuICAgIH0pXG5cbiAgICBpdCgnY2xvc2VzIHRoZSBleGlzdGluZyBwcmV2aWV3IHdoZW4gdG9nZ2xlIGlzIHRyaWdnZXJlZCBhIHNlY29uZCB0aW1lIG9uIHRoZSBlZGl0b3InLCAoKSA9PiB7XG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdzdmctcHJldmlldzp0b2dnbGUnKVxuXG4gICAgICAvLyBUT0RPIGNvbWUgdXAgd2l0aCBhIGJldHRlciBzb2x1dGlvblxuICAgICAgcnVuc0FmdGVyKDEwMCwgKCkgPT4ge1xuICAgICAgICBjb25zdCBbIGVkaXRvclBhbmUsIHByZXZpZXdQYW5lIF0gPSBhdG9tLndvcmtzcGFjZS5nZXRDZW50ZXIoKS5nZXRQYW5lcygpXG5cbiAgICAgICAgZXhwZWN0KGVkaXRvclBhbmUuaXNBY3RpdmUoKSkudG9CZSh0cnVlKVxuICAgICAgICBleHBlY3QocHJldmlld1BhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlVW5kZWZpbmVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdjbG9zZXMgdGhlIGV4aXN0aW5nIHByZXZpZXcgd2hlbiB0b2dnbGUgaXMgdHJpZ2dlcmVkIG9uIGl0IGFuZCBpdCBoYXMgZm9jdXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBbICwgcHJldmlld1BhbmUgXSA9IGF0b20ud29ya3NwYWNlLmdldFBhbmVzKClcbiAgICAgIHByZXZpZXdQYW5lLmFjdGl2YXRlKClcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ3N2Zy1wcmV2aWV3OnRvZ2dsZScpXG5cbiAgICAgIHJ1bnNBZnRlcigxMDAsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KHByZXZpZXdQYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZVVuZGVmaW5lZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnd2hlbiB0aGUgZWRpdG9yIGlzIG1vZGlmaWVkJywgKCkgPT4ge1xuICAgICAgaXQoJ2ludm9rZXMgOjpvbkRpZENoYW5nZVN2ZyBsaXN0ZW5lcnMnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN2Z0VkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICBjb25zdCBsaXN0ZW5lciA9IGphc21pbmUuY3JlYXRlU3B5KCdkaWRDaGFuZ2VTdmdMaXN0ZW5lcicpXG5cbiAgICAgICAgcHJldmlldy5vbkRpZENoYW5nZVN2ZyhsaXN0ZW5lcilcblxuICAgICAgICBydW5zKCgpID0+IHN2Z0VkaXRvci5zZXRUZXh0KCc8c3ZnPjwvc3ZnPicpKVxuICAgICAgICB3YWl0c0ZvcignOjpvbkRpZENoYW5nZVN2ZyBoYW5kbGVyIHRvIGJlIGNhbGxlZCcsICgpID0+IHtcbiAgICAgICAgICByZXR1cm4gbGlzdGVuZXIuY2FsbENvdW50ID4gMFxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgZGVzY3JpYmUoJ3doZW4gdGhlIHByZXZpZXcgaXMgaW4gdGhlIGFjdGl2ZSBwYW5lIGJ1dCBpcyBub3QgdGhlIGFjdGl2ZSBpdGVtJywgKCkgPT4ge1xuICAgICAgICBpdCgncmUtcmVuZGVycyB0aGUgcHJldmlldyBidXQgZG9lcyBub3QgbWFrZSBpdCBhY3RpdmUnLCAoKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3ZnRWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgICAgY29uc3QgWyAsIHByZXZpZXdQYW5lIF0gPSBhdG9tLndvcmtzcGFjZS5nZXRQYW5lcygpXG4gICAgICAgICAgY29uc3QgcHJldmlldyA9IHByZXZpZXdQYW5lLml0ZW1BdEluZGV4KDApXG5cbiAgICAgICAgICBwcmV2aWV3UGFuZS5hY3RpdmF0ZSgpXG5cbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4gYXRvbS53b3Jrc3BhY2Uub3BlbigpKVxuICAgICAgICAgIHJ1bnMoKCkgPT4gc3ZnRWRpdG9yLnNldFRleHQoJzxzdmc+PC9zdmc+JykpXG5cbiAgICAgICAgICB3YWl0c0ZvcigoKSA9PiBwcmV2aWV3LmZpbmQoJy5pbWFnZS1jYW52YXMnKS5odG1sKCkubWF0Y2goLzxzdmdbXj5dKj48XFwvc3ZnPi8pKVxuICAgICAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICAgICAgZXhwZWN0KHByZXZpZXdQYW5lLmlzQWN0aXZlKCkpLnRvQmUodHJ1ZSlcbiAgICAgICAgICAgIGV4cGVjdChwcmV2aWV3UGFuZS5nZXRBY3RpdmVJdGVtKCkpLm5vdC50b0JlKHByZXZpZXcpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGRlc2NyaWJlKCd3aGVuIHRoZSBwcmV2aWV3IGlzIG5vdCB0aGUgYWN0aXZlIGl0ZW0gYW5kIG5vdCBpbiB0aGUgYWN0aXZlIHBhbmUnLCAoKSA9PiB7XG4gICAgICAgIGl0KCdyZS1yZW5kZXJzIHRoZSBwcmV2aWV3IGFuZCBtYWtlcyBpdCBhY3RpdmUnLCAoKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3ZnRWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgICAgY29uc3QgWyBlZGl0b3JQYW5lLCBwcmV2aWV3UGFuZSBdID0gYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZXMoKVxuICAgICAgICAgIGNvbnN0IHByZXZpZXcgPSBwcmV2aWV3UGFuZS5pdGVtQXRJbmRleCgwKVxuXG4gICAgICAgICAgcHJldmlld1BhbmUuc3BsaXRSaWdodCh7IGNvcHlBY3RpdmVJdGVtOiB0cnVlIH0pXG4gICAgICAgICAgcHJldmlld1BhbmUuYWN0aXZhdGUoKVxuXG4gICAgICAgICAgbGV0IGRpZENoYW5nZSA9IGZhbHNlXG4gICAgICAgICAgcHJldmlldy5vbkRpZENoYW5nZVN2ZygoKSA9PiB7XG4gICAgICAgICAgICBkaWRDaGFuZ2UgPSB0cnVlXG4gICAgICAgICAgICByZXR1cm4gZGlkQ2hhbmdlXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiBhdG9tLndvcmtzcGFjZS5vcGVuKCkpXG4gICAgICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgICAgICBlZGl0b3JQYW5lLmFjdGl2YXRlKClcbiAgICAgICAgICAgIHJldHVybiBzdmdFZGl0b3Iuc2V0VGV4dCgnPHN2Zz48L3N2Zz4nKVxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICB3YWl0c0ZvcigoKSA9PiBkaWRDaGFuZ2UpXG4gICAgICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgICAgICBleHBlY3QoZWRpdG9yUGFuZS5pc0FjdGl2ZSgpKS50b0JlKHRydWUpXG4gICAgICAgICAgICBleHBlY3QocHJldmlld1BhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlKHByZXZpZXcpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGRlc2NyaWJlKCd3aGVuIHRoZSBsaXZlVXBkYXRlIGNvbmZpZyBpcyBzZXQgdG8gZmFsc2UnLCAoKSA9PiB7XG4gICAgICAgIGl0KCdvbmx5IHJlLXJlbmRlcnMgdGhlIHN2ZyB3aGVuIHRoZSBlZGl0b3IgaXMgc2F2ZWQsIG5vdCB3aGVuIHRoZSBjb250ZW50cyBhcmUgbW9kaWZpZWQnLCAoKSA9PiB7XG4gICAgICAgICAgYXRvbS5jb25maWcuc2V0KCdzdmctcHJldmlldy5saXZlVXBkYXRlJywgZmFsc2UpXG4gICAgICAgICAgY29uc3QgZGlkU3RvcENoYW5naW5nSGFuZGxlciA9IGphc21pbmUuY3JlYXRlU3B5KCdkaWRTdG9wQ2hhbmdpbmdIYW5kbGVyJylcblxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5nZXRCdWZmZXIoKS5vbkRpZFN0b3BDaGFuZ2luZyhkaWRTdG9wQ2hhbmdpbmdIYW5kbGVyKVxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5zZXRUZXh0KCc8c3ZnIGZvbz1cImJhclwiPjwvc3ZnPicpXG5cbiAgICAgICAgICB3YWl0c0ZvcigoKSA9PiBkaWRTdG9wQ2hhbmdpbmdIYW5kbGVyLmNhbGxDb3VudCA+IDApXG4gICAgICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgICAgICBleHBlY3QocHJldmlldy5maW5kKCcuaW1hZ2UtY2FudmFzJykuaHRtbCgpKS5ub3QudG9Db250YWluKCc8c3ZnIGZvbz1cImJhclwiJylcbiAgICAgICAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5zYXZlKClcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgd2FpdHNGb3IoKCkgPT4gcHJldmlldy5maW5kKCcuaW1hZ2UtY2FudmFzJykuaHRtbCgpLm1hdGNoKC88c3ZnIGZvbz1cImJhclwiW14+XSo+PFxcL3N2Zz4vKSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnd2hlbiB0aGUgc3ZnIHByZXZpZXcgdmlldyBpcyByZXF1ZXN0ZWQgYnkgZmlsZSBVUkknLCAoKSA9PiB7XG4gICAgaXQoJ29wZW5zIGEgcHJldmlldyBlZGl0b3IgYW5kIHdhdGNoZXMgdGhlIGZpbGUgZm9yIGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoJ2F0b20ud29ya3NwYWNlLm9wZW4gcHJvbWlzZSB0byBiZSByZXNvbHZlZCcsICgpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSBhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKVswXS5yZXNvbHZlKCdzdWJkaXIvZmlsZS5zdmcnKVxuICAgICAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3Blbignc3ZnLXByZXZpZXc6Ly8nICsgZmlsZVBhdGgpXG4gICAgICB9KVxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIHByZXZpZXcgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpXG4gICAgICAgIGV4cGVjdChwcmV2aWV3KS50b0JlSW5zdGFuY2VPZihTdmdQcmV2aWV3VmlldylcbiAgICAgICAgc3B5T24ocHJldmlldywgJ3JlbmRlclN2Z1RleHQnKVxuICAgICAgICBwcmV2aWV3LmZpbGUuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlJylcbiAgICAgIH0pXG5cbiAgICAgIHdhaXRzRm9yKCdzdmcgdG8gYmUgcmUtcmVuZGVyZWQgYWZ0ZXIgZmlsZSBjaGFuZ2VkJywgKCkgPT4ge1xuICAgICAgICByZXR1cm4gcHJldmlldy5yZW5kZXJTdmdUZXh0LmNhbGxDb3VudCA+IDBcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZShcIndoZW4gdGhlIGVkaXRvcidzIGdyYW1tYXIgaXQgbm90IGVuYWJsZWQgZm9yIHByZXZpZXdcIiwgKCkgPT4ge1xuICAgIGl0KCdkb2VzIG5vdCBvcGVuIHRoZSBzdmcgcHJldmlldycsICgpID0+IHtcbiAgICAgIGF0b20uY29uZmlnLnNldCgnc3ZnLXByZXZpZXcuZ3JhbW1hcnMnLCBbXSlcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IGF0b20ud29ya3NwYWNlLm9wZW4oJ3N1YmRpci9maWxlLnN2ZycpKVxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIHNweU9uKGF0b20ud29ya3NwYWNlLCAnb3BlbicpLmFuZENhbGxUaHJvdWdoKClcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnc3ZnLXByZXZpZXc6dG9nZ2xlJylcbiAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLm9wZW4pLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZShcIndoZW4gdGhlIGVkaXRvcidzIHBhdGggY2hhbmdlcyBvbiAjd2luMzIgYW5kICNkYXJ3aW5cIiwgKCkgPT4ge1xuICAgIGl0KFwidXBkYXRlcyB0aGUgcHJldmlldydzIHRpdGxlXCIsICgpID0+IHtcbiAgICAgIGNvbnN0IHRpdGxlQ2hhbmdlZENhbGxiYWNrID0gamFzbWluZS5jcmVhdGVTcHkoJ3RpdGxlQ2hhbmdlZENhbGxiYWNrJylcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IGF0b20ud29ya3NwYWNlLm9wZW4oJ3N1YmRpci9maWxlLnN2ZycpKVxuICAgICAgcnVucygoKSA9PiBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdzdmctcHJldmlldzp0b2dnbGUnKSlcblxuICAgICAgZXhwZWN0UHJldmlld0luU3BsaXRQYW5lKClcbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBleHBlY3QocHJldmlldy5nZXRUaXRsZSgpKS50b0JlKCdmaWxlLnN2ZyBQcmV2aWV3JylcbiAgICAgICAgcHJldmlldy5vbkRpZENoYW5nZVRpdGxlKHRpdGxlQ2hhbmdlZENhbGxiYWNrKVxuICAgICAgICByZXR1cm4gZnMucmVuYW1lU3luYyhhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkuZ2V0UGF0aCgpLCBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5nZXRQYXRoKCkpLCAnZmlsZTIuc3ZnJykpXG4gICAgICB9KVxuXG4gICAgICB3YWl0c0ZvcigoKSA9PiBwcmV2aWV3LmdldFRpdGxlKCkgPT09ICdmaWxlMi5zdmcgUHJldmlldycpXG4gICAgICBydW5zKCgpID0+IGV4cGVjdCh0aXRsZUNoYW5nZWRDYWxsYmFjaykudG9IYXZlQmVlbkNhbGxlZCgpKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3doZW4gdGhlIFVSSSBvcGVuZWQgZG9lcyBub3QgaGF2ZSBhIHN2Zy1wcmV2aWV3IHByb3RvY29sJywgKCkgPT4ge1xuICAgIGl0KCdkb2VzIG5vdCB0aHJvdyBhbiBlcnJvciB0cnlpbmcgdG8gZGVjb2RlIHRoZSBVUkkgKHJlZ3Jlc3Npb24pJywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IGF0b20ud29ya3NwYWNlLm9wZW4oJyUnKSlcbiAgICAgIHJ1bnMoKCkgPT4gZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKSkudG9CZVRydXRoeSgpKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3doZW4gc3ZnLXByZXZpZXc6ZXhwb3J0LXRvLXBuZyBpcyB0cmlnZ2VyZWQnLCAoKSA9PiB7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBsZXQgZml4dHVyZXNQYXRoLCB0ZW1wUGF0aCwgd29ya3NwYWNlRWxlbWVudFxuICAgICAgZml4dHVyZXNQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJylcbiAgICAgIHRlbXBQYXRoID0gdGVtcC5ta2RpclN5bmMoJ2F0b20nKVxuICAgICAgd3JlbmNoLmNvcHlEaXJTeW5jUmVjdXJzaXZlKGZpeHR1cmVzUGF0aCwgdGVtcFBhdGgsIHtcbiAgICAgICAgZm9yY2VEZWxldGU6IHRydWVcbiAgICAgIH0pXG4gICAgICBhdG9tLnByb2plY3Quc2V0UGF0aHMoW3RlbXBQYXRoXSlcbiAgICAgIHdvcmtzcGFjZUVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpXG4gICAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHdvcmtzcGFjZUVsZW1lbnQpXG4gICAgfSlcblxuICAgIGl0KCdzYXZlcyBhIFBORyBhbmQgb3BlbnMgaXQnLCAoKSA9PiB7XG4gICAgICBsZXQgb3V0cHV0UGF0aCA9IGAke3RlbXAucGF0aCgpfXN1YmRpci9maWxlIHdpdGggc3BhY2UucG5nYFxuICAgICAgbGV0IHByZXZpZXdQYW5lSXRlbSA9IG51bGxcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IGF0b20ud29ya3NwYWNlLm9wZW4oJ3N1YmRpci9maWxlIHdpdGggc3BhY2Uuc3ZnJykpXG4gICAgICBydW5zKCgpID0+IGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ3N2Zy1wcmV2aWV3OnRvZ2dsZScpKVxuXG4gICAgICB3YWl0c0ZvcigoKSA9PiB7XG4gICAgICAgIHByZXZpZXdQYW5lSXRlbSA9IGF0b20ud29ya3NwYWNlLmdldFBhbmVzKClbMV0uZ2V0QWN0aXZlSXRlbSgpXG4gICAgICAgIHJldHVybiBwcmV2aWV3UGFuZUl0ZW1cbiAgICAgIH0pXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgc3B5T24oYXRvbSwgJ3Nob3dTYXZlRGlhbG9nU3luYycpLmFuZFJldHVybihvdXRwdXRQYXRoKVxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHByZXZpZXdQYW5lSXRlbS5lbGVtZW50LCAnc3ZnLXByZXZpZXc6ZXhwb3J0LXRvLXBuZycpXG4gICAgICB9KVxuXG4gICAgICB3YWl0c0ZvcigoKSA9PiBmcy5leGlzdHNTeW5jKG91dHB1dFBhdGgpKVxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIGV4cGVjdChmcy5pc0ZpbGVTeW5jKG91dHB1dFBhdGgpKS50b0JlKHRydWUpXG5cbiAgICAgICAgbGV0IHdyaXR0ZW5GaWxlID0gZnMucmVhZEZpbGVTeW5jKG91dHB1dFBhdGgpXG4gICAgICAgIGV4cGVjdCh3cml0dGVuRmlsZSkudG9Db250YWluKCdQTkcnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3NhdmVzIGEgSlBFRyBhbmQgb3BlbnMgaXQnLCAoKSA9PiB7XG4gICAgICBsZXQgb3V0cHV0UGF0aCA9IGAke3RlbXAucGF0aCgpfXN1YmRpci9maWxlIHdpdGggc3BhY2UuanBlZ2BcbiAgICAgIGxldCBwcmV2aWV3UGFuZUl0ZW0gPSBudWxsXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiBhdG9tLndvcmtzcGFjZS5vcGVuKCdzdWJkaXIvZmlsZSB3aXRoIHNwYWNlLnN2ZycpKVxuICAgICAgcnVucygoKSA9PiBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdzdmctcHJldmlldzp0b2dnbGUnKSlcblxuICAgICAgd2FpdHNGb3IoKCkgPT4ge1xuICAgICAgICBwcmV2aWV3UGFuZUl0ZW0gPSBhdG9tLndvcmtzcGFjZS5nZXRQYW5lcygpWzFdLmdldEFjdGl2ZUl0ZW0oKVxuICAgICAgICByZXR1cm4gcHJldmlld1BhbmVJdGVtXG4gICAgICB9KVxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIHNweU9uKGF0b20sICdzaG93U2F2ZURpYWxvZ1N5bmMnKS5hbmRSZXR1cm4ob3V0cHV0UGF0aClcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChwcmV2aWV3UGFuZUl0ZW0uZWxlbWVudCwgJ3N2Zy1wcmV2aWV3OmV4cG9ydC10by1qcGVnJylcbiAgICAgIH0pXG5cbiAgICAgIHdhaXRzRm9yKCgpID0+IGZzLmV4aXN0c1N5bmMob3V0cHV0UGF0aCkpXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgbGV0IHdyaXR0ZW5GaWxlXG4gICAgICAgIGV4cGVjdChmcy5pc0ZpbGVTeW5jKG91dHB1dFBhdGgpKS50b0JlKHRydWUpXG4gICAgICAgIHdyaXR0ZW5GaWxlID0gZnMucmVhZEZpbGVTeW5jKG91dHB1dFBhdGgpXG4gICAgICAgIGV4cGVjdCh3cml0dGVuRmlsZSkudG9Db250YWluKCdKRklGJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=