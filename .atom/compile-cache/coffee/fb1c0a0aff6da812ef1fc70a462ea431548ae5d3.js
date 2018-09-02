(function() {
  describe('Coffee-React grammar', function() {
    var grammar;
    grammar = null;
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-coffee-script');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('react');
      });
      return runs(function() {
        return grammar = atom.grammars.grammarForScopeName('source.coffee.jsx');
      });
    });
    it('parses the grammar', function() {
      expect(grammar).toBeTruthy();
      return expect(grammar.scopeName).toBe('source.coffee.jsx');
    });
    it('tokenizes CoffeeScript', function() {
      var tokens;
      tokens = grammar.tokenizeLine('foo = @bar').tokens;
      expect(tokens.length).toEqual(5);
      expect(tokens[0]).toEqual({
        value: 'foo',
        scopes: ['source.coffee.jsx', 'variable.assignment.coffee']
      });
      expect(tokens[1]).toEqual({
        value: ' ',
        scopes: ['source.coffee.jsx']
      });
      expect(tokens[2]).toEqual({
        value: '=',
        scopes: ['source.coffee.jsx', 'keyword.operator.assignment.coffee']
      });
      expect(tokens[3]).toEqual({
        value: ' ',
        scopes: ['source.coffee.jsx']
      });
      return expect(tokens[4]).toEqual({
        value: '@bar',
        scopes: ['source.coffee.jsx', 'variable.other.readwrite.instance.coffee']
      });
    });
    return describe('CJSX', function() {
      it('tokenizes CJSX', function() {
        var tokens;
        tokens = grammar.tokenizeLine('<div>hi</div>').tokens;
        expect(tokens.length).toEqual(7);
        expect(tokens[0]).toEqual({
          value: '<',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'punctuation.definition.tag.begin.html']
        });
        expect(tokens[1]).toEqual({
          value: 'div',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'entity.name.tag.other.html']
        });
        expect(tokens[2]).toEqual({
          value: '>',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'punctuation.definition.tag.end.html']
        });
        expect(tokens[3]).toEqual({
          value: 'hi',
          scopes: ['source.coffee.jsx']
        });
        expect(tokens[4]).toEqual({
          value: '<',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'punctuation.definition.tag.begin.html']
        });
        expect(tokens[5]).toEqual({
          value: '/div',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'entity.name.tag.other.html']
        });
        return expect(tokens[6]).toEqual({
          value: '>',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'punctuation.definition.tag.end.html']
        });
      });
      it('tokenizes props', function() {
        var tokens;
        tokens = grammar.tokenizeLine('<div className="span6"></div>').tokens;
        expect(tokens.length).toEqual(12);
        expect(tokens[2]).toEqual({
          value: ' ',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html']
        });
        expect(tokens[3]).toEqual({
          value: 'className',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'entity.other.attribute-name.html']
        });
        expect(tokens[4]).toEqual({
          value: '=',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html']
        });
        expect(tokens[5]).toEqual({
          value: '"',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'string.quoted.double.html', 'punctuation.definition.string.begin.html']
        });
        expect(tokens[6]).toEqual({
          value: 'span6',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'string.quoted.double.html']
        });
        return expect(tokens[7]).toEqual({
          value: '"',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'string.quoted.double.html', 'punctuation.definition.string.end.html']
        });
      });
      it('tokenizes props with digits', function() {
        var tokens;
        tokens = grammar.tokenizeLine('<div thing1="hi"></div>').tokens;
        return expect(tokens[3]).toEqual({
          value: 'thing1',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'entity.other.attribute-name.html']
        });
      });
      it('tokenizes interpolated CoffeeScript strings', function() {
        var tokens;
        tokens = grammar.tokenizeLine('<div className="#{@var}"></div>').tokens;
        expect(tokens.length).toEqual(14);
        expect(tokens[6]).toEqual({
          value: '#{',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'string.quoted.double.html', 'source.coffee.embedded.source', 'punctuation.section.embedded.coffee']
        });
        expect(tokens[7]).toEqual({
          value: '@var',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'string.quoted.double.html', 'source.coffee.embedded.source', 'variable.other.readwrite.instance.coffee']
        });
        return expect(tokens[8]).toEqual({
          value: '}',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'string.quoted.double.html', 'source.coffee.embedded.source', 'punctuation.section.embedded.coffee']
        });
      });
      it('tokenizes embedded CoffeeScript', function() {
        var tokens;
        tokens = grammar.tokenizeLine('<div>{@var}</div>').tokens;
        expect(tokens.length).toEqual(9);
        expect(tokens[3]).toEqual({
          value: '{',
          scopes: ['source.coffee.jsx', 'meta.brace.curly.coffee']
        });
        expect(tokens[4]).toEqual({
          value: '@var',
          scopes: ['source.coffee.jsx', 'variable.other.readwrite.instance.coffee']
        });
        return expect(tokens[5]).toEqual({
          value: '}',
          scopes: ['source.coffee.jsx', 'meta.brace.curly.coffee']
        });
      });
      return it("doesn't tokenize inner CJSX as CoffeeScript", function() {
        var tokens;
        tokens = grammar.tokenizeLine("<div>it's and</div>").tokens;
        expect(tokens.length).toEqual(7);
        return expect(tokens[3]).toEqual({
          value: "it's and",
          scopes: ['source.coffee.jsx']
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdGhla2FybG85NS8uYXRvbS9wYWNrYWdlcy9yZWFjdC9zcGVjL2NvZmZlZS1yZWFjdC1ncmFtbWFyLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsUUFBQSxDQUFTLHNCQUFULEVBQWlDLFNBQUE7QUFDL0IsUUFBQTtJQUFBLE9BQUEsR0FBVTtJQUVWLFVBQUEsQ0FBVyxTQUFBO01BQ1QsZUFBQSxDQUFnQixTQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLHdCQUE5QjtNQURjLENBQWhCO01BRUEsZUFBQSxDQUFnQixTQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLE9BQTlCO01BRGMsQ0FBaEI7YUFHQSxJQUFBLENBQUssU0FBQTtlQUNILE9BQUEsR0FBVSxJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFkLENBQWtDLG1CQUFsQztNQURQLENBQUw7SUFOUyxDQUFYO0lBU0EsRUFBQSxDQUFHLG9CQUFILEVBQXlCLFNBQUE7TUFDdkIsTUFBQSxDQUFPLE9BQVAsQ0FBZSxDQUFDLFVBQWhCLENBQUE7YUFDQSxNQUFBLENBQU8sT0FBTyxDQUFDLFNBQWYsQ0FBeUIsQ0FBQyxJQUExQixDQUErQixtQkFBL0I7SUFGdUIsQ0FBekI7SUFJQSxFQUFBLENBQUcsd0JBQUgsRUFBNkIsU0FBQTtBQUMzQixVQUFBO01BQUMsU0FBVSxPQUFPLENBQUMsWUFBUixDQUFxQixZQUFyQjtNQUVYLE1BQUEsQ0FBTyxNQUFNLENBQUMsTUFBZCxDQUFxQixDQUFDLE9BQXRCLENBQThCLENBQTlCO01BRUEsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUNFO1FBQUEsS0FBQSxFQUFPLEtBQVA7UUFDQSxNQUFBLEVBQVEsQ0FDTixtQkFETSxFQUVOLDRCQUZNLENBRFI7T0FERjtNQU1BLE1BQUEsQ0FB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LEtBQUEsRUFBTyxHQUFQO1VBQ0EsTUFBQSxFQUFRLENBQ04sbUJBRE0sRUFFTix5QkFGTSxDQURSO1NBREY7UUFNQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQ0U7VUFBQSxLQUFBLEVBQU8sTUFBUDtVQUNBLE1BQUEsRUFBUSxDQUNOLG1CQURNLEVBRU4sMENBRk0sQ0FEUjtTQURGO2VBTUEsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUNFO1VBQUEsS0FBQSxFQUFPLEdBQVA7VUFDQSxNQUFBLEVBQVEsQ0FDTixtQkFETSxFQUVOLHlCQUZNLENBRFI7U0FERjtNQWpCb0MsQ0FBdEM7YUF3QkEsRUFBQSxDQUFHLDZDQUFILEVBQWtELFNBQUE7QUFDaEQsWUFBQTtRQUFDLFNBQVUsT0FBTyxDQUFDLFlBQVIsQ0FBcUIscUJBQXJCO1FBRVgsTUFBQSxDQUFPLE1BQU0sQ0FBQyxNQUFkLENBQXFCLENBQUMsT0FBdEIsQ0FBOEIsQ0FBOUI7ZUFFQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQ0U7VUFBQSxLQUFBLEVBQU8sVUFBUDtVQUNBLE1BQUEsRUFBUSxDQUNOLG1CQURNLENBRFI7U0FERjtNQUxnRCxDQUFsRDtJQTNLZSxDQUFqQjtFQWxEK0IsQ0FBakM7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImRlc2NyaWJlICdDb2ZmZWUtUmVhY3QgZ3JhbW1hcicsIC0+XG4gIGdyYW1tYXIgPSBudWxsXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xhbmd1YWdlLWNvZmZlZS1zY3JpcHQnKVxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ3JlYWN0JylcblxuICAgIHJ1bnMgLT5cbiAgICAgIGdyYW1tYXIgPSBhdG9tLmdyYW1tYXJzLmdyYW1tYXJGb3JTY29wZU5hbWUoJ3NvdXJjZS5jb2ZmZWUuanN4JylcblxuICBpdCAncGFyc2VzIHRoZSBncmFtbWFyJywgLT5cbiAgICBleHBlY3QoZ3JhbW1hcikudG9CZVRydXRoeSgpXG4gICAgZXhwZWN0KGdyYW1tYXIuc2NvcGVOYW1lKS50b0JlICdzb3VyY2UuY29mZmVlLmpzeCdcblxuICBpdCAndG9rZW5pemVzIENvZmZlZVNjcmlwdCcsIC0+XG4gICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgnZm9vID0gQGJhcicpXG5cbiAgICBleHBlY3QodG9rZW5zLmxlbmd0aCkudG9FcXVhbCA1XG5cbiAgICBleHBlY3QodG9rZW5zWzBdKS50b0VxdWFsXG4gICAgICB2YWx1ZTogJ2ZvbydcbiAgICAgIHNjb3BlczogW1xuICAgICAgICAnc291cmNlLmNvZmZlZS5qc3gnXG4gICAgICAgICd2YXJpYWJsZS5hc3NpZ25tZW50LmNvZmZlZSdcbiAgICAgIF1cbiAgICBleHBlY3QodG9rZW5zWzFdKS50b0VxdWFsXG4gICAgICB2YWx1ZTogJyAnXG4gICAgICBzY29wZXM6IFtcbiAgICAgICAgJ3NvdXJjZS5jb2ZmZWUuanN4J1xuICAgICAgXVxuICAgIGV4cGVjdCh0b2tlbnNbMl0pLnRvRXF1YWxcbiAgICAgIHZhbHVlOiAnPSdcbiAgICAgIHNjb3BlczogW1xuICAgICAgICAnc291cmNlLmNvZmZlZS5qc3gnXG4gICAgICAgICdrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuY29mZmVlJ1xuICAgICAgXVxuICAgIGV4cGVjdCh0b2tlbnNbM10pLnRvRXF1YWxcbiAgICAgIHZhbHVlOiAnICdcbiAgICAgIHNjb3BlczogW1xuICAgICAgICAnc291cmNlLmNvZmZlZS5qc3gnXG4gICAgICBdXG4gICAgZXhwZWN0KHRva2Vuc1s0XSkudG9FcXVhbFxuICAgICAgdmFsdWU6ICdAYmFyJ1xuICAgICAgc2NvcGVzOiBbXG4gICAgICAgICdzb3VyY2UuY29mZmVlLmpzeCdcbiAgICAgICAgJ3ZhcmlhYmxlLm90aGVyLnJlYWR3cml0ZS5pbnN0YW5jZS5jb2ZmZWUnXG4gICAgICBdXG5cbiAgZGVzY3JpYmUgJ0NKU1gnLCAtPlxuXG4gICAgaXQgJ3Rva2VuaXplcyBDSlNYJywgLT5cbiAgICAgIHt0b2tlbnN9ID0gZ3JhbW1hci50b2tlbml6ZUxpbmUgJzxkaXY+aGk8L2Rpdj4nXG5cbiAgICAgIGV4cGVjdCh0b2tlbnMubGVuZ3RoKS50b0VxdWFsIDdcblxuICAgICAgZXhwZWN0KHRva2Vuc1swXSkudG9FcXVhbFxuICAgICAgICB2YWx1ZTogJzwnXG4gICAgICAgIHNjb3BlczogW1xuICAgICAgICAgICdzb3VyY2UuY29mZmVlLmpzeCdcbiAgICAgICAgICAnbWV0YS50YWcub3RoZXIuaHRtbCdcbiAgICAgICAgICAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuYmVnaW4uaHRtbCdcbiAgICAgICAgXVxuICAgICAgZXhwZWN0KHRva2Vuc1sxXSkudG9FcXVhbFxuICAgICAgICB2YWx1ZTogJ2RpdidcbiAgICAgICAgc2NvcGVzOiBbXG4gICAgICAgICAgJ3NvdXJjZS5jb2ZmZWUuanN4J1xuICAgICAgICAgICdtZXRhLnRhZy5vdGhlci5odG1sJ1xuICAgICAgICAgICdlbnRpdHkubmFtZS50YWcub3RoZXIuaHRtbCdcbiAgICAgICAgXVxuICAgICAgZXhwZWN0KHRva2Vuc1syXSkudG9FcXVhbFxuICAgICAgICB2YWx1ZTogJz4nXG4gICAgICAgIHNjb3BlczogW1xuICAgICAgICAgICdzb3VyY2UuY29mZmVlLmpzeCdcbiAgICAgICAgICAnbWV0YS50YWcub3RoZXIuaHRtbCdcbiAgICAgICAgICAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuZW5kLmh0bWwnXG4gICAgICAgIF1cbiAgICAgIGV4cGVjdCh0b2tlbnNbM10pLnRvRXF1YWxcbiAgICAgICAgdmFsdWU6ICdoaSdcbiAgICAgICAgc2NvcGVzOiBbXG4gICAgICAgICAgJ3NvdXJjZS5jb2ZmZWUuanN4J1xuICAgICAgICBdXG4gICAgICBleHBlY3QodG9rZW5zWzRdKS50b0VxdWFsXG4gICAgICAgIHZhbHVlOiAnPCdcbiAgICAgICAgc2NvcGVzOiBbXG4gICAgICAgICAgJ3NvdXJjZS5jb2ZmZWUuanN4J1xuICAgICAgICAgICdtZXRhLnRhZy5vdGhlci5odG1sJ1xuICAgICAgICAgICdwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnRhZy5iZWdpbi5odG1sJ1xuICAgICAgICBdXG4gICAgICBleHBlY3QodG9rZW5zWzVdKS50b0VxdWFsXG4gICAgICAgIHZhbHVlOiAnL2RpdidcbiAgICAgICAgc2NvcGVzOiBbXG4gICAgICAgICAgJ3NvdXJjZS5jb2ZmZWUuanN4J1xuICAgICAgICAgICdtZXRhLnRhZy5vdGhlci5odG1sJ1xuICAgICAgICAgICdlbnRpdHkubmFtZS50YWcub3RoZXIuaHRtbCdcbiAgICAgICAgXVxuICAgICAgZXhwZWN0KHRva2Vuc1s2XSkudG9FcXVhbFxuICAgICAgICB2YWx1ZTogJz4nXG4gICAgICAgIHNjb3BlczogW1xuICAgICAgICAgICdzb3VyY2UuY29mZmVlLmpzeCdcbiAgICAgICAgICAnbWV0YS50YWcub3RoZXIuaHRtbCdcbiAgICAgICAgICAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuZW5kLmh0bWwnXG4gICAgICAgIF1cblxuICAgIGl0ICd0b2tlbml6ZXMgcHJvcHMnLCAtPlxuICAgICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSAnPGRpdiBjbGFzc05hbWU9XCJzcGFuNlwiPjwvZGl2PidcblxuICAgICAgZXhwZWN0KHRva2Vucy5sZW5ndGgpLnRvRXF1YWwgMTJcblxuICAgICAgZXhwZWN0KHRva2Vuc1syXSkudG9FcXVhbFxuICAgICAgICB2YWx1ZTogJyAnXG4gICAgICAgIHNjb3BlczogW1xuICAgICAgICAgICdzb3VyY2UuY29mZmVlLmpzeCdcbiAgICAgICAgICAnbWV0YS50YWcub3RoZXIuaHRtbCdcbiAgICAgICAgXVxuICAgICAgZXhwZWN0KHRva2Vuc1szXSkudG9FcXVhbFxuICAgICAgICB2YWx1ZTogJ2NsYXNzTmFtZSdcbiAgICAgICAgc2NvcGVzOiBbXG4gICAgICAgICAgJ3NvdXJjZS5jb2ZmZWUuanN4J1xuICAgICAgICAgICdtZXRhLnRhZy5vdGhlci5odG1sJ1xuICAgICAgICAgICdlbnRpdHkub3RoZXIuYXR0cmlidXRlLW5hbWUuaHRtbCdcbiAgICAgICAgXVxuICAgICAgZXhwZWN0KHRva2Vuc1s0XSkudG9FcXVhbFxuICAgICAgICB2YWx1ZTogJz0nXG4gICAgICAgIHNjb3BlczogW1xuICAgICAgICAgICdzb3VyY2UuY29mZmVlLmpzeCdcbiAgICAgICAgICAnbWV0YS50YWcub3RoZXIuaHRtbCdcbiAgICAgICAgXVxuICAgICAgZXhwZWN0KHRva2Vuc1s1XSkudG9FcXVhbFxuICAgICAgICB2YWx1ZTogJ1wiJ1xuICAgICAgICBzY29wZXM6IFtcbiAgICAgICAgICAnc291cmNlLmNvZmZlZS5qc3gnXG4gICAgICAgICAgJ21ldGEudGFnLm90aGVyLmh0bWwnXG4gICAgICAgICAgJ3N0cmluZy5xdW90ZWQuZG91YmxlLmh0bWwnXG4gICAgICAgICAgJ3B1bmN0dWF0aW9uLmRlZmluaXRpb24uc3RyaW5nLmJlZ2luLmh0bWwnXG4gICAgICAgIF1cbiAgICAgIGV4cGVjdCh0b2tlbnNbNl0pLnRvRXF1YWxcbiAgICAgICAgdmFsdWU6ICdzcGFuNidcbiAgICAgICAgc2NvcGVzOiBbXG4gICAgICAgICAgJ3NvdXJjZS5jb2ZmZWUuanN4J1xuICAgICAgICAgICdtZXRhLnRhZy5vdGhlci5odG1sJ1xuICAgICAgICAgICdzdHJpbmcucXVvdGVkLmRvdWJsZS5odG1sJ1xuICAgICAgICBdXG4gICAgICBleHBlY3QodG9rZW5zWzddKS50b0VxdWFsXG4gICAgICAgIHZhbHVlOiAnXCInXG4gICAgICAgIHNjb3BlczogW1xuICAgICAgICAgICdzb3VyY2UuY29mZmVlLmpzeCdcbiAgICAgICAgICAnbWV0YS50YWcub3RoZXIuaHRtbCdcbiAgICAgICAgICAnc3RyaW5nLnF1b3RlZC5kb3VibGUuaHRtbCdcbiAgICAgICAgICAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi5zdHJpbmcuZW5kLmh0bWwnXG4gICAgICAgIF1cblxuICAgIGl0ICd0b2tlbml6ZXMgcHJvcHMgd2l0aCBkaWdpdHMnLCAtPlxuICAgICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSAnPGRpdiB0aGluZzE9XCJoaVwiPjwvZGl2PidcblxuICAgICAgZXhwZWN0KHRva2Vuc1szXSkudG9FcXVhbFxuICAgICAgICB2YWx1ZTogJ3RoaW5nMSdcbiAgICAgICAgc2NvcGVzOiBbXG4gICAgICAgICAgJ3NvdXJjZS5jb2ZmZWUuanN4J1xuICAgICAgICAgICdtZXRhLnRhZy5vdGhlci5odG1sJ1xuICAgICAgICAgICdlbnRpdHkub3RoZXIuYXR0cmlidXRlLW5hbWUuaHRtbCdcbiAgICAgICAgXVxuXG4gICAgaXQgJ3Rva2VuaXplcyBpbnRlcnBvbGF0ZWQgQ29mZmVlU2NyaXB0IHN0cmluZ3MnLCAtPlxuICAgICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSAnPGRpdiBjbGFzc05hbWU9XCIje0B2YXJ9XCI+PC9kaXY+J1xuXG4gICAgICBleHBlY3QodG9rZW5zLmxlbmd0aCkudG9FcXVhbCAxNFxuXG4gICAgICBleHBlY3QodG9rZW5zWzZdKS50b0VxdWFsXG4gICAgICAgIHZhbHVlOiAnI3snXG4gICAgICAgIHNjb3BlczogW1xuICAgICAgICAgICdzb3VyY2UuY29mZmVlLmpzeCdcbiAgICAgICAgICAnbWV0YS50YWcub3RoZXIuaHRtbCdcbiAgICAgICAgICAnc3RyaW5nLnF1b3RlZC5kb3VibGUuaHRtbCdcbiAgICAgICAgICAnc291cmNlLmNvZmZlZS5lbWJlZGRlZC5zb3VyY2UnXG4gICAgICAgICAgJ3B1bmN0dWF0aW9uLnNlY3Rpb24uZW1iZWRkZWQuY29mZmVlJ1xuICAgICAgICBdXG4gICAgICBleHBlY3QodG9rZW5zWzddKS50b0VxdWFsXG4gICAgICAgIHZhbHVlOiAnQHZhcidcbiAgICAgICAgc2NvcGVzOiBbXG4gICAgICAgICAgJ3NvdXJjZS5jb2ZmZWUuanN4J1xuICAgICAgICAgICdtZXRhLnRhZy5vdGhlci5odG1sJ1xuICAgICAgICAgICdzdHJpbmcucXVvdGVkLmRvdWJsZS5odG1sJ1xuICAgICAgICAgICdzb3VyY2UuY29mZmVlLmVtYmVkZGVkLnNvdXJjZSdcbiAgICAgICAgICAndmFyaWFibGUub3RoZXIucmVhZHdyaXRlLmluc3RhbmNlLmNvZmZlZSdcbiAgICAgICAgXVxuICAgICAgZXhwZWN0KHRva2Vuc1s4XSkudG9FcXVhbFxuICAgICAgICB2YWx1ZTogJ30nXG4gICAgICAgIHNjb3BlczogW1xuICAgICAgICAgICdzb3VyY2UuY29mZmVlLmpzeCdcbiAgICAgICAgICAnbWV0YS50YWcub3RoZXIuaHRtbCdcbiAgICAgICAgICAnc3RyaW5nLnF1b3RlZC5kb3VibGUuaHRtbCdcbiAgICAgICAgICAnc291cmNlLmNvZmZlZS5lbWJlZGRlZC5zb3VyY2UnXG4gICAgICAgICAgJ3B1bmN0dWF0aW9uLnNlY3Rpb24uZW1iZWRkZWQuY29mZmVlJ1xuICAgICAgICBdXG5cbiAgICBpdCAndG9rZW5pemVzIGVtYmVkZGVkIENvZmZlZVNjcmlwdCcsIC0+XG4gICAgICB7dG9rZW5zfSA9IGdyYW1tYXIudG9rZW5pemVMaW5lICc8ZGl2PntAdmFyfTwvZGl2PidcblxuICAgICAgZXhwZWN0KHRva2Vucy5sZW5ndGgpLnRvRXF1YWwgOVxuXG4gICAgICBleHBlY3QodG9rZW5zWzNdKS50b0VxdWFsXG4gICAgICAgIHZhbHVlOiAneydcbiAgICAgICAgc2NvcGVzOiBbXG4gICAgICAgICAgJ3NvdXJjZS5jb2ZmZWUuanN4J1xuICAgICAgICAgICdtZXRhLmJyYWNlLmN1cmx5LmNvZmZlZSdcbiAgICAgICAgXVxuICAgICAgZXhwZWN0KHRva2Vuc1s0XSkudG9FcXVhbFxuICAgICAgICB2YWx1ZTogJ0B2YXInXG4gICAgICAgIHNjb3BlczogW1xuICAgICAgICAgICdzb3VyY2UuY29mZmVlLmpzeCdcbiAgICAgICAgICAndmFyaWFibGUub3RoZXIucmVhZHdyaXRlLmluc3RhbmNlLmNvZmZlZSdcbiAgICAgICAgXVxuICAgICAgZXhwZWN0KHRva2Vuc1s1XSkudG9FcXVhbFxuICAgICAgICB2YWx1ZTogJ30nXG4gICAgICAgIHNjb3BlczogW1xuICAgICAgICAgICdzb3VyY2UuY29mZmVlLmpzeCdcbiAgICAgICAgICAnbWV0YS5icmFjZS5jdXJseS5jb2ZmZWUnXG4gICAgICAgIF1cblxuICAgIGl0IFwiZG9lc24ndCB0b2tlbml6ZSBpbm5lciBDSlNYIGFzIENvZmZlZVNjcmlwdFwiLCAtPlxuICAgICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSBcIjxkaXY+aXQncyBhbmQ8L2Rpdj5cIlxuXG4gICAgICBleHBlY3QodG9rZW5zLmxlbmd0aCkudG9FcXVhbCA3XG5cbiAgICAgIGV4cGVjdCh0b2tlbnNbM10pLnRvRXF1YWxcbiAgICAgICAgdmFsdWU6IFwiaXQncyBhbmRcIlxuICAgICAgICBzY29wZXM6IFtcbiAgICAgICAgICAnc291cmNlLmNvZmZlZS5qc3gnXG4gICAgICAgIF1cbiJdfQ==
