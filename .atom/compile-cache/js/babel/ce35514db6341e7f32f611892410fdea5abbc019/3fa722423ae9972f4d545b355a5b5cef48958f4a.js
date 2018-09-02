var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atom = require('atom');

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

'use babel';

var atom = global.atom;

var SvgPreviewView = null;

function importSvgPreviewView() {
  if (SvgPreviewView == null) {
    SvgPreviewView = require('./svg-preview-view');
  }
}

function createSvgPreviewView(state) {
  importSvgPreviewView();
  return new SvgPreviewView(state);
}

function isSvgPreviewView(object) {
  importSvgPreviewView();
  return object instanceof SvgPreviewView;
}

function configGet(key) {
  return atom.config.get('svg-preview.' + key);
}

function configSet(key, value) {
  return atom.config.set('svg-preview.' + key, value);
}

module.exports = {

  config: require('./config'),

  deserializeSvgPreviewView: function deserializeSvgPreviewView(state) {
    if (state.constructor === Object) {
      return createSvgPreviewView(state);
    }
  },

  activate: function activate() {
    var _this = this;

    this.disposables = new _atom.CompositeDisposable();

    // Deprecated config
    if (configGet('openPreviewInSplitPane') === false) {
      configSet('openPreviewInPane', '');
      configSet('openPreviewInSplitPane', undefined);
    }

    this.disposables.add(atom.commands.add('atom-workspace', {
      'svg-preview:toggle': function svgPreviewToggle() {
        return _this.toggle();
      }
    }));

    this.disposables.add(atom.workspace.addOpener(function (uriToOpen) {
      return _this.onOpenUri(uriToOpen);
    }));

    this.disposables.add(atom.workspace.onDidChangeActivePaneItem(function (item) {
      _this.onDidChangeActivePaneItem(item);
    }));

    this.disposables.add(atom.workspace.onWillDestroyPaneItem(function (event) {
      _this.onWillDestroyPaneItem(event.item);
    }));
  },

  deactivate: function deactivate() {
    var _this2 = this;

    atom.workspace.getPaneItems().filter(function (item) {
      return isSvgPreviewView(item);
    }).forEach(function (item) {
      return _this2.removePreview(item);
    });

    this.disposables.dispose();
  },

  onWillDestroyPaneItem: function onWillDestroyPaneItem(item) {
    if (!(configGet('closePreviewAutomatically') && configGet('openPreviewInPane'))) {
      return;
    }
    return this.removePreviewForEditor(item);
  },

  onDidChangeActivePaneItem: function onDidChangeActivePaneItem(item) {
    if (!(configGet('openPreviewAutomatically') && configGet('openPreviewInPane') && this.isSvgEditor(item))) {
      return;
    }
    return this.addPreviewForEditor(item);
  },

  onOpenUri: function onOpenUri(uriToOpen) {
    var protocol = undefined,
        host = undefined,
        filePath = undefined;

    try {
      var urlObjs = _url2['default'].parse(uriToOpen);

      protocol = urlObjs.protocol;
      host = urlObjs.host;
      filePath = urlObjs.pathname;

      if (protocol !== 'svg-preview:') {
        return;
      }
      if (filePath) {
        filePath = decodeURI(filePath);
      }
    } catch (error) {
      return;
    }

    if (host === 'editor') {
      return createSvgPreviewView({ editorId: filePath.substring(1) });
    }

    return createSvgPreviewView({ filePath: filePath });
  },

  isSvgEditor: function isSvgEditor(item) {
    try {
      var grammars = ['text.xml.svg'].concat(configGet('grammars') || []);
      var grammar = item.getGrammar().scopeName;

      return item.getBuffer && item.getText && grammars.indexOf(grammar) >= 0 && item.getText().match(/<svg/);
    } catch (error) {
      return false;
    }
  },

  toggle: function toggle() {
    if (isSvgPreviewView(atom.workspace.getActivePaneItem())) {
      atom.workspace.destroyActivePaneItem();
      return;
    }

    var editor = atom.workspace.getActiveTextEditor();
    if (editor == null) {
      return;
    }

    var grammars = configGet('grammars') || [];

    if (grammars.indexOf(editor.getGrammar().scopeName) >= 0 && !this.removePreviewForEditor(editor)) {
      return this.addPreviewForEditor(editor);
    }
  },

  uriForEditor: function uriForEditor(editor) {
    return 'svg-preview://editor/' + editor.id;
  },

  removePreview: function removePreview(previewView) {
    var uri = 'svg-preview://editor/' + previewView.editorId;
    var previewPane = atom.workspace.paneForURI(uri);

    if (previewPane) {
      previewPane.destroyItem(previewPane.itemForURI(uri));
      return true;
    }

    return false;
  },

  removePreviewForEditor: function removePreviewForEditor(editor) {
    var uri = this.uriForEditor(editor);
    var previewPane = atom.workspace.paneForURI(uri);

    if (previewPane) {
      previewPane.destroyItem(previewPane.itemForURI(uri));
      return true;
    }

    return false;
  },

  addPreviewForEditor: function addPreviewForEditor(editor) {
    var uri = this.uriForEditor(editor);
    var previousActivePane = atom.workspace.getActivePane();
    var options = {
      searchAllPanes: true,
      activatePane: false,
      split: configGet('openPreviewInPane') || undefined
    };

    atom.workspace.open(uri, options).then(function (svgPreviewView) {
      if (isSvgPreviewView(svgPreviewView)) {
        previousActivePane.activate();
      }
    });
  },

  previewFile: function previewFile(_ref) {
    var target = _ref.target;

    var filePath = target.dataset.path;
    if (!filePath) {
      return;
    }

    var _atom$workspace$getTextEditors = atom.workspace.getTextEditors();

    var _atom$workspace$getTextEditors2 = _slicedToArray(_atom$workspace$getTextEditors, 1);

    var editor = _atom$workspace$getTextEditors2[0];

    if (editor && editor.getPath() === filePath) {
      this.addPreviewForEditor(editor);
    } else {
      atom.workspace.open('svg-preview://' + encodeURI(filePath), {
        searchAllPanes: true
      });
    }
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvc3ZnLXByZXZpZXcvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztvQkFFb0MsTUFBTTs7bUJBQzFCLEtBQUs7Ozs7QUFIckIsV0FBVyxDQUFBOztJQUtILElBQUksR0FBSyxNQUFNLENBQWYsSUFBSTs7QUFFWixJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUE7O0FBRXpCLFNBQVMsb0JBQW9CLEdBQUk7QUFDL0IsTUFBSSxjQUFjLElBQUksSUFBSSxFQUFFO0FBQzFCLGtCQUFjLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUE7R0FDL0M7Q0FDRjs7QUFFRCxTQUFTLG9CQUFvQixDQUFFLEtBQUssRUFBRTtBQUNwQyxzQkFBb0IsRUFBRSxDQUFBO0FBQ3RCLFNBQU8sSUFBSSxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUE7Q0FDakM7O0FBRUQsU0FBUyxnQkFBZ0IsQ0FBRSxNQUFNLEVBQUU7QUFDakMsc0JBQW9CLEVBQUUsQ0FBQTtBQUN0QixTQUFPLE1BQU0sWUFBWSxjQUFjLENBQUE7Q0FDeEM7O0FBRUQsU0FBUyxTQUFTLENBQUUsR0FBRyxFQUFFO0FBQ3ZCLFNBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLGtCQUFnQixHQUFHLENBQUcsQ0FBQTtDQUM3Qzs7QUFFRCxTQUFTLFNBQVMsQ0FBRSxHQUFHLEVBQUUsS0FBSyxFQUFFO0FBQzlCLFNBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLGtCQUFnQixHQUFHLEVBQUksS0FBSyxDQUFDLENBQUE7Q0FDcEQ7O0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRzs7QUFFZixRQUFNLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQzs7QUFFM0IsMkJBQXlCLEVBQUMsbUNBQUMsS0FBSyxFQUFFO0FBQ2hDLFFBQUksS0FBSyxDQUFDLFdBQVcsS0FBSyxNQUFNLEVBQUU7QUFDaEMsYUFBTyxvQkFBb0IsQ0FBQyxLQUFLLENB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YXRvbS9wYWNrYWdlcy9zdmctcHJldmlldy9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHVybCBmcm9tICd1cmwnXG5cbmNvbnN0IHsgYXRvbSB9ID0gZ2xvYmFsXG5cbmxldCBTdmdQcmV2aWV3VmlldyA9IG51bGxcblxuZnVuY3Rpb24gaW1wb3J0U3ZnUHJldmlld1ZpZXcgKCkge1xuICBpZiAoU3ZnUHJldmlld1ZpZXcgPT0gbnVsbCkge1xuICAgIFN2Z1ByZXZpZXdWaWV3ID0gcmVxdWlyZSgnLi9zdmctcHJldmlldy12aWV3JylcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTdmdQcmV2aWV3VmlldyAoc3RhdGUpIHtcbiAgaW1wb3J0U3ZnUHJldmlld1ZpZXcoKVxuICByZXR1cm4gbmV3IFN2Z1ByZXZpZXdWaWV3KHN0YXRlKVxufVxuXG5mdW5jdGlvbiBpc1N2Z1ByZXZpZXdWaWV3IChvYmplY3QpIHtcbiAgaW1wb3J0U3ZnUHJldmlld1ZpZXcoKVxuICByZXR1cm4gb2JqZWN0IGluc3RhbmNlb2YgU3ZnUHJldmlld1ZpZXdcbn1cblxuZnVuY3Rpb24gY29uZmlnR2V0IChrZXkpIHtcbiAgcmV0dXJuIGF0b20uY29uZmlnLmdldChgc3ZnLXByZXZpZXcuJHtrZXl9YClcbn1cblxuZnVuY3Rpb24gY29uZmlnU2V0IChrZXksIHZhbHVlKSB7XG4gIHJldHVybiBhdG9tLmNvbmZpZy5zZXQoYHN2Zy1wcmV2aWV3LiR7a2V5fWAsIHZhbHVlKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBjb25maWc6IHJlcXVpcmUoJy4vY29uZmlnJyksXG5cbiAgZGVzZXJpYWxpemVTdmdQcmV2aWV3VmlldyAoc3RhdGUpIHtcbiAgICBpZiAoc3RhdGUuY29uc3RydWN0b3IgPT09IE9iamVjdCkge1xuICAgICAgcmV0dXJuIGNyZWF0ZVN2Z1ByZXZpZXdWaWV3KHN0YXRlKVxuICAgIH1cbiAgfSxcblxuICBhY3RpdmF0ZSAoKSB7XG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIC8vIERlcHJlY2F0ZWQgY29uZmlnXG4gICAgaWYgKGNvbmZpZ0dldCgnb3BlblByZXZpZXdJblNwbGl0UGFuZScpID09PSBmYWxzZSkge1xuICAgICAgY29uZmlnU2V0KCdvcGVuUHJldmlld0luUGFuZScsICcnKVxuICAgICAgY29uZmlnU2V0KCdvcGVuUHJldmlld0luU3BsaXRQYW5lJywgdW5kZWZpbmVkKVxuICAgIH1cblxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICdzdmctcHJldmlldzp0b2dnbGUnOiAoKSA9PiB0aGlzLnRvZ2dsZSgpXG4gICAgfSkpXG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChcbiAgICAgIGF0b20ud29ya3NwYWNlLmFkZE9wZW5lcigodXJpVG9PcGVuKSA9PiB0aGlzLm9uT3BlblVyaSh1cmlUb09wZW4pKVxuICAgIClcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKFxuICAgICAgYXRvbS53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSgoaXRlbSkgPT4ge1xuICAgICAgICB0aGlzLm9uRGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW0oaXRlbSlcbiAgICAgIH0pXG4gICAgKVxuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoXG4gICAgICBhdG9tLndvcmtzcGFjZS5vbldpbGxEZXN0cm95UGFuZUl0ZW0oKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMub25XaWxsRGVzdHJveVBhbmVJdGVtKGV2ZW50Lml0ZW0pXG4gICAgICB9KVxuICAgIClcbiAgfSxcblxuICBkZWFjdGl2YXRlICgpIHtcbiAgICBhdG9tLndvcmtzcGFjZS5nZXRQYW5lSXRlbXMoKVxuICAgICAgLmZpbHRlcigoaXRlbSkgPT4gaXNTdmdQcmV2aWV3VmlldyhpdGVtKSlcbiAgICAgIC5mb3JFYWNoKChpdGVtKSA9PiB0aGlzLnJlbW92ZVByZXZpZXcoaXRlbSkpXG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICB9LFxuXG4gIG9uV2lsbERlc3Ryb3lQYW5lSXRlbSAoaXRlbSkge1xuICAgIGlmICghKFxuICAgICAgY29uZmlnR2V0KCdjbG9zZVByZXZpZXdBdXRvbWF0aWNhbGx5JykgJiZcbiAgICAgIGNvbmZpZ0dldCgnb3BlblByZXZpZXdJblBhbmUnKVxuICAgICkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5yZW1vdmVQcmV2aWV3Rm9yRWRpdG9yKGl0ZW0pXG4gIH0sXG5cbiAgb25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSAoaXRlbSkge1xuICAgIGlmICghKFxuICAgICAgY29uZmlnR2V0KCdvcGVuUHJldmlld0F1dG9tYXRpY2FsbHknKSAmJlxuICAgICAgY29uZmlnR2V0KCdvcGVuUHJldmlld0luUGFuZScpICYmXG4gICAgICB0aGlzLmlzU3ZnRWRpdG9yKGl0ZW0pXG4gICAgKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHJldHVybiB0aGlzLmFkZFByZXZpZXdGb3JFZGl0b3IoaXRlbSlcbiAgfSxcblxuICBvbk9wZW5VcmkgKHVyaVRvT3Blbikge1xuICAgIGxldCBwcm90b2NvbCwgaG9zdCwgZmlsZVBhdGhcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCB1cmxPYmpzID0gdXJsLnBhcnNlKHVyaVRvT3BlbilcblxuICAgICAgcHJvdG9jb2wgPSB1cmxPYmpzLnByb3RvY29sXG4gICAgICBob3N0ID0gdXJsT2Jqcy5ob3N0XG4gICAgICBmaWxlUGF0aCA9IHVybE9ianMucGF0aG5hbWVcblxuICAgICAgaWYgKHByb3RvY29sICE9PSAnc3ZnLXByZXZpZXc6JykgeyByZXR1cm4gfVxuICAgICAgaWYgKGZpbGVQYXRoKSB7IGZpbGVQYXRoID0gZGVjb2RlVVJJKGZpbGVQYXRoKSB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmIChob3N0ID09PSAnZWRpdG9yJykge1xuICAgICAgcmV0dXJuIGNyZWF0ZVN2Z1ByZXZpZXdWaWV3KHsgZWRpdG9ySWQ6IGZpbGVQYXRoLnN1YnN0cmluZygxKSB9KVxuICAgIH1cblxuICAgIHJldHVybiBjcmVhdGVTdmdQcmV2aWV3Vmlldyh7IGZpbGVQYXRoIH0pXG4gIH0sXG5cbiAgaXNTdmdFZGl0b3IgKGl0ZW0pIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZ3JhbW1hcnMgPSBbJ3RleHQueG1sLnN2ZyddLmNvbmNhdChjb25maWdHZXQoJ2dyYW1tYXJzJykgfHwgW10pXG4gICAgICBjb25zdCBncmFtbWFyID0gaXRlbS5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lXG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIChpdGVtLmdldEJ1ZmZlciAmJiBpdGVtLmdldFRleHQpICYmXG4gICAgICAgIChncmFtbWFycy5pbmRleE9mKGdyYW1tYXIpID49IDAgJiYgaXRlbS5nZXRUZXh0KCkubWF0Y2goLzxzdmcvKSlcbiAgICAgIClcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9LFxuXG4gIHRvZ2dsZSAoKSB7XG4gICAgaWYgKGlzU3ZnUHJldmlld1ZpZXcoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKSkpIHtcbiAgICAgIGF0b20ud29ya3NwYWNlLmRlc3Ryb3lBY3RpdmVQYW5lSXRlbSgpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBpZiAoZWRpdG9yID09IG51bGwpIHsgcmV0dXJuIH1cblxuICAgIGNvbnN0IGdyYW1tYXJzID0gY29uZmlnR2V0KCdncmFtbWFycycpIHx8IFtdXG5cbiAgICBpZiAoXG4gICAgICBncmFtbWFycy5pbmRleE9mKGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lKSA+PSAwICYmXG4gICAgICAhdGhpcy5yZW1vdmVQcmV2aWV3Rm9yRWRpdG9yKGVkaXRvcilcbiAgICApIHtcbiAgICAgIHJldHVybiB0aGlzLmFkZFByZXZpZXdGb3JFZGl0b3IoZWRpdG9yKVxuICAgIH1cbiAgfSxcblxuICB1cmlGb3JFZGl0b3IgKGVkaXRvcikge1xuICAgIHJldHVybiBgc3ZnLXByZXZpZXc6Ly9lZGl0b3IvJHtlZGl0b3IuaWR9YFxuICB9LFxuXG4gIHJlbW92ZVByZXZpZXcgKHByZXZpZXdWaWV3KSB7XG4gICAgY29uc3QgdXJpID0gYHN2Zy1wcmV2aWV3Oi8vZWRpdG9yLyR7cHJldmlld1ZpZXcuZWRpdG9ySWR9YFxuICAgIGNvbnN0IHByZXZpZXdQYW5lID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvclVSSSh1cmkpXG5cbiAgICBpZiAocHJldmlld1BhbmUpIHtcbiAgICAgIHByZXZpZXdQYW5lLmRlc3Ryb3lJdGVtKHByZXZpZXdQYW5lLml0ZW1Gb3JVUkkodXJpKSlcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH0sXG5cbiAgcmVtb3ZlUHJldmlld0ZvckVkaXRvciAoZWRpdG9yKSB7XG4gICAgY29uc3QgdXJpID0gdGhpcy51cmlGb3JFZGl0b3IoZWRpdG9yKVxuICAgIGNvbnN0IHByZXZpZXdQYW5lID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvclVSSSh1cmkpXG5cbiAgICBpZiAocHJldmlld1BhbmUpIHtcbiAgICAgIHByZXZpZXdQYW5lLmRlc3Ryb3lJdGVtKHByZXZpZXdQYW5lLml0ZW1Gb3JVUkkodXJpKSlcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH0sXG5cbiAgYWRkUHJldmlld0ZvckVkaXRvciAoZWRpdG9yKSB7XG4gICAgY29uc3QgdXJpID0gdGhpcy51cmlGb3JFZGl0b3IoZWRpdG9yKVxuICAgIGNvbnN0IHByZXZpb3VzQWN0aXZlUGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICBzZWFyY2hBbGxQYW5lczogdHJ1ZSxcbiAgICAgIGFjdGl2YXRlUGFuZTogZmFsc2UsXG4gICAgICBzcGxpdDogY29uZmlnR2V0KCdvcGVuUHJldmlld0luUGFuZScpIHx8IHVuZGVmaW5lZFxuICAgIH1cblxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4odXJpLCBvcHRpb25zKS50aGVuKChzdmdQcmV2aWV3VmlldykgPT4ge1xuICAgICAgaWYgKGlzU3ZnUHJldmlld1ZpZXcoc3ZnUHJldmlld1ZpZXcpKSB7XG4gICAgICAgIHByZXZpb3VzQWN0aXZlUGFuZS5hY3RpdmF0ZSgpXG4gICAgICB9XG4gICAgfSlcbiAgfSxcblxuICBwcmV2aWV3RmlsZSAoeyB0YXJnZXQgfSkge1xuICAgIGNvbnN0IGZpbGVQYXRoID0gdGFyZ2V0LmRhdGFzZXQucGF0aFxuICAgIGlmICghZmlsZVBhdGgpIHsgcmV0dXJuIH1cblxuICAgIGNvbnN0IFsgZWRpdG9yIF0gPSBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpXG4gICAgaWYgKGVkaXRvciAmJiBlZGl0b3IuZ2V0UGF0aCgpID09PSBmaWxlUGF0aCkge1xuICAgICAgdGhpcy5hZGRQcmV2aWV3Rm9yRWRpdG9yKGVkaXRvcilcbiAgICB9IGVsc2Uge1xuICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbihgc3ZnLXByZXZpZXc6Ly8ke2VuY29kZVVSSShmaWxlUGF0aCl9YCwge1xuICAgICAgICBzZWFyY2hBbGxQYW5lczogdHJ1ZVxuICAgICAgfSlcbiAgICB9XG4gIH1cbn1cbiJdfQ==