(function() {
  var MinimapPigments;

  MinimapPigments = require('../lib/minimap-pigments');

  describe("MinimapPigments", function() {
    var binding, colorBuffer, editBuffer, editor, minimap, minimapPackage, pigmentsProject, plugin, ref, workspaceElement;
    ref = [], workspaceElement = ref[0], editor = ref[1], minimapPackage = ref[2], minimap = ref[3], pigmentsProject = ref[4], colorBuffer = ref[5], plugin = ref[6], binding = ref[7];
    editBuffer = function(text, options) {
      var range;
      if (options == null) {
        options = {};
      }
      if (options.start != null) {
        if (options.end != null) {
          range = [options.start, options.end];
        } else {
          range = [options.start, options.start];
        }
        editor.setSelectedBufferRange(range);
      }
      editor.insertText(text);
      if (!options.noEvent) {
        return editor.getBuffer().emitter.emit('did-stop-changing');
      }
    };
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      waitsForPromise(function() {
        return atom.workspace.open('sample.sass').then(function(textEditor) {
          return editor = textEditor;
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('pigments').then(function(pkg) {
          return pigmentsProject = pkg.mainModule.getProject();
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('minimap').then(function(pkg) {
          return minimapPackage = pkg.mainModule;
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('minimap-pigments').then(function(pkg) {
          return plugin = pkg.mainModule;
        });
      });
      runs(function() {
        minimap = minimapPackage.minimapForEditor(editor);
        return colorBuffer = pigmentsProject.colorBufferForEditor(editor);
      });
      waitsFor(function() {
        return binding = plugin.bindingForEditor(editor);
      });
      return runs(function() {
        return spyOn(minimap, 'decorateMarker').andCallThrough();
      });
    });
    return describe("with an open editor that have a minimap", function() {
      beforeEach(function() {
        return waitsForPromise(function() {
          return colorBuffer.initialize();
        });
      });
      it("creates a binding between the two plugins", function() {
        return expect(binding).toBeDefined();
      });
      it('decorates the minimap with color markers', function() {
        return expect(minimap.decorateMarker).toHaveBeenCalled();
      });
      describe('when a color is added', function() {
        beforeEach(function() {
          editor.moveToBottom();
          editBuffer('  border-color: yellow');
          return waitsFor(function() {
            return minimap.decorateMarker.callCount > 2;
          });
        });
        return it('adds a new decoration on the minimap', function() {
          return expect(minimap.decorateMarker.callCount).toEqual(3);
        });
      });
      describe('when a color is removed', function() {
        beforeEach(function() {
          spyOn(minimap, 'removeAllDecorationsForMarker').andCallThrough();
          editBuffer('', {
            start: [2, 0],
            end: [2, 2e308]
          });
          return waitsFor(function() {
            return minimap.removeAllDecorationsForMarker.callCount > 0;
          });
        });
        return it('removes the minimap decoration', function() {
          return expect(minimap.removeAllDecorationsForMarker.callCount).toEqual(1);
        });
      });
      describe('when the editor is destroyed', function() {
        beforeEach(function() {
          spyOn(binding, 'destroy').andCallThrough();
          return editor.destroy();
        });
        return it('also destroy the binding model', function() {
          expect(binding.destroy).toHaveBeenCalled();
          return expect(plugin.bindingForEditor(editor)).toBeUndefined();
        });
      });
      return describe('when the plugin is deactivated', function() {
        beforeEach(function() {
          spyOn(binding, 'destroy').andCallThrough();
          return plugin.deactivatePlugin();
        });
        return it('removes all the decorations from the minimap', function() {
          return expect(binding.destroy).toHaveBeenCalled();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdGhla2FybG85NS8uYXRvbS9wYWNrYWdlcy9taW5pbWFwLXBpZ21lbnRzL3NwZWMvbWluaW1hcC1waWdtZW50cy1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsZUFBQSxHQUFrQixPQUFBLENBQVEseUJBQVI7O0VBT2xCLFFBQUEsQ0FBUyxpQkFBVCxFQUE0QixTQUFBO0FBQzFCLFFBQUE7SUFBQSxNQUFxRyxFQUFyRyxFQUFDLHlCQUFELEVBQW1CLGVBQW5CLEVBQTJCLHVCQUEzQixFQUEyQyxnQkFBM0MsRUFBb0Qsd0JBQXBELEVBQXFFLG9CQUFyRSxFQUFrRixlQUFsRixFQUEwRjtJQUUxRixVQUFBLEdBQWEsU0FBQyxJQUFELEVBQU8sT0FBUDtBQUNYLFVBQUE7O1FBRGtCLFVBQVE7O01BQzFCLElBQUcscUJBQUg7UUFDRSxJQUFHLG1CQUFIO1VBQ0UsS0FBQSxHQUFRLENBQUMsT0FBTyxDQUFDLEtBQVQsRUFBZ0IsT0FBTyxDQUFDLEdBQXhCLEVBRFY7U0FBQSxNQUFBO1VBR0UsS0FBQSxHQUFRLENBQUMsT0FBTyxDQUFDLEtBQVQsRUFBZ0IsT0FBTyxDQUFDLEtBQXhCLEVBSFY7O1FBS0EsTUFBTSxDQUFDLHNCQUFQLENBQThCLEtBQTlCLEVBTkY7O01BUUEsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsSUFBbEI7TUFDQSxJQUFBLENBQTRELE9BQU8sQ0FBQyxPQUFwRTtlQUFBLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyxPQUFPLENBQUMsSUFBM0IsQ0FBZ0MsbUJBQWhDLEVBQUE7O0lBVlc7SUFZYixVQUFBLENBQVcsU0FBQTtNQUNULGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEI7TUFDbkIsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsZ0JBQXBCO01BRUEsZUFBQSxDQUFn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RUFBcUMsU0FBQTtpQkFDbkMsTUFBQSxDQUFPLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxTQUE3QyxDQUF1RCxDQUFDLE9BQXhELENBQWdFLENBQWhFO1FBRG1DLENBQXJDO01BUmtDLENBQXBDO01BV0EsUUFBQSxDQUFTLDhCQUFULEVBQXlDLFNBQUE7UUFDdkMsVUFBQSxDQUFXLFNBQUE7VUFDVCxLQUFBLENBQU0sT0FBTixFQUFlLFNBQWYsQ0FBeUIsQ0FBQyxjQUExQixDQUFBO2lCQUNBLE1BQU0sQ0FBQyxPQUFQLENBQUE7UUFGUyxDQUFYO2VBSUEsRUFBQSxDQUFHLGdDQUFILEVBQXFDLFNBQUE7VUFDbkMsTUFBQSxDQUFPLE9BQU8sQ0FBQyxPQUFmLENBQXVCLENBQUMsZ0JBQXhCLENBQUE7aUJBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixNQUF4QixDQUFQLENBQXVDLENBQUMsYUFBeEMsQ0FBQTtRQUhtQyxDQUFyQztNQUx1QyxDQUF6QzthQVVBLFFBQUEsQ0FBUyxnQ0FBVCxFQUEyQyxTQUFBO1FBQ3pDLFVBQUEsQ0FBVyxTQUFBO1VBQ1QsS0FBQSxDQUFNLE9BQU4sRUFBZSxTQUFmLENBQXlCLENBQUMsY0FBMUIsQ0FBQTtpQkFFQSxNQUFNLENBQUMsZ0JBQVAsQ0FBQTtRQUhTLENBQVg7ZUFLQSxFQUFBLENBQUcsOENBQUgsRUFBbUQsU0FBQTtpQkFDakQsTUFBQSxDQUFPLE9BQU8sQ0FBQyxPQUFmLENBQXVCLENBQUMsZ0JBQXhCLENBQUE7UUFEaUQsQ0FBbkQ7TUFOeUMsQ0FBM0M7SUF6Q2tELENBQXBEO0VBN0MwQixDQUE1QjtBQVBBIiwic291cmNlc0NvbnRlbnQiOlsiTWluaW1hcFBpZ21lbnRzID0gcmVxdWlyZSAnLi4vbGliL21pbmltYXAtcGlnbWVudHMnXG5cbiMgVXNlIHRoZSBjb21tYW5kIGB3aW5kb3c6cnVuLXBhY2thZ2Utc3BlY3NgIChjbWQtYWx0LWN0cmwtcCkgdG8gcnVuIHNwZWNzLlxuI1xuIyBUbyBydW4gYSBzcGVjaWZpYyBgaXRgIG9yIGBkZXNjcmliZWAgYmxvY2sgYWRkIGFuIGBmYCB0byB0aGUgZnJvbnQgKGUuZy4gYGZpdGBcbiMgb3IgYGZkZXNjcmliZWApLiBSZW1vdmUgdGhlIGBmYCB0byB1bmZvY3VzIHRoZSBibG9jay5cblxuZGVzY3JpYmUgXCJNaW5pbWFwUGlnbWVudHNcIiwgLT5cbiAgW3dvcmtzcGFjZUVsZW1lbnQsIGVkaXRvciwgbWluaW1hcFBhY2thZ2UsIG1pbmltYXAsIHBpZ21lbnRzUHJvamVjdCwgY29sb3JCdWZmZXIsIHBsdWdpbiwgYmluZGluZ10gPSBbXVxuXG4gIGVkaXRCdWZmZXIgPSAodGV4dCwgb3B0aW9ucz17fSkgLT5cbiAgICBpZiBvcHRpb25zLnN0YXJ0P1xuICAgICAgaWYgb3B0aW9ucy5lbmQ/XG4gICAgICAgIHJhbmdlID0gW29wdGlvbnMuc3RhcnQsIG9wdGlvbnMuZW5kXVxuICAgICAgZWxzZVxuICAgICAgICByYW5nZSA9IFtvcHRpb25zLnN0YXJ0LCBvcHRpb25zLnN0YXJ0XVxuXG4gICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZShyYW5nZSlcblxuICAgIGVkaXRvci5pbnNlcnRUZXh0KHRleHQpXG4gICAgZWRpdG9yLmdldEJ1ZmZlcigpLmVtaXR0ZXIuZW1pdCgnZGlkLXN0b3AtY2hhbmdpbmcnKSB1bmxlc3Mgb3B0aW9ucy5ub0V2ZW50XG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHdvcmtzcGFjZUVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpXG4gICAgamFzbWluZS5hdHRhY2hUb0RPTSh3b3Jrc3BhY2VFbGVtZW50KVxuXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdzYW1wbGUuc2FzcycpLnRoZW4gKHRleHRFZGl0b3IpIC0+XG4gICAgICAgIGVkaXRvciA9IHRleHRFZGl0b3JcblxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ3BpZ21lbnRzJykudGhlbiAocGtnKSAtPlxuICAgICAgICBwaWdtZW50c1Byb2plY3QgPSBwa2cubWFpbk1vZHVsZS5nZXRQcm9qZWN0KClcblxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ21pbmltYXAnKS50aGVuIChwa2cpIC0+XG4gICAgICAgIG1pbmltYXBQYWNrYWdlID0gcGtnLm1haW5Nb2R1bGVcblxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ21pbmltYXAtcGlnbWVudHMnKS50aGVuIChwa2cpIC0+XG4gICAgICAgIHBsdWdpbiA9IHBrZy5tYWluTW9kdWxlXG5cbiAgICBydW5zIC0+XG4gICAgICBtaW5pbWFwID0gbWluaW1hcFBhY2thZ2UubWluaW1hcEZvckVkaXRvcihlZGl0b3IpXG4gICAgICBjb2xvckJ1ZmZlciA9IHBpZ21lbnRzUHJvamVjdC5jb2xvckJ1ZmZlckZvckVkaXRvcihlZGl0b3IpXG5cbiAgICB3YWl0c0ZvciAtPlxuICAgICAgYmluZGluZyA9IHBsdWdpbi5iaW5kaW5nRm9yRWRpdG9yKGVkaXRvcilcblxuICAgIHJ1bnMgLT5cbiAgICAgIHNweU9uKG1pbmltYXAsICdkZWNvcmF0ZU1hcmtlcicpLmFuZENhbGxUaHJvdWdoKClcblxuICBkZXNjcmliZSBcIndpdGggYW4gb3BlbiBlZGl0b3IgdGhhdCBoYXZlIGEgbWluaW1hcFwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBjb2xvckJ1ZmZlci5pbml0aWFsaXplKClcblxuICAgIGl0IFwiY3JlYXRlcyBhIGJpbmRpbmcgYmV0d2VlbiB0aGUgdHdvIHBsdWdpbnNcIiwgLT5cbiAgICAgIGV4cGVjdChiaW5kaW5nKS50b0JlRGVmaW5lZCgpXG5cbiAgICBpdCAnZGVjb3JhdGVzIHRoZSBtaW5pbWFwIHdpdGggY29sb3IgbWFya2VycycsIC0+XG4gICAgICBleHBlY3QobWluaW1hcC5kZWNvcmF0ZU1hcmtlcikudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICBkZXNjcmliZSAnd2hlbiBhIGNvbG9yIGlzIGFkZGVkJywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgZWRpdG9yLm1vdmVUb0JvdHRvbSgpXG4gICAgICAgIGVkaXRCdWZmZXIoJyAgYm9yZGVyLWNvbG9yOiB5ZWxsb3cnKVxuXG4gICAgICAgIHdhaXRzRm9yIC0+IG1pbmltYXAuZGVjb3JhdGVNYXJrZXIuY2FsbENvdW50ID4gMlxuXG4gICAgICBpdCAnYWRkcyBhIG5ldyBkZWNvcmF0aW9uIG9uIHRoZSBtaW5pbWFwJywgLT5cbiAgICAgICAgZXhwZWN0KG1pbmltYXAuZGVjb3JhdGVNYXJrZXIuY2FsbENvdW50KS50b0VxdWFsKDMpXG5cbiAgICBkZXNjcmliZSAnd2hlbiBhIGNvbG9yIGlzIHJlbW92ZWQnLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBzcHlPbihtaW5pbWFwLCAncmVtb3ZlQWxsRGVjb3JhdGlvbnNGb3JNYXJrZXInKS5hbmRDYWxsVGhyb3VnaCgpXG5cbiAgICAgICAgZWRpdEJ1ZmZlcignJywgc3RhcnQ6IFsyLDBdLCBlbmQ6IFsyLCBJbmZpbml0eV0pXG5cbiAgICAgICAgd2FpdHNGb3IgLT4gbWluaW1hcC5yZW1vdmVBbGxEZWNvcmF0aW9uc0Zvck1hcmtlci5jYWxsQ291bnQgPiAwXG5cbiAgICAgIGl0ICdyZW1vdmVzIHRoZSBtaW5pbWFwIGRlY29yYXRpb24nLCAtPlxuICAgICAgICBleHBlY3QobWluaW1hcC5yZW1vdmVBbGxEZWNvcmF0aW9uc0Zvck1hcmtlci5jYWxsQ291bnQpLnRvRXF1YWwoMSlcblxuICAgIGRlc2NyaWJlICd3aGVuIHRoZSBlZGl0b3IgaXMgZGVzdHJveWVkJywgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgc3B5T24oYmluZGluZywgJ2Rlc3Ryb3knKS5hbmRDYWxsVGhyb3VnaCgpXG4gICAgICAgIGVkaXRvci5kZXN0cm95KClcblxuICAgICAgaXQgJ2Fsc28gZGVzdHJveSB0aGUgYmluZGluZyBtb2RlbCcsIC0+XG4gICAgICAgIGV4cGVjdChiaW5kaW5nLmRlc3Ryb3kpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICAgIGV4cGVjdChwbHVnaW4uYmluZGluZ0ZvckVkaXRvcihlZGl0b3IpKS50b0JlVW5kZWZpbmVkKClcblxuICAgIGRlc2NyaWJlICd3aGVuIHRoZSBwbHVnaW4gaXMgZGVhY3RpdmF0ZWQnLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBzcHlPbihiaW5kaW5nLCAnZGVzdHJveScpLmFuZENhbGxUaHJvdWdoKClcblxuICAgICAgICBwbHVnaW4uZGVhY3RpdmF0ZVBsdWdpbigpXG5cbiAgICAgIGl0ICdyZW1vdmVzIGFsbCB0aGUgZGVjb3JhdGlvbnMgZnJvbSB0aGUgbWluaW1hcCcsIC0+XG4gICAgICAgIGV4cGVjdChiaW5kaW5nLmRlc3Ryb3kpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuIl19
