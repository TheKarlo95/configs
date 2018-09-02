(function() {
  var CompositeDisposable, MinimapFindAndReplaceBinding;

  CompositeDisposable = require('atom').CompositeDisposable;

  MinimapFindAndReplaceBinding = null;

  module.exports = {
    active: false,
    bindingsById: {},
    subscriptionsById: {},
    isActive: function() {
      return this.active;
    },
    activate: function(state) {
      return this.subscriptions = new CompositeDisposable;
    },
    consumeMinimapServiceV1: function(minimap1) {
      this.minimap = minimap1;
      return this.minimap.registerPlugin('find-and-replace', this);
    },
    deactivate: function() {
      this.minimap.unregisterPlugin('find-and-replace');
      return this.minimap = null;
    },
    activatePlugin: function() {
      var fnrHasServiceAPI, fnrVersion;
      if (this.active) {
        return;
      }
      this.active = true;
      fnrVersion = atom.packages.getLoadedPackage('find-and-replace').metadata.version;
      fnrHasServiceAPI = parseFloat(fnrVersion) >= 0.194;
      if (fnrHasServiceAPI) {
        this.initializeServiceAPI();
      } else {
        this.initializeLegacyAPI();
      }
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'find-and-replace:show': (function(_this) {
          return function() {
            return _this.discoverMarkers();
          };
        })(this),
        'find-and-replace:toggle': (function(_this) {
          return function() {
            return _this.discoverMarkers();
          };
        })(this),
        'find-and-replace:show-replace': (function(_this) {
          return function() {
            return _this.discoverMarkers();
          };
        })(this),
        'core:cancel': (function(_this) {
          return function() {
            return _this.clearBindings();
          };
        })(this),
        'core:close': (function(_this) {
          return function() {
            return _this.clearBindings();
          };
        })(this)
      }));
    },
    initializeServiceAPI: function() {
      return atom.packages.serviceHub.consume('find-and-replace', '0.0.1', (function(_this) {
        return function(fnr) {
          return _this.subscriptions.add(_this.minimap.observeMinimaps(function(minimap) {
            var binding, id;
            if (MinimapFindAndReplaceBinding == null) {
              MinimapFindAndReplaceBinding = require('./minimap-find-and-replace-binding');
            }
            id = minimap.id;
            binding = new MinimapFindAndReplaceBinding(minimap, fnr);
            _this.bindingsById[id] = binding;
            return _this.subscriptionsById[id] = minimap.onDidDestroy(function() {
              var ref, ref1;
              if ((ref = _this.subscriptionsById[id]) != null) {
                ref.dispose();
              }
              if ((ref1 = _this.bindingsById[id]) != null) {
                ref1.destroy();
              }
              delete _this.bindingsById[id];
              return delete _this.subscriptionsById[id];
            });
          }));
        };
      })(this));
    },
    initializeLegacyAPI: function() {
      return this.subscriptions.add(this.minimap.observeMinimaps((function(_this) {
        return function(minimap) {
          var binding, id;
          if (MinimapFindAndReplaceBinding == null) {
            MinimapFindAndReplaceBinding = require('./minimap-find-and-replace-binding');
          }
          id = minimap.id;
          binding = new MinimapFindAndReplaceBinding(minimap);
          _this.bindingsById[id] = binding;
          return _this.subscriptionsById[id] = minimap.onDidDestroy(function() {
            var ref, ref1;
            if ((ref = _this.subscriptionsById[id]) != null) {
              ref.dispose();
            }
            if ((ref1 = _this.bindingsById[id]) != null) {
              ref1.destroy();
            }
            delete _this.bindingsById[id];
            return delete _this.subscriptionsById[id];
          });
        };
      })(this)));
    },
    deactivatePlugin: function() {
      var binding, id, ref, ref1, sub;
      if (!this.active) {
        return;
      }
      this.active = false;
      this.subscriptions.dispose();
      ref = this.subscriptionsById;
      for (id in ref) {
        sub = ref[id];
        sub.dispose();
      }
      ref1 = this.bindingsById;
      for (id in ref1) {
        binding = ref1[id];
        binding.destroy();
      }
      this.bindingsById = {};
      return this.subscriptionsById = {};
    },
    discoverMarkers: function() {
      var binding, id, ref, results;
      ref = this.bindingsById;
      results = [];
      for (id in ref) {
        binding = ref[id];
        results.push(binding.discoverMarkers());
      }
      return results;
    },
    clearBindings: function() {
      var binding, id, ref, results;
      ref = this.bindingsById;
      results = [];
      for (id in ref) {
        binding = ref[id];
        results.push(binding.clear());
      }
      return results;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdGhla2FybG85NS8uYXRvbS9wYWNrYWdlcy9taW5pbWFwLWZpbmQtYW5kLXJlcGxhY2UvbGliL21pbmltYXAtZmluZC1hbmQtcmVwbGFjZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsNEJBQUEsR0FBK0I7O0VBRS9CLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxNQUFBLEVBQVEsS0FBUjtJQUNBLFlBQUEsRUFBYyxFQURkO0lBRUEsaUJBQUEsRUFBbUIsRUFGbkI7SUFJQSxRQUFBLEVBQVUsU0FBQTthQUFHLElBQUMsQ0FBQTtJQUFKLENBSlY7SUFNQSxRQUFBLEVBQVUsU0FBQyxLQUFEO2FBQ1IsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtJQURiLENBTlY7SUFTQSx1QkFBQSxFQUF5QixTQUFDLFFBQUQ7TUFBQyxJQUFDLENBQUEsVUFBRDthQUN4QixJQUFDLENBQUEsT0FBTyxDQUFDLGNBQVQsQ0FBd0Isa0JBQXhCLEVBQTRDLElBQTVDO0lBRHVCLENBVHpCO0lBWUEsVUFBQSxFQUFZLFNBQUE7TUFDVixJQUFDLENBQUEsT0FBTyxDQUFDLGdCQUFULENBQTBCLGtCQUExQjthQUNBLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFGRCxDQVpaO0lBZ0JBLGNBQUEsRUFBZ0IsU0FBQTtBQUNkLFVBQUE7TUFBQSxJQUFVLElBQUMsQ0FBQSxNQUFYO0FBQUEsZUFBQTs7TUFFQSxJQUFDLENBQUEsTUFBRCxHQUFVO01BRVYsVUFBQSxHQUFhLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWQsQ0FBK0Isa0JBQS9CLENBQWtELENBQUMsUUFBUSxDQUFDO01BQ3pFLGdCQUFBLEdBQW1CLFVBQUEsQ0FBVyxVQUFYLENBQUEsSUFBMEI7TUFFN0MsSUFBRyxnQkFBSDtRQUNFLElBQUMsQ0FBQSxvQkFBRCxDQUFB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TGtCLENBQXJCO1FBUGlCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QixDQUFuQjtJQURtQixDQXBEckI7SUFtRUEsZ0JBQUEsRUFBa0IsU0FBQTtBQUNoQixVQUFBO01BQUEsSUFBQSxDQUFjLElBQUMsQ0FBQSxNQUFmO0FBQUEsZUFBQTs7TUFFQSxJQUFDLENBQUEsTUFBRCxHQUFVO01BQ1YsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUE7QUFFQTtBQUFBLFdBQUEsU0FBQTs7UUFBQSxHQUFHLENBQUMsT0FBSixDQUFBO0FBQUE7QUFDQTtBQUFBLFdBQUEsVUFBQTs7UUFBQSxPQUFPLENBQUMsT0FBUixDQUFBO0FBQUE7TUFFQSxJQUFDLENBQUEsWUFBRCxHQUFnQjthQUNoQixJQUFDLENBQUEsaUJBQUQsR0FBcUI7SUFWTCxDQW5FbEI7SUErRUEsZUFBQSxFQUFpQixTQUFBO0FBQ2YsVUFBQTtBQUFBO0FBQUE7V0FBQSxTQUFBOztxQkFBQSxPQUFPLENBQUMsZUFBUixDQUFBO0FBQUE7O0lBRGUsQ0EvRWpCO0lBa0ZBLGFBQUEsRUFBZSxTQUFBO0FBQ2IsVUFBQTtBQUFBO0FBQUE7V0FBQSxTQUFBOztxQkFBQSxPQUFPLENBQUMsS0FBUixDQUFBO0FBQUE7O0lBRGEsQ0FsRmY7O0FBSkYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuTWluaW1hcEZpbmRBbmRSZXBsYWNlQmluZGluZyA9IG51bGxcblxubW9kdWxlLmV4cG9ydHMgPVxuICBhY3RpdmU6IGZhbHNlXG4gIGJpbmRpbmdzQnlJZDoge31cbiAgc3Vic2NyaXB0aW9uc0J5SWQ6IHt9XG5cbiAgaXNBY3RpdmU6IC0+IEBhY3RpdmVcblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICBjb25zdW1lTWluaW1hcFNlcnZpY2VWMTogKEBtaW5pbWFwKSAtPlxuICAgIEBtaW5pbWFwLnJlZ2lzdGVyUGx1Z2luICdmaW5kLWFuZC1yZXBsYWNlJywgdGhpc1xuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQG1pbmltYXAudW5yZWdpc3RlclBsdWdpbiAnZmluZC1hbmQtcmVwbGFjZSdcbiAgICBAbWluaW1hcCA9IG51bGxcblxuICBhY3RpdmF0ZVBsdWdpbjogLT5cbiAgICByZXR1cm4gaWYgQGFjdGl2ZVxuXG4gICAgQGFjdGl2ZSA9IHRydWVcblxuICAgIGZuclZlcnNpb24gPSBhdG9tLnBhY2thZ2VzLmdldExvYWRlZFBhY2thZ2UoJ2ZpbmQtYW5kLXJlcGxhY2UnKS5tZXRhZGF0YS52ZXJzaW9uXG4gICAgZm5ySGFzU2VydmljZUFQSSA9IHBhcnNlRmxvYXQoZm5yVmVyc2lvbikgPj0gMC4xOTRcblxuICAgIGlmIGZuckhhc1NlcnZpY2VBUElcbiAgICAgIEBpbml0aWFsaXplU2VydmljZUFQSSgpXG4gICAgZWxzZVxuICAgICAgQGluaXRpYWxpemVMZWdhY3lBUEkoKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsXG4gICAgICAnZmluZC1hbmQtcmVwbGFjZTpzaG93JzogPT4gQGRpc2NvdmVyTWFya2VycygpXG4gICAgICAnZmluZC1hbmQtcmVwbGFjZTp0b2dnbGUnOiA9PiBAZGlzY292ZXJNYXJrZXJzKClcbiAgICAgICdmaW5kLWFuZC1yZXBsYWNlOnNob3ctcmVwbGFjZSc6ID0+IEBkaXNjb3Zlck1hcmtlcnMoKVxuICAgICAgJ2NvcmU6Y2FuY2VsJzogPT4gQGNsZWFyQmluZGluZ3MoKVxuICAgICAgJ2NvcmU6Y2xvc2UnOiA9PiBAY2xlYXJCaW5kaW5ncygpXG5cbiAgaW5pdGlhbGl6ZVNlcnZpY2VBUEk6IC0+XG4gICAgYXRvbS5wYWNrYWdlcy5zZXJ2aWNlSHViLmNvbnN1bWUgJ2ZpbmQtYW5kLXJlcGxhY2UnLCAnMC4wLjEnLCAoZm5yKSA9PlxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBtaW5pbWFwLm9ic2VydmVNaW5pbWFwcyAobWluaW1hcCkgPT5cbiAgICAgICAgTWluaW1hcEZpbmRBbmRSZXBsYWNlQmluZGluZyA/PSByZXF1aXJlICcuL21pbmltYXAtZmluZC1hbmQtcmVwbGFjZS1iaW5kaW5nJ1xuXG4gICAgICAgIGlkID0gbWluaW1hcC5pZFxuICAgICAgICBiaW5kaW5nID0gbmV3IE1pbmltYXBGaW5kQW5kUmVwbGFjZUJpbmRpbmcobWluaW1hcCwgZm5yKVxuICAgICAgICBAYmluZGluZ3NCeUlkW2lkXSA9IGJpbmRpbmdcblxuICAgICAgICBAc3Vic2NyaXB0aW9uc0J5SWRbaWRdID0gbWluaW1hcC5vbkRpZERlc3Ryb3kgPT5cbiAgICAgICAgICBAc3Vic2NyaXB0aW9uc0J5SWRbaWRdPy5kaXNwb3NlKClcbiAgICAgICAgICBAYmluZGluZ3NCeUlkW2lkXT8uZGVzdHJveSgpXG5cbiAgICAgICAgICBkZWxldGUgQGJpbmRpbmdzQnlJZFtpZF1cbiAgICAgICAgICBkZWxldGUgQHN1YnNjcmlwdGlvbnNCeUlkW2lkXVxuXG4gIGluaXRpYWxpemVMZWdhY3lBUEk6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBtaW5pbWFwLm9ic2VydmVNaW5pbWFwcyAobWluaW1hcCkgPT5cbiAgICAgIE1pbmltYXBGaW5kQW5kUmVwbGFjZUJpbmRpbmcgPz0gcmVxdWlyZSAnLi9taW5pbWFwLWZpbmQtYW5kLXJlcGxhY2UtYmluZGluZydcblxuICAgICAgaWQgPSBtaW5pbWFwLmlkXG4gICAgICBiaW5kaW5nID0gbmV3IE1pbmltYXBGaW5kQW5kUmVwbGFjZUJpbmRpbmcobWluaW1hcClcbiAgICAgIEBiaW5kaW5nc0J5SWRbaWRdID0gYmluZGluZ1xuXG4gICAgICBAc3Vic2NyaXB0aW9uc0J5SWRbaWRdID0gbWluaW1hcC5vbkRpZERlc3Ryb3kgPT5cbiAgICAgICAgQHN1YnNjcmlwdGlvbnNCeUlkW2lkXT8uZGlzcG9zZSgpXG4gICAgICAgIEBiaW5kaW5nc0J5SWRbaWRdPy5kZXN0cm95KClcblxuICAgICAgICBkZWxldGUgQGJpbmRpbmdzQnlJZFtpZF1cbiAgICAgICAgZGVsZXRlIEBzdWJzY3JpcHRpb25zQnlJZFtpZF1cblxuICBkZWFjdGl2YXRlUGx1Z2luOiAtPlxuICAgIHJldHVybiB1bmxlc3MgQGFjdGl2ZVxuXG4gICAgQGFjdGl2ZSA9IGZhbHNlXG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG5cbiAgICBzdWIuZGlzcG9zZSgpIGZvciBpZCxzdWIgb2YgQHN1YnNjcmlwdGlvbnNCeUlkXG4gICAgYmluZGluZy5kZXN0cm95KCkgZm9yIGlkLGJpbmRpbmcgb2YgQGJpbmRpbmdzQnlJZFxuXG4gICAgQGJpbmRpbmdzQnlJZCA9IHt9XG4gICAgQHN1YnNjcmlwdGlvbnNCeUlkID0ge31cblxuICBkaXNjb3Zlck1hcmtlcnM6IC0+XG4gICAgYmluZGluZy5kaXNjb3Zlck1hcmtlcnMoKSBmb3IgaWQsYmluZGluZyBvZiBAYmluZGluZ3NCeUlkXG5cbiAgY2xlYXJCaW5kaW5nczogLT5cbiAgICBiaW5kaW5nLmNsZWFyKCkgZm9yIGlkLGJpbmRpbmcgb2YgQGJpbmRpbmdzQnlJZFxuIl19
