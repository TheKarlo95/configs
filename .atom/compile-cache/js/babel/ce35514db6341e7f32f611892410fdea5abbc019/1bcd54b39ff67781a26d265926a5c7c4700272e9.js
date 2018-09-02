Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

/* eslint class-methods-use-this: ["error", {
  "exceptMethods": ["getFilterKey", "elementForItem", "didChangeSelection", "didLoseFocus"]
}] */

var _atom = require('atom');

var _atomSelectList = require('atom-select-list');

var _atomSelectList2 = _interopRequireDefault(_atomSelectList);

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

function DefinitionsListView(props) {
  var _this = this;

  this.props = props;
  this.computeItems(false);
  this.disposables = new _atom.CompositeDisposable();
  _etch2['default'].initialize(this);
  this.element.classList.add('select-list');
  this.disposables.add(this.refs.queryEditor.onDidChange(this.didChangeQuery.bind(this)));
  if (!props.skipCommandsRegistration) {
    this.disposables.add(this.registerAtomCommands());
  }
  this.disposables.add(new _atom.Disposable(function () {
    _this.unbindBlur();
  }));
}

DefinitionsListView.prototype = _atomSelectList2['default'].prototype;

DefinitionsListView.prototype.bindBlur = function bindBlur() {
  var editorElement = this.refs.queryEditor.element;
  var didLoseFocus = this.didLoseFocus.bind(this);
  editorElement.addEventListener('blur', didLoseFocus);
};

DefinitionsListView.prototype.unbindBlur = function unbindBlur() {
  var editorElement = this.refs.queryEditor.element;
  var didLoseFocus = this.didLoseFocus.bind(this);
  editorElement.removeEventListener('blur', didLoseFocus);
};

var DefinitionsView = (function () {
  function DefinitionsView() {
    var emptyMessage = arguments.length <= 0 || arguments[0] === undefined ? 'No definition found' : arguments[0];
    var maxResults = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    _classCallCheck(this, DefinitionsView);

    this.selectListView = new DefinitionsListView({
      maxResults: maxResults,
      emptyMessage: emptyMessage,
      items: [],
      filterKeyForItem: function filterKeyForItem(item) {
        return item.fileName;
      },
      elementForItem: this.elementForItem.bind(this),
      didConfirmSelection: this.didConfirmSelection.bind(this),
      didConfirmEmptySelection: this.didConfirmEmptySelection.bind(this),
      didCancelSelection: this.didCancelSelection.bind(this)
    });
    this.element = this.selectListView.element;
    this.element.classList.add('symbols-view');
    this.panel = atom.workspace.addModalPanel({ item: this, visible: false });
    this.items = [];

    this.setState('ready');
    setTimeout(this.show.bind(this), 300);
  }

  _createClass(DefinitionsView, [{
    key: 'setState',
    value: function setState(state) {
      if (state === 'ready' && !this.state) {
        this.state = 'ready';
        return null;
      }
      if (state === 'loding' && ['ready', 'loding'].includes(this.state)) {
        this.state = 'loding';
        return null;
      }
      if (state === 'cancelled' && ['ready', 'loding'].includes(this.state)) {
        this.state = 'cancelled';
        return null;
      }
      throw new Error('state switch error');
    }
  }, {
    key: 'getFilterKey',
    value: function getFilterKey() {
      return 'fileName';
    }
  }, {
    key: 'elementForItem',
    value: function elementForItem(_ref) {
      var fileName = _ref.fileName;
      var text = _ref.text;
      var line = _ref.line;

      var relativePath = atom.project.relativizePath(fileName)[1];

      var li = document.createElement('li');
      li.classList.add('two-lines');

      var primaryLine = document.createElement('div');
      primaryLine.classList.add('primary-line');
      primaryLine.textContent = text;
      li.appendChild(primaryLine);

      var secondaryLine = document.createElement('div');
      secondaryLine.classList.add('secondary-line');
      secondaryLine.textContent = relativePath + ', line ' + (line + 1);
      li.appendChild(secondaryLine);

      return li;
    }
  }, {
    key: 'addItems',
    value: function addItems(items) {
      var _items;

      if (!['ready', 'loding'].includes(this.state)) {
        return null;
      }
      this.setState('loding');

      (_items = this.items).push.apply(_items, _toConsumableArray(items));
      this.items.filter(function (v, i, a) {
        return a.indexOf(v) === i;
      });

      this.selectListView.update({ items: this.items });
      return null;
    }
  }, {
    key: 'confirmedFirst',
    value: function confirmedFirst() {
      if (this.items.length > 0) {
        this.didConfirmSelection(this.items[0]);
      }
    }
  }, {
    key: 'show',
    value: function show() {
      if (['ready', 'loding'].includes(this.state) && !this.panel.visible) {
        this.previouslyFocusedElement = document.activeElement;
        this.panel.show();
        this.selectListView.reset();
        this.selectListView.focus();
        this.selectListView.bindBlur();
      }
    }
  }, {
    key: 'cancel',
    value: _asyncToGenerator(function* () {
      if (['ready', 'loding'].includes(this.state)) {
        if (!this.isCanceling) {
          this.setState('cancelled');
          this.selectListView.unbindBlur();
          this.isCanceling = true;
          yield this.selectListView.update({ items: [] });
          this.panel.hide();
          if (this.previouslyFocusedElement) {
            this.previouslyFocusedElement.focus();
            this.previouslyFocusedElement = null;
          }
          this.isCanceling = false;
        }
      }
    })
  }, {
    key: 'didCancelSelection',
    value: function didCancelSelection() {
      this.cancel();
    }
  }, {
    key: 'didConfirmEmptySelection',
    value: function didConfirmEmptySelection() {
      this.cancel();
    }
  }, {
    key: 'didConfirmSelection',
    value: _asyncToGenerator(function* (_ref2) {
      var fileName = _ref2.fileName;
      var line = _ref2.line;
      var column = _ref2.column;

      if (this.state !== 'loding') {
        return null;
      }
      var promise = atom.workspace.open(fileName);
      yield promise.then(function (editor) {
        editor.setCursorBufferPosition([line, column]);
        editor.scrollToCursorPosition();
      });
      yield this.cancel();
      return null;
    })
  }, {
    key: 'destroy',
    value: _asyncToGenerator(function* () {
      yield this.cancel();
      this.panel.destroy();
      this.selectListView.destroy();
      return null;
    })
  }]);

  return DefinitionsView;
})();

exports['default'] = DefinitionsView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvZ290by1kZWZpbml0aW9uL2xpYi9kZWZpbml0aW9ucy12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQU1nRCxNQUFNOzs4QkFDM0Isa0JBQWtCOzs7O29CQUM1QixNQUFNOzs7O0FBRXZCLFNBQVMsbUJBQW1CLENBQUMsS0FBSyxFQUFFOzs7QUFDbEMsTUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbkIsTUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6QixNQUFJLENBQUMsV0FBVyxHQUFHLCtCQUF5QixDQUFDO0FBQzdDLG9CQUFLLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0QixNQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDMUMsTUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4RixNQUFJLENBQUMsS0FBSyxDQUFDLHdCQUF3QixFQUFFO0FBQ25DLFFBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUM7R0FDbkQ7QUFDRCxNQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxxQkFBZSxZQUFNO0FBQUUsVUFBSyxVQUFVLEVBQUUsQ0FBQztHQUFFLENBQUMsQ0FBQyxDQUFDO0NBQ3BFOztBQUVELG1CQUFtQixDQUFDLFNBQVMsR0FBRyw0QkFBZSxTQUFTLENBQUM7O0FBRXpELG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsU0FBUyxRQUFRLEdBQUc7QUFDM0QsTUFBTSxhQUFhLEdBQUcsSUFBSSxD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TSxDQUFDLHVCQUF1QixDQUFDLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDL0MsY0FBTSxDQUFDLHNCQUFzQixFQUFFLENBQUM7T0FDakMsQ0FBQyxDQUFDO0FBQ0gsWUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDcEIsYUFBTyxJQUFJLENBQUM7S0FDYjs7OzZCQUVZLGFBQUc7QUFDZCxZQUFNLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNwQixVQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3JCLFVBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDOUIsYUFBTyxJQUFJLENBQUM7S0FDYjs7O1NBcElrQixlQUFlOzs7cUJBQWYsZUFBZSIsImZpbGUiOiIvaG9tZS90aGVrYXJsbzk1Ly5hdG9tL3BhY2thZ2VzL2dvdG8tZGVmaW5pdGlvbi9saWIvZGVmaW5pdGlvbnMtdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuLyogZXNsaW50IGNsYXNzLW1ldGhvZHMtdXNlLXRoaXM6IFtcImVycm9yXCIsIHtcbiAgXCJleGNlcHRNZXRob2RzXCI6IFtcImdldEZpbHRlcktleVwiLCBcImVsZW1lbnRGb3JJdGVtXCIsIFwiZGlkQ2hhbmdlU2VsZWN0aW9uXCIsIFwiZGlkTG9zZUZvY3VzXCJdXG59XSAqL1xuXG5pbXBvcnQgeyBEaXNwb3NhYmxlLCBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgU2VsZWN0TGlzdFZpZXcgZnJvbSAnYXRvbS1zZWxlY3QtbGlzdCc7XG5pbXBvcnQgZXRjaCBmcm9tICdldGNoJztcblxuZnVuY3Rpb24gRGVmaW5pdGlvbnNMaXN0Vmlldyhwcm9wcykge1xuICB0aGlzLnByb3BzID0gcHJvcHM7XG4gIHRoaXMuY29tcHV0ZUl0ZW1zKGZhbHNlKTtcbiAgdGhpcy5kaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gIGV0Y2guaW5pdGlhbGl6ZSh0aGlzKTtcbiAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3NlbGVjdC1saXN0Jyk7XG4gIHRoaXMuZGlzcG9zYWJsZXMuYWRkKHRoaXMucmVmcy5xdWVyeUVkaXRvci5vbkRpZENoYW5nZSh0aGlzLmRpZENoYW5nZVF1ZXJ5LmJpbmQodGhpcykpKTtcbiAgaWYgKCFwcm9wcy5za2lwQ29tbWFuZHNSZWdpc3RyYXRpb24pIHtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZCh0aGlzLnJlZ2lzdGVyQXRvbUNvbW1hbmRzKCkpO1xuICB9XG4gIHRoaXMuZGlzcG9zYWJsZXMuYWRkKG5ldyBEaXNwb3NhYmxlKCgpID0+IHsgdGhpcy51bmJpbmRCbHVyKCk7IH0pKTtcbn1cblxuRGVmaW5pdGlvbnNMaXN0Vmlldy5wcm90b3R5cGUgPSBTZWxlY3RMaXN0Vmlldy5wcm90b3R5cGU7XG5cbkRlZmluaXRpb25zTGlzdFZpZXcucHJvdG90eXBlLmJpbmRCbHVyID0gZnVuY3Rpb24gYmluZEJsdXIoKSB7XG4gIGNvbnN0IGVkaXRvckVsZW1lbnQgPSB0aGlzLnJlZnMucXVlcnlFZGl0b3IuZWxlbWVudDtcbiAgY29uc3QgZGlkTG9zZUZvY3VzID0gdGhpcy5kaWRMb3NlRm9jdXMuYmluZCh0aGlzKTtcbiAgZWRpdG9yRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgZGlkTG9zZUZvY3VzKTtcbn07XG5cbkRlZmluaXRpb25zTGlzdFZpZXcucHJvdG90eXBlLnVuYmluZEJsdXIgPSBmdW5jdGlvbiB1bmJpbmRCbHVyKCkge1xuICBjb25zdCBlZGl0b3JFbGVtZW50ID0gdGhpcy5yZWZzLnF1ZXJ5RWRpdG9yLmVsZW1lbnQ7XG4gIGNvbnN0IGRpZExvc2VGb2N1cyA9IHRoaXMuZGlkTG9zZUZvY3VzLmJpbmQodGhpcyk7XG4gIGVkaXRvckVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmx1cicsIGRpZExvc2VGb2N1cyk7XG59O1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERlZmluaXRpb25zVmlldyB7XG4gIGNvbnN0cnVjdG9yKGVtcHR5TWVzc2FnZSA9ICdObyBkZWZpbml0aW9uIGZvdW5kJywgbWF4UmVzdWx0cyA9IG51bGwpIHtcbiAgICB0aGlzLnNlbGVjdExpc3RWaWV3ID0gbmV3IERlZmluaXRpb25zTGlzdFZpZXcoe1xuICAgICAgbWF4UmVzdWx0cyxcbiAgICAgIGVtcHR5TWVzc2FnZSxcbiAgICAgIGl0ZW1zOiBbXSxcbiAgICAgIGZpbHRlcktleUZvckl0ZW06IGl0ZW0gPT4gaXRlbS5maWxlTmFtZSxcbiAgICAgIGVsZW1lbnRGb3JJdGVtOiB0aGlzLmVsZW1lbnRGb3JJdGVtLmJpbmQodGhpcyksXG4gICAgICBkaWRDb25maXJtU2VsZWN0aW9uOiB0aGlzLmRpZENvbmZpcm1TZWxlY3Rpb24uYmluZCh0aGlzKSxcbiAgICAgIGRpZENvbmZpcm1FbXB0eVNlbGVjdGlvbjogdGhpcy5kaWRDb25maXJtRW1wdHlTZWxlY3Rpb24uYmluZCh0aGlzKSxcbiAgICAgIGRpZENhbmNlbFNlbGVjdGlvbjogdGhpcy5kaWRDYW5jZWxTZWxlY3Rpb24uYmluZCh0aGlzKSxcbiAgICB9KTtcbiAgICB0aGlzLmVsZW1lbnQgPSB0aGlzLnNlbGVjdExpc3RWaWV3LmVsZW1lbnQ7XG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3N5bWJvbHMtdmlldycpO1xuICAgIHRoaXMucGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKHsgaXRlbTogdGhpcywgdmlzaWJsZTogZmFsc2UgfSk7XG4gICAgdGhpcy5pdGVtcyA9IFtdO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSgncmVhZHknKTtcbiAgICBzZXRUaW1lb3V0KHRoaXMuc2hvdy5iaW5kKHRoaXMpLCAzMDApO1xuICB9XG5cbiAgc2V0U3RhdGUoc3RhdGUpIHtcbiAgICBpZiAoc3RhdGUgPT09ICdyZWFkeScgJiYgIXRoaXMuc3RhdGUpIHtcbiAgICAgIHRoaXMuc3RhdGUgPSAncmVhZHknO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChzdGF0ZSA9PT0gJ2xvZGluZycgJiYgWydyZWFkeScsICdsb2RpbmcnXS5pbmNsdWRlcyh0aGlzLnN0YXRlKSkge1xuICAgICAgdGhpcy5zdGF0ZSA9ICdsb2RpbmcnO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChzdGF0ZSA9PT0gJ2NhbmNlbGxlZCcgJiYgWydyZWFkeScsICdsb2RpbmcnXS5pbmNsdWRlcyh0aGlzLnN0YXRlKSkge1xuICAgICAgdGhpcy5zdGF0ZSA9ICdjYW5jZWxsZWQnO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcignc3RhdGUgc3dpdGNoIGVycm9yJyk7XG4gIH1cblxuICBnZXRGaWx0ZXJLZXkoKSB7XG4gICAgcmV0dXJuICdmaWxlTmFtZSc7XG4gIH1cblxuICBlbGVtZW50Rm9ySXRlbSh7IGZpbGVOYW1lLCB0ZXh0LCBsaW5lIH0pIHtcbiAgICBjb25zdCByZWxhdGl2ZVBhdGggPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZmlsZU5hbWUpWzFdO1xuXG4gICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgIGxpLmNsYXNzTGlzdC5hZGQoJ3R3by1saW5lcycpO1xuXG4gICAgY29uc3QgcHJpbWFyeUxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwcmltYXJ5TGluZS5jbGFzc0xpc3QuYWRkKCdwcmltYXJ5LWxpbmUnKTtcbiAgICBwcmltYXJ5TGluZS50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgbGkuYXBwZW5kQ2hpbGQocHJpbWFyeUxpbmUpO1xuXG4gICAgY29uc3Qgc2Vjb25kYXJ5TGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHNlY29uZGFyeUxpbmUuY2xhc3NMaXN0LmFkZCgnc2Vjb25kYXJ5LWxpbmUnKTtcbiAgICBzZWNvbmRhcnlMaW5lLnRleHRDb250ZW50ID0gYCR7cmVsYXRpdmVQYXRofSwgbGluZSAke2xpbmUgKyAxfWA7XG4gICAgbGkuYXBwZW5kQ2hpbGQoc2Vjb25kYXJ5TGluZSk7XG5cbiAgICByZXR1cm4gbGk7XG4gIH1cblxuICBhZGRJdGVtcyhpdGVtcykge1xuICAgIGlmICghWydyZWFkeScsICdsb2RpbmcnXS5pbmNsdWRlcyh0aGlzLnN0YXRlKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoJ2xvZGluZycpO1xuXG4gICAgdGhpcy5pdGVtcy5wdXNoKC4uLml0ZW1zKTtcbiAgICB0aGlzLml0ZW1zLmZpbHRlcigodiwgaSwgYSkgPT4gYS5pbmRleE9mKHYpID09PSBpKTtcblxuICAgIHRoaXMuc2VsZWN0TGlzdFZpZXcudXBkYXRlKHsgaXRlbXM6IHRoaXMuaXRlbXMgfSk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25maXJtZWRGaXJzdCgpIHtcbiAgICBpZiAodGhpcy5pdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLmRpZENvbmZpcm1TZWxlY3Rpb24odGhpcy5pdGVtc1swXSk7XG4gICAgfVxuICB9XG5cbiAgc2hvdygpIHtcbiAgICBpZiAoWydyZWFkeScsICdsb2RpbmcnXS5pbmNsdWRlcyh0aGlzLnN0YXRlKSAmJiAhdGhpcy5wYW5lbC52aXNpYmxlKSB7XG4gICAgICB0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgICB0aGlzLnBhbmVsLnNob3coKTtcbiAgICAgIHRoaXMuc2VsZWN0TGlzdFZpZXcucmVzZXQoKTtcbiAgICAgIHRoaXMuc2VsZWN0TGlzdFZpZXcuZm9jdXMoKTtcbiAgICAgIHRoaXMuc2VsZWN0TGlzdFZpZXcuYmluZEJsdXIoKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBjYW5jZWwoKSB7XG4gICAgaWYgKFsncmVhZHknLCAnbG9kaW5nJ10uaW5jbHVkZXModGhpcy5zdGF0ZSkpIHtcbiAgICAgIGlmICghdGhpcy5pc0NhbmNlbGluZykge1xuICAgICAgICB0aGlzLnNldFN0YXRlKCdjYW5jZWxsZWQnKTtcbiAgICAgICAgdGhpcy5zZWxlY3RMaXN0Vmlldy51bmJpbmRCbHVyKCk7XG4gICAgICAgIHRoaXMuaXNDYW5jZWxpbmcgPSB0cnVlO1xuICAgICAgICBhd2FpdCB0aGlzLnNlbGVjdExpc3RWaWV3LnVwZGF0ZSh7IGl0ZW1zOiBbXSB9KTtcbiAgICAgICAgdGhpcy5wYW5lbC5oaWRlKCk7XG4gICAgICAgIGlmICh0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCkge1xuICAgICAgICAgIHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgdGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXNDYW5jZWxpbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkaWRDYW5jZWxTZWxlY3Rpb24oKSB7XG4gICAgdGhpcy5jYW5jZWwoKTtcbiAgfVxuXG4gIGRpZENvbmZpcm1FbXB0eVNlbGVjdGlvbigpIHtcbiAgICB0aGlzLmNhbmNlbCgpO1xuICB9XG5cbiAgYXN5bmMgZGlkQ29uZmlybVNlbGVjdGlvbih7IGZpbGVOYW1lLCBsaW5lLCBjb2x1bW4gfSkge1xuICAgIGlmICh0aGlzLnN0YXRlICE9PSAnbG9kaW5nJykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHByb21pc2UgPSBhdG9tLndvcmtzcGFjZS5vcGVuKGZpbGVOYW1lKTtcbiAgICBhd2FpdCBwcm9taXNlLnRoZW4oKGVkaXRvcikgPT4ge1xuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFtsaW5lLCBjb2x1bW5dKTtcbiAgICAgIGVkaXRvci5zY3JvbGxUb0N1cnNvclBvc2l0aW9uKCk7XG4gICAgfSk7XG4gICAgYXdhaXQgdGhpcy5jYW5jZWwoKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGFzeW5jIGRlc3Ryb3koKSB7XG4gICAgYXdhaXQgdGhpcy5jYW5jZWwoKTtcbiAgICB0aGlzLnBhbmVsLmRlc3Ryb3koKTtcbiAgICB0aGlzLnNlbGVjdExpc3RWaWV3LmRlc3Ryb3koKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuIl19