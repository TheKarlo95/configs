(function() {
  var CompositeDisposable, MinimapGitDiffBinding, repositoryForPath,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CompositeDisposable = require('atom').CompositeDisposable;

  repositoryForPath = require('./helpers').repositoryForPath;

  module.exports = MinimapGitDiffBinding = (function() {
    MinimapGitDiffBinding.prototype.active = false;

    function MinimapGitDiffBinding(minimap) {
      var repository;
      this.minimap = minimap;
      this.destroy = bind(this.destroy, this);
      this.updateDiffs = bind(this.updateDiffs, this);
      this.decorations = {};
      this.markers = null;
      this.subscriptions = new CompositeDisposable;
      if (this.minimap == null) {
        return console.warn('minimap-git-diff binding created without a minimap');
      }
      this.editor = this.minimap.getTextEditor();
      this.subscriptions.add(this.minimap.onDidDestroy(this.destroy));
      if (repository = this.getRepo()) {
        this.subscriptions.add(this.editor.getBuffer().onDidStopChanging(this.updateDiffs));
        this.subscriptions.add(repository.onDidChangeStatuses((function(_this) {
          return function() {
            return _this.scheduleUpdate();
          };
        })(this)));
        this.subscriptions.add(repository.onDidChangeStatus((function(_this) {
          return function(changedPath) {
            if (changedPath === _this.editor.getPath()) {
              return _this.scheduleUpdate();
            }
          };
        })(this)));
        this.subscriptions.add(repository.onDidDestroy((function(_this) {
          return function() {
            return _this.destroy();
          };
        })(this)));
        this.subscriptions.add(atom.config.observe('minimap-git-diff.useGutterDecoration', (function(_this) {
          return function(useGutterDecoration) {
            _this.useGutterDecoration = useGutterDecoration;
            return _this.scheduleUpdate();
          };
        })(this)));
      }
      this.scheduleUpdate();
    }

    MinimapGitDiffBinding.prototype.cancelUpdate = function() {
      return clearImmediate(this.immediateId);
    };

    MinimapGitDiffBinding.prototype.scheduleUpdate = function() {
      this.cancelUpdate();
      return this.immediateId = setImmediate(this.updateDiffs);
    };

    MinimapGitDiffBinding.prototype.updateDiffs = function() {
      this.removeDecorations();
      if (this.getPath() && (this.diffs = this.getDiffs())) {
        return this.addDecorations(this.diffs);
      }
    };

    MinimapGitDiffBinding.prototype.addDecorations = function(diffs) {
      var endRow, i, len, newLines, newStart, oldLines, oldStart, ref, results, startRow;
      results = [];
      for (i = 0, len = diffs.length; i < len; i++) {
        ref = diffs[i], oldStart = ref.oldStart, newStart = ref.newStart, oldLines = ref.oldLines, newLines = ref.newLines;
        startRow = newStart - 1;
        endRow = newStart + newLines - 2;
        if (oldLines === 0 && newLines > 0) {
          results.push(this.markRange(startRow, endRow, '.git-line-added'));
        } else if (newLines === 0 && oldLines > 0) {
          results.push(this.markRange(startRow, startRow, '.git-line-removed'));
        } else {
          results.push(this.markRange(startRow, endRow, '.git-line-modified'));
        }
      }
      return results;
    };

    MinimapGitDiffBinding.prototype.removeDecorations = function() {
      var i, len, marker, ref;
      if (this.markers == null) {
        return;
      }
      ref = this.markers;
      for (i = 0, len = ref.length; i < len; i++) {
        marker = ref[i];
        marker.destroy();
      }
      return this.markers = null;
    };

    MinimapGitDiffBinding.prototype.markRange = function(startRow, endRow, scope) {
      var marker, type;
      if (this.editor.isDestroyed()) {
        return;
      }
      marker = this.editor.markBufferRange([[startRow, 0], [endRow, 2e308]], {
        invalidate: 'never'
      });
      type = this.useGutterDecoration ? 'gutter' : 'line';
      this.minimap.decorateMarker(marker, {
        type: type,
        scope: ".minimap ." + type + " " + scope,
        plugin: 'git-diff'
      });
      if (this.markers == null) {
        this.markers = [];
      }
      return this.markers.push(marker);
    };

    MinimapGitDiffBinding.prototype.destroy = function() {
      this.removeDecorations();
      this.subscriptions.dispose();
      this.diffs = null;
      return this.minimap = null;
    };

    MinimapGitDiffBinding.prototype.getPath = function() {
      var ref;
      return (ref = this.editor.getBuffer()) != null ? ref.getPath() : void 0;
    };

    MinimapGitDiffBinding.prototype.getRepositories = function() {
      return atom.project.getRepositories().filter(function(repo) {
        return repo != null;
      });
    };

    MinimapGitDiffBinding.prototype.getRepo = function() {
      return this.repository != null ? this.repository : this.repository = repositoryForPath(this.editor.getPath());
    };

    MinimapGitDiffBinding.prototype.getDiffs = function() {
      var e, ref;
      try {
        return (ref = this.getRepo()) != null ? ref.getLineDiffs(this.getPath(), this.editor.getBuffer().getText()) : void 0;
      } catch (error) {
        e = error;
        return null;
      }
    };

    return MinimapGitDiffBinding;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdGhla2FybG85NS8uYXRvbS9wYWNrYWdlcy9taW5pbWFwLWdpdC1kaWZmL2xpYi9taW5pbWFwLWdpdC1kaWZmLWJpbmRpbmcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSw2REFBQTtJQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDdkIsb0JBQXFCLE9BQUEsQ0FBUSxXQUFSOztFQUV0QixNQUFNLENBQUMsT0FBUCxHQUNNO29DQUVKLE1BQUEsR0FBUTs7SUFFSywrQkFBQyxPQUFEO0FBQ1gsVUFBQTtNQURZLElBQUMsQ0FBQSxVQUFEOzs7TUFDWixJQUFDLENBQUEsV0FBRCxHQUFlO01BQ2YsSUFBQyxDQUFBLE9BQUQsR0FBVztNQUNYLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFFckIsSUFBTyxvQkFBUDtBQUNFLGVBQU8sT0FBTyxDQUFDLElBQVIsQ0FBYSxvREFBYixFQURUOztNQUdBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLE9BQU8sQ0FBQyxhQUFULENBQUE7TUFFVixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxZQUFULENBQXNCLElBQUMsQ0FBQSxPQUF2QixDQUFuQjtNQUVBLElBQUcsVUFBQSxHQUFhLElBQUMsQ0FBQSxPQUFELENBQUEsQ0FBaEI7UUFDRSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFSLENBQUEsQ0FBbUIsQ0FBQyxpQkFBcEIsQ0FBc0MsSUFBQyxDQUFBLFdBQXZDLENBQW5CO1FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLFVBQVUsQ0FBQyxtQkFBWCxDQUErQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUNoRCxLQUFDLENBQUEsY0FBRCxDQUFBO1VBRGdEO1FBQUEs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V0FEVDtPQUFBLGFBQUE7UUFFTTtBQUNKLGVBQU8sS0FIVDs7SUFEUTs7Ozs7QUFqRloiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xue3JlcG9zaXRvcnlGb3JQYXRofSA9IHJlcXVpcmUgJy4vaGVscGVycydcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgTWluaW1hcEdpdERpZmZCaW5kaW5nXG5cbiAgYWN0aXZlOiBmYWxzZVxuXG4gIGNvbnN0cnVjdG9yOiAoQG1pbmltYXApIC0+XG4gICAgQGRlY29yYXRpb25zID0ge31cbiAgICBAbWFya2VycyA9IG51bGxcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICB1bmxlc3MgQG1pbmltYXA/XG4gICAgICByZXR1cm4gY29uc29sZS53YXJuICdtaW5pbWFwLWdpdC1kaWZmIGJpbmRpbmcgY3JlYXRlZCB3aXRob3V0IGEgbWluaW1hcCdcblxuICAgIEBlZGl0b3IgPSBAbWluaW1hcC5nZXRUZXh0RWRpdG9yKClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAbWluaW1hcC5vbkRpZERlc3Ryb3kgQGRlc3Ryb3lcblxuICAgIGlmIHJlcG9zaXRvcnkgPSBAZ2V0UmVwbygpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQGVkaXRvci5nZXRCdWZmZXIoKS5vbkRpZFN0b3BDaGFuZ2luZyBAdXBkYXRlRGlmZnNcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCByZXBvc2l0b3J5Lm9uRGlkQ2hhbmdlU3RhdHVzZXMgPT5cbiAgICAgICAgQHNjaGVkdWxlVXBkYXRlKClcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCByZXBvc2l0b3J5Lm9uRGlkQ2hhbmdlU3RhdHVzIChjaGFuZ2VkUGF0aCkgPT5cbiAgICAgICAgQHNjaGVkdWxlVXBkYXRlKCkgaWYgY2hhbmdlZFBhdGggaXMgQGVkaXRvci5nZXRQYXRoKClcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCByZXBvc2l0b3J5Lm9uRGlkRGVzdHJveSA9PlxuICAgICAgICBAZGVzdHJveSgpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAnbWluaW1hcC1naXQtZGlmZi51c2VHdXR0ZXJEZWNvcmF0aW9uJywgKEB1c2VHdXR0ZXJEZWNvcmF0aW9uKSA9PlxuICAgICAgICBAc2NoZWR1bGVVcGRhdGUoKVxuXG4gICAgQHNjaGVkdWxlVXBkYXRlKClcblxuICBjYW5jZWxVcGRhdGU6IC0+XG4gICAgY2xlYXJJbW1lZGlhdGUoQGltbWVkaWF0ZUlkKVxuXG4gIHNjaGVkdWxlVXBkYXRlOiAtPlxuICAgIEBjYW5jZWxVcGRhdGUoKVxuICAgIEBpbW1lZGlhdGVJZCA9IHNldEltbWVkaWF0ZShAdXBkYXRlRGlmZnMpXG5cbiAgdXBkYXRlRGlmZnM6ID0+XG4gICAgQHJlbW92ZURlY29yYXRpb25zKClcbiAgICBpZiBAZ2V0UGF0aCgpIGFuZCBAZGlmZnMgPSBAZ2V0RGlmZnMoKVxuICAgICAgQGFkZERlY29yYXRpb25zKEBkaWZmcylcblxuICBhZGREZWNvcmF0aW9uczogKGRpZmZzKSAtPlxuICAgIGZvciB7b2xkU3RhcnQsIG5ld1N0YXJ0LCBvbGRMaW5lcywgbmV3TGluZXN9IGluIGRpZmZzXG4gICAgICBzdGFydFJvdyA9IG5ld1N0YXJ0IC0gMVxuICAgICAgZW5kUm93ID0gbmV3U3RhcnQgKyBuZXdMaW5lcyAtIDJcbiAgICAgIGlmIG9sZExpbmVzIGlzIDAgYW5kIG5ld0xpbmVzID4gMFxuICAgICAgICBAbWFya1JhbmdlKHN0YXJ0Um93LCBlbmRSb3csICcuZ2l0LWxpbmUtYWRkZWQnKVxuICAgICAgZWxzZSBpZiBuZXdMaW5lcyBpcyAwIGFuZCBvbGRMaW5lcyA+IDBcbiAgICAgICAgQG1hcmtSYW5nZShzdGFydFJvdywgc3RhcnRSb3csICcuZ2l0LWxpbmUtcmVtb3ZlZCcpXG4gICAgICBlbHNlXG4gICAgICAgIEBtYXJrUmFuZ2Uoc3RhcnRSb3csIGVuZFJvdywgJy5naXQtbGluZS1tb2RpZmllZCcpXG5cbiAgcmVtb3ZlRGVjb3JhdGlvbnM6IC0+XG4gICAgcmV0dXJuIHVubGVzcyBAbWFya2Vycz9cbiAgICBtYXJrZXIuZGVzdHJveSgpIGZvciBtYXJrZXIgaW4gQG1hcmtlcnNcbiAgICBAbWFya2VycyA9IG51bGxcblxuICBtYXJrUmFuZ2U6IChzdGFydFJvdywgZW5kUm93LCBzY29wZSkgLT5cbiAgICByZXR1cm4gaWYgQGVkaXRvci5pc0Rlc3Ryb3llZCgpXG4gICAgbWFya2VyID0gQGVkaXRvci5tYXJrQnVmZmVyUmFuZ2UoW1tzdGFydFJvdywgMF0sIFtlbmRSb3csIEluZmluaXR5XV0sIGludmFsaWRhdGU6ICduZXZlcicpXG4gICAgdHlwZSA9IGlmIEB1c2VHdXR0ZXJEZWNvcmF0aW9uIHRoZW4gJ2d1dHRlcicgZWxzZSAnbGluZSdcbiAgICBAbWluaW1hcC5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHt0eXBlLCBzY29wZTogXCIubWluaW1hcCAuI3t0eXBlfSAje3Njb3BlfVwiLCBwbHVnaW46ICdnaXQtZGlmZid9KVxuICAgIEBtYXJrZXJzID89IFtdXG4gICAgQG1hcmtlcnMucHVzaChtYXJrZXIpXG5cbiAgZGVzdHJveTogPT5cbiAgICBAcmVtb3ZlRGVjb3JhdGlvbnMoKVxuICAgIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIEBkaWZmcyA9IG51bGxcbiAgICBAbWluaW1hcCA9IG51bGxcblxuICBnZXRQYXRoOiAtPiBAZWRpdG9yLmdldEJ1ZmZlcigpPy5nZXRQYXRoKClcblxuICBnZXRSZXBvc2l0b3JpZXM6IC0+IGF0b20ucHJvamVjdC5nZXRSZXBvc2l0b3JpZXMoKS5maWx0ZXIgKHJlcG8pIC0+IHJlcG8/XG5cbiAgZ2V0UmVwbzogLT4gQHJlcG9zaXRvcnkgPz0gcmVwb3NpdG9yeUZvclBhdGgoQGVkaXRvci5nZXRQYXRoKCkpXG5cbiAgZ2V0RGlmZnM6IC0+XG4gICAgdHJ5XG4gICAgICByZXR1cm4gQGdldFJlcG8oKT8uZ2V0TGluZURpZmZzKEBnZXRQYXRoKCksIEBlZGl0b3IuZ2V0QnVmZmVyKCkuZ2V0VGV4dCgpKVxuICAgIGNhdGNoIGVcbiAgICAgIHJldHVybiBudWxsXG4iXX0=
