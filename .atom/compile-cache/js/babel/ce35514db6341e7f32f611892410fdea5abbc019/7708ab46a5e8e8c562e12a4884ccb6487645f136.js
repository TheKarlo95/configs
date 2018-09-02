var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atom = require('atom');

var _atomSpacePenViews = require('atom-space-pen-views');

var _debounce = require('debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _getSvgSize = require('./get-svg-size');

var _getSvgSize2 = _interopRequireDefault(_getSvgSize);

'use babel';

var fs = null; // Defer until used
var svgToRaster = null; // Defer until used

var atom = global.atom;

var SvgPreviewView = (function (_View) {
  _inherits(SvgPreviewView, _View);

  _createClass(SvgPreviewView, null, [{
    key: 'deserialize',
    value: function deserialize(state) {
      return new SvgPreviewView(state);
    }
  }, {
    key: 'content',
    value: function content() {
      var _this = this;

      this.div({ outlet: 'container', 'class': 'svg-preview native-key-bindings', tabindex: -1, background: 'white' }, function () {
        _this.div({ outlet: 'controls', 'class': 'image-controls' }, function () {
          _this.div({ 'class': 'image-controls-group' }, function () {
            _this.a({ outlet: 'whiteButton', 'class': 'image-controls-color-white', value: 'white' }, function () {
              _this.text('white');
            });
            _this.a({ outlet: 'blackButton', 'class': 'image-controls-color-black', value: 'black' }, function () {
              _this.text('black');
            });
            _this.a({ outlet: 'transparentButton', 'class': 'image-controls-color-transparent', value: 'transparent' }, function () {
              _this.text('transparent');
            });
          });
          _this.div({ 'class': 'image-controls-group btn-group' }, function () {
            _this.button({ 'class': 'btn', outlet: 'zoomOutButton' }, function () {
              _this.text('-');
            });
            _this.button({ 'class': 'btn reset-zoom-button', outlet: 'resetZoomButton' }, function () {
              _this.text('100%');
            });
            _this.button({ 'class': 'btn', outlet: 'zoomInButton' }, function () {
              _this.text('+');
            });
          });
        });
        _this.div({ outlet: 'canvas', 'class': 'image-canvas' });
      });
    }
  }]);

  function SvgPreviewView(_ref) {
    var editorId = _ref.editorId;
    var filePath = _ref.filePath;
    var zoomValue = _ref.zoomValue;

    _classCallCheck(this, SvgPreviewView);

    _get(Object.getPrototypeOf(SvgPreviewView.prototype), 'constructor', this).call(this);

    this.editorId = editorId;
    this.filePath = filePath;

    this.emitter = new _atom.Emitter();
    this.disposables = new _atom.CompositeDisposable();

    this.zoomValue = zoomValue || 1;
  }

  _createClass(SvgPreviewView, [{
    key: 'attached',
    value: function attached() {
      var _this2 = this;

      if (this.isAttached) {
        return;
      }

      this.isAttached = true;

      if (this.editorId) {
        this.resolveEditor(this.editorId);
      } else if (this.filePath) {
        if (atom.workspace) {
          this.subscribeToFilePath(this.filePath);
        } else {
          this.disposables.add(atom.packages.onDidActivateInitialPackages(function () {
            return _this2.subscribeToFilePath(_this2.filePath);
          }));
        }
      }

      this.disposables.add(atom.tooltips.add(this.whiteButton[0], { title: 'Use white transparent background' }));
      this.disposables.add(atom.tooltips.add(this.blackButton[0], { title: 'Use black transparent background' }));
      this.disposables.add(atom.tooltips.add(this.transparentButton[0], { title: 'Use transparent background' }));

      this.controls.find('a').on('click', function (e) {
        _this2.changeBackground((0, _atomSpacePenViews.$)(e.target).attr('value'));
      });
      this.zoomOutButton.on('click', function (e) {
        return _this2.zoom(9 / 10 - 1);
      });
      this.resetZoomButton.on('click', function (e) {
        return _this2.zoomReset();
      });
      this.zoomInButton.on('click', function (e) {
        return _this2.zoom(10 / 9 - 1);
      });
    }
  }, {
    key: 'serialize',
    value: function serialize() {
      return {
        deserializer: 'SvgPreviewView',
        filePath: this.getPath(),
        editorId: this.editorId,
        zoomValue: this.zoomValue
      };
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.disposables.dispose();
    }
  }, {
    key: 'onDidChangeTitle',
    value: function onDidChangeTitle(callback) {
      return this.emitter.on('did-change-title', callback);
    }
  }, {
    key: 'onDidChangeModified',
    value: function onDidChangeModified(callback) {
      // No op to suppress deprecation warning
      return new _atom.Disposable();
    }
  }, {
    key: 'onDidChangeSvg',
    value: function onDidChangeSvg(callback) {
      return this.emitter.on('did-change-svg', callback);
    }
  }, {
    key: 'subscribeToFilePath',
    value: function subscribeToFilePath(filePath) {
      this.file = new _atom.File(filePath);
      this.emitter.emit('did-change-title');
      this.handleEvents();
      this.renderSvg();
    }
  }, {
    key: 'resolveEditor',
    value: function resolveEditor(editorId) {
      var _this3 = this;

      var resolve = function resolve() {
        _this3.editor = _this3.editorForId(editorId);

        if (_this3.editor) {
          _this3.emitter.emit('did-change-title');
          _this3.handleEvents();
          _this3.renderSvg();
        } else {
          // The editor this preview was created for has been closed so close
          // this preview since a preview cannot be rendered without an editor
          var paneView = _this3.parents('.pane').view();
          if (paneView) {
            paneView.destroyItem(_this3);
          }
        }
      };

      if (atom.workspace) {
        resolve();
      } else {
        this.disposables.add(atom.packages.onDidActivateInitialPackages(resolve));
      }
    }
  }, {
    key: 'editorForId',
    value: function editorForId(editorId) {
      for (var editor of atom.workspace.getTextEditors()) {
        if (editor.id && editor.id.toString() === editorId.toString()) {
          return editor;
        }
      }

      return null;
    }
  }, {
    key: 'zoom',
    value: function zoom(offset) {
      this.zoomTo(this.zoomValue + this.zoomValue * offset);
    }
  }, {
    key: 'zoomReset',
    value: function zoomReset() {
      this.zoomTo(1);
    }
  }, {
    key: 'zoomTo',
    value: function zoomTo(zoomValue) {
      if (zoomValue <= Number.EPSILON) {
        return;
      }

      var svg = this.canvas.find('svg');
      var svgEl = svg.get(0);

      if (svgEl) {
        var width = svg.width() * zoomValue;
        var height = svg.height() * zoomValue;

        var factor = svg.data('factor');
        if (factor) {
          width /= factor;
          height /= factor;
        }

        if (!svgEl.getAttribute('viewBox')) {
          svg[0].setAttribute('viewBox', '0 0 ' + svg.width() + ' ' + svg.height());
        }

        svg.width(width).height(height).data('factor', zoomValue);

        this.zoomValue = zoomValue;
        this.resetZoomButton.text(Math.round(zoomValue * 100) + '%');
      }
    }
  }, {
    key: 'config',
    value: function config(key) {
      return atom.config.get('svg-preview.' + key);
    }
  }, {
    key: 'handleEvents',
    value: function handleEvents() {
      var _this4 = this;

      this.disposables.add(atom.grammars.onDidAddGrammar((0, _debounce2['default'])(function () {
        return _this4.renderSvg();
      }, 250)), atom.grammars.onDidUpdateGrammar((0, _debounce2['default'])(function () {
        return _this4.renderSvg();
      }, 250)));

      atom.commands.add(this.element, {
        'core:move-up': function coreMoveUp() {
          return _this4.scrollUp();
        },
        'core:move-down': function coreMoveDown() {
          return _this4.scrollDown();
        },
        'svg-preview:zoom-in': function svgPreviewZoomIn() {
          return _this4.zoom(0.1);
        },
        'svg-preview:zoom-out': function svgPreviewZoomOut() {
          return _this4.zoom(-0.1);
        },
        'svg-preview:reset-zoom': function svgPreviewResetZoom() {
          return _this4.zoomReset();
        },
        'svg-preview:export-to-png': function svgPreviewExportToPng(event) {
          event.stopPropagation();
          _this4.exportTo('png');
        },
        'svg-preview:export-to-jpeg': function svgPreviewExportToJpeg(event) {
          event.stopPropagation();
          _this4.exportTo('jpeg');
        }
      });

      if (this.file) {
        this.disposables.add(this.file.onDidChange(function () {
          return _this4.changeHandler();
        }));
      } else if (this.editor) {
        var buffer = this.editor.getBuffer();

        this.disposables.add(buffer.onDidSave(function () {
          return _this4.changeHandler(false);
        }), buffer.onDidReload(function () {
          return _this4.changeHandler(false);
        }), buffer.onDidStopChanging(function () {
          return _this4.changeHandler(true);
        }), this.editor.onDidChangePath(function () {
          return _this4.emitter.emit('did-change-title');
        }));
      }
    }
  }, {
    key: 'changeHandler',
    value: function changeHandler() {
      var ifLiveUpdate = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (ifLiveUpdate === !this.config('liveUpdate')) {
        return;
      }

      this.renderSvg();

      var pane = atom.workspace.paneForItem(this);
      if (pane && pane !== atom.workspace.getActivePane()) {
        pane.activateItem(this);
      }
    }
  }, {
    key: 'renderSvg',
    value: function renderSvg() {
      var _this5 = this;

      return this.getSvgSource().then(function (source) {
        return _this5.renderSvgText(source);
      });
    }
  }, {
    key: 'getSvgSource',
    value: function getSvgSource() {
      if (this.file) {
        return this.file.read();
      } else if (this.editor) {
        return Promise.resolve(this.editor.getText());
      } else {
        return Promise.resolve(null);
      }
    }
  }, {
    key: 'renderSvgText',
    value: function renderSvgText(text) {
      if (!text) {
        return;
      }

      text = text.replace(/<svg:/g, '<');

      var scrollTop = this.canvas.scrollTop();
      var scrollLeft = this.canvas.scrollLeft();

      this.canvas.html(text);

      var svg = this.canvas.find('svg');
      if (svg.get(0)) {
        var _getSVGSize = (0, _getSvgSize2['default'])(svg.get(0));

        var width = _getSVGSize.width;
        var height = _getSVGSize.height;

        svg.width(width);
        svg.height(height);

        this.zoomTo(this.zoomValue);

        this.canvas.scrollTop(scrollTop);
        this.canvas.scrollLeft(scrollLeft);
      }

      this.emitter.emit('did-change-svg');
      this.originalTrigger('svg-preview:svg-changed');
    }
  }, {
    key: 'getTitle',
    value: function getTitle() {
      var title = 'SVG';
      if (this.file) {
        title = _path2['default'].basename(this.getPath());
      } else if (this.editor) {
        title = this.editor.getTitle();
      }

      return title + ' Preview';
    }
  }, {
    key: 'getIconName',
    value: function getIconName() {
      return 'svg';
    }
  }, {
    key: 'getURI',
    value: function getURI() {
      if (this.file) {
        return 'svg-preview://' + this.getPath();
      }
      return 'svg-preview://editor/' + this.editorId;
    }
  }, {
    key: 'getPath',
    value: function getPath() {
      if (this.file) {
        return this.file.getPath();
      } else if (this.editor) {
        return this.editor.getPath();
      }
    }
  }, {
    key: 'getGrammar',
    value: function getGrammar() {
      if (this.editor) {
        return this.editor.getGrammar();
      }
    }
  }, {
    key: 'showError',
    value: function showError(result) {
      var _ref2 = result || {};

      var message = _ref2.message;

      this.canvas.html((0, _atomSpacePenViews.$$$)(function () {
        this.h2('Previewing SVG Failed');
        if (message) {
          this.h3(message);
        }
      }));
    }
  }, {
    key: 'showLoading',
    value: function showLoading() {
      this.canvas.html((0, _atomSpacePenViews.$$$)(function () {
        this.div({ 'class': 'svg-spinner' }, 'Loading SVG…');
      }));
    }
  }, {
    key: 'isEqual',
    value: function isEqual(other) {
      return other && this[0] === other[0]; // Compare DOM elements
    }
  }, {
    key: 'changeBackground',
    value: function changeBackground(color) {
      this.attr('background', color);
    }
  }, {
    key: 'exportTo',
    value: function exportTo(outputType) {
      var filePath = undefined,
          outputFilePath = undefined,
          projectPath = undefined;
      if (this.loading) {
        return;
      }

      filePath = this.getPath();

      if (filePath) {
        filePath = _path2['default'].join(_path2['default'].dirname(filePath), _path2['default'].basename(filePath, _path2['default'].extname(filePath))).concat('.' + outputType);
      } else {
        filePath = 'untitled.' + outputType;
        projectPath = atom.project.getPaths()[0];
        if (projectPath) {
          filePath = _path2['default'].join(projectPath, filePath);
        }
      }

      outputFilePath = atom.showSaveDialogSync(filePath);
      if (outputFilePath) {
        if (svgToRaster == null) {
          svgToRaster = require('./svg-to-raster');
        }
        if (fs == null) {
          fs = require('fs-plus');
        }
        this.getSvgSource().then(function (source) {
          svgToRaster.transform(source, outputType, function (result) {
            fs.writeFileSync(outputFilePath, result);
            atom.workspace.open(outputFilePath);
          });
        });
      }
    }
  }]);

  return SvgPreviewView;
})(_atomSpacePenViews.View);

atom.deserializers.add(SvgPreviewView);

module.exports = SvgPreviewView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvc3ZnLXByZXZpZXcvbGliL3N2Zy1wcmV2aWV3LXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFaUIsTUFBTTs7OztvQkFDd0MsTUFBTTs7aUNBQ3hDLHNCQUFzQjs7d0JBQzlCLFVBQVU7Ozs7MEJBQ1IsZ0JBQWdCOzs7O0FBTnZDLFdBQVcsQ0FBQTs7QUFRWCxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUE7QUFDYixJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUE7O0lBRWQsSUFBSSxHQUFLLE1BQU0sQ0FBZixJQUFJOztJQUVOLGNBQWM7WUFBZCxjQUFjOztlQUFkLGNBQWM7O1dBQ0MscUJBQUMsS0FBSyxFQUFFO0FBQ3pCLGFBQU8sSUFBSSxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUE7S0FDakM7OztXQUVjLG1CQUFHOzs7QUFDaEIsVUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsU0FBTyxpQ0FBaUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxFQUFFLFlBQU07QUFDbkgsY0FBSyxHQUFHLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFNBQU8sZ0JBQWdCLEVBQUUsRUFBRSxZQUFNO0FBQzlELGdCQUFLLEdBQUcsQ0FBQyxFQUFFLFNBQU8sc0JBQXNCLEVBQUUsRUFBRSxZQUFNO0FBQ2hELGtCQUFLLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsU0FBTyw0QkFBNEIsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUUsWUFBTTtBQUMzRixvQkFBSyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7YUFDbkIsQ0FBQyxDQUFBO0FBQ0Ysa0JBQUssQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxTQUFPLDRCQUE0QixFQUFFLEtBQUssRUFBRSxPQUFP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LENBQUE7QUFDbEQsVUFBSSxjQUFjLEVBQUU7QUFDbEIsWUFBSSxXQUFXLElBQUksSUFBSSxFQUFFO0FBQ3ZCLHFCQUFXLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUE7U0FDekM7QUFDRCxZQUFJLEVBQUUsSUFBSSxJQUFJLEVBQUU7QUFDZCxZQUFFLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFBO1NBQ3hCO0FBQ0QsWUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLE1BQU0sRUFBSztBQUNuQyxxQkFBVyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFVBQUMsTUFBTSxFQUFLO0FBQ3BELGNBQUUsQ0FBQyxhQUFhLENBQUMsY0FBYyxFQUFFLE1BQU0sQ0FBQyxDQUFBO0FBQ3hDLGdCQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQTtXQUNwQyxDQUFDLENBQUE7U0FDSCxDQUFDLENBQUE7T0FDSDtLQUNGOzs7U0E1WEcsY0FBYzs7O0FBK1hwQixJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQTs7QUFFdEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUEiLCJmaWxlIjoiL2hvbWUvdGhla2FybG85NS8uYXRvbS9wYWNrYWdlcy9zdmctcHJldmlldy9saWIvc3ZnLXByZXZpZXctdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBFbWl0dGVyLCBEaXNwb3NhYmxlLCBDb21wb3NpdGVEaXNwb3NhYmxlLCBGaWxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7ICQsICQkJCwgVmlldyB9IGZyb20gJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuaW1wb3J0IGRlYm91bmNlIGZyb20gJ2RlYm91bmNlJ1xuaW1wb3J0IGdldFNWR1NpemUgZnJvbSAnLi9nZXQtc3ZnLXNpemUnXG5cbmxldCBmcyA9IG51bGwgLy8gRGVmZXIgdW50aWwgdXNlZFxubGV0IHN2Z1RvUmFzdGVyID0gbnVsbCAvLyBEZWZlciB1bnRpbCB1c2VkXG5cbmNvbnN0IHsgYXRvbSB9ID0gZ2xvYmFsXG5cbmNsYXNzIFN2Z1ByZXZpZXdWaWV3IGV4dGVuZHMgVmlldyB7XG4gIHN0YXRpYyBkZXNlcmlhbGl6ZSAoc3RhdGUpIHtcbiAgICByZXR1cm4gbmV3IFN2Z1ByZXZpZXdWaWV3KHN0YXRlKVxuICB9XG5cbiAgc3RhdGljIGNvbnRlbnQgKCkge1xuICAgIHRoaXMuZGl2KHsgb3V0bGV0OiAnY29udGFpbmVyJywgY2xhc3M6ICdzdmctcHJldmlldyBuYXRpdmUta2V5LWJpbmRpbmdzJywgdGFiaW5kZXg6IC0xLCBiYWNrZ3JvdW5kOiAnd2hpdGUnIH0sICgpID0+IHtcbiAgICAgIHRoaXMuZGl2KHsgb3V0bGV0OiAnY29udHJvbHMnLCBjbGFzczogJ2ltYWdlLWNvbnRyb2xzJyB9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMuZGl2KHsgY2xhc3M6ICdpbWFnZS1jb250cm9scy1ncm91cCcgfSwgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuYSh7IG91dGxldDogJ3doaXRlQnV0dG9uJywgY2xhc3M6ICdpbWFnZS1jb250cm9scy1jb2xvci13aGl0ZScsIHZhbHVlOiAnd2hpdGUnIH0sICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudGV4dCgnd2hpdGUnKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgdGhpcy5hKHsgb3V0bGV0OiAnYmxhY2tCdXR0b24nLCBjbGFzczogJ2ltYWdlLWNvbnRyb2xzLWNvbG9yLWJsYWNrJywgdmFsdWU6ICdibGFjaycgfSwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy50ZXh0KCdibGFjaycpXG4gICAgICAgICAgfSlcbiAgICAgICAgICB0aGlzLmEoeyBvdXRsZXQ6ICd0cmFuc3BhcmVudEJ1dHRvbicsIGNsYXNzOiAnaW1hZ2UtY29udHJvbHMtY29sb3ItdHJhbnNwYXJlbnQnLCB2YWx1ZTogJ3RyYW5zcGFyZW50JyB9LCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRleHQoJ3RyYW5zcGFyZW50JylcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLmRpdih7IGNsYXNzOiAnaW1hZ2UtY29udHJvbHMtZ3JvdXAgYnRuLWdyb3VwJyB9LCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5idXR0b24oeyBjbGFzczogJ2J0bicsIG91dGxldDogJ3pvb21PdXRCdXR0b24nIH0sICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudGV4dCgnLScpXG4gICAgICAgICAgfSlcbiAgICAgICAgICB0aGlzLmJ1dHRvbih7IGNsYXNzOiAnYnRuIHJlc2V0LXpvb20tYnV0dG9uJywgb3V0bGV0OiAncmVzZXRab29tQnV0dG9uJyB9LCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRleHQoJzEwMCUnKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgdGhpcy5idXR0b24oeyBjbGFzczogJ2J0bicsIG91dGxldDogJ3pvb21JbkJ1dHRvbicgfSwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy50ZXh0KCcrJylcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIHRoaXMuZGl2KHsgb3V0bGV0OiAnY2FudmFzJywgY2xhc3M6ICdpbWFnZS1jYW52YXMnIH0pXG4gICAgfSlcbiAgfVxuXG4gIGNvbnN0cnVjdG9yICh7IGVkaXRvcklkLCBmaWxlUGF0aCwgem9vbVZhbHVlIH0pIHtcbiAgICBzdXBlcigpXG5cbiAgICB0aGlzLmVkaXRvcklkID0gZWRpdG9ySWRcbiAgICB0aGlzLmZpbGVQYXRoID0gZmlsZVBhdGhcblxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLmRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy56b29tVmFsdWUgPSB6b29tVmFsdWUgfHwgMVxuICB9XG5cbiAgYXR0YWNoZWQgKCkge1xuICAgIGlmICh0aGlzLmlzQXR0YWNoZWQpIHsgcmV0dXJuIH1cblxuICAgIHRoaXMuaXNBdHRhY2hlZCA9IHRydWVcblxuICAgIGlmICh0aGlzLmVkaXRvcklkKSB7XG4gICAgICB0aGlzLnJlc29sdmVFZGl0b3IodGhpcy5lZGl0b3JJZClcbiAgICB9IGVsc2UgaWYgKHRoaXMuZmlsZVBhdGgpIHtcbiAgICAgIGlmIChhdG9tLndvcmtzcGFjZSkge1xuICAgICAgICB0aGlzLnN1YnNjcmliZVRvRmlsZVBhdGgodGhpcy5maWxlUGF0aClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKGF0b20ucGFja2FnZXMub25EaWRBY3RpdmF0ZUluaXRpYWxQYWNrYWdlcygoKSA9PlxuICAgICAgICAgIHRoaXMuc3Vic2NyaWJlVG9GaWxlUGF0aCh0aGlzLmZpbGVQYXRoKVxuICAgICAgICApKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKGF0b20udG9vbHRpcHMuYWRkKHRoaXMud2hpdGVCdXR0b25bMF0sIHsgdGl0bGU6ICdVc2Ugd2hpdGUgdHJhbnNwYXJlbnQgYmFja2dyb3VuZCcgfSkpXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoYXRvbS50b29sdGlwcy5hZGQodGhpcy5ibGFja0J1dHRvblswXSwgeyB0aXRsZTogJ1VzZSBibGFjayB0cmFuc3BhcmVudCBiYWNrZ3JvdW5kJyB9KSlcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLnRvb2x0aXBzLmFkZCh0aGlzLnRyYW5zcGFyZW50QnV0dG9uWzBdLCB7IHRpdGxlOiAnVXNlIHRyYW5zcGFyZW50IGJhY2tncm91bmQnIH0pKVxuXG4gICAgdGhpcy5jb250cm9scy5maW5kKCdhJykub24oJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIHRoaXMuY2hhbmdlQmFja2dyb3VuZCgkKGUudGFyZ2V0KS5hdHRyKCd2YWx1ZScpKVxuICAgIH0pXG4gICAgdGhpcy56b29tT3V0QnV0dG9uLm9uKCdjbGljaycsIChlKSA9PiB0aGlzLnpvb20oOSAvIDEwIC0gMSkpXG4gICAgdGhpcy5yZXNldFpvb21CdXR0b24ub24oJ2NsaWNrJywgKGUpID0+IHRoaXMuem9vbVJlc2V0KCkpXG4gICAgdGhpcy56b29tSW5CdXR0b24ub24oJ2NsaWNrJywgKGUpID0+IHRoaXMuem9vbSgxMCAvIDkgLSAxKSlcbiAgfVxuXG4gIHNlcmlhbGl6ZSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRlc2VyaWFsaXplcjogJ1N2Z1ByZXZpZXdWaWV3JyxcbiAgICAgIGZpbGVQYXRoOiB0aGlzLmdldFBhdGgoKSxcbiAgICAgIGVkaXRvcklkOiB0aGlzLmVkaXRvcklkLFxuICAgICAgem9vbVZhbHVlOiB0aGlzLnpvb21WYWx1ZVxuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3kgKCkge1xuICAgIHRoaXMuZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gIH1cblxuICBvbkRpZENoYW5nZVRpdGxlIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1jaGFuZ2UtdGl0bGUnLCBjYWxsYmFjaylcbiAgfVxuXG4gIG9uRGlkQ2hhbmdlTW9kaWZpZWQgKGNhbGxiYWNrKSB7XG4gICAgLy8gTm8gb3AgdG8gc3VwcHJlc3MgZGVwcmVjYXRpb24gd2FybmluZ1xuICAgIHJldHVybiBuZXcgRGlzcG9zYWJsZSgpXG4gIH1cblxuICBvbkRpZENoYW5nZVN2ZyAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLXN2ZycsIGNhbGxiYWNrKVxuICB9XG5cbiAgc3Vic2NyaWJlVG9GaWxlUGF0aCAoZmlsZVBhdGgpIHtcbiAgICB0aGlzLmZpbGUgPSBuZXcgRmlsZShmaWxlUGF0aClcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS10aXRsZScpXG4gICAgdGhpcy5oYW5kbGVFdmVudHMoKVxuICAgIHRoaXMucmVuZGVyU3ZnKClcbiAgfVxuXG4gIHJlc29sdmVFZGl0b3IgKGVkaXRvcklkKSB7XG4gICAgY29uc3QgcmVzb2x2ZSA9ICgpID0+IHtcbiAgICAgIHRoaXMuZWRpdG9yID0gdGhpcy5lZGl0b3JGb3JJZChlZGl0b3JJZClcblxuICAgICAgaWYgKHRoaXMuZWRpdG9yKSB7XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLXRpdGxlJylcbiAgICAgICAgdGhpcy5oYW5kbGVFdmVudHMoKVxuICAgICAgICB0aGlzLnJlbmRlclN2ZygpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUaGUgZWRpdG9yIHRoaXMgcHJldmlldyB3YXMgY3JlYXRlZCBmb3IgaGFzIGJlZW4gY2xvc2VkIHNvIGNsb3NlXG4gICAgICAgIC8vIHRoaXMgcHJldmlldyBzaW5jZSBhIHByZXZpZXcgY2Fubm90IGJlIHJlbmRlcmVkIHdpdGhvdXQgYW4gZWRpdG9yXG4gICAgICAgIGNvbnN0IHBhbmVWaWV3ID0gdGhpcy5wYXJlbnRzKCcucGFuZScpLnZpZXcoKVxuICAgICAgICBpZiAocGFuZVZpZXcpIHtcbiAgICAgICAgICBwYW5lVmlldy5kZXN0cm95SXRlbSh0aGlzKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGF0b20ud29ya3NwYWNlKSB7XG4gICAgICByZXNvbHZlKClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoYXRvbS5wYWNrYWdlcy5vbkRpZEFjdGl2YXRlSW5pdGlhbFBhY2thZ2VzKHJlc29sdmUpKVxuICAgIH1cbiAgfVxuXG4gIGVkaXRvckZvcklkIChlZGl0b3JJZCkge1xuICAgIGZvciAobGV0IGVkaXRvciBvZiBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpKSB7XG4gICAgICBpZiAoZWRpdG9yLmlkICYmIGVkaXRvci5pZC50b1N0cmluZygpID09PSBlZGl0b3JJZC50b1N0cmluZygpKSB7XG4gICAgICAgIHJldHVybiBlZGl0b3JcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgem9vbSAob2Zmc2V0KSB7XG4gICAgdGhpcy56b29tVG8odGhpcy56b29tVmFsdWUgKyB0aGlzLnpvb21WYWx1ZSAqIG9mZnNldClcbiAgfVxuXG4gIHpvb21SZXNldCAoKSB7XG4gICAgdGhpcy56b29tVG8oMSlcbiAgfVxuXG4gIHpvb21UbyAoem9vbVZhbHVlKSB7XG4gICAgaWYgKHpvb21WYWx1ZSA8PSBOdW1iZXIuRVBTSUxPTikge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3Qgc3ZnID0gdGhpcy5jYW52YXMuZmluZCgnc3ZnJylcbiAgICBjb25zdCBzdmdFbCA9IHN2Zy5nZXQoMClcblxuICAgIGlmIChzdmdFbCkge1xuICAgICAgbGV0IHdpZHRoID0gc3ZnLndpZHRoKCkgKiB6b29tVmFsdWVcbiAgICAgIGxldCBoZWlnaHQgPSBzdmcuaGVpZ2h0KCkgKiB6b29tVmFsdWVcblxuICAgICAgY29uc3QgZmFjdG9yID0gc3ZnLmRhdGEoJ2ZhY3RvcicpXG4gICAgICBpZiAoZmFjdG9yKSB7XG4gICAgICAgIHdpZHRoIC89IGZhY3RvclxuICAgICAgICBoZWlnaHQgLz0gZmFjdG9yXG4gICAgICB9XG5cbiAgICAgIGlmICghc3ZnRWwuZ2V0QXR0cmlidXRlKCd2aWV3Qm94JykpIHtcbiAgICAgICAgc3ZnWzBdLnNldEF0dHJpYnV0ZSgndmlld0JveCcsIGAwIDAgJHtzdmcud2lkdGgoKX0gJHtzdmcuaGVpZ2h0KCl9YClcbiAgICAgIH1cblxuICAgICAgc3ZnXG4gICAgICAgIC53aWR0aCh3aWR0aClcbiAgICAgICAgLmhlaWdodChoZWlnaHQpXG4gICAgICAgIC5kYXRhKCdmYWN0b3InLCB6b29tVmFsdWUpXG5cbiAgICAgIHRoaXMuem9vbVZhbHVlID0gem9vbVZhbHVlXG4gICAgICB0aGlzLnJlc2V0Wm9vbUJ1dHRvbi50ZXh0KGAke01hdGgucm91bmQoem9vbVZhbHVlICogMTAwKX0lYClcbiAgICB9XG4gIH1cblxuICBjb25maWcgKGtleSkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoYHN2Zy1wcmV2aWV3LiR7a2V5fWApXG4gIH1cblxuICBoYW5kbGVFdmVudHMgKCkge1xuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKFxuICAgICAgYXRvbS5ncmFtbWFycy5vbkRpZEFkZEdyYW1tYXIoZGVib3VuY2UoKCkgPT4gdGhpcy5yZW5kZXJTdmcoKSwgMjUwKSksXG4gICAgICBhdG9tLmdyYW1tYXJzLm9uRGlkVXBkYXRlR3JhbW1hcihkZWJvdW5jZSgoKSA9PiB0aGlzLnJlbmRlclN2ZygpLCAyNTApKVxuICAgIClcblxuICAgIGF0b20uY29tbWFuZHMuYWRkKHRoaXMuZWxlbWVudCwge1xuICAgICAgJ2NvcmU6bW92ZS11cCc6ICgpID0+IHRoaXMuc2Nyb2xsVXAoKSxcbiAgICAgICdjb3JlOm1vdmUtZG93bic6ICgpID0+IHRoaXMuc2Nyb2xsRG93bigpLFxuICAgICAgJ3N2Zy1wcmV2aWV3Onpvb20taW4nOiAoKSA9PiB0aGlzLnpvb20oMC4xKSxcbiAgICAgICdzdmctcHJldmlldzp6b29tLW91dCc6ICgpID0+IHRoaXMuem9vbSgtMC4xKSxcbiAgICAgICdzdmctcHJldmlldzpyZXNldC16b29tJzogKCkgPT4gdGhpcy56b29tUmVzZXQoKSxcbiAgICAgICdzdmctcHJldmlldzpleHBvcnQtdG8tcG5nJzogKGV2ZW50KSA9PiB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgIHRoaXMuZXhwb3J0VG8oJ3BuZycpXG4gICAgICB9LFxuICAgICAgJ3N2Zy1wcmV2aWV3OmV4cG9ydC10by1qcGVnJzogKGV2ZW50KSA9PiB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgIHRoaXMuZXhwb3J0VG8oJ2pwZWcnKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpZiAodGhpcy5maWxlKSB7XG4gICAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChcbiAgICAgICAgdGhpcy5maWxlLm9uRGlkQ2hhbmdlKCgpID0+IHRoaXMuY2hhbmdlSGFuZGxlcigpKVxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAodGhpcy5lZGl0b3IpIHtcbiAgICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuZWRpdG9yLmdldEJ1ZmZlcigpXG5cbiAgICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKFxuICAgICAgICBidWZmZXIub25EaWRTYXZlKCgpID0+IHRoaXMuY2hhbmdlSGFuZGxlcihmYWxzZSkpLFxuICAgICAgICBidWZmZXIub25EaWRSZWxvYWQoKCkgPT4gdGhpcy5jaGFuZ2VIYW5kbGVyKGZhbHNlKSksXG4gICAgICAgIGJ1ZmZlci5vbkRpZFN0b3BDaGFuZ2luZygoKSA9PiB0aGlzLmNoYW5nZUhhbmRsZXIodHJ1ZSkpLFxuICAgICAgICB0aGlzLmVkaXRvci5vbkRpZENoYW5nZVBhdGgoKCkgPT4gdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtdGl0bGUnKSlcbiAgICAgIClcbiAgICB9XG4gIH1cblxuICBjaGFuZ2VIYW5kbGVyIChpZkxpdmVVcGRhdGUgPSBudWxsKSB7XG4gICAgaWYgKGlmTGl2ZVVwZGF0ZSA9PT0gIXRoaXMuY29uZmlnKCdsaXZlVXBkYXRlJykpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMucmVuZGVyU3ZnKClcblxuICAgIGNvbnN0IHBhbmUgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9ySXRlbSh0aGlzKVxuICAgIGlmIChwYW5lICYmIHBhbmUgIT09IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKSkge1xuICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0odGhpcylcbiAgICB9XG4gIH1cblxuICByZW5kZXJTdmcgKCkge1xuICAgIHJldHVybiB0aGlzLmdldFN2Z1NvdXJjZSgpXG4gICAgICAudGhlbigoc291cmNlKSA9PiB0aGlzLnJlbmRlclN2Z1RleHQoc291cmNlKSlcbiAgfVxuXG4gIGdldFN2Z1NvdXJjZSAoKSB7XG4gICAgaWYgKHRoaXMuZmlsZSkge1xuICAgICAgcmV0dXJuIHRoaXMuZmlsZS5yZWFkKClcbiAgICB9IGVsc2UgaWYgKHRoaXMuZWRpdG9yKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuZWRpdG9yLmdldFRleHQoKSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlclN2Z1RleHQgKHRleHQpIHtcbiAgICBpZiAoIXRleHQpIHsgcmV0dXJuIH1cblxuICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoLzxzdmc6L2csICc8JylcblxuICAgIGNvbnN0IHNjcm9sbFRvcCA9IHRoaXMuY2FudmFzLnNjcm9sbFRvcCgpXG4gICAgY29uc3Qgc2Nyb2xsTGVmdCA9IHRoaXMuY2FudmFzLnNjcm9sbExlZnQoKVxuXG4gICAgdGhpcy5jYW52YXMuaHRtbCh0ZXh0KVxuXG4gICAgY29uc3Qgc3ZnID0gdGhpcy5jYW52YXMuZmluZCgnc3ZnJylcbiAgICBpZiAoc3ZnLmdldCgwKSkge1xuICAgICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSBnZXRTVkdTaXplKHN2Zy5nZXQoMCkpXG4gICAgICBzdmcud2lkdGgod2lkdGgpXG4gICAgICBzdmcuaGVpZ2h0KGhlaWdodClcblxuICAgICAgdGhpcy56b29tVG8odGhpcy56b29tVmFsdWUpXG5cbiAgICAgIHRoaXMuY2FudmFzLnNjcm9sbFRvcChzY3JvbGxUb3ApXG4gICAgICB0aGlzLmNhbnZhcy5zY3JvbGxMZWZ0KHNjcm9sbExlZnQpXG4gICAgfVxuXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2Utc3ZnJylcbiAgICB0aGlzLm9yaWdpbmFsVHJpZ2dlcignc3ZnLXByZXZpZXc6c3ZnLWNoYW5nZWQnKVxuICB9XG5cbiAgZ2V0VGl0bGUgKCkge1xuICAgIGxldCB0aXRsZSA9ICdTVkcnXG4gICAgaWYgKHRoaXMuZmlsZSkge1xuICAgICAgdGl0bGUgPSBwYXRoLmJhc2VuYW1lKHRoaXMuZ2V0UGF0aCgpKVxuICAgIH0gZWxzZSBpZiAodGhpcy5lZGl0b3IpIHtcbiAgICAgIHRpdGxlID0gdGhpcy5lZGl0b3IuZ2V0VGl0bGUoKVxuICAgIH1cblxuICAgIHJldHVybiBgJHt0aXRsZX0gUHJldmlld2BcbiAgfVxuXG4gIGdldEljb25OYW1lICgpIHtcbiAgICByZXR1cm4gJ3N2ZydcbiAgfVxuXG4gIGdldFVSSSAoKSB7XG4gICAgaWYgKHRoaXMuZmlsZSkge1xuICAgICAgcmV0dXJuIGBzdmctcHJldmlldzovLyR7dGhpcy5nZXRQYXRoKCl9YFxuICAgIH1cbiAgICByZXR1cm4gYHN2Zy1wcmV2aWV3Oi8vZWRpdG9yLyR7dGhpcy5lZGl0b3JJZH1gXG4gIH1cblxuICBnZXRQYXRoICgpIHtcbiAgICBpZiAodGhpcy5maWxlKSB7XG4gICAgICByZXR1cm4gdGhpcy5maWxlLmdldFBhdGgoKVxuICAgIH0gZWxzZSBpZiAodGhpcy5lZGl0b3IpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci5nZXRQYXRoKClcbiAgICB9XG4gIH1cblxuICBnZXRHcmFtbWFyICgpIHtcbiAgICBpZiAodGhpcy5lZGl0b3IpIHtcbiAgICAgIHJldHVybiB0aGlzLmVkaXRvci5nZXRHcmFtbWFyKClcbiAgICB9XG4gIH1cblxuICBzaG93RXJyb3IgKHJlc3VsdCkge1xuICAgIGNvbnN0IHsgbWVzc2FnZSB9ID0gcmVzdWx0IHx8IHt9XG5cbiAgICB0aGlzLmNhbnZhcy5odG1sKCQkJChmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmgyKCdQcmV2aWV3aW5nIFNWRyBGYWlsZWQnKVxuICAgICAgaWYgKG1lc3NhZ2UpIHtcbiAgICAgICAgdGhpcy5oMyhtZXNzYWdlKVxuICAgICAgfVxuICAgIH0pKVxuICB9XG5cbiAgc2hvd0xvYWRpbmcgKCkge1xuICAgIHRoaXMuY2FudmFzLmh0bWwoJCQkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuZGl2KHsgY2xhc3M6ICdzdmctc3Bpbm5lcicgfSwgJ0xvYWRpbmcgU1ZHXFx1MjAyNicpXG4gICAgfSkpXG4gIH1cblxuICBpc0VxdWFsIChvdGhlcikge1xuICAgIHJldHVybiBvdGhlciAmJiB0aGlzWzBdID09PSBvdGhlclswXSAvLyBDb21wYXJlIERPTSBlbGVtZW50c1xuICB9XG5cbiAgY2hhbmdlQmFja2dyb3VuZCAoY29sb3IpIHtcbiAgICB0aGlzLmF0dHIoJ2JhY2tncm91bmQnLCBjb2xvcilcbiAgfVxuXG4gIGV4cG9ydFRvIChvdXRwdXRUeXBlKSB7XG4gICAgbGV0IGZpbGVQYXRoLCBvdXRwdXRGaWxlUGF0aCwgcHJvamVjdFBhdGhcbiAgICBpZiAodGhpcy5sb2FkaW5nKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBmaWxlUGF0aCA9IHRoaXMuZ2V0UGF0aCgpXG5cbiAgICBpZiAoZmlsZVBhdGgpIHtcbiAgICAgIGZpbGVQYXRoID0gcGF0aC5qb2luKFxuICAgICAgICBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpLFxuICAgICAgICBwYXRoLmJhc2VuYW1lKFxuICAgICAgICAgIGZpbGVQYXRoLFxuICAgICAgICAgIHBhdGguZXh0bmFtZShmaWxlUGF0aClcbiAgICAgICAgKVxuICAgICAgKS5jb25jYXQoYC4ke291dHB1dFR5cGV9YClcbiAgICB9IGVsc2Uge1xuICAgICAgZmlsZVBhdGggPSBgdW50aXRsZWQuJHtvdXRwdXRUeXBlfWBcbiAgICAgIHByb2plY3RQYXRoID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF1cbiAgICAgIGlmIChwcm9qZWN0UGF0aCkge1xuICAgICAgICBmaWxlUGF0aCA9IHBhdGguam9pbihwcm9qZWN0UGF0aCwgZmlsZVBhdGgpXG4gICAgICB9XG4gICAgfVxuXG4gICAgb3V0cHV0RmlsZVBhdGggPSBhdG9tLnNob3dTYXZlRGlhbG9nU3luYyhmaWxlUGF0aClcbiAgICBpZiAob3V0cHV0RmlsZVBhdGgpIHtcbiAgICAgIGlmIChzdmdUb1Jhc3RlciA9PSBudWxsKSB7XG4gICAgICAgIHN2Z1RvUmFzdGVyID0gcmVxdWlyZSgnLi9zdmctdG8tcmFzdGVyJylcbiAgICAgIH1cbiAgICAgIGlmIChmcyA9PSBudWxsKSB7XG4gICAgICAgIGZzID0gcmVxdWlyZSgnZnMtcGx1cycpXG4gICAgICB9XG4gICAgICB0aGlzLmdldFN2Z1NvdXJjZSgpLnRoZW4oKHNvdXJjZSkgPT4ge1xuICAgICAgICBzdmdUb1Jhc3Rlci50cmFuc2Zvcm0oc291cmNlLCBvdXRwdXRUeXBlLCAocmVzdWx0KSA9PiB7XG4gICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhvdXRwdXRGaWxlUGF0aCwgcmVzdWx0KVxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4ob3V0cHV0RmlsZVBhdGgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cbiAgfVxufVxuXG5hdG9tLmRlc2VyaWFsaXplcnMuYWRkKFN2Z1ByZXZpZXdWaWV3KVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN2Z1ByZXZpZXdWaWV3XG4iXX0=