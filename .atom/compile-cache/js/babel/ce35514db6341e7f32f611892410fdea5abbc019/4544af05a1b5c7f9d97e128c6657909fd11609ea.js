Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _htmlTemplateGeneratorView = require('./html-template-generator-view');

var _htmlTemplateGeneratorView2 = _interopRequireDefault(_htmlTemplateGeneratorView);

var _atom = require('atom');

'use babel';

exports['default'] = {

  generatorView: null,
  subscriptions: null,
  modalPanel: null,

  activate: function activate(state) {
    var _this = this;

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.generatorView = new _htmlTemplateGeneratorView2['default']();
    this.subscriptions = new _atom.CompositeDisposable();
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.generatorView,
      visible: false
    });
    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'html-template-generator:generate': function htmlTemplateGeneratorGenerate() {
        return _this.generatorView.displayForm(_this.modalPanel);
      },
      'html-template-generator:quick-generate': function htmlTemplateGeneratorQuickGenerate() {
        return _this.generatorView.generateQuickTemplate(_this.modalPanel);
      }
    }));
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
    this.generatorView.destroy();
    this.modalPanel.destroy();
  },

  serialize: function serialize() {
    return {
      generatorViewState: this.generatorView.serialize()
    };
  }

};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvaHRtbC10ZW1wbGF0ZS1nZW5lcmF0b3IvbGliL2h0bWwtdGVtcGxhdGUtZ2VuZXJhdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozt5Q0FFc0MsZ0NBQWdDOzs7O29CQUNsQyxNQUFNOztBQUgxQyxXQUFXLENBQUM7O3FCQUtHOztBQUViLGVBQWEsRUFBRSxJQUFJO0FBQ25CLGVBQWEsRUFBRSxJQUFJO0FBQ25CLFlBQVUsRUFBQyxJQUFJOztBQUVmLFVBQVEsRUFBQSxrQkFBQyxLQUFLLEVBQUU7Ozs7QUFHZCxRQUFJLENBQUMsYUFBYSxHQUFHLDRDQUErQixDQUFBO0FBQ3BELFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUM7QUFDL0MsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQztBQUM3QyxVQUFJLEVBQUUsSUFBSSxDQUFDLGFBQWE7QUFDeEIsYUFBTyxFQUFDLEtBQUs7S0FDZCxDQUFDLENBQUE7O0FBRUYsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7QUFDekQsd0NBQWtDLEVBQUU7ZUFBTSxNQUFLLGFBQWEsQ0FBQyxXQUFXLENBQUMsTUFBSyxVQUFVLENBQUM7T0FBQTtBQUN6Riw4Q0FBd0MsRUFBRTtlQUFNLE1BQUssYUFBYSxDQUFDLHFCQUFxQixDQUFDLE1BQUssVUFBVSxDQUFDO09BQUE7S0FDMUcsQ0FBQyxDQUFDLENBQUM7R0FFTDs7QUFFRCxZQUFVLEVBQUEsc0JBQUc7QUFDWCxRQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzdCLFFBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDN0IsUUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztHQUMzQjs7QUFFRCxXQUFTLEVBQUEscUJBQUc7QUFDVixXQUFPO0FBQ0wsd0JBQWtCLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUU7S0FDbkQsQ0FBQztHQUNIOztDQUVGIiwiZmlsZSI6Ii9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvaHRtbC10ZW1wbGF0ZS1nZW5lcmF0b3IvbGliL2h0bWwtdGVtcGxhdGUtZ2VuZXJhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBIdG1sVGVtcGxhdGVHZW5lcmF0b3JWaWV3IGZyb20gJy4vaHRtbC10ZW1wbGF0ZS1nZW5lcmF0b3Itdmlldyc7XG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblxuICBnZW5lcmF0b3JWaWV3OiBudWxsLFxuICBzdWJzY3JpcHRpb25zOiBudWxsLFxuICBtb2RhbFBhbmVsOm51bGwsXG5cbiAgYWN0aXZhdGUoc3RhdGUpIHtcblxuICAvLyBFdmVudHMgc3Vic2NyaWJlZCB0byBpbiBhdG9tJ3Mgc3lzdGVtIGNhbiBiZSBlYXNpbHkgY2xlYW5lZCB1cCB3aXRoIGEgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIHRoaXMuZ2VuZXJhdG9yVmlldyA9IG5ldyBIdG1sVGVtcGxhdGVHZW5lcmF0b3JWaWV3KClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMubW9kYWxQYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoe1xuICAgICAgaXRlbTogdGhpcy5nZW5lcmF0b3JWaWV3LFxuICAgICAgdmlzaWJsZTpmYWxzZVxuICAgIH0pXG4gICAgLy8gUmVnaXN0ZXIgY29tbWFuZCB0aGF0IHRvZ2dsZXMgdGhpcyB2aWV3XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgICAnaHRtbC10ZW1wbGF0ZS1nZW5lcmF0b3I6Z2VuZXJhdGUnOiAoKSA9PiB0aGlzLmdlbmVyYXRvclZpZXcuZGlzcGxheUZvcm0odGhpcy5tb2RhbFBhbmVsKSxcbiAgICAgICdodG1sLXRlbXBsYXRlLWdlbmVyYXRvcjpxdWljay1nZW5lcmF0ZSc6ICgpID0+IHRoaXMuZ2VuZXJhdG9yVmlldy5nZW5lcmF0ZVF1aWNrVGVtcGxhdGUodGhpcy5tb2RhbFBhbmVsKVxuICAgIH0pKTtcblxuICB9LFxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgICB0aGlzLmdlbmVyYXRvclZpZXcuZGVzdHJveSgpO1xuICAgIHRoaXMubW9kYWxQYW5lbC5kZXN0cm95KCk7XG4gIH0sXG5cbiAgc2VyaWFsaXplKCkge1xuICAgIHJldHVybiB7XG4gICAgICBnZW5lcmF0b3JWaWV3U3RhdGU6IHRoaXMuZ2VuZXJhdG9yVmlldy5zZXJpYWxpemUoKVxuICAgIH07XG4gIH1cblxufTtcbiJdfQ==