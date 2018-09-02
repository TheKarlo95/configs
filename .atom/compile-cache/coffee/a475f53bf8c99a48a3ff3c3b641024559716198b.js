(function() {
  describe("React tests", function() {
    var sampleCorrectAddonsES6File, sampleCorrectAddonsFile, sampleCorrectES6File, sampleCorrectFile, sampleCorrectNativeFile, sampleInvalidFile;
    sampleCorrectFile = require.resolve('./fixtures/sample-correct.js');
    sampleCorrectNativeFile = require.resolve('./fixtures/sample-correct-native.js');
    sampleCorrectES6File = require.resolve('./fixtures/sample-correct-es6.js');
    sampleCorrectAddonsES6File = require.resolve('./fixtures/sample-correct-addons-es6.js');
    sampleCorrectAddonsFile = require.resolve('./fixtures/sample-correct-addons.js');
    sampleInvalidFile = require.resolve('./fixtures/sample-invalid.js');
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-javascript");
      });
      return waitsForPromise(function() {
        return atom.packages.activatePackage("react");
      });
    });
    afterEach(function() {
      waitsForPromise(function() {
        return atom.packages.deactivatePackages();
      });
      return runs(function() {
        return atom.packages.unloadPackages();
      });
    });
    return describe("should select correct grammar", function() {
      it("should select source.js.jsx if file has require('react')", function() {
        return waitsForPromise(function() {
          return atom.workspace.open(sampleCorrectFile, {
            autoIndent: false
          }).then(function(editor) {
            expect(editor.getGrammar().scopeName).toEqual('source.js.jsx');
            return editor.destroy();
          });
        });
      });
      it("should select source.js.jsx if file has require('react-native')", function() {
        return waitsForPromise(function() {
          return atom.workspace.open(sampleCorrectNativeFile, {
            autoIndent: false
          }).then(function(editor) {
            expect(editor.getGrammar().scopeName).toEqual('source.js.jsx');
            return editor.destroy();
          });
        });
      });
      it("should select source.js.jsx if file has require('react/addons')", function() {
        return waitsForPromise(function() {
          return atom.workspace.open(sampleCorrectAddonsFile, {
            autoIndent: false
          }).then(function(editor) {
            expect(editor.getGrammar().scopeName).toEqual('source.js.jsx');
            return editor.destroy();
          });
        });
      });
      it("should select source.js.jsx if file has react es6 import", function() {
        return waitsForPromise(function() {
          return atom.workspace.open(sampleCorrectES6File, {
            autoIndent: false
          }).then(function(editor) {
            expect(editor.getGrammar().scopeName).toEqual('source.js.jsx');
            return editor.destroy();
          });
        });
      });
      it("should select source.js.jsx if file has react/addons es6 import", function() {
        return waitsForPromise(function() {
          return atom.workspace.open(sampleCorrectAddonsES6File, {
            autoIndent: false
          }).then(function(editor) {
            expect(editor.getGrammar().scopeName).toEqual('source.js.jsx');
            return editor.destroy();
          });
        });
      });
      return it("should select source.js if file doesnt have require('react')", function() {
        return waitsForPromise(function() {
          return atom.workspace.open(sampleInvalidFile, {
            autoIndent: false
          }).then(function(editor) {
            expect(editor.getGrammar().scopeName).toEqual('source.js');
            return editor.destroy();
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdGhla2FybG85NS8uYXRvbS9wYWNrYWdlcy9yZWFjdC9zcGVjL2F0b20tcmVhY3Qtc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxRQUFBLENBQVMsYUFBVCxFQUF3QixTQUFBO0FBQ3RCLFFBQUE7SUFBQSxpQkFBQSxHQUFvQixPQUFPLENBQUMsT0FBUixDQUFnQiw4QkFBaEI7SUFDcEIsdUJBQUEsR0FBMEIsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IscUNBQWhCO0lBQzFCLG9CQUFBLEdBQXVCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLGtDQUFoQjtJQUN2QiwwQkFBQSxHQUE2QixPQUFPLENBQUMsT0FBUixDQUFnQix5Q0FBaEI7SUFDN0IsdUJBQUEsR0FBMEIsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IscUNBQWhCO0lBQzFCLGlCQUFBLEdBQW9CLE9BQU8sQ0FBQyxPQUFSLENBQWdCLDhCQUFoQjtJQUVwQixVQUFBLENBQVcsU0FBQTtNQUNULGVBQUEsQ0FBZ0IsU0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixxQkFBOUI7TUFEYyxDQUFoQjthQUdBLGVBQUEsQ0FBZ0IsU0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixPQUE5QjtNQURjLENBQWhCO0lBSlMsQ0FBWDtJQU9BLFNBQUEsQ0FBVSxTQUFBO01BQ1IsZUFBQSxDQUFnQixTQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBZCxDQUFBO01BRGMsQ0FBaEI7YUFFQSxJQUFBLENBQUssU0FBQTtlQUNILElBQUksQ0FBQyxRQUFRLENBQUMsY0FBZCxDQUFBO01BREcsQ0FBTDtJQUhRLENBQVY7V0FNQSxRQUFBLENBQVMsK0JBQVQsRUFBMEMsU0FBQTtNQUN4QyxFQUFBLENBQUcsMERBQUgsRUFBK0QsU0FBQTtlQUM3RCxlQUFBLENBQWdCLFNBQUE7aUJBQ2Qs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QjtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiZGVzY3JpYmUgXCJSZWFjdCB0ZXN0c1wiLCAtPlxuICBzYW1wbGVDb3JyZWN0RmlsZSA9IHJlcXVpcmUucmVzb2x2ZSAnLi9maXh0dXJlcy9zYW1wbGUtY29ycmVjdC5qcydcbiAgc2FtcGxlQ29ycmVjdE5hdGl2ZUZpbGUgPSByZXF1aXJlLnJlc29sdmUgJy4vZml4dHVyZXMvc2FtcGxlLWNvcnJlY3QtbmF0aXZlLmpzJ1xuICBzYW1wbGVDb3JyZWN0RVM2RmlsZSA9IHJlcXVpcmUucmVzb2x2ZSAnLi9maXh0dXJlcy9zYW1wbGUtY29ycmVjdC1lczYuanMnXG4gIHNhbXBsZUNvcnJlY3RBZGRvbnNFUzZGaWxlID0gcmVxdWlyZS5yZXNvbHZlICcuL2ZpeHR1cmVzL3NhbXBsZS1jb3JyZWN0LWFkZG9ucy1lczYuanMnXG4gIHNhbXBsZUNvcnJlY3RBZGRvbnNGaWxlID0gcmVxdWlyZS5yZXNvbHZlICcuL2ZpeHR1cmVzL3NhbXBsZS1jb3JyZWN0LWFkZG9ucy5qcydcbiAgc2FtcGxlSW52YWxpZEZpbGUgPSByZXF1aXJlLnJlc29sdmUgJy4vZml4dHVyZXMvc2FtcGxlLWludmFsaWQuanMnXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoXCJsYW5ndWFnZS1qYXZhc2NyaXB0XCIpXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKFwicmVhY3RcIilcblxuICBhZnRlckVhY2ggLT5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGF0b20ucGFja2FnZXMuZGVhY3RpdmF0ZVBhY2thZ2VzKClcbiAgICBydW5zIC0+XG4gICAgICBhdG9tLnBhY2thZ2VzLnVubG9hZFBhY2thZ2VzKClcblxuICBkZXNjcmliZSBcInNob3VsZCBzZWxlY3QgY29ycmVjdCBncmFtbWFyXCIsIC0+XG4gICAgaXQgXCJzaG91bGQgc2VsZWN0IHNvdXJjZS5qcy5qc3ggaWYgZmlsZSBoYXMgcmVxdWlyZSgncmVhY3QnKVwiLCAtPlxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oc2FtcGxlQ29ycmVjdEZpbGUsIGF1dG9JbmRlbnQ6IGZhbHNlKS50aGVuIChlZGl0b3IpIC0+XG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lKS50b0VxdWFsICdzb3VyY2UuanMuanN4J1xuICAgICAgICAgIGVkaXRvci5kZXN0cm95KClcblxuICAgIGl0IFwic2hvdWxkIHNlbGVjdCBzb3VyY2UuanMuanN4IGlmIGZpbGUgaGFzIHJlcXVpcmUoJ3JlYWN0LW5hdGl2ZScpXCIsIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihzYW1wbGVDb3JyZWN0TmF0aXZlRmlsZSwgYXV0b0luZGVudDogZmFsc2UpLnRoZW4gKGVkaXRvcikgLT5cbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWUpLnRvRXF1YWwgJ3NvdXJjZS5qcy5qc3gnXG4gICAgICAgICAgZWRpdG9yLmRlc3Ryb3koKVxuXG4gICAgaXQgXCJzaG91bGQgc2VsZWN0IHNvdXJjZS5qcy5qc3ggaWYgZmlsZSBoYXMgcmVxdWlyZSgncmVhY3QvYWRkb25zJylcIiwgLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKHNhbXBsZUNvcnJlY3RBZGRvbnNGaWxlLCBhdXRvSW5kZW50OiBmYWxzZSkudGhlbiAoZWRpdG9yKSAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZSkudG9FcXVhbCAnc291cmNlLmpzLmpzeCdcbiAgICAgICAgICBlZGl0b3IuZGVzdHJveSgpXG5cbiAgICBpdCBcInNob3VsZCBzZWxlY3Qgc291cmNlLmpzLmpzeCBpZiBmaWxlIGhhcyByZWFjdCBlczYgaW1wb3J0XCIsIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihzYW1wbGVDb3JyZWN0RVM2RmlsZSwgYXV0b0luZGVudDogZmFsc2UpLnRoZW4gKGVkaXRvcikgLT5cbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWUpLnRvRXF1YWwgJ3NvdXJjZS5qcy5qc3gnXG4gICAgICAgICAgZWRpdG9yLmRlc3Ryb3koKVxuXG4gICAgaXQgXCJzaG91bGQgc2VsZWN0IHNvdXJjZS5qcy5qc3ggaWYgZmlsZSBoYXMgcmVhY3QvYWRkb25zIGVzNiBpbXBvcnRcIiwgLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKHNhbXBsZUNvcnJlY3RBZGRvbnNFUzZGaWxlLCBhdXRvSW5kZW50OiBmYWxzZSkudGhlbiAoZWRpdG9yKSAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZSkudG9FcXVhbCAnc291cmNlLmpzLmpzeCdcbiAgICAgICAgICBlZGl0b3IuZGVzdHJveSgpXG5cbiAgICBpdCBcInNob3VsZCBzZWxlY3Qgc291cmNlLmpzIGlmIGZpbGUgZG9lc250IGhhdmUgcmVxdWlyZSgncmVhY3QnKVwiLCAtPlxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oc2FtcGxlSW52YWxpZEZpbGUsIGF1dG9JbmRlbnQ6IGZhbHNlKS50aGVuIChlZGl0b3IpIC0+XG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lKS50b0VxdWFsICdzb3VyY2UuanMnXG4gICAgICAgICAgZWRpdG9yLmRlc3Ryb3koKVxuIl19
