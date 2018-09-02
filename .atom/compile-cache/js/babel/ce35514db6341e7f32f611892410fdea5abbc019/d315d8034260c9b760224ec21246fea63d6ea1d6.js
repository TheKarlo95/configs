Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @jsx etch.dom */

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _logic = require('./logic');

var _logic2 = _interopRequireDefault(_logic);

var _touch = require('touch');

var _touch2 = _interopRequireDefault(_touch);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

'use babel';
var HtmlTemplateGeneratorView = (function () {
  function HtmlTemplateGeneratorView(serializedState) {
    _classCallCheck(this, HtmlTemplateGeneratorView);

    this.generateTemplate = this.generateTemplate.bind(this);
    this.appendData = this.appendData.bind(this);
    this.hidePane = this.hidePane.bind(this);
    this.modalPanel = null;
    this.fields = null;
    this.classes = ['.Title', '.Script', '.Link'];
    _etch2['default'].initialize(this);
  }

  _createClass(HtmlTemplateGeneratorView, [{
    key: 'displayForm',
    value: function displayForm(modal) {
      if (modal.isVisible()) modal.hide();else {
        this.resetValues();
        this.createFields(); // Appropriate place to put it since displayForm is called to generate template!
        modal.show();
      }
      this.update({ modal: modal });
    }
  }, {
    key: 'createFormField',
    value: function createFormField(innerText) {
      var inputLabel = innerText[0];
      var className = 'input-wrapper ' + inputLabel;
      innerText = innerText.map(function (element) {
        var placeholder = '' + element;
        return _etch2['default'].dom('input', { className: 'native-key-bindings', type: 'text', placeholder: placeholder });
      });

      innerText.splice(0, 1);
      return _etch2['default'].dom(
        'div',
        null,
        _etch2['default'].dom(
          'span',
          null,
          ' ',
          inputLabel,
          ' '
        ),
        _etch2['default'].dom(
          'div',
          { className: className },
          innerText
        )
      );
    }
  }, {
    key: 'createFields',
    value: function createFields() {
      var formFields = [];
      var elementData = [['Title', 'title'], ['Script', 'src', 'type'], ['Link', 'rel', 'type', 'title', 'href']];
      for (var i = 0; i < 3; i++) {
        formFields.push(this.createFormField(elementData[i]));
      }this.fields = formFields;
    }

    // Returns an object that can be retrieved when package is activated
  }, {
    key: 'serialize',
    value: function serialize() {}

    // Tear down any state and detach
  }, {
    key: 'destroy',
    value: function destroy() {
      this.modalPanel.destroy();
      this.fields = null;
      this.classes = null;
    }
  }, {
    key: 'extractValues',
    value: function extractValues(tag, className) {
      var extractedValues = [];
      var elementFormFields = Array.from(document.querySelector(className).children);
      Object.keys(tag).forEach(function (key, index) {
        tag[key] = elementFormFields[index].value;
      });
      extractedValues.push(tag);
      return extractedValues;
    }
  }, {
    key: 'resetValues',
    value: function resetValues() {
      var classNames = this.classes;
      classNames.forEach(function (className) {
        if (document.querySelector(className)) {
          var formFields = Array.from(document.querySelector(className).children);
          //  formFields.splice(0,1)
          formFields.forEach(function (field) {
            return field.value = '';
          });
        }
      });
    }
  }, {
    key: 'update',
    value: function update(props) {
      this.modalPanel = props.modal;
      document.querySelector('.close_button').onclick = this.hidePane;
      document.querySelector('.generate_button').onclick = this.generateTemplate;
      return _etch2['default'].update(this);
    }
  }, {
    key: 'generateTemplate',
    value: function generateTemplate() {

      console.log('Generating template');
      var classNames = this.classes;
      var scriptObject = { src: '', type: '' };
      var linkObject = { rel: '', type: '', title: '', href: '' };
      this.hidePane();

      var titleField = Array.from(document.querySelector(classNames[0]).children)[0].value;
      var userInput = [titleField, this.extractValues(scriptObject, classNames[1]), this.extractValues(linkObject, classNames[2])];
      var editor = atom.workspace.getActiveTextEditor();
      console.log('User input is', userInput);
      console.clear();
      if (editor) {
        editor.insertText((0, _logic2['default'])(userInput));
        atom.notifications.addSuccess('Template generated successfully');
      } else {
        atom.notifications.addError('No active text editor found');
      }
      //       atom.notifications.addSuccess('Template generated successfully')
    }
  }, {
    key: 'appendData',
    value: function appendData(filePath, html) {

      _fs2['default'].appendFile(filePath, html, function (error) {
        if (error) atom.notifications.addError('Unable to access file.Try again');else {
          console.log('data append done');
          atom.notifications.addSuccess('Template generated successfully');
        }
      });
    }
  }, {
    key: 'generateQuickTemplate',
    value: function generateQuickTemplate(modalPanel) {
      var _this = this;

      console.log('Generating Quick template');
      if (modalPanel.isVisible()) modalPanel.hide();
      var DEFAULT_SCRIPT_INPUT = [{ src: '', type: '' }];
      var DEFAULT_LINK_INPUT = [{ rel: '', type: '', title: '', href: '' }];
      var DEFAULT_USER_INPUT = ['', DEFAULT_SCRIPT_INPUT, DEFAULT_LINK_INPUT];

      var html = (0, _logic2['default'])(DEFAULT_USER_INPUT);
      console.log(process.env.HOME, atom.project.getPaths()[0]);
      var filePath = _path2['default'].join(atom.project.getPaths()[0], 'index.html');
      (0, _touch2['default'])(filePath, function (error) {
        if (error) atom.notifications.addError('Unable to create file', console.error(error));else _this.appendData(filePath, html);
      });
    }

    // Although 'Esc' key can be used to close the modal, this is user friendly
  }, {
    key: 'hidePane',
    value: function hidePane() {
      this.modalPanel.hide();
    }
  }, {
    key: 'render',
    value: function render() {
      var formFields = this.fields || '';
      return _etch2['default'].dom(
        'div',
        null,
        _etch2['default'].dom(
          'div',
          { className: 'header_wrapper' },
          _etch2['default'].dom(
            'div',
            { className: 'form_title' },
            ' Generate Template '
          ),
          _etch2['default'].dom(
            'button',
            { className: 'close_button' },
            ' Close '
          )
        ),
        _etch2['default'].dom(
          'form',
          null,
          formFields
        ),
        _etch2['default'].dom(
          'button',
          { className: 'generate_button' },
          ' Generate '
        )
      );
    }
  }]);

  return HtmlTemplateGeneratorView;
})();

