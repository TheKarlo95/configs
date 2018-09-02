(function() {
  describe("JSX indent", function() {
    var buffer, editor, formattedFile, formattedLines, formattedSample, fs, languageMode, ref, sampleFile;
    fs = require('fs');
    formattedFile = require.resolve('./fixtures/sample-formatted.jsx');
    sampleFile = require.resolve('./fixtures/sample.jsx');
    formattedSample = fs.readFileSync(formattedFile);
    formattedLines = formattedSample.toString().split('\n');
    ref = [], editor = ref[0], buffer = ref[1], languageMode = ref[2];
    afterEach(function() {
      return editor.destroy();
    });
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open(sampleFile, {
          autoIndent: false
        }).then(function(o) {
          editor = o;
          return buffer = editor.buffer, languageMode = editor.languageMode, editor;
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("react");
      });
      afterEach(function() {
        atom.packages.deactivatePackages();
        return atom.packages.unloadPackages();
      });
      return runs(function() {
        var grammar;
        grammar = atom.grammars.grammarForScopeName("source.js.jsx");
        return editor.setGrammar(grammar);
      });
    });
    return describe("should indent sample file correctly", function() {
      return it("autoIndentBufferRows should indent same as sample file", function() {
        var i, j, line, ref1, results;
        editor.autoIndentBufferRows(0, formattedLines.length - 1);
        results = [];
        for (i = j = 0, ref1 = formattedLines.length; 0 <= ref1 ? j < ref1 : j > ref1; i = 0 <= ref1 ? ++j : --j) {
          line = formattedLines[i];
          if (!line.trim()) {
            continue;
          }
          results.push(expect((i + 1) + ":" + buffer.lineForRow(i)).toBe((i + 1) + ":" + line));
        }
        return results;
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdGhla2FybG85NS8uYXRvbS9wYWNrYWdlcy9yZWFjdC9zcGVjL2luZGVudC1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLFFBQUEsQ0FBUyxZQUFULEVBQXVCLFNBQUE7QUFDckIsUUFBQTtJQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjtJQUNMLGFBQUEsR0FBZ0IsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsaUNBQWhCO0lBQ2hCLFVBQUEsR0FBYSxPQUFPLENBQUMsT0FBUixDQUFnQix1QkFBaEI7SUFDYixlQUFBLEdBQWtCLEVBQUUsQ0FBQyxZQUFILENBQWdCLGFBQWhCO0lBQ2xCLGNBQUEsR0FBaUIsZUFBZSxDQUFDLFFBQWhCLENBQUEsQ0FBMEIsQ0FBQyxLQUEzQixDQUFpQyxJQUFqQztJQUNqQixNQUFpQyxFQUFqQyxFQUFDLGVBQUQsRUFBUyxlQUFULEVBQWlCO0lBRWpCLFNBQUEsQ0FBVSxTQUFBO2FBQ1IsTUFBTSxDQUFDLE9BQVAsQ0FBQTtJQURRLENBQVY7SUFHQSxVQUFBLENBQVcsU0FBQTtNQUNULGVBQUEsQ0FBZ0IsU0FBQTtlQUNaLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixVQUFwQixFQUFnQztVQUFBLFVBQUEsRUFBWSxLQUFaO1NBQWhDLENBQWtELENBQUMsSUFBbkQsQ0FBd0QsU0FBQyxDQUFEO1VBQ3RELE1BQUEsR0FBUztpQkFDUixzQkFBRCxFQUFTLGtDQUFULEVBQXlCO1FBRjZCLENBQXhEO01BRFksQ0FBaEI7TUFLQSxlQUFBLENBQWdCLFNBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsT0FBOUI7TUFEYyxDQUFoQjtNQUdBLFNBQUEsQ0FBVSxTQUFBO1FBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBZCxDQUFBO2VBQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFkLENBQUE7TUFGUSxDQUFWO2FBSUEsSUFBQSxDQUFLLFNBQUE7QUFDSCxZQUFBO1FBQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQWQsQ0FBa0MsZUFBbEM7ZUFDVixNQUFNLENBQUMsVUFBUCxDQUFrQixPQUFsQjtNQUZHLENBQUw7SUFiUyxDQUFYO1dBaUJBLFFBQUEsQ0FBUyxxQ0FBVCxFQUFnRCxTQUFBO2FBQzlDLEVBQUEsQ0FBRyx3REFBSCxFQUE2RCxTQUFBO0FBQzNELFlBQUE7UUFBQSxNQUFNLENBQUMsb0JBQVAsQ0FBNEIsQ0FBNUIsRUFBK0IsY0FBYyxDQUFDLE1BQWYsR0FBd0IsQ0FBdkQ7QUFDQTthQUFTLG1HQUFUO1VBQ0UsSUFBQSxHQUFPLGNBQWUsQ0FBQSxDQUFBO1VBQ3RCLElBQVksQ0FBQyxJQUFJLENBQUMsSUFBTCxDQUFBLENBQWI7QUFBQSxxQkFBQTs7dUJBQ0EsTUFBQSxDQUFPLENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBQSxHQUFVLEdBQVYsR0FBZ0IsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsQ0FBbEIsQ0FBdkIsQ0FBNEMsQ0FBQyxJQUE3QyxDQUFtRCxDQUFDLENBQUEsR0FBSSxDQUFMLENBQUEsR0FBVSxHQUFWLEdBQWdCLElBQW5FO0FBSEY7O01BRjJELENBQTdEO0lBRDhDLENBQWhEO0VBNUJxQixDQUF2QjtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiZGVzY3JpYmUgXCJKU1ggaW5kZW50XCIsIC0+XG4gIGZzID0gcmVxdWlyZSAnZnMnXG4gIGZvcm1hdHRlZEZpbGUgPSByZXF1aXJlLnJlc29sdmUgJy4vZml4dHVyZXMvc2FtcGxlLWZvcm1hdHRlZC5qc3gnXG4gIHNhbXBsZUZpbGUgPSByZXF1aXJlLnJlc29sdmUgJy4vZml4dHVyZXMvc2FtcGxlLmpzeCdcbiAgZm9ybWF0dGVkU2FtcGxlID0gZnMucmVhZEZpbGVTeW5jIGZvcm1hdHRlZEZpbGVcbiAgZm9ybWF0dGVkTGluZXMgPSBmb3JtYXR0ZWRTYW1wbGUudG9TdHJpbmcoKS5zcGxpdCAnXFxuJ1xuICBbZWRpdG9yLCBidWZmZXIsIGxhbmd1YWdlTW9kZV0gPSBbXVxuXG4gIGFmdGVyRWFjaCAtPlxuICAgIGVkaXRvci5kZXN0cm95KClcblxuICBiZWZvcmVFYWNoIC0+XG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oc2FtcGxlRmlsZSwgYXV0b0luZGVudDogZmFsc2UpLnRoZW4gKG8pIC0+XG4gICAgICAgICAgZWRpdG9yID0gb1xuICAgICAgICAgIHtidWZmZXIsIGxhbmd1YWdlTW9kZX0gPSBlZGl0b3JcblxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoXCJyZWFjdFwiKVxuXG4gICAgYWZ0ZXJFYWNoIC0+XG4gICAgICBhdG9tLnBhY2thZ2VzLmRlYWN0aXZhdGVQYWNrYWdlcygpXG4gICAgICBhdG9tLnBhY2thZ2VzLnVubG9hZFBhY2thZ2VzKClcblxuICAgIHJ1bnMgLT5cbiAgICAgIGdyYW1tYXIgPSBhdG9tLmdyYW1tYXJzLmdyYW1tYXJGb3JTY29wZU5hbWUoXCJzb3VyY2UuanMuanN4XCIpXG4gICAgICBlZGl0b3Iuc2V0R3JhbW1hcihncmFtbWFyKTtcblxuICBkZXNjcmliZSBcInNob3VsZCBpbmRlbnQgc2FtcGxlIGZpbGUgY29ycmVjdGx5XCIsIC0+XG4gICAgaXQgXCJhdXRvSW5kZW50QnVmZmVyUm93cyBzaG91bGQgaW5kZW50IHNhbWUgYXMgc2FtcGxlIGZpbGVcIiwgLT5cbiAgICAgIGVkaXRvci5hdXRvSW5kZW50QnVmZmVyUm93cygwLCBmb3JtYXR0ZWRMaW5lcy5sZW5ndGggLSAxKVxuICAgICAgZm9yIGkgaW4gWzAuLi5mb3JtYXR0ZWRMaW5lcy5sZW5ndGhdXG4gICAgICAgIGxpbmUgPSBmb3JtYXR0ZWRMaW5lc1tpXVxuICAgICAgICBjb250aW51ZSBpZiAhbGluZS50cmltKClcbiAgICAgICAgZXhwZWN0KChpICsgMSkgKyBcIjpcIiArIGJ1ZmZlci5saW5lRm9yUm93KGkpKS50b0JlICgoaSArIDEpICsgXCI6XCIgKyBsaW5lKVxuIl19