exports['default'] = HtmlTemplateGeneratorView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvaHRtbC10ZW1wbGF0ZS1nZW5lcmF0b3IvbGliL2h0bWwtdGVtcGxhdGUtZ2VuZXJhdG9yLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O29CQUlpQixNQUFNOzs7O3FCQUNMLFNBQVM7Ozs7cUJBQ1QsT0FBTzs7OztvQkFDUixNQUFNOzs7O2tCQUNSLElBQUk7Ozs7QUFSbkIsV0FBVyxDQUFBO0lBU1UseUJBQXlCO0FBRWpDLFdBRlEseUJBQXlCLENBRWhDLGVBQWUsRUFBRTswQkFGVix5QkFBeUI7O0FBRzdDLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3hELFFBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDNUMsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUN4QyxRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQTtBQUN0QixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQTtBQUNsQixRQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUM3QyxzQkFBSyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDckI7O2VBVm9CLHlCQUF5Qjs7V0FZbkMscUJBQUMsS0FBSyxFQUFFO0FBQ2pCLFVBQUcsS0FBSyxDQUFDLFNBQVMsRUFBRSxFQUNsQixLQUFLLENBQUMsSUFBSSxFQUFFLENBQUEsS0FDVjtBQUNGLFlBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUNsQixZQUFJLENBQUMsWUFBWSxFQUFFLENBQUE7QUFDbkIsYUFBSyxDQUFDLElBQUksRUFBRSxDQUFBO09BQ1o7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QiIsImZpbGUiOiIvaG9tZS90aGVrYXJsbzk1Ly5hdG9tL3BhY2thZ2VzL2h0bWwtdGVtcGxhdGUtZ2VuZXJhdG9yL2xpYi9odG1sLXRlbXBsYXRlLWdlbmVyYXRvci12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCdcbmltcG9ydCBMb2dpYyBmcm9tICcuL2xvZ2ljJ1xuaW1wb3J0IHRvdWNoIGZyb20gJ3RvdWNoJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBmcyBmcm9tICdmcydcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEh0bWxUZW1wbGF0ZUdlbmVyYXRvclZpZXcge1xuXG4gIGNvbnN0cnVjdG9yKHNlcmlhbGl6ZWRTdGF0ZSkge1xuIHRoaXMuZ2VuZXJhdGVUZW1wbGF0ZSA9IHRoaXMuZ2VuZXJhdGVUZW1wbGF0ZS5iaW5kKHRoaXMpXG4gdGhpcy5hcHBlbmREYXRhID0gdGhpcy5hcHBlbmREYXRhLmJpbmQodGhpcylcbiB0aGlzLmhpZGVQYW5lID0gdGhpcy5oaWRlUGFuZS5iaW5kKHRoaXMpXG4gdGhpcy5tb2RhbFBhbmVsID0gbnVsbFxuIHRoaXMuZmllbGRzID0gbnVsbFxuIHRoaXMuY2xhc3NlcyA9IFsnLlRpdGxlJywgJy5TY3JpcHQnLCAnLkxpbmsnXVxuIGV0Y2guaW5pdGlhbGl6ZSh0aGlzKVxufVxuXG5kaXNwbGF5Rm9ybShtb2RhbCkge1xuICBpZihtb2RhbC5pc1Zpc2libGUoKSlcbiAgICBtb2RhbC5oaWRlKClcbiAgZWxzZXtcbiAgICB0aGlzLnJlc2V0VmFsdWVzKClcbiAgICB0aGlzLmNyZWF0ZUZpZWxkcygpICAgIC8vIEFwcHJvcHJpYXRlIHBsYWNlIHRvIHB1dCBpdCBzaW5jZSBkaXNwbGF5Rm9ybSBpcyBjYWxsZWQgdG8gZ2VuZXJhdGUgdGVtcGxhdGUhXG4gICAgbW9kYWwuc2hvdygpXG4gICB9XG4gICAgIHRoaXMudXBkYXRlKHttb2RhbH0pXG59XG5cbmNyZWF0ZUZvcm1GaWVsZChpbm5lclRleHQpIHtcbiAgY29uc3QgaW5wdXRMYWJlbCA9IGlubmVyVGV4dFswXVxuICBjb25zdCBjbGFzc05hbWUgPSBgaW5wdXQtd3JhcHBlciAke2lucHV0TGFiZWx9YFxuICBpbm5lclRleHQgPSBpbm5lclRleHQubWFwKGVsZW1lbnQgPT4ge1xuICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gYCR7ZWxlbWVudH1gXG4gICAgcmV0dXJuKCA8aW5wdXQgY2xhc3NOYW1lPSduYXRpdmUta2V5LWJpbmRpbmdzJyB0eXBlPSd0ZXh0JyBwbGFjZWhvbGRlcj17cGxhY2Vob2xkZXJ9IC8+KVxuICB9KVxuXG4gIGlubmVyVGV4dC5zcGxpY2UoMCwgMSlcbiAgcmV0dXJuIChcbiAgICA8ZGl2PlxuICAgICAgPHNwYW4+IHsgaW5wdXRMYWJlbCB9IDwvc3Bhbj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPXsgY2xhc3NOYW1lIH0+XG4gICAgICB7IGlubmVyVGV4dCB9XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5jcmVhdGVGaWVsZHMoKSB7XG4gIGxldCBmb3JtRmllbGRzID0gW11cbiAgY29uc3QgZWxlbWVudERhdGEgPSBbXG4gICAgWydUaXRsZScsICd0aXRsZSddLFxuICAgIFsgJ1NjcmlwdCcsICdzcmMnLCAndHlwZSddLFxuICAgIFsgJ0xpbmsnLCAncmVsJywgJ3R5cGUnLCAndGl0bGUnLCAnaHJlZiddXG4gIF1cbiAgZm9yKGxldCBpID0gMDsgaSA8IDM7IGkrKylcbiAgICBmb3JtRmllbGRzLnB1c2godGhpcy5jcmVhdGVGb3JtRmllbGQoZWxlbWVudERhdGFbaV0pKVxuICB0aGlzLmZpZWxkcyA9IGZvcm1GaWVsZHNcbn1cbiAgLy8gUmV0dXJucyBhbiBvYmplY3QgdGhhdCBjYW4gYmUgcmV0cmlldmVkIHdoZW4gcGFja2FnZSBpcyBhY3RpdmF0ZWRcbiAgc2VyaWFsaXplKCkge31cblxuICAvLyBUZWFyIGRvd24gYW55IHN0YXRlIGFuZCBkZXRhY2hcbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLm1vZGFsUGFuZWwuZGVzdHJveSgpO1xuICAgIHRoaXMuZmllbGRzID0gbnVsbDtcbiAgICB0aGlzLmNsYXNzZXMgPSBudWxsO1xuICB9XG5cbiAgZXh0cmFjdFZhbHVlcyh0YWcsIGNsYXNzTmFtZSkge1xuICAgIGNvbnN0IGV4dHJhY3RlZFZhbHVlcyA9IFtdO1xuICAgIGNvbnN0IGVsZW1lbnRGb3JtRmllbGRzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNsYXNzTmFtZSkuY2hpbGRyZW4pXG4gICAgIE9iamVjdC5rZXlzKHRhZykuZm9yRWFjaCgoa2V5LCBpbmRleCkgPT4ge1xuICAgICAgIHRhZ1trZXldID0gZWxlbWVudEZvcm1GaWVsZHNbaW5kZXhdLnZhbHVlXG4gICAgIH0pXG4gICAgZXh0cmFjdGVkVmFsdWVzLnB1c2godGFnKVxuICAgIHJldHVybiBleHRyYWN0ZWRWYWx1ZXNcbiAgfVxuXG4gIHJlc2V0VmFsdWVzKCkge1xuICAgICAgY29uc3QgY2xhc3NOYW1lcyA9IHRoaXMuY2xhc3Nlc1xuICAgICAgY2xhc3NOYW1lcy5mb3JFYWNoKGNsYXNzTmFtZSA9PiB7XG4gICAgICAgIGlmKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY2xhc3NOYW1lKSl7XG4gICAgICAgICAgY29uc3QgZm9ybUZpZWxkcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvcihjbGFzc05hbWUpLmNoaWxkcmVuKVxuICAgICAgICAvLyAgZm9ybUZpZWxkcy5zcGxpY2UoMCwxKVxuICAgICAgICAgIGZvcm1GaWVsZHMuZm9yRWFjaChmaWVsZCA9PiBmaWVsZC52YWx1ZSA9ICcnKVxuICAgICAgICB9XG4gICAgICB9KVxuICB9XG5cbiAgdXBkYXRlIChwcm9wcykge1xuICAgIHRoaXMubW9kYWxQYW5lbCA9IHByb3BzLm1vZGFsXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNsb3NlX2J1dHRvbicpLm9uY2xpY2sgPSB0aGlzLmhpZGVQYW5lXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdlbmVyYXRlX2J1dHRvbicpLm9uY2xpY2sgPSB0aGlzLmdlbmVyYXRlVGVtcGxhdGVcbiAgICByZXR1cm4gZXRjaC51cGRhdGUodGhpcylcbiAgfVxuXG4gIGdlbmVyYXRlVGVtcGxhdGUoKSB7XG5cbiAgICBjb25zb2xlLmxvZygnR2VuZXJhdGluZyB0ZW1wbGF0ZScpXG4gICAgY29uc3QgY2xhc3NOYW1lcyA9IHRoaXMuY2xhc3Nlc1xuICAgIGNvbnN0IHNjcmlwdE9iamVjdCA9IHsgIHNyYzogJycsIHR5cGU6ICcnIH1cbiAgICBjb25zdCBsaW5rT2JqZWN0ID0geyByZWw6ICcnLCB0eXBlOiAnJywgdGl0bGU6ICcnLCBocmVmOiAnJyB9XG4gICAgdGhpcy5oaWRlUGFuZSgpXG5cbiAgICBjb25zdCB0aXRsZUZpZWxkID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNsYXNzTmFtZXNbMF0pLmNoaWxkcmVuKVswXS52YWx1ZVxuICAgIGNvbnN0IHVzZXJJbnB1dCA9IFt0aXRsZUZpZWxkLCB0aGlzLmV4dHJhY3RWYWx1ZXMoc2NyaXB0T2JqZWN0LCBjbGFzc05hbWVzWzFdKSwgdGhpcy5leHRyYWN0VmFsdWVzKGxpbmtPYmplY3QsIGNsYXNzTmFtZXNbMl0pXVxuICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGNvbnNvbGUubG9nKCdVc2VyIGlucHV0IGlzJywgdXNlcklucHV0KVxuICAgIGNvbnNvbGUuY2xlYXIoKVxuICAgIGlmKGVkaXRvcil7XG4gICAgICBlZGl0b3IuaW5zZXJ0VGV4dChMb2dpYyh1c2VySW5wdXQpKVxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoJ1RlbXBsYXRlIGdlbmVyYXRlZCBzdWNjZXNzZnVsbHknKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignTm8gYWN0aXZlIHRleHQgZWRpdG9yIGZvdW5kJylcbiAgICB9XG4gICAgLy8gICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoJ1RlbXBsYXRlIGdlbmVyYXRlZCBzdWNjZXNzZnVsbHknKVxuICB9XG5cbiAgYXBwZW5kRGF0YShmaWxlUGF0aCwgaHRtbCkge1xuXG4gICAgZnMuYXBwZW5kRmlsZShmaWxlUGF0aCwgaHRtbCwgKGVycm9yKSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignVW5hYmxlIHRvIGFjY2VzcyBmaWxlLlRyeSBhZ2FpbicpXG4gICAgICBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2RhdGEgYXBwZW5kIGRvbmUnKVxuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcygnVGVtcGxhdGUgZ2VuZXJhdGVkIHN1Y2Nlc3NmdWxseScpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGdlbmVyYXRlUXVpY2tUZW1wbGF0ZShtb2RhbFBhbmVsKSB7XG4gICAgY29uc29sZS5sb2coJ0dlbmVyYXRpbmcgUXVpY2sgdGVtcGxhdGUnKVxuICAgIGlmKG1vZGFsUGFuZWwuaXNWaXNpYmxlKCkpXG4gICAgICBtb2RhbFBhbmVsLmhpZGUoKVxuICAgICAgY29uc3QgREVGQVVMVF9TQ1JJUFRfSU5QVVQgPSBbIHsgIHNyYzogJycsIHR5cGU6ICcnIH0gXVxuICAgICAgY29uc3QgREVGQVVMVF9MSU5LX0lOUFVUID0gW3sgcmVsOiAnJywgdHlwZTogJycsIHRpdGxlOiAnJywgaHJlZjogJycgfV1cbiAgICBjb25zdCBERUZBVUxUX1VTRVJfSU5QVVQ9IFsnJyxERUZBVUxUX1NDUklQVF9JTlBVVCwgREVGQVVMVF9MSU5LX0lOUFVUXVxuXG4gICAgY29uc3QgaHRtbCA9IExvZ2ljKERFRkFVTFRfVVNFUl9JTlBVVClcbiAgICBjb25zb2xlLmxvZyhwcm9jZXNzLmVudi5IT01FLCBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXSlcbiAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXSwgJ2luZGV4Lmh0bWwnKVxuICAgIHRvdWNoKGZpbGVQYXRoLCAoZXJyb3IpID0+IHtcbiAgICAgIGlmIChlcnJvcikgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdVbmFibGUgdG8gY3JlYXRlIGZpbGUnLCBjb25zb2xlLmVycm9yKGVycm9yKSlcbiAgICAgIGVsc2UgdGhpcy5hcHBlbmREYXRhKGZpbGVQYXRoLCBodG1sKVxuICAgIH0pXG4gIH1cbiAgLy8gQWx0aG91Z2ggJ0VzYycga2V5IGNhbiBiZSB1c2VkIHRvIGNsb3NlIHRoZSBtb2RhbCwgdGhpcyBpcyB1c2VyIGZyaWVuZGx5XG4gIGhpZGVQYW5lKCkge1xuICAgIHRoaXMubW9kYWxQYW5lbC5oaWRlKClcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBmb3JtRmllbGRzID0gdGhpcy5maWVsZHMgfHwgJydcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdoZWFkZXJfd3JhcHBlcic+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdmb3JtX3RpdGxlJz4gR2VuZXJhdGUgVGVtcGxhdGUgPC9kaXY+XG4gICAgICAgIDxidXR0b24gY2xhc3NOYW1lPSdjbG9zZV9idXR0b24nID4gQ2xvc2UgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICAgICAgPGZvcm0+XG4gICAgICAgICAgeyBmb3JtRmllbGRzIH1cbiAgICAgICAgPC9mb3JtPlxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT0nZ2VuZXJhdGVfYnV0dG9uJz4gR2VuZXJhdGUgPC9idXR0b24+XG4gICAgICA8L2Rpdj4pXG4gIH1cbn1cbiJdfQ==