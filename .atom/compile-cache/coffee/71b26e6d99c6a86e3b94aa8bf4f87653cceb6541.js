(function() {
  var TextEditor, buildTextEditor;

  TextEditor = null;

  buildTextEditor = function(params) {
    if (atom.workspace.buildTextEditor != null) {
      return atom.workspace.buildTextEditor(params);
    } else {
      if (TextEditor == null) {
        TextEditor = require('atom').TextEditor;
      }
      return new TextEditor(params);
    }
  };

  describe("React grammar", function() {
    var grammar;
    grammar = null;
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-javascript");
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("react");
      });
      return runs(function() {
        return grammar = atom.grammars.grammarForScopeName("source.js.jsx");
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
    it("parses the grammar", function() {
      expect(grammar).toBeTruthy();
      return expect(grammar.scopeName).toBe("source.js.jsx");
    });
    describe("strings", function() {
      return it("tokenizes single-line strings", function() {
        var delim, delimsByScope, results, scope, tokens;
        delimsByScope = {
          "string.quoted.double.js": '"',
          "string.quoted.single.js": "'"
        };
        results = [];
        for (scope in delimsByScope) {
          delim = delimsByScope[scope];
          tokens = grammar.tokenizeLine(delim + "x" + delim).tokens;
          expect(tokens[0].value).toEqual(delim);
          expect(tokens[0].scopes).toEqual(["source.js.jsx", scope, "punctuation.definition.string.begin.js"]);
          expect(tokens[1].value).toEqual("x");
          expect(tokens[1].scopes).toEqual(["source.js.jsx", scope]);
          expect(tokens[2].value).toEqual(delim);
          results.push(expect(tokens[2].scopes).toEqual(["source.js.jsx", scope, "punctuation.definition.string.end.js"]));
        }
        return results;
      });
    });
    describe("keywords", function() {
      return it("tokenizes with as a keyword", function() {
        var tokens;
        tokens = grammar.tokenizeLine('with').tokens;
        return expect(tokens[0]).toEqual({
          value: 'with',
          scopes: ['source.js.jsx', 'keyword.control.js']
        });
      });
    });
    describe("regular expressions", function() {
      it("tokenizes regular expressions", function() {
        var tokens;
        tokens = grammar.tokenizeLine('/test/').tokens;
        expect(tokens[0]).toEqual({
          value: '/',
          scopes: ['source.js.jsx', 'string.regexp.js', 'punctuation.definition.string.begin.js']
        });
        expect(tokens[1]).toEqual({
          value: 'test',
          scopes: ['source.js.jsx', 'string.regexp.js']
        });
        expect(tokens[2]).toEqual({
          value: '/',
          scopes: ['source.js.jsx', 'string.regexp.js', 'punctuation.definition.string.end.js']
        });
        tokens = grammar.tokenizeLine('foo + /test/').tokens;
        expect(tokens[0]).toEqual({
          value: 'foo ',
          scopes: ['source.js.jsx']
        });
        expect(tokens[1]).toEqual({
          value: '+',
          scopes: ['source.js.jsx', 'keyword.operator.js']
        });
        expect(tokens[2]).toEqual({
          value: ' ',
          scopes: ['source.js.jsx', 'string.regexp.js']
        });
        expect(tokens[3]).toEqual({
          value: '/',
          scopes: ['source.js.jsx', 'string.regexp.js', 'punctuation.definition.string.begin.js']
        });
        expect(tokens[4]).toEqual({
          value: 'test',
          scopes: ['source.js.jsx', 'string.regexp.js']
        });
        return expect(tokens[5]).toEqual({
          value: '/',
          scopes: ['source.js.jsx', 'string.regexp.js', 'punctuation.definition.string.end.js']
        });
      });
      return it("tokenizes regular expressions inside arrays", function() {
        var tokens;
        tokens = grammar.tokenizeLine('[/test/]').tokens;
        expect(tokens[0]).toEqual({
          value: '[',
          scopes: ['source.js.jsx', 'meta.brace.square.js']
        });
        expect(tokens[1]).toEqual({
          value: '/',
          scopes: ['source.js.jsx', 'string.regexp.js', 'punctuation.definition.string.begin.js']
        });
        expect(tokens[2]).toEqual({
          value: 'test',
          scopes: ['source.js.jsx', 'string.regexp.js']
        });
        expect(tokens[3]).toEqual({
          value: '/',
          scopes: ['source.js.jsx', 'string.regexp.js', 'punctuation.definition.string.end.js']
        });
        expect(tokens[4]).toEqual({
          value: ']',
          scopes: ['source.js.jsx', 'meta.brace.square.js']
        });
        tokens = grammar.tokenizeLine('[1, /test/]').tokens;
        expect(tokens[0]).toEqual({
          value: '[',
          scopes: ['source.js.jsx', 'meta.brace.square.js']
        });
        expect(tokens[1]).toEqual({
          value: '1',
          scopes: ['source.js.jsx', 'constant.numeric.decimal.js']
        });
        expect(tokens[2]).toEqual({
          value: ',',
          scopes: ['source.js.jsx', 'meta.delimiter.object.comma.js']
        });
        expect(tokens[3]).toEqual({
          value: ' ',
          scopes: ['source.js.jsx', 'string.regexp.js']
        });
        expect(tokens[4]).toEqual({
          value: '/',
          scopes: ['source.js.jsx', 'string.regexp.js', 'punctuation.definition.string.begin.js']
        });
        expect(tokens[5]).toEqual({
          value: 'test',
          scopes: ['source.js.jsx', 'string.regexp.js']
        });
        expect(tokens[6]).toEqual({
          value: '/',
          scopes: ['source.js.jsx', 'string.regexp.js', 'punctuation.definition.string.end.js']
        });
        expect(tokens[7]).toEqual({
          value: ']',
          scopes: ['source.js.jsx', 'meta.brace.square.js']
        });
        tokens = grammar.tokenizeLine('0x1D306').tokens;
        expect(tokens[0]).toEqual({
          value: '0x1D306',
          scopes: ['source.js.jsx', 'constant.numeric.hex.js']
        });
        tokens = grammar.tokenizeLine('0X1D306').tokens;
        expect(tokens[0]).toEqual({
          value: '0X1D306',
          scopes: ['source.js.jsx', 'constant.numeric.hex.js']
        });
        tokens = grammar.tokenizeLine('0b011101110111010001100110').tokens;
        expect(tokens[0]).toEqual({
          value: '0b011101110111010001100110',
          scopes: ['source.js.jsx', 'constant.numeric.binary.js']
        });
        tokens = grammar.tokenizeLine('0B011101110111010001100110').tokens;
        expect(tokens[0]).toEqual({
          value: '0B011101110111010001100110',
          scopes: ['source.js.jsx', 'constant.numeric.binary.js']
        });
        tokens = grammar.tokenizeLine('0o1411').tokens;
        expect(tokens[0]).toEqual({
          value: '0o1411',
          scopes: ['source.js.jsx', 'constant.numeric.octal.js']
        });
        tokens = grammar.tokenizeLine('0O1411').tokens;
        return expect(tokens[0]).toEqual({
          value: '0O1411',
          scopes: ['source.js.jsx', 'constant.numeric.octal.js']
        });
      });
    });
    describe("operators", function() {
      it("tokenizes void correctly", function() {
        var tokens;
        tokens = grammar.tokenizeLine('void').tokens;
        return expect(tokens[0]).toEqual({
          value: 'void',
          scopes: ['source.js.jsx', 'keyword.operator.void.js']
        });
      });
      return it("tokenizes the / arithmetic operator when separated by newlines", function() {
        var lines;
        lines = grammar.tokenizeLines("1\n/ 2");
        expect(lines[0][0]).toEqual({
          value: '1',
          scopes: ['source.js.jsx', 'constant.numeric.decimal.js']
        });
        expect(lines[1][0]).toEqual({
          value: '/',
          scopes: ['source.js.jsx', 'keyword.operator.js']
        });
        expect(lines[1][1]).toEqual({
          value: ' ',
          scopes: ['source.js.jsx']
        });
        return expect(lines[1][2]).toEqual({
          value: '2',
          scopes: ['source.js.jsx', 'constant.numeric.decimal.js']
        });
      });
    });
    describe("ES6 string templates", function() {
      return it("tokenizes them as strings", function() {
        var tokens;
        tokens = grammar.tokenizeLine('`hey ${name}`').tokens;
        expect(tokens[0]).toEqual({
          value: '`',
          scopes: ['source.js.jsx', 'string.quoted.template.js', 'punctuation.definition.string.begin.js']
        });
        expect(tokens[1]).toEqual({
          value: 'hey ',
          scopes: ['source.js.jsx', 'string.quoted.template.js']
        });
        expect(tokens[2]).toEqual({
          value: '${',
          scopes: ['source.js.jsx', 'string.quoted.template.js', 'source.js.embedded.source', 'punctuation.section.embedded.js']
        });
        expect(tokens[3]).toEqual({
          value: 'name',
          scopes: ['source.js.jsx', 'string.quoted.template.js', 'source.js.embedded.source']
        });
        expect(tokens[4]).toEqual({
          value: '}',
          scopes: ['source.js.jsx', 'string.quoted.template.js', 'source.js.embedded.source', 'punctuation.section.embedded.js']
        });
        return expect(tokens[5]).toEqual({
          value: '`',
          scopes: ['source.js.jsx', 'string.quoted.template.js', 'punctuation.definition.string.end.js']
        });
      });
    });
    describe("default: in a switch statement", function() {
      return it("tokenizes it as a keyword", function() {
        var tokens;
        tokens = grammar.tokenizeLine('default: ').tokens;
        return expect(tokens[0]).toEqual({
          value: 'default',
          scopes: ['source.js.jsx', 'keyword.control.js']
        });
      });
    });
    it("tokenizes comments in function params", function() {
      var tokens;
      tokens = grammar.tokenizeLine('foo: function (/**Bar*/bar){').tokens;
      expect(tokens[5]).toEqual({
        value: '(',
        scopes: ['source.js.jsx', 'meta.function.json.js', 'meta.parameters.js', 'punctuation.definition.parameters.begin.bracket.round.js']
      });
      expect(tokens[6]).toEqual({
        value: '/**',
        scopes: ['source.js.jsx', 'meta.function.json.js', 'meta.parameters.js', 'comment.block.documentation.js', 'punctuation.definition.comment.begin.js']
      });
      expect(tokens[7]).toEqual({
        value: 'Bar',
        scopes: ['source.js.jsx', 'meta.function.json.js', 'meta.parameters.js', 'comment.block.documentation.js']
      });
      expect(tokens[8]).toEqual({
        value: '*/',
        scopes: ['source.js.jsx', 'meta.function.json.js', 'meta.parameters.js', 'comment.block.documentation.js', 'punctuation.definition.comment.end.js']
      });
      return expect(tokens[9]).toEqual({
        value: 'bar',
        scopes: ['source.js.jsx', 'meta.function.json.js', 'meta.parameters.js', 'variable.parameter.function.js']
      });
    });
    it("tokenizes /* */ comments", function() {
      var tokens;
      tokens = grammar.tokenizeLine('/**/').tokens;
      expect(tokens[0]).toEqual({
        value: '/*',
        scopes: ['source.js.jsx', 'comment.block.empty.js', 'punctuation.definition.comment.begin.js']
      });
      expect(tokens[1]).toEqual({
        value: '*/',
        scopes: ['source.js.jsx', 'comment.block.empty.js', 'punctuation.definition.comment.end.js']
      });
      tokens = grammar.tokenizeLine('/* foo */').tokens;
      expect(tokens[0]).toEqual({
        value: '/*',
        scopes: ['source.js.jsx', 'comment.block.js', 'punctuation.definition.comment.begin.js']
      });
      expect(tokens[1]).toEqual({
        value: ' foo ',
        scopes: ['source.js.jsx', 'comment.block.js']
      });
      return expect(tokens[2]).toEqual({
        value: '*/',
        scopes: ['source.js.jsx', 'comment.block.js', 'punctuation.definition.comment.end.js']
      });
    });
    it("tokenizes /** */ comments", function() {
      var tokens;
      tokens = grammar.tokenizeLine('/***/').tokens;
      expect(tokens[0]).toEqual({
        value: '/**',
        scopes: ['source.js.jsx', 'comment.block.documentation.js', 'punctuation.definition.comment.begin.js']
      });
      expect(tokens[1]).toEqual({
        value: '*/',
        scopes: ['source.js.jsx', 'comment.block.documentation.js', 'punctuation.definition.comment.end.js']
      });
      tokens = grammar.tokenizeLine('/** foo */').tokens;
      expect(tokens[0]).toEqual({
        value: '/**',
        scopes: ['source.js.jsx', 'comment.block.documentation.js', 'punctuation.definition.comment.begin.js']
      });
      expect(tokens[1]).toEqual({
        value: ' foo ',
        scopes: ['source.js.jsx', 'comment.block.documentation.js']
      });
      return expect(tokens[2]).toEqual({
        value: '*/',
        scopes: ['source.js.jsx', 'comment.block.documentation.js', 'punctuation.definition.comment.end.js']
      });
    });
    it("tokenizes jsx tags", function() {
      var tokens;
      tokens = grammar.tokenizeLine('<tag></tag>').tokens;
      expect(tokens[0]).toEqual({
        value: '<',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[1]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.open.js", "entity.name.tag.js"]
      });
      expect(tokens[2]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.end.js"]
      });
      expect(tokens[3]).toEqual({
        value: '</',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[4]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.closed.js", "entity.name.tag.js"]
      });
      return expect(tokens[5]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.end.js"]
      });
    });
    it("tokenizes jsx inside parenthesis", function() {
      var tokens;
      tokens = grammar.tokenizeLine('return (<tag></tag>)').tokens;
      expect(tokens[3]).toEqual({
        value: '<',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[4]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.open.js", "entity.name.tag.js"]
      });
      expect(tokens[5]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.end.js"]
      });
      expect(tokens[6]).toEqual({
        value: '</',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[7]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.closed.js", "entity.name.tag.js"]
      });
      return expect(tokens[8]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.end.js"]
      });
    });
    it("tokenizes jsx inside function body", function() {
      var tokens;
      tokens = grammar.tokenizeLine('function () { return (<tag></tag>) }').tokens;
      expect(tokens[10]).toEqual({
        value: '<',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[11]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.open.js", "entity.name.tag.js"]
      });
      expect(tokens[12]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.end.js"]
      });
      expect(tokens[13]).toEqual({
        value: '</',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[14]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.closed.js", "entity.name.tag.js"]
      });
      return expect(tokens[15]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.end.js"]
      });
    });
    it("tokenizes jsx inside function body in an object", function() {
      var tokens;
      tokens = grammar.tokenizeLine('{foo:function () { return (<tag></tag>) }}').tokens;
      expect(tokens[13]).toEqual({
        value: '<',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[14]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.open.js", "entity.name.tag.js"]
      });
      expect(tokens[15]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.end.js"]
      });
      expect(tokens[16]).toEqual({
        value: '</',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[17]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.closed.js", "entity.name.tag.js"]
      });
      return expect(tokens[18]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.end.js"]
      });
    });
    it("tokenizes jsx inside function call", function() {
      var tokens;
      tokens = grammar.tokenizeLine('foo(<tag></tag>)').tokens;
      expect(tokens[2]).toEqual({
        value: '<',
        scopes: ["source.js.jsx", "meta.function-call.js", "tag.open.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[3]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "meta.function-call.js", "tag.open.js", "entity.name.tag.js"]
      });
      expect(tokens[4]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "meta.function-call.js", "tag.open.js", "punctuation.definition.tag.end.js"]
      });
      expect(tokens[5]).toEqual({
        value: '</',
        scopes: ["source.js.jsx", "meta.function-call.js", "tag.closed.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[6]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "meta.function-call.js", "tag.closed.js", "entity.name.tag.js"]
      });
      return expect(tokens[7]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "meta.function-call.js", "tag.closed.js", "punctuation.definition.tag.end.js"]
      });
    });
    it("tokenizes jsx inside method call", function() {
      var tokens;
      tokens = grammar.tokenizeLine('bar.foo(<tag></tag>)').tokens;
      expect(tokens[4]).toEqual({
        value: '<',
        scopes: ["source.js.jsx", "meta.method-call.js", "tag.open.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[5]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "meta.method-call.js", "tag.open.js", "entity.name.tag.js"]
      });
      expect(tokens[6]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "meta.method-call.js", "tag.open.js", "punctuation.definition.tag.end.js"]
      });
      expect(tokens[7]).toEqual({
        value: '</',
        scopes: ["source.js.jsx", "meta.method-call.js", "tag.closed.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[8]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "meta.method-call.js", "tag.closed.js", "entity.name.tag.js"]
      });
      return expect(tokens[9]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "meta.method-call.js", "tag.closed.js", "punctuation.definition.tag.end.js"]
      });
    });
    it("tokenizes ' as string inside jsx", function() {
      var tokens;
      tokens = grammar.tokenizeLine('<tag>fo\'o</tag>').tokens;
      expect(tokens[0]).toEqual({
        value: '<',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[1]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.open.js", "entity.name.tag.js"]
      });
      expect(tokens[2]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.end.js"]
      });
      expect(tokens[3]).toEqual({
        value: 'fo\'o',
        scopes: ["source.js.jsx", "meta.other.pcdata.js"]
      });
      expect(tokens[4]).toEqual({
        value: '</',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[5]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.closed.js", "entity.name.tag.js"]
      });
      return expect(tokens[6]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.end.js"]
      });
    });
    it("tokenizes ternary operator inside jsx code section", function() {
      var tokens;
      tokens = grammar.tokenizeLine('{x?<tag></tag>:null}').tokens;
      expect(tokens[0]).toEqual({
        value: '{',
        scopes: ["source.js.jsx", "meta.brace.curly.js"]
      });
      expect(tokens[1]).toEqual({
        value: 'x',
        scopes: ["source.js.jsx"]
      });
      expect(tokens[2]).toEqual({
        value: '?',
        scopes: ["source.js.jsx", "keyword.operator.ternary.js"]
      });
      expect(tokens[3]).toEqual({
        value: '<',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[4]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.open.js", "entity.name.tag.js"]
      });
      expect(tokens[5]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.end.js"]
      });
      expect(tokens[6]).toEqual({
        value: '</',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[7]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.closed.js", "entity.name.tag.js"]
      });
      expect(tokens[8]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.end.js"]
      });
      expect(tokens[9]).toEqual({
        value: ':',
        scopes: ["source.js.jsx", "keyword.operator.ternary.js"]
      });
      expect(tokens[10]).toEqual({
        value: 'null',
        scopes: ["source.js.jsx", "constant.language.null.js"]
      });
      return expect(tokens[11]).toEqual({
        value: '}',
        scopes: ["source.js.jsx", "meta.brace.curly.js"]
      });
    });
    return describe("indentation", function() {
      var editor, expectPreservedIndentation;
      editor = null;
      beforeEach(function() {
        editor = buildTextEditor();
        return editor.setGrammar(grammar);
      });
      expectPreservedIndentation = function(text) {
        editor.setText(text);
        editor.autoIndentBufferRows(0, text.split("\n").length - 1);
        return expect(editor.getText()).toBe(text);
      };
      it("indents allman-style curly braces", function() {
        return expectPreservedIndentation("if (true)\n{\n  for (;;)\n  {\n    while (true)\n    {\n      x();\n    }\n  }\n}\n\nelse\n{\n  do\n  {\n    y();\n  } while (true);\n}");
      });
      return it("indents non-allman-style curly braces", function() {
        return expectPreservedIndentation("if (true) {\n  for (;;) {\n    while (true) {\n      x();\n    }\n  }\n} else {\n  do {\n    y();\n  } while (true);\n}");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdGhla2FybG85NS8uYXRvbS9wYWNrYWdlcy9yZWFjdC9zcGVjL3JlYWN0LWdyYW1tYXItc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLFVBQUEsR0FBYTs7RUFDYixlQUFBLEdBQWtCLFNBQUMsTUFBRDtJQUNoQixJQUFHLHNDQUFIO2FBQ0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFmLENBQStCLE1BQS9CLEVBREY7S0FBQSxNQUFBOztRQUdFLGFBQWMsT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDOzthQUM5QixJQUFJLFVBQUosQ0FBZSxNQUFmLEVBSkY7O0VBRGdCOztFQU9sQixRQUFBLENBQVMsZUFBVCxFQUEwQixTQUFBO0FBQ3hCLFFBQUE7SUFBQSxPQUFBLEdBQVU7SUFFVixVQUFBLENBQVcsU0FBQTtNQUNULGVBQUEsQ0FBZ0IsU0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixxQkFBOUI7TUFEYyxDQUFoQjtNQUdBLGVBQUEsQ0FBZ0IsU0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixPQUE5QjtNQURjLENBQWhCO2FBR0EsSUFBQSxDQUFLLFNBQUE7ZUFDSCxPQUFBLEdBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBZCxDQUFrQyxlQUFsQztNQURQLENBQUw7SUFQUyxDQUFYO0lBVUEsU0FBQSxDQUFVLFNBQUE7TUFDUixlQUFBLENBQWdCLFNBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFkLENBQUE7TUFEYyxDQUFoQjthQUVBLElBQUEsQ0FBSyxTQUFBO2VBQ0gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFkLENBQUE7TUFERyxDQUFMO0lBSFEsQ0FBVjtJQU1BLEVBQUEsQ0FBRyxvQkFBSCxFQUF5QixTQUFBO01BQ3ZCLE1BQUEsQ0FBTyxPQUFQLENBQWUsQ0FBQyxVQUFoQixDQUFBO2FBQ0EsTUFBQSxDQUFPLE9BQU8sQ0FBQyxTQUFmLENBQXlCLENBQUMsSUFBMUIsQ0FBK0IsZUFBL0I7SUFGdUIsQ0FBekI7SUFJQSxRQUFBLENBQVMsU0FBVCxFQUFvQixTQUFBO2FBQ2xCLEVBQUEsQ0FBRywrQkFBSCxFQUFvQyxTQUFBO0FBQ2xDLFlBQUE7UUFBQSxhQUFBLEdBQ0U7VUFBQSx5QkFBQSxFQUEyQixHQUEzQjtVQUNBLHlCQUFBLEVBQTJCLEdBRDNCOztBQUdGO2FBQUEsc0JBQUE7O1VBQ0csU0FBVSxPQUFPLENBQUMsWUFBUixDQUFxQixLQUFBLEdBQVEsR0FBUixHQUFjLEtBQW5DO1VBQ1gsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFqQixDQUF1QixDQUFDLE9BQXhCLENBQWdDLEtBQWhDO1VBQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUFqQixDQUF3QixDQUFDLE9BQXpCLENBQWlDLENBQUMsZUFBRCxFQUFrQixLQUFsQixFQUF5Qix3Q0FBekIsQ0FBakM7VUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQWpCLENBQXVCLENBQUMsT0FBeEIsQ0FBZ0MsR0FBaEM7VUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBRSxDQUFDLE1BQWpCLENBQXdCLENBQUMsT0FBekIsQ0FBaUMsQ0FBQyxlQUFELEVBQWtCLEtBQWxCLENBQWpDO1VBQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFqQixDQUF1QixDQUFDLE9BQXhCLENBQWdDLEtBQWhDO3VCQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBakIsQ0FBd0IsQ0FBQyxPQUF6QixDQUFpQyxDQUFDLGVBQUQsRUFBa0IsS0FBbEIsRUFBeUIsc0NBQXpCLENBQWpDO0FBUEY7O01BTGtDLENBQXBDO0lBRGtCLENBQXBCO0lBZUEsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQTthQUNuQixFQUFBLENBQUcsNkJBQUgsRUFBa0MsU0FBQTtBQUNoQyxZQUFBO1FBQUMsU0FBVSxPQUFPLENBQUMsWUFBUixDQUFxQixNQUFyQjtlQUNYLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7VUFBQSxLQUFBLEVBQU8sTUFBUDtVQUFlLE1BQUEsRUFBUSxDQUFDLGVBQUQsRUFBa0Isb0JBQWxCLENBQXZCO1NBQTFCO01BRmdDLENBQWxDO0lBRG1CLENBQXJCO0lBS0EsUUFBQSxDQUFTLHFCQUFULEVBQWdDLFNBQUE7TUFDOUIsRUFBQSxDQUFHLCtCQUFILEVBQW9DLFNBQUE7QUFDbEMsWUFBQTtRQUFDLFNBQVUsT0FBTyxDQUFDLFlBQVIsQ0FBcUIsUUFBckI7UUFDWCxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1VBQUEsS0FBQSxFQUFPLEdBQVA7VUFBWSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWtCLGtCQUFsQixFQUFzQyx3Q0FBdEMsQ0FBcEI7U0FBMUI7UUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1VBQUEsS0FBQSxFQUFPLE1BQVA7VUFBZSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWtCLGtCQUFsQixDQUF2QjtTQUExQjtRQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7VUFBQSxLQUFBLEVBQU8sR0FBUDtVQUFZLE1BQUEsRUFBUSxDQUFDLGVBQUQsRUFBa0Isa0JBQWxCLEVBQXNDLHNDQUF0QyxDQUFwQjtTQUExQjtRQUVDLFNBQVUsT0FBTyxDQUFDLFlBQVIsQ0FBcUIsY0FBckI7UUFDWCxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1VBQUEsS0FBQSxFQUFPLE1BQVA7VUFBZSxNQUFBLEVBQVEsQ0FBQyxlQUFELENBQXZCO1NBQTFCO1FBQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtVQUFBLEtBQUEsRUFBTyxHQUFQO1VBQVksTUFBQSxFQUFRLENBQUMsZUFBRCxFQUFrQixxQkFBbEIsQ0FBcEI7U0FBMUI7UUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1VBQUEsS0FBQSxFQUFPLEdBQVA7VUFBWSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWtCLGtCQUFsQixDQUFwQjtTQUExQjtRQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7VUFBQSxLQUFBLEVBQU8sR0FBUDtVQUFZLE1BQUEsRUFBUSxDQUFDLGVBQUQsRUFBa0Isa0JBQWxCLEVBQXNDLHdDQUF0QyxDQUFwQjtTQUExQjtRQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7VUFBQSxLQUFBLEVBQU8sTUFBUDtVQUFlLE1BQUEsRUFBUSxDQUFDLGVBQUQsRUFBa0Isa0JBQWxCLENBQXZCO1NBQTFCO2VBQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtVQUFBLEtBQUEsRUFBTyxHQUFQO1VBQVksTUFBQSxFQUFRLENBQUMsZUFBRCxFQUFrQixrQkFBbEIsRUFBc0Msc0NBQXRDLENBQXBCO1NBQTFCO01BWmtDLENBQXBDO2FBY0EsRUFBQSxDQUFHLDZDQUFILEVBQWtELFNBQUE7QUFDaEQsWUFBQTtRQUFDLFNBQVUsT0FBTyxDQUFDLFlBQVIsQ0FBcUIsVUFBckI7UUFDWCxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1VBQUEsS0FBQSxFQUFPLEdBQVA7VUFBWSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWtCLHNCQUFsQixDQUFwQjtTQUExQjtRQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7VUFBQSxLQUFBLEVBQU8sR0FBUDtVQUFZLE1BQUEsRUFBUSxDQUFDLGVBQUQsRUFBa0Isa0JBQWxCLEVBQXNDLHdDQUF0QyxDQUFwQjtTQUExQjtRQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7VUFBQSxLQUFBLEVBQU8sTUFBUDtVQUFlLE1BQUEsRUFBUSxDQUFDLGVBQUQsRUFBa0Isa0JBQWxCLENBQXZCO1NBQTFCO1FBQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtVQUFBLEtBQUEsRUFBTyxHQUFQO1VBQVksTUFBQSxFQUFRLENBQUMsZUFBRCxFQUFrQixrQkFBbEIsRUFBc0Msc0NBQXRDLENBQXBCO1NBQTFCO1FBQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtVQUFBLEtBQUEsRUFBTyxHQUFQO1VBQVksTUFBQSxFQUFRLENBQUMsZUFBRCxFQUFrQixzQkFBbEIsQ0FBcEI7U0FBMUI7UUFFQyxTQUFVLE9BQU8sQ0FBQyxZQUFSLENBQXFCLGFBQXJCO1FBQ1gsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtVQUFBLEtBQUEsRUFBTyxHQUFQO1VBQVksTUFBQSxFQUFRLENBQUMsZUFBRCxFQUFrQixzQkFBbEIsQ0FBcEI7U0FBMUI7UUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1VBQUEsS0FBQSxFQUFPLEdBQVA7VUFBWSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWtCLDZCQUFsQixDQUFwQjtTQUExQjtRQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7VUFBQSxLQUFBLEVBQU8sR0FBUDtVQUFZLE1BQUEsRUFBUSxDQUFDLGVBQUQsRUFBa0IsZ0NBQWxCLENBQXBCO1NBQTFCO1FBQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtVQUFBLEtBQUEsRUFBTyxHQUFQO1VBQVksTUFBQSxFQUFRLENBQUMsZUFBRCxFQUFrQixrQkFBbEIsQ0FBcEI7U0FBMUI7UUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1VBQUEsS0FBQSxFQUFPLEdBQVA7VUFBWSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWtCLGtCQUFsQixFQUFzQyx3Q0FBdEMsQ0FBcEI7U0FBMUI7UUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1VBQUEsS0FBQSxFQUFPLE1BQVA7VUFBZSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWtCLGtCQUFsQixDQUF2QjtTQUExQjtRQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7VUFBQSxLQUFBLEVBQU8sR0FBUDtVQUFZLE1BQUEsRUFBUSxDQUFDLGVBQUQsRUFBa0Isa0JBQWxCLEVBQXNDLHNDQUF0QyxDQUFwQjtTQUExQjtRQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7VUFBQSxLQUFBLEVBQU8sR0FBUDtVQUFZLE1BQUEsRUFBUSxDQUFDLGVBQUQsRUFBa0Isc0JBQWxCLENBQXBCO1NBQTFCO1FBRUMsU0FBVSxPQUFPLENBQUMsWUFBUixDQUFxQixTQUFyQjtRQUNYLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7VUFBQSxLQUFBLEVBQU8sU0FBUDtVQUFrQixNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWtCLHlCQUFsQixDQUExQjtTQUExQjtRQUVDLFNBQVUsT0FBTyxDQUFDLFlBQVIsQ0FBcUIsU0FBckI7UUFDWCxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1VBQUEsS0FBQSxFQUFPLFNBQVA7VUFBa0IsTUFBQSxFQUFRLENBQUMsZUFBRCxFQUFrQix5QkFBbEIsQ0FBMUI7U0FBMUI7UUFFQyxTQUFVLE9BQU8sQ0FBQyxZQUFSLENBQXFCLDRCQUFyQjtRQUNYLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7VUFBQSxLQUFBLEVBQU8sNEJBQVA7VUFBcUMsTUFBQSxFQUFRLENBQUMsZUFBRCxFQUFrQiw0QkFBbEIsQ0FBN0M7U0FBMUI7UUFFQyxTQUFVLE9BQU8sQ0FBQyxZQUFSLENBQXFCLDRCQUFyQjtRQUNYLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7VUFBQSxLQUFBLEVBQU8sNEJBQVA7VUFBcUMsTUFBQSxFQUFRLENBQUMsZUFBRCxFQUFrQiw0QkFBbEIsQ0FBN0M7U0FBMUI7UUFFQyxTQUFVLE9BQU8sQ0FBQyxZQUFSLENBQXFCLFFBQXJCO1FBQ1gsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtVQUFBLEtBQUEsRUFBTyxRQUFQO1VBQWlCLE1BQUEsRUFBUSxDQUFDLGVBQUQsRUFBa0IsMkJBQWxCLENBQXpCO1NBQTFCO1FBRUMsU0FBVSxPQUFPLENBQUMsWUFBUixDQUFxQixRQUFyQjtlQUNYLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7VUFBQSxLQUFBLEVBQU8sUUFBUDtVQUFpQixNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWtCLDJCQUFsQixDQUF6QjtTQUExQjtNQWxDZ0QsQ0FBbEQ7SUFmOEIsQ0FBaEM7SUFtREEsUUFBQSxDQUFTLFdBQVQsRUFBc0IsU0FBQTtNQUNwQixFQUFBLENBQUcsMEJBQUgsRUFBK0IsU0FBQTtBQUM3QixZQUFBO1FBQUMsU0FBVSxPQUFPLENBQUMsWUFBUixDQUFxQixNQUFyQjtlQUNYLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7VUFBQSxLQUFBLEVBQU8sTUFBUDtVQUFlLE1BQUEsRUFBUSxDQUFDLGVBQUQsRUFBa0IsMEJBQWxCLENBQXZCO1NBQTFCO01BRjZCLENBQS9CO2FBSUEsRUFBQSxDQUFHLGdFQUFILEVBQXFFLFNBQUE7QUFDbkUsWUFBQTtRQUFBLEtBQUEsR0FBUSxPQUFPLENBQUMsYUFBUixDQUFzQixRQUF0QjtRQUlSLE1BQUEsQ0FBTyxLQUFNLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFoQixDQUFtQixDQUFDLE9BQXBCLENBQTRCO1VBQUEsS0FBQSxFQUFPLEdBQVA7VUFBWSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWtCLDZCQUFsQixDQUFwQjtTQUE1QjtRQUNBLE1BQUEsQ0FBTyxLQUFNLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFoQixDQUFtQixDQUFDLE9BQXBCLENBQTRCO1VBQUEsS0FBQSxFQUFPLEdBQVA7VUFBWSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWtCLHFCQUFsQixDQUFwQjtTQUE1QjtRQUNBLE1BQUEsQ0FBTyxLQUFNLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFoQixDQUFtQixDQUFDLE9BQXBCLENBQTRCO1VBQUEsS0FBQSxFQUFPLEdBQVA7VUFBWSxNQUFBLEVBQVEsQ0FBQyxlQUFELENBQXBCO1NBQTVCO2VBQ0EsTUFBQSxDQUFPLEtBQU0sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQWhCLENBQW1CLENBQUMsT0FBcEIsQ0FBNEI7VUFBQSxLQUFBLEVBQU8sR0FBUDtVQUFZLE1BQUEsRUFBUSxDQUFDLGVBQUQsRUFBa0IsNkJBQWxCLENBQXBCO1NBQTVCO01BUm1FLENBQXJFO0lBTG9CLENBQXRCO0lBZUEsUUFBQSxDQUFTLHNCQUFULEVBQWlDLFNBQUE7YUFDL0IsRUFBQSxDQUFHLDJCQUFILEVBQWdDLFNBQUE7QUFDOUIsWUFBQTtRQUFDLFNBQVUsT0FBTyxDQUFDLFlBQVIsQ0FBcUIsZUFBckI7UUFDWCxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1VBQUEsS0FBQSxFQUFPLEdBQVA7VUFBWSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWtCLDJCQUFsQixFQUErQyx3Q0FBL0MsQ0FBcEI7U0FBMUI7UUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1VBQUEsS0FBQSxFQUFPLE1BQVA7VUFBZSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWtCLDJCQUFsQixDQUF2QjtTQUExQjtRQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7VUFBQSxLQUFBLEVBQU8sSUFBUDtVQUFhLE1BQUEsRUFBUSxDQUFDLGVBQUQsRUFBa0IsMkJBQWxCLEVBQStDLDJCQUEvQyxFQUE0RSxpQ0FBNUUsQ0FBckI7U0FBMUI7UUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1VBQUEsS0FBQSxFQUFPLE1BQVA7VUFBZSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWtCLDJCQUFsQixFQUErQywyQkFBL0MsQ0FBdkI7U0FBMUI7UUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1VBQUEsS0FBQSxFQUFPLEdBQVA7VUFBWSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWtCLDJCQUFsQixFQUErQywyQkFBL0MsRUFBNEUsaUNBQTVFLENBQXBCO1NBQTFCO2VBQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtVQUFBLEtBQUEsRUFBTyxHQUFQO1VBQVksTUFBQSxFQUFRLENBQUMsZUFBRCxFQUFrQiwyQkFBbEIsRUFBK0Msc0NBQS9DLENBQXBCO1NBQTFCO01BUDhCLENBQWhDO0lBRCtCLENBQWpDO0lBVUEsUUFBQSxDQUFTLGdDQUFULEVBQTJDLFNBQUE7YUFDekMsRUFBQSxDQUFHLDJCQUFILEVBQWdDLFNBQUE7QUFDOUIsWUFBQTtRQUFDLFNBQVUsT0FBTyxDQUFDLFlBQVIsQ0FBcUIsV0FBckI7ZUFDWCxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1VBQUEsS0FBQSxFQUFPLFNBQVA7VUFBa0IsTUFBQSxFQUFRLENBQUMsZUFBRCxFQUFrQixvQkFBbEIsQ0FBMUI7U0FBMUI7TUFGOEIsQ0FBaEM7SUFEeUMsQ0FBM0M7SUFLQSxFQUFBLENBQUcsdUNBQUgsRUFBNEMsU0FBQTtBQUMxQyxVQUFBO01BQUMsU0FBVSxPQUFPLENBQUMsWUFBUixDQUFxQiw4QkFBckI7TUFFWCxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLEdBQVA7UUFBWSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWtCLHVCQUFsQixFQUEyQyxvQkFBM0MsRUFBaUUsMERBQWpFLENBQXBCO09BQTFCO01BQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtRQUFBLEtBQUEsRUFBTyxLQUFQO1FBQWMsTUFBQSxFQUFRLENBQUMsZUFBRCxFQUFrQix1QkFBbEIsRUFBMkMsb0JBQTNDLEVBQWlFLGdDQUFqRSxFQUFtRyx5Q0FBbkcsQ0FBdEI7T0FBMUI7TUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLEtBQVA7UUFBYyxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWtCLHVCQUFsQixFQUEyQyxvQkFBM0MsRUFBaUUsZ0NBQWpFLENBQXRCO09BQTFCO01BQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtRQUFBLEtBQUEsRUFBTyxJQUFQO1FBQWEsTUFBQSxFQUFRLENBQUMsZUFBRCxFQUFrQix1QkFBbEIsRUFBMkMsb0JBQTNDLEVBQWlFLGdDQUFqRSxFQUFtRyx1Q0FBbkcsQ0FBckI7T0FBMUI7YUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLEtBQVA7UUFBYyxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWtCLHVCQUFsQixFQUEyQyxvQkFBM0MsRUFBaUUsZ0NBQWpFLENBQXRCO09BQTFCO0lBUDBDLENBQTVDO0lBU0EsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUE7QUFDN0IsVUFBQTtNQUFDLFNBQVUsT0FBTyxDQUFDLFlBQVIsQ0FBcUIsTUFBckI7TUFFWCxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLElBQVA7UUFBYSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWtCLHdCQUFsQixFQUE0Qyx5Q0FBNUMsQ0FBckI7T0FBMUI7TUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLElBQVA7UUFBYSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWtCLHdCQUFsQixFQUE0Qyx1Q0FBNUMsQ0FBckI7T0FBMUI7TUFFQyxTQUFVLE9BQU8sQ0FBQyxZQUFSLENBQXFCLFdBQXJCO01BRVgsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtRQUFBLEtBQUEsRUFBTyxJQUFQO1FBQWEsTUFBQSxFQUFRLENBQUMsZUFBRCxFQUFrQixrQkFBbEIsRUFBc0MseUNBQXRDLENBQXJCO09BQTFCO01BQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtRQUFBLEtBQUEsRUFBTyxPQUFQO1FBQWdCLE1BQUEsRUFBUSxDQUFDLGVBQUQsRUFBa0Isa0JBQWxCLENBQXhCO09BQTFCO2FBQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtRQUFBLEtBQUEsRUFBTyxJQUFQO1FBQWEsTUFBQSxFQUFRLENBQUMsZUFBRCxFQUFrQixrQkFBbEIsRUFBc0MsdUNBQXRDLENBQXJCO09BQTFCO0lBVjZCLENBQS9CO0lBWUEsRUFBQSxDQUFHLDJCQUFILEVBQWdDLFNBQUE7QUFDOUIsVUFBQTtNQUFDLFNBQVUsT0FBTyxDQUFDLFlBQVIsQ0FBcUIsT0FBckI7TUFFWCxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLEtBQVA7UUFBYyxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWtCLGdDQUFsQixFQUFvRCx5Q0FBcEQsQ0FBdEI7T0FBMUI7TUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLElBQVA7UUFBYSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWtCLGdDQUFsQixFQUFvRCx1Q0FBcEQsQ0FBckI7T0FBMUI7TUFFQyxTQUFVLE9BQU8sQ0FBQyxZQUFSLENBQXFCLFlBQXJCO01BRVgsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtRQUFBLEtBQUEsRUFBTyxLQUFQO1FBQWMsTUFBQSxFQUFRLENBQUMsZUFBRCxFQUFrQixnQ0FBbEIsRUFBb0QseUNBQXBELENBQXRCO09BQTFCO01BQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtRQUFBLEtBQUEsRUFBTyxPQUFQO1FBQWdCLE1BQUEsRUFBUSxDQUFDLGVBQUQsRUFBa0IsZ0NBQWxCLENBQXhCO09BQTFCO2FBQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtRQUFBLEtBQUEsRUFBTyxJQUFQO1FBQWEsTUFBQSxFQUFRLENBQUMsZUFBRCxFQUFrQixnQ0FBbEIsRUFBb0QsdUNBQXBELENBQXJCO09BQTFCO0lBVjhCLENBQWhDO0lBWUEsRUFBQSxDQUFHLG9CQUFILEVBQXlCLFNBQUE7QUFDdkIsVUFBQTtNQUFDLFNBQVUsT0FBTyxDQUFDLFlBQVIsQ0FBcUIsYUFBckI7TUFFWCxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLEdBQVA7UUFBWSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWlCLGFBQWpCLEVBQStCLHFDQUEvQixDQUFwQjtPQUExQjtNQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7UUFBQSxLQUFBLEVBQU8sS0FBUDtRQUFjLE1BQUEsRUFBUSxDQUFDLGVBQUQsRUFBaUIsYUFBakIsRUFBK0Isb0JBQS9CLENBQXRCO09BQTFCO01BQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtRQUFBLEtBQUEsRUFBTyxHQUFQO1FBQVksTUFBQSxFQUFRLENBQUMsZUFBRCxFQUFpQixhQUFqQixFQUErQixtQ0FBL0IsQ0FBcEI7T0FBMUI7TUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLElBQVA7UUFBYSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWlCLGVBQWpCLEVBQWlDLHFDQUFqQyxDQUFyQjtPQUExQjtNQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7UUFBQSxLQUFBLEVBQU8sS0FBUDtRQUFjLE1BQUEsRUFBUSxDQUFDLGVBQUQsRUFBaUIsZUFBakIsRUFBaUMsb0JBQWpDLENBQXRCO09BQTFCO2FBQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtRQUFBLEtBQUEsRUFBTyxHQUFQO1FBQVksTUFBQSxFQUFRLENBQUMsZUFBRCxFQUFpQixlQUFqQixFQUFpQyxtQ0FBakMsQ0FBcEI7T0FBMUI7SUFSdUIsQ0FBekI7SUFVQSxFQUFBLENBQUcsa0NBQUgsRUFBdUMsU0FBQTtBQUNyQyxVQUFBO01BQUMsU0FBVSxPQUFPLENBQUMsWUFBUixDQUFxQixzQkFBckI7TUFDWCxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLEdBQVA7UUFBWSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWlCLGFBQWpCLEVBQStCLHFDQUEvQixDQUFwQjtPQUExQjtNQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7UUFBQSxLQUFBLEVBQU8sS0FBUDtRQUFjLE1BQUEsRUFBUSxDQUFDLGVBQUQsRUFBaUIsYUFBakIsRUFBK0Isb0JBQS9CLENBQXRCO09BQTFCO01BQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtRQUFBLEtBQUEsRUFBTyxHQUFQO1FBQVksTUFBQSxFQUFRLENBQUMsZUFBRCxFQUFpQixhQUFqQixFQUErQixtQ0FBL0IsQ0FBcEI7T0FBMUI7TUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLElBQVA7UUFBYSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWlCLGVBQWpCLEVBQWlDLHFDQUFqQyxDQUFyQjtPQUExQjtNQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7UUFBQSxLQUFBLEVBQU8sS0FBUDtRQUFjLE1BQUEsRUFBUSxDQUFDLGVBQUQsRUFBaUIsZUFBakIsRUFBaUMsb0JBQWpDLENBQXRCO09BQTFCO2FBQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtRQUFBLEtBQUEsRUFBTyxHQUFQO1FBQVksTUFBQSxFQUFRLENBQUMsZUFBRCxFQUFpQixlQUFqQixFQUFpQyxtQ0FBakMsQ0FBcEI7T0FBMUI7SUFQcUMsQ0FBdkM7SUFTQSxFQUFBLENBQUcsb0NBQUgsRUFBeUMsU0FBQTtBQUN2QyxVQUFBO01BQUMsU0FBVSxPQUFPLENBQUMsWUFBUixDQUFxQixzQ0FBckI7TUFDWCxNQUFBLENBQU8sTUFBTyxDQUFBLEVBQUEsQ0FBZCxDQUFrQixDQUFDLE9BQW5CLENBQTJCO1FBQUEsS0FBQSxFQUFPLEdBQVA7UUFBWSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWlCLGFBQWpCLEVBQStCLHFDQUEvQixDQUFwQjtPQUEzQjtNQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsRUFBQSxDQUFkLENBQWtCLENBQUMsT0FBbkIsQ0FBMkI7UUFBQSxLQUFBLEVBQU8sS0FBUDtRQUFjLE1BQUEsRUFBUSxDQUFDLGVBQUQsRUFBaUIsYUFBakIsRUFBK0Isb0JBQS9CLENBQXRCO09BQTNCO01BQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxFQUFBLENBQWQsQ0FBa0IsQ0FBQyxPQUFuQixDQUEyQjtRQUFBLEtBQUEsRUFBTyxHQUFQO1FBQVksTUFBQSxFQUFRLENBQUMsZUFBRCxFQUFpQixhQUFqQixFQUErQixtQ0FBL0IsQ0FBcEI7T0FBM0I7TUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLEVBQUEsQ0FBZCxDQUFrQixDQUFDLE9BQW5CLENBQTJCO1FBQUEsS0FBQSxFQUFPLElBQVA7UUFBYSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWlCLGVBQWpCLEVBQWlDLHFDQUFqQyxDQUFyQjtPQUEzQjtNQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsRUFBQSxDQUFkLENBQWtCLENBQUMsT0FBbkIsQ0FBMkI7UUFBQSxLQUFBLEVBQU8sS0FBUDtRQUFjLE1BQUEsRUFBUSxDQUFDLGVBQUQsRUFBaUIsZUFBakIsRUFBaUMsb0JBQWpDLENBQXRCO09BQTNCO2FBQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxFQUFBLENBQWQsQ0FBa0IsQ0FBQyxPQUFuQixDQUEyQjtRQUFBLEtBQUEsRUFBTyxHQUFQO1FBQVksTUFBQSxFQUFRLENBQUMsZUFBRCxFQUFpQixlQUFqQixFQUFpQyxtQ0FBakMsQ0FBcEI7T0FBM0I7SUFQdUMsQ0FBekM7SUFTQSxFQUFBLENBQUcsaURBQUgsRUFBc0QsU0FBQTtBQUNwRCxVQUFBO01BQUMsU0FBVSxPQUFPLENBQUMsWUFBUixDQUFxQiw0Q0FBckI7TUFDWCxNQUFBLENBQU8sTUFBTyxDQUFBLEVBQUEsQ0FBZCxDQUFrQixDQUFDLE9BQW5CLENBQTJCO1FBQUEsS0FBQSxFQUFPLEdBQVA7UUFBWSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWlCLGFBQWpCLEVBQStCLHFDQUEvQixDQUFwQjtPQUEzQjtNQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsRUFBQSxDQUFkLENBQWtCLENBQUMsT0FBbkIsQ0FBMkI7UUFBQSxLQUFBLEVBQU8sS0FBUDtRQUFjLE1BQUEsRUFBUSxDQUFDLGVBQUQsRUFBaUIsYUFBakIsRUFBK0Isb0JBQS9CLENBQXRCO09BQTNCO01BQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxFQUFBLENBQWQsQ0FBa0IsQ0FBQyxPQUFuQixDQUEyQjtRQUFBLEtBQUEsRUFBTyxHQUFQO1FBQVksTUFBQSxFQUFRLENBQUMsZUFBRCxFQUFpQixhQUFqQixFQUErQixtQ0FBL0IsQ0FBcEI7T0FBM0I7TUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLEVBQUEsQ0FBZCxDQUFrQixDQUFDLE9BQW5CLENBQTJCO1FBQUEsS0FBQSxFQUFPLElBQVA7UUFBYSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWlCLGVBQWpCLEVBQWlDLHFDQUFqQyxDQUFyQjtPQUEzQjtNQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsRUFBQSxDQUFkLENBQWtCLENBQUMsT0FBbkIsQ0FBMkI7UUFBQSxLQUFBLEVBQU8sS0FBUDtRQUFjLE1BQUEsRUFBUSxDQUFDLGVBQUQsRUFBaUIsZUFBakIsRUFBaUMsb0JBQWpDLENBQXRCO09BQTNCO2FBQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxFQUFBLENBQWQsQ0FBa0IsQ0FBQyxPQUFuQixDQUEyQjtRQUFBLEtBQUEsRUFBTyxHQUFQO1FBQVksTUFBQSxFQUFRLENBQUMsZUFBRCxFQUFpQixlQUFqQixFQUFpQyxtQ0FBakMsQ0FBcEI7T0FBM0I7SUFQb0QsQ0FBdEQ7SUFVQSxFQUFBLENBQUcsb0NBQUgsRUFBeUMsU0FBQTtBQUN2QyxVQUFBO01BQUMsU0FBVSxPQUFPLENBQUMsWUFBUixDQUFxQixrQkFBckI7TUFDWCxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLEdBQVA7UUFBWSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWlCLHVCQUFqQixFQUF5QyxhQUF6QyxFQUF1RCxxQ0FBdkQsQ0FBcEI7T0FBMUI7TUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLEtBQVA7UUFBYyxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWlCLHVCQUFqQixFQUF5QyxhQUF6QyxFQUF1RCxvQkFBdkQsQ0FBdEI7T0FBMUI7TUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLEdBQVA7UUFBWSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWlCLHVCQUFqQixFQUF5QyxhQUF6QyxFQUF1RCxtQ0FBdkQsQ0FBcEI7T0FBMUI7TUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLElBQVA7UUFBYSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWlCLHVCQUFqQixFQUF5QyxlQUF6QyxFQUF5RCxxQ0FBekQsQ0FBckI7T0FBMUI7TUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLEtBQVA7UUFBYyxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWlCLHVCQUFqQixFQUF5QyxlQUF6QyxFQUF5RCxvQkFBekQsQ0FBdEI7T0FBMUI7YUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLEdBQVA7UUFBWSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWlCLHVCQUFqQixFQUF5QyxlQUF6QyxFQUF5RCxtQ0FBekQsQ0FBcEI7T0FBMUI7SUFQdUMsQ0FBekM7SUFTQSxFQUFBLENBQUcsa0NBQUgsRUFBdUMsU0FBQTtBQUNyQyxVQUFBO01BQUMsU0FBVSxPQUFPLENBQUMsWUFBUixDQUFxQixzQkFBckI7TUFDWCxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLEdBQVA7UUFBWSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWlCLHFCQUFqQixFQUF1QyxhQUF2QyxFQUFxRCxxQ0FBckQsQ0FBcEI7T0FBMUI7TUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLEtBQVA7UUFBYyxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWlCLHFCQUFqQixFQUF1QyxhQUF2QyxFQUFxRCxvQkFBckQsQ0FBdEI7T0FBMUI7TUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLEdBQVA7UUFBWSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWlCLHFCQUFqQixFQUF1QyxhQUF2QyxFQUFxRCxtQ0FBckQsQ0FBcEI7T0FBMUI7TUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLElBQVA7UUFBYSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWlCLHFCQUFqQixFQUF1QyxlQUF2QyxFQUF1RCxxQ0FBdkQsQ0FBckI7T0FBMUI7TUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLEtBQVA7UUFBYyxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWlCLHFCQUFqQixFQUF1QyxlQUF2QyxFQUF1RCxvQkFBdkQsQ0FBdEI7T0FBMUI7YUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLEdBQVA7UUFBWSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWlCLHFCQUFqQixFQUF1QyxlQUF2QyxFQUF1RCxtQ0FBdkQsQ0FBcEI7T0FBMUI7SUFQcUMsQ0FBdkM7SUFVQSxFQUFBLENBQUcsa0NBQUgsRUFBdUMsU0FBQTtBQUNyQyxVQUFBO01BQUMsU0FBVSxPQUFPLENBQUMsWUFBUixDQUFxQixrQkFBckI7TUFFWCxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLEdBQVA7UUFBWSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWlCLGFBQWpCLEVBQStCLHFDQUEvQixDQUFwQjtPQUExQjtNQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7UUFBQSxLQUFBLEVBQU8sS0FBUDtRQUFjLE1BQUEsRUFBUSxDQUFDLGVBQUQsRUFBaUIsYUFBakIsRUFBK0Isb0JBQS9CLENBQXRCO09BQTFCO01BQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtRQUFBLEtBQUEsRUFBTyxHQUFQO1FBQVksTUFBQSxFQUFRLENBQUMsZUFBRCxFQUFpQixhQUFqQixFQUErQixtQ0FBL0IsQ0FBcEI7T0FBMUI7TUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLE9BQVA7UUFBZ0IsTUFBQSxFQUFRLENBQUMsZUFBRCxFQUFpQixzQkFBakIsQ0FBeEI7T0FBMUI7TUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLElBQVA7UUFBYSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWlCLGVBQWpCLEVBQWlDLHFDQUFqQyxDQUFyQjtPQUExQjtNQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7UUFBQSxLQUFBLEVBQU8sS0FBUDtRQUFjLE1BQUEsRUFBUSxDQUFDLGVBQUQsRUFBaUIsZUFBakIsRUFBaUMsb0JBQWpDLENBQXRCO09BQTFCO2FBQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtRQUFBLEtBQUEsRUFBTyxHQUFQO1FBQVksTUFBQSxFQUFRLENBQUMsZUFBRCxFQUFpQixlQUFqQixFQUFpQyxtQ0FBakMsQ0FBcEI7T0FBMUI7SUFUcUMsQ0FBdkM7SUFXQSxFQUFBLENBQUcsb0RBQUgsRUFBeUQsU0FBQTtBQUN2RCxVQUFBO01BQUMsU0FBVSxPQUFPLENBQUMsWUFBUixDQUFxQixzQkFBckI7TUFDWCxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLEdBQVA7UUFBWSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWlCLHFCQUFqQixDQUFwQjtPQUExQjtNQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7UUFBQSxLQUFBLEVBQU8sR0FBUDtRQUFZLE1BQUEsRUFBUSxDQUFDLGVBQUQsQ0FBcEI7T0FBMUI7TUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLEdBQVA7UUFBWSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWtCLDZCQUFsQixDQUFwQjtPQUExQjtNQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7UUFBQSxLQUFBLEVBQU8sR0FBUDtRQUFZLE1BQUEsRUFBUSxDQUFDLGVBQUQsRUFBaUIsYUFBakIsRUFBK0IscUNBQS9CLENBQXBCO09BQTFCO01BQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtRQUFBLEtBQUEsRUFBTyxLQUFQO1FBQWMsTUFBQSxFQUFRLENBQUMsZUFBRCxFQUFpQixhQUFqQixFQUErQixvQkFBL0IsQ0FBdEI7T0FBMUI7TUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLEdBQVA7UUFBWSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWlCLGFBQWpCLEVBQStCLG1DQUEvQixDQUFwQjtPQUExQjtNQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7UUFBQSxLQUFBLEVBQU8sSUFBUDtRQUFhLE1BQUEsRUFBUSxDQUFDLGVBQUQsRUFBaUIsZUFBakIsRUFBaUMscUNBQWpDLENBQXJCO09BQTFCO01BQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtRQUFBLEtBQUEsRUFBTyxLQUFQO1FBQWMsTUFBQSxFQUFRLENBQUMsZUFBRCxFQUFpQixlQUFqQixFQUFpQyxvQkFBakMsQ0FBdEI7T0FBMUI7TUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLEdBQVA7UUFBWSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWlCLGVBQWpCLEVBQWlDLG1DQUFqQyxDQUFwQjtPQUExQjtNQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7UUFBQSxLQUFBLEVBQU8sR0FBUDtRQUFZLE1BQUEsRUFBUSxDQUFDLGVBQUQsRUFBaUIsNkJBQWpCLENBQXBCO09BQTFCO01BQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxFQUFBLENBQWQsQ0FBa0IsQ0FBQyxPQUFuQixDQUEyQjtRQUFBLEtBQUEsRUFBTyxNQUFQO1FBQWUsTUFBQSxFQUFRLENBQUMsZUFBRCxFQUFpQiwyQkFBakIsQ0FBdkI7T0FBM0I7YUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLEVBQUEsQ0FBZCxDQUFrQixDQUFDLE9BQW5CLENBQTJCO1FBQUEsS0FBQSxFQUFPLEdBQVA7UUFBWSxNQUFBLEVBQVEsQ0FBQyxlQUFELEVBQWlCLHFCQUFqQixDQUFwQjtPQUEzQjtJQWJ1RCxDQUF6RDtXQTJCQSxRQUFBLENBQVMsYUFBVCxFQUF3QixTQUFBO0FBQ3RCLFVBQUE7TUFBQSxNQUFBLEdBQVM7TUFFVCxVQUFBLENBQVcsU0FBQTtRQUNULE1BQUEsR0FBUyxlQUFBLENBQUE7ZUFDVCxNQUFNLENBQUMsVUFBUCxDQUFrQixPQUFsQjtNQUZTLENBQVg7TUFJQSwwQkFBQSxHQUE2QixTQUFDLElBQUQ7UUFDM0IsTUFBTSxDQUFDLE9BQVAsQ0FBZSxJQUFmO1FBQ0EsTUFBTSxDQUFDLG9CQUFQLENBQTRCLENBQTVCLEVBQStCLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBWCxDQUFnQixDQUFDLE1BQWpCLEdBQTBCLENBQXpEO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLElBQTlCO01BSDJCO01BSzdCLEVBQUEsQ0FBRyxtQ0FBSCxFQUF3QyxTQUFBO2VBQ3RDLDBCQUFBLENBQTJCLHlJQUEzQjtNQURzQyxDQUF4QzthQXNCQSxFQUFBLENBQUcsdUNBQUgsRUFBNEMsU0FBQTtlQUMxQywwQkFBQSxDQUEyQix5SEFBM0I7TUFEMEMsQ0FBNUM7SUFsQ3NCLENBQXhCO0VBNVB3QixDQUExQjtBQVJBIiwic291cmNlc0NvbnRlbnQiOlsiVGV4dEVkaXRvciA9IG51bGxcbmJ1aWxkVGV4dEVkaXRvciA9IChwYXJhbXMpIC0+XG4gIGlmIGF0b20ud29ya3NwYWNlLmJ1aWxkVGV4dEVkaXRvcj9cbiAgICBhdG9tLndvcmtzcGFjZS5idWlsZFRleHRFZGl0b3IocGFyYW1zKVxuICBlbHNlXG4gICAgVGV4dEVkaXRvciA/PSByZXF1aXJlKCdhdG9tJykuVGV4dEVkaXRvclxuICAgIG5ldyBUZXh0RWRpdG9yKHBhcmFtcylcblxuZGVzY3JpYmUgXCJSZWFjdCBncmFtbWFyXCIsIC0+XG4gIGdyYW1tYXIgPSBudWxsXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoXCJsYW5ndWFnZS1qYXZhc2NyaXB0XCIpXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKFwicmVhY3RcIilcblxuICAgIHJ1bnMgLT5cbiAgICAgIGdyYW1tYXIgPSBhdG9tLmdyYW1tYXJzLmdyYW1tYXJGb3JTY29wZU5hbWUoXCJzb3VyY2UuanMuanN4XCIpXG5cbiAgYWZ0ZXJFYWNoIC0+XG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBhdG9tLnBhY2thZ2VzLmRlYWN0aXZhdGVQYWNrYWdlcygpXG4gICAgcnVucyAtPlxuICAgICAgYXRvbS5wYWNrYWdlcy51bmxvYWRQYWNrYWdlcygpXG5cbiAgaXQgXCJwYXJzZXMgdGhlIGdyYW1tYXJcIiwgLT5cbiAgICBleHBlY3QoZ3JhbW1hcikudG9CZVRydXRoeSgpXG4gICAgZXhwZWN0KGdyYW1tYXIuc2NvcGVOYW1lKS50b0JlIFwic291cmNlLmpzLmpzeFwiXG5cbiAgZGVzY3JpYmUgXCJzdHJpbmdzXCIsIC0+XG4gICAgaXQgXCJ0b2tlbml6ZXMgc2luZ2xlLWxpbmUgc3RyaW5nc1wiLCAtPlxuICAgICAgZGVsaW1zQnlTY29wZSA9XG4gICAgICAgIFwic3RyaW5nLnF1b3RlZC5kb3VibGUuanNcIjogJ1wiJ1xuICAgICAgICBcInN0cmluZy5xdW90ZWQuc2luZ2xlLmpzXCI6IFwiJ1wiXG5cbiAgICAgIGZvciBzY29wZSwgZGVsaW0gb2YgZGVsaW1zQnlTY29wZVxuICAgICAgICB7dG9rZW5zfSA9IGdyYW1tYXIudG9rZW5pemVMaW5lKGRlbGltICsgXCJ4XCIgKyBkZWxpbSlcbiAgICAgICAgZXhwZWN0KHRva2Vuc1swXS52YWx1ZSkudG9FcXVhbCBkZWxpbVxuICAgICAgICBleHBlY3QodG9rZW5zWzBdLnNjb3BlcykudG9FcXVhbCBbXCJzb3VyY2UuanMuanN4XCIsIHNjb3BlLCBcInB1bmN0dWF0aW9uLmRlZmluaXRpb24uc3RyaW5nLmJlZ2luLmpzXCJdXG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV0udmFsdWUpLnRvRXF1YWwgXCJ4XCJcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXS5zY29wZXMpLnRvRXF1YWwgW1wic291cmNlLmpzLmpzeFwiLCBzY29wZV1cbiAgICAgICAgZXhwZWN0KHRva2Vuc1syXS52YWx1ZSkudG9FcXVhbCBkZWxpbVxuICAgICAgICBleHBlY3QodG9rZW5zWzJdLnNjb3BlcykudG9FcXVhbCBbXCJzb3VyY2UuanMuanN4XCIsIHNjb3BlLCBcInB1bmN0dWF0aW9uLmRlZmluaXRpb24uc3RyaW5nLmVuZC5qc1wiXVxuXG4gIGRlc2NyaWJlIFwia2V5d29yZHNcIiwgLT5cbiAgICBpdCBcInRva2VuaXplcyB3aXRoIGFzIGEga2V5d29yZFwiLCAtPlxuICAgICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgnd2l0aCcpXG4gICAgICBleHBlY3QodG9rZW5zWzBdKS50b0VxdWFsIHZhbHVlOiAnd2l0aCcsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ2tleXdvcmQuY29udHJvbC5qcyddXG5cbiAgZGVzY3JpYmUgXCJyZWd1bGFyIGV4cHJlc3Npb25zXCIsIC0+XG4gICAgaXQgXCJ0b2tlbml6ZXMgcmVndWxhciBleHByZXNzaW9uc1wiLCAtPlxuICAgICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgnL3Rlc3QvJylcbiAgICAgIGV4cGVjdCh0b2tlbnNbMF0pLnRvRXF1YWwgdmFsdWU6ICcvJywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnLCAnc3RyaW5nLnJlZ2V4cC5qcycsICdwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnN0cmluZy5iZWdpbi5qcyddXG4gICAgICBleHBlY3QodG9rZW5zWzFdKS50b0VxdWFsIHZhbHVlOiAndGVzdCcsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ3N0cmluZy5yZWdleHAuanMnXVxuICAgICAgZXhwZWN0KHRva2Vuc1syXSkudG9FcXVhbCB2YWx1ZTogJy8nLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdzdHJpbmcucmVnZXhwLmpzJywgJ3B1bmN0dWF0aW9uLmRlZmluaXRpb24uc3RyaW5nLmVuZC5qcyddXG5cbiAgICAgIHt0b2tlbnN9ID0gZ3JhbW1hci50b2tlbml6ZUxpbmUoJ2ZvbyArIC90ZXN0LycpXG4gICAgICBleHBlY3QodG9rZW5zWzBdKS50b0VxdWFsIHZhbHVlOiAnZm9vICcsIHNjb3BlczogWydzb3VyY2UuanMuanN4J11cbiAgICAgIGV4cGVjdCh0b2tlbnNbMV0pLnRvRXF1YWwgdmFsdWU6ICcrJywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnLCAna2V5d29yZC5vcGVyYXRvci5qcyddXG4gICAgICBleHBlY3QodG9rZW5zWzJdKS50b0VxdWFsIHZhbHVlOiAnICcsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ3N0cmluZy5yZWdleHAuanMnXVxuICAgICAgZXhwZWN0KHRva2Vuc1szXSkudG9FcXVhbCB2YWx1ZTogJy8nLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdzdHJpbmcucmVnZXhwLmpzJywgJ3B1bmN0dWF0aW9uLmRlZmluaXRpb24uc3RyaW5nLmJlZ2luLmpzJ11cbiAgICAgIGV4cGVjdCh0b2tlbnNbNF0pLnRvRXF1YWwgdmFsdWU6ICd0ZXN0Jywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnLCAnc3RyaW5nLnJlZ2V4cC5qcyddXG4gICAgICBleHBlY3QodG9rZW5zWzVdKS50b0VxdWFsIHZhbHVlOiAnLycsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ3N0cmluZy5yZWdleHAuanMnLCAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi5zdHJpbmcuZW5kLmpzJ11cblxuICAgIGl0IFwidG9rZW5pemVzIHJlZ3VsYXIgZXhwcmVzc2lvbnMgaW5zaWRlIGFycmF5c1wiLCAtPlxuICAgICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgnWy90ZXN0L10nKVxuICAgICAgZXhwZWN0KHRva2Vuc1swXSkudG9FcXVhbCB2YWx1ZTogJ1snLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdtZXRhLmJyYWNlLnNxdWFyZS5qcyddXG4gICAgICBleHBlY3QodG9rZW5zWzFdKS50b0VxdWFsIHZhbHVlOiAnLycsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ3N0cmluZy5yZWdleHAuanMnLCAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi5zdHJpbmcuYmVnaW4uanMnXVxuICAgICAgZXhwZWN0KHRva2Vuc1syXSkudG9FcXVhbCB2YWx1ZTogJ3Rlc3QnLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdzdHJpbmcucmVnZXhwLmpzJ11cbiAgICAgIGV4cGVjdCh0b2tlbnNbM10pLnRvRXF1YWwgdmFsdWU6ICcvJywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnLCAnc3RyaW5nLnJlZ2V4cC5qcycsICdwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnN0cmluZy5lbmQuanMnXVxuICAgICAgZXhwZWN0KHRva2Vuc1s0XSkudG9FcXVhbCB2YWx1ZTogJ10nLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdtZXRhLmJyYWNlLnNxdWFyZS5qcyddXG5cbiAgICAgIHt0b2tlbnN9ID0gZ3JhbW1hci50b2tlbml6ZUxpbmUoJ1sxLCAvdGVzdC9dJylcbiAgICAgIGV4cGVjdCh0b2tlbnNbMF0pLnRvRXF1YWwgdmFsdWU6ICdbJywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnLCAnbWV0YS5icmFjZS5zcXVhcmUuanMnXVxuICAgICAgZXhwZWN0KHRva2Vuc1sxXSkudG9FcXVhbCB2YWx1ZTogJzEnLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdjb25zdGFudC5udW1lcmljLmRlY2ltYWwuanMnXVxuICAgICAgZXhwZWN0KHRva2Vuc1syXSkudG9FcXVhbCB2YWx1ZTogJywnLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdtZXRhLmRlbGltaXRlci5vYmplY3QuY29tbWEuanMnXVxuICAgICAgZXhwZWN0KHRva2Vuc1szXSkudG9FcXVhbCB2YWx1ZTogJyAnLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdzdHJpbmcucmVnZXhwLmpzJ11cbiAgICAgIGV4cGVjdCh0b2tlbnNbNF0pLnRvRXF1YWwgdmFsdWU6ICcvJywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnLCAnc3RyaW5nLnJlZ2V4cC5qcycsICdwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnN0cmluZy5iZWdpbi5qcyddXG4gICAgICBleHBlY3QodG9rZW5zWzVdKS50b0VxdWFsIHZhbHVlOiAndGVzdCcsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ3N0cmluZy5yZWdleHAuanMnXVxuICAgICAgZXhwZWN0KHRva2Vuc1s2XSkudG9FcXVhbCB2YWx1ZTogJy8nLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdzdHJpbmcucmVnZXhwLmpzJywgJ3B1bmN0dWF0aW9uLmRlZmluaXRpb24uc3RyaW5nLmVuZC5qcyddXG4gICAgICBleHBlY3QodG9rZW5zWzddKS50b0VxdWFsIHZhbHVlOiAnXScsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ21ldGEuYnJhY2Uuc3F1YXJlLmpzJ11cblxuICAgICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgnMHgxRDMwNicpXG4gICAgICBleHBlY3QodG9rZW5zWzBdKS50b0VxdWFsIHZhbHVlOiAnMHgxRDMwNicsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ2NvbnN0YW50Lm51bWVyaWMuaGV4LmpzJ11cblxuICAgICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgnMFgxRDMwNicpXG4gICAgICBleHBlY3QodG9rZW5zWzBdKS50b0VxdWFsIHZhbHVlOiAnMFgxRDMwNicsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ2NvbnN0YW50Lm51bWVyaWMuaGV4LmpzJ11cblxuICAgICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgnMGIwMTExMDExMTAxMTEwMTAwMDExMDAxMTAnKVxuICAgICAgZXhwZWN0KHRva2Vuc1swXSkudG9FcXVhbCB2YWx1ZTogJzBiMDExMTAxMTEwMTExMDEwMDAxMTAwMTEwJywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnLCAnY29uc3RhbnQubnVtZXJpYy5iaW5hcnkuanMnXVxuXG4gICAgICB7dG9rZW5zfSA9IGdyYW1tYXIudG9rZW5pemVMaW5lKCcwQjAxMTEwMTExMDExMTAxMDAwMTEwMDExMCcpXG4gICAgICBleHBlY3QodG9rZW5zWzBdKS50b0VxdWFsIHZhbHVlOiAnMEIwMTExMDExMTAxMTEwMTAwMDExMDAxMTAnLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdjb25zdGFudC5udW1lcmljLmJpbmFyeS5qcyddXG5cbiAgICAgIHt0b2tlbnN9ID0gZ3JhbW1hci50b2tlbml6ZUxpbmUoJzBvMTQxMScpXG4gICAgICBleHBlY3QodG9rZW5zWzBdKS50b0VxdWFsIHZhbHVlOiAnMG8xNDExJywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnLCAnY29uc3RhbnQubnVtZXJpYy5vY3RhbC5qcyddXG5cbiAgICAgIHt0b2tlbnN9ID0gZ3JhbW1hci50b2tlbml6ZUxpbmUoJzBPMTQxMScpXG4gICAgICBleHBlY3QodG9rZW5zWzBdKS50b0VxdWFsIHZhbHVlOiAnME8xNDExJywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnLCAnY29uc3RhbnQubnVtZXJpYy5vY3RhbC5qcyddXG5cbiAgZGVzY3JpYmUgXCJvcGVyYXRvcnNcIiwgLT5cbiAgICBpdCBcInRva2VuaXplcyB2b2lkIGNvcnJlY3RseVwiLCAtPlxuICAgICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgndm9pZCcpXG4gICAgICBleHBlY3QodG9rZW5zWzBdKS50b0VxdWFsIHZhbHVlOiAndm9pZCcsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ2tleXdvcmQub3BlcmF0b3Iudm9pZC5qcyddXG5cbiAgICBpdCBcInRva2VuaXplcyB0aGUgLyBhcml0aG1ldGljIG9wZXJhdG9yIHdoZW4gc2VwYXJhdGVkIGJ5IG5ld2xpbmVzXCIsIC0+XG4gICAgICBsaW5lcyA9IGdyYW1tYXIudG9rZW5pemVMaW5lcyBcIlwiXCJcbiAgICAgICAgMVxuICAgICAgICAvIDJcbiAgICAgIFwiXCJcIlxuICAgICAgZXhwZWN0KGxpbmVzWzBdWzBdKS50b0VxdWFsIHZhbHVlOiAnMScsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ2NvbnN0YW50Lm51bWVyaWMuZGVjaW1hbC5qcyddXG4gICAgICBleHBlY3QobGluZXNbMV1bMF0pLnRvRXF1YWwgdmFsdWU6ICcvJywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnLCAna2V5d29yZC5vcGVyYXRvci5qcyddXG4gICAgICBleHBlY3QobGluZXNbMV1bMV0pLnRvRXF1YWwgdmFsdWU6ICcgJywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnXVxuICAgICAgZXhwZWN0KGxpbmVzWzFdWzJdKS50b0VxdWFsIHZhbHVlOiAnMicsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ2NvbnN0YW50Lm51bWVyaWMuZGVjaW1hbC5qcyddXG5cbiAgZGVzY3JpYmUgXCJFUzYgc3RyaW5nIHRlbXBsYXRlc1wiLCAtPlxuICAgIGl0IFwidG9rZW5pemVzIHRoZW0gYXMgc3RyaW5nc1wiLCAtPlxuICAgICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgnYGhleSAke25hbWV9YCcpXG4gICAgICBleHBlY3QodG9rZW5zWzBdKS50b0VxdWFsIHZhbHVlOiAnYCcsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ3N0cmluZy5xdW90ZWQudGVtcGxhdGUuanMnLCAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi5zdHJpbmcuYmVnaW4uanMnXVxuICAgICAgZXhwZWN0KHRva2Vuc1sxXSkudG9FcXVhbCB2YWx1ZTogJ2hleSAnLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdzdHJpbmcucXVvdGVkLnRlbXBsYXRlLmpzJ11cbiAgICAgIGV4cGVjdCh0b2tlbnNbMl0pLnRvRXF1YWwgdmFsdWU6ICckeycsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ3N0cmluZy5xdW90ZWQudGVtcGxhdGUuanMnLCAnc291cmNlLmpzLmVtYmVkZGVkLnNvdXJjZScsICdwdW5jdHVhdGlvbi5zZWN0aW9uLmVtYmVkZGVkLmpzJ11cbiAgICAgIGV4cGVjdCh0b2tlbnNbM10pLnRvRXF1YWwgdmFsdWU6ICduYW1lJywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnLCAnc3RyaW5nLnF1b3RlZC50ZW1wbGF0ZS5qcycsICdzb3VyY2UuanMuZW1iZWRkZWQuc291cmNlJ11cbiAgICAgIGV4cGVjdCh0b2tlbnNbNF0pLnRvRXF1YWwgdmFsdWU6ICd9Jywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnLCAnc3RyaW5nLnF1b3RlZC50ZW1wbGF0ZS5qcycsICdzb3VyY2UuanMuZW1iZWRkZWQuc291cmNlJywgJ3B1bmN0dWF0aW9uLnNlY3Rpb24uZW1iZWRkZWQuanMnXVxuICAgICAgZXhwZWN0KHRva2Vuc1s1XSkudG9FcXVhbCB2YWx1ZTogJ2AnLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdzdHJpbmcucXVvdGVkLnRlbXBsYXRlLmpzJywgJ3B1bmN0dWF0aW9uLmRlZmluaXRpb24uc3RyaW5nLmVuZC5qcyddXG5cbiAgZGVzY3JpYmUgXCJkZWZhdWx0OiBpbiBhIHN3aXRjaCBzdGF0ZW1lbnRcIiwgLT5cbiAgICBpdCBcInRva2VuaXplcyBpdCBhcyBhIGtleXdvcmRcIiwgLT5cbiAgICAgIHt0b2tlbnN9ID0gZ3JhbW1hci50b2tlbml6ZUxpbmUoJ2RlZmF1bHQ6ICcpXG4gICAgICBleHBlY3QodG9rZW5zWzBdKS50b0VxdWFsIHZhbHVlOiAnZGVmYXVsdCcsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ2tleXdvcmQuY29udHJvbC5qcyddXG5cbiAgaXQgXCJ0b2tlbml6ZXMgY29tbWVudHMgaW4gZnVuY3Rpb24gcGFyYW1zXCIsIC0+XG4gICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgnZm9vOiBmdW5jdGlvbiAoLyoqQmFyKi9iYXIpeycpXG5cbiAgICBleHBlY3QodG9rZW5zWzVdKS50b0VxdWFsIHZhbHVlOiAnKCcsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ21ldGEuZnVuY3Rpb24uanNvbi5qcycsICdtZXRhLnBhcmFtZXRlcnMuanMnLCAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi5wYXJhbWV0ZXJzLmJlZ2luLmJyYWNrZXQucm91bmQuanMnXVxuICAgIGV4cGVjdCh0b2tlbnNbNl0pLnRvRXF1YWwgdmFsdWU6ICcvKionLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdtZXRhLmZ1bmN0aW9uLmpzb24uanMnLCAnbWV0YS5wYXJhbWV0ZXJzLmpzJywgJ2NvbW1lbnQuYmxvY2suZG9jdW1lbnRhdGlvbi5qcycsICdwdW5jdHVhdGlvbi5kZWZpbml0aW9uLmNvbW1lbnQuYmVnaW4uanMnXVxuICAgIGV4cGVjdCh0b2tlbnNbN10pLnRvRXF1YWwgdmFsdWU6ICdCYXInLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdtZXRhLmZ1bmN0aW9uLmpzb24uanMnLCAnbWV0YS5wYXJhbWV0ZXJzLmpzJywgJ2NvbW1lbnQuYmxvY2suZG9jdW1lbnRhdGlvbi5qcyddXG4gICAgZXhwZWN0KHRva2Vuc1s4XSkudG9FcXVhbCB2YWx1ZTogJyovJywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnLCAnbWV0YS5mdW5jdGlvbi5qc29uLmpzJywgJ21ldGEucGFyYW1ldGVycy5qcycsICdjb21tZW50LmJsb2NrLmRvY3VtZW50YXRpb24uanMnLCAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi5jb21tZW50LmVuZC5qcyddXG4gICAgZXhwZWN0KHRva2Vuc1s5XSkudG9FcXVhbCB2YWx1ZTogJ2JhcicsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ21ldGEuZnVuY3Rpb24uanNvbi5qcycsICdtZXRhLnBhcmFtZXRlcnMuanMnLCAndmFyaWFibGUucGFyYW1ldGVyLmZ1bmN0aW9uLmpzJyBdXG5cbiAgaXQgXCJ0b2tlbml6ZXMgLyogKi8gY29tbWVudHNcIiwgLT5cbiAgICB7dG9rZW5zfSA9IGdyYW1tYXIudG9rZW5pemVMaW5lKCcvKiovJylcblxuICAgIGV4cGVjdCh0b2tlbnNbMF0pLnRvRXF1YWwgdmFsdWU6ICcvKicsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ2NvbW1lbnQuYmxvY2suZW1wdHkuanMnLCAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi5jb21tZW50LmJlZ2luLmpzJ11cbiAgICBleHBlY3QodG9rZW5zWzFdKS50b0VxdWFsIHZhbHVlOiAnKi8nLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdjb21tZW50LmJsb2NrLmVtcHR5LmpzJywgJ3B1bmN0dWF0aW9uLmRlZmluaXRpb24uY29tbWVudC5lbmQuanMnXVxuXG4gICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgnLyogZm9vICovJylcblxuICAgIGV4cGVjdCh0b2tlbnNbMF0pLnRvRXF1YWwgdmFsdWU6ICcvKicsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ2NvbW1lbnQuYmxvY2suanMnLCAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi5jb21tZW50LmJlZ2luLmpzJ11cbiAgICBleHBlY3QodG9rZW5zWzFdKS50b0VxdWFsIHZhbHVlOiAnIGZvbyAnLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdjb21tZW50LmJsb2NrLmpzJ11cbiAgICBleHBlY3QodG9rZW5zWzJdKS50b0VxdWFsIHZhbHVlOiAnKi8nLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdjb21tZW50LmJsb2NrLmpzJywgJ3B1bmN0dWF0aW9uLmRlZmluaXRpb24uY29tbWVudC5lbmQuanMnXVxuXG4gIGl0IFwidG9rZW5pemVzIC8qKiAqLyBjb21tZW50c1wiLCAtPlxuICAgIHt0b2tlbnN9ID0gZ3JhbW1hci50b2tlbml6ZUxpbmUoJy8qKiovJylcblxuICAgIGV4cGVjdCh0b2tlbnNbMF0pLnRvRXF1YWwgdmFsdWU6ICcvKionLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdjb21tZW50LmJsb2NrLmRvY3VtZW50YXRpb24uanMnLCAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi5jb21tZW50LmJlZ2luLmpzJ11cbiAgICBleHBlY3QodG9rZW5zWzFdKS50b0VxdWFsIHZhbHVlOiAnKi8nLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdjb21tZW50LmJsb2NrLmRvY3VtZW50YXRpb24uanMnLCAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi5jb21tZW50LmVuZC5qcyddXG5cbiAgICB7dG9rZW5zfSA9IGdyYW1tYXIudG9rZW5pemVMaW5lKCcvKiogZm9vICovJylcblxuICAgIGV4cGVjdCh0b2tlbnNbMF0pLnRvRXF1YWwgdmFsdWU6ICcvKionLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdjb21tZW50LmJsb2NrLmRvY3VtZW50YXRpb24uanMnLCAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi5jb21tZW50LmJlZ2luLmpzJ11cbiAgICBleHBlY3QodG9rZW5zWzFdKS50b0VxdWFsIHZhbHVlOiAnIGZvbyAnLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdjb21tZW50LmJsb2NrLmRvY3VtZW50YXRpb24uanMnXVxuICAgIGV4cGVjdCh0b2tlbnNbMl0pLnRvRXF1YWwgdmFsdWU6ICcqLycsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ2NvbW1lbnQuYmxvY2suZG9jdW1lbnRhdGlvbi5qcycsICdwdW5jdHVhdGlvbi5kZWZpbml0aW9uLmNvbW1lbnQuZW5kLmpzJ11cblxuICBpdCBcInRva2VuaXplcyBqc3ggdGFnc1wiLCAtPlxuICAgIHt0b2tlbnN9ID0gZ3JhbW1hci50b2tlbml6ZUxpbmUoJzx0YWc+PC90YWc+JylcblxuICAgIGV4cGVjdCh0b2tlbnNbMF0pLnRvRXF1YWwgdmFsdWU6ICc8Jywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJ0YWcub3Blbi5qc1wiLFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuYmVnaW4uanNcIl1cbiAgICBleHBlY3QodG9rZW5zWzFdKS50b0VxdWFsIHZhbHVlOiAndGFnJywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJ0YWcub3Blbi5qc1wiLFwiZW50aXR5Lm5hbWUudGFnLmpzXCJdXG4gICAgZXhwZWN0KHRva2Vuc1syXSkudG9FcXVhbCB2YWx1ZTogJz4nLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcInRhZy5vcGVuLmpzXCIsXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnRhZy5lbmQuanNcIl1cbiAgICBleHBlY3QodG9rZW5zWzNdKS50b0VxdWFsIHZhbHVlOiAnPC8nLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcInRhZy5jbG9zZWQuanNcIixcInB1bmN0dWF0aW9uLmRlZmluaXRpb24udGFnLmJlZ2luLmpzXCJdXG4gICAgZXhwZWN0KHRva2Vuc1s0XSkudG9FcXVhbCB2YWx1ZTogJ3RhZycsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwidGFnLmNsb3NlZC5qc1wiLFwiZW50aXR5Lm5hbWUudGFnLmpzXCJdXG4gICAgZXhwZWN0KHRva2Vuc1s1XSkudG9FcXVhbCB2YWx1ZTogJz4nLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcInRhZy5jbG9zZWQuanNcIixcInB1bmN0dWF0aW9uLmRlZmluaXRpb24udGFnLmVuZC5qc1wiXVxuXG4gIGl0IFwidG9rZW5pemVzIGpzeCBpbnNpZGUgcGFyZW50aGVzaXNcIiwgLT5cbiAgICB7dG9rZW5zfSA9IGdyYW1tYXIudG9rZW5pemVMaW5lKCdyZXR1cm4gKDx0YWc+PC90YWc+KScpXG4gICAgZXhwZWN0KHRva2Vuc1szXSkudG9FcXVhbCB2YWx1ZTogJzwnLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcInRhZy5vcGVuLmpzXCIsXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnRhZy5iZWdpbi5qc1wiXVxuICAgIGV4cGVjdCh0b2tlbnNbNF0pLnRvRXF1YWwgdmFsdWU6ICd0YWcnLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcInRhZy5vcGVuLmpzXCIsXCJlbnRpdHkubmFtZS50YWcuanNcIl1cbiAgICBleHBlY3QodG9rZW5zWzVdKS50b0VxdWFsIHZhbHVlOiAnPicsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwidGFnLm9wZW4uanNcIixcInB1bmN0dWF0aW9uLmRlZmluaXRpb24udGFnLmVuZC5qc1wiXVxuICAgIGV4cGVjdCh0b2tlbnNbNl0pLnRvRXF1YWwgdmFsdWU6ICc8LycsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwidGFnLmNsb3NlZC5qc1wiLFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuYmVnaW4uanNcIl1cbiAgICBleHBlY3QodG9rZW5zWzddKS50b0VxdWFsIHZhbHVlOiAndGFnJywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJ0YWcuY2xvc2VkLmpzXCIsXCJlbnRpdHkubmFtZS50YWcuanNcIl1cbiAgICBleHBlY3QodG9rZW5zWzhdKS50b0VxdWFsIHZhbHVlOiAnPicsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwidGFnLmNsb3NlZC5qc1wiLFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuZW5kLmpzXCJdXG5cbiAgaXQgXCJ0b2tlbml6ZXMganN4IGluc2lkZSBmdW5jdGlvbiBib2R5XCIsIC0+XG4gICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgnZnVuY3Rpb24gKCkgeyByZXR1cm4gKDx0YWc+PC90YWc+KSB9JylcbiAgICBleHBlY3QodG9rZW5zWzEwXSkudG9FcXVhbCB2YWx1ZTogJzwnLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcInRhZy5vcGVuLmpzXCIsXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnRhZy5iZWdpbi5qc1wiXVxuICAgIGV4cGVjdCh0b2tlbnNbMTFdKS50b0VxdWFsIHZhbHVlOiAndGFnJywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJ0YWcub3Blbi5qc1wiLFwiZW50aXR5Lm5hbWUudGFnLmpzXCJdXG4gICAgZXhwZWN0KHRva2Vuc1sxMl0pLnRvRXF1YWwgdmFsdWU6ICc+Jywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJ0YWcub3Blbi5qc1wiLFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuZW5kLmpzXCJdXG4gICAgZXhwZWN0KHRva2Vuc1sxM10pLnRvRXF1YWwgdmFsdWU6ICc8LycsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwidGFnLmNsb3NlZC5qc1wiLFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuYmVnaW4uanNcIl1cbiAgICBleHBlY3QodG9rZW5zWzE0XSkudG9FcXVhbCB2YWx1ZTogJ3RhZycsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwidGFnLmNsb3NlZC5qc1wiLFwiZW50aXR5Lm5hbWUudGFnLmpzXCJdXG4gICAgZXhwZWN0KHRva2Vuc1sxNV0pLnRvRXF1YWwgdmFsdWU6ICc+Jywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJ0YWcuY2xvc2VkLmpzXCIsXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnRhZy5lbmQuanNcIl1cblxuICBpdCBcInRva2VuaXplcyBqc3ggaW5zaWRlIGZ1bmN0aW9uIGJvZHkgaW4gYW4gb2JqZWN0XCIsIC0+XG4gICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgne2ZvbzpmdW5jdGlvbiAoKSB7IHJldHVybiAoPHRhZz48L3RhZz4pIH19JylcbiAgICBleHBlY3QodG9rZW5zWzEzXSkudG9FcXVhbCB2YWx1ZTogJzwnLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcInRhZy5vcGVuLmpzXCIsXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnRhZy5iZWdpbi5qc1wiXVxuICAgIGV4cGVjdCh0b2tlbnNbMTRdKS50b0VxdWFsIHZhbHVlOiAndGFnJywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJ0YWcub3Blbi5qc1wiLFwiZW50aXR5Lm5hbWUudGFnLmpzXCJdXG4gICAgZXhwZWN0KHRva2Vuc1sxNV0pLnRvRXF1YWwgdmFsdWU6ICc+Jywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJ0YWcub3Blbi5qc1wiLFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuZW5kLmpzXCJdXG4gICAgZXhwZWN0KHRva2Vuc1sxNl0pLnRvRXF1YWwgdmFsdWU6ICc8LycsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwidGFnLmNsb3NlZC5qc1wiLFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuYmVnaW4uanNcIl1cbiAgICBleHBlY3QodG9rZW5zWzE3XSkudG9FcXVhbCB2YWx1ZTogJ3RhZycsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwidGFnLmNsb3NlZC5qc1wiLFwiZW50aXR5Lm5hbWUudGFnLmpzXCJdXG4gICAgZXhwZWN0KHRva2Vuc1sxOF0pLnRvRXF1YWwgdmFsdWU6ICc+Jywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJ0YWcuY2xvc2VkLmpzXCIsXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnRhZy5lbmQuanNcIl1cblxuXG4gIGl0IFwidG9rZW5pemVzIGpzeCBpbnNpZGUgZnVuY3Rpb24gY2FsbFwiLCAtPlxuICAgIHt0b2tlbnN9ID0gZ3JhbW1hci50b2tlbml6ZUxpbmUoJ2Zvbyg8dGFnPjwvdGFnPiknKVxuICAgIGV4cGVjdCh0b2tlbnNbMl0pLnRvRXF1YWwgdmFsdWU6ICc8Jywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJtZXRhLmZ1bmN0aW9uLWNhbGwuanNcIixcInRhZy5vcGVuLmpzXCIsXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnRhZy5iZWdpbi5qc1wiXVxuICAgIGV4cGVjdCh0b2tlbnNbM10pLnRvRXF1YWwgdmFsdWU6ICd0YWcnLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcIm1ldGEuZnVuY3Rpb24tY2FsbC5qc1wiLFwidGFnLm9wZW4uanNcIixcImVudGl0eS5uYW1lLnRhZy5qc1wiXVxuICAgIGV4cGVjdCh0b2tlbnNbNF0pLnRvRXF1YWwgdmFsdWU6ICc+Jywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJtZXRhLmZ1bmN0aW9uLWNhbGwuanNcIixcInRhZy5vcGVuLmpzXCIsXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnRhZy5lbmQuanNcIl1cbiAgICBleHBlY3QodG9rZW5zWzVdKS50b0VxdWFsIHZhbHVlOiAnPC8nLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcIm1ldGEuZnVuY3Rpb24tY2FsbC5qc1wiLFwidGFnLmNsb3NlZC5qc1wiLFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuYmVnaW4uanNcIl1cbiAgICBleHBlY3QodG9rZW5zWzZdKS50b0VxdWFsIHZhbHVlOiAndGFnJywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJtZXRhLmZ1bmN0aW9uLWNhbGwuanNcIixcInRhZy5jbG9zZWQuanNcIixcImVudGl0eS5uYW1lLnRhZy5qc1wiXVxuICAgIGV4cGVjdCh0b2tlbnNbN10pLnRvRXF1YWwgdmFsdWU6ICc+Jywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJtZXRhLmZ1bmN0aW9uLWNhbGwuanNcIixcInRhZy5jbG9zZWQuanNcIixcInB1bmN0dWF0aW9uLmRlZmluaXRpb24udGFnLmVuZC5qc1wiXVxuXG4gIGl0IFwidG9rZW5pemVzIGpzeCBpbnNpZGUgbWV0aG9kIGNhbGxcIiwgLT5cbiAgICB7dG9rZW5zfSA9IGdyYW1tYXIudG9rZW5pemVMaW5lKCdiYXIuZm9vKDx0YWc+PC90YWc+KScpXG4gICAgZXhwZWN0KHRva2Vuc1s0XSkudG9FcXVhbCB2YWx1ZTogJzwnLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcIm1ldGEubWV0aG9kLWNhbGwuanNcIixcInRhZy5vcGVuLmpzXCIsXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnRhZy5iZWdpbi5qc1wiXVxuICAgIGV4cGVjdCh0b2tlbnNbNV0pLnRvRXF1YWwgdmFsdWU6ICd0YWcnLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcIm1ldGEubWV0aG9kLWNhbGwuanNcIixcInRhZy5vcGVuLmpzXCIsXCJlbnRpdHkubmFtZS50YWcuanNcIl1cbiAgICBleHBlY3QodG9rZW5zWzZdKS50b0VxdWFsIHZhbHVlOiAnPicsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwibWV0YS5tZXRob2QtY2FsbC5qc1wiLFwidGFnLm9wZW4uanNcIixcInB1bmN0dWF0aW9uLmRlZmluaXRpb24udGFnLmVuZC5qc1wiXVxuICAgIGV4cGVjdCh0b2tlbnNbN10pLnRvRXF1YWwgdmFsdWU6ICc8LycsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwibWV0YS5tZXRob2QtY2FsbC5qc1wiLFwidGFnLmNsb3NlZC5qc1wiLFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuYmVnaW4uanNcIl1cbiAgICBleHBlY3QodG9rZW5zWzhdKS50b0VxdWFsIHZhbHVlOiAndGFnJywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJtZXRhLm1ldGhvZC1jYWxsLmpzXCIsXCJ0YWcuY2xvc2VkLmpzXCIsXCJlbnRpdHkubmFtZS50YWcuanNcIl1cbiAgICBleHBlY3QodG9rZW5zWzldKS50b0VxdWFsIHZhbHVlOiAnPicsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwibWV0YS5tZXRob2QtY2FsbC5qc1wiLFwidGFnLmNsb3NlZC5qc1wiLFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuZW5kLmpzXCJdXG5cblxuICBpdCBcInRva2VuaXplcyAnIGFzIHN0cmluZyBpbnNpZGUganN4XCIsIC0+XG4gICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgnPHRhZz5mb1xcJ288L3RhZz4nKVxuXG4gICAgZXhwZWN0KHRva2Vuc1swXSkudG9FcXVhbCB2YWx1ZTogJzwnLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcInRhZy5vcGVuLmpzXCIsXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnRhZy5iZWdpbi5qc1wiXVxuICAgIGV4cGVjdCh0b2tlbnNbMV0pLnRvRXF1YWwgdmFsdWU6ICd0YWcnLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcInRhZy5vcGVuLmpzXCIsXCJlbnRpdHkubmFtZS50YWcuanNcIl1cbiAgICBleHBlY3QodG9rZW5zWzJdKS50b0VxdWFsIHZhbHVlOiAnPicsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwidGFnLm9wZW4uanNcIixcInB1bmN0dWF0aW9uLmRlZmluaXRpb24udGFnLmVuZC5qc1wiXVxuICAgIGV4cGVjdCh0b2tlbnNbM10pLnRvRXF1YWwgdmFsdWU6ICdmb1xcJ28nLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcIm1ldGEub3RoZXIucGNkYXRhLmpzXCJdXG4gICAgZXhwZWN0KHRva2Vuc1s0XSkudG9FcXVhbCB2YWx1ZTogJzwvJywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJ0YWcuY2xvc2VkLmpzXCIsXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnRhZy5iZWdpbi5qc1wiXVxuICAgIGV4cGVjdCh0b2tlbnNbNV0pLnRvRXF1YWwgdmFsdWU6ICd0YWcnLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcInRhZy5jbG9zZWQuanNcIixcImVudGl0eS5uYW1lLnRhZy5qc1wiXVxuICAgIGV4cGVjdCh0b2tlbnNbNl0pLnRvRXF1YWwgdmFsdWU6ICc+Jywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJ0YWcuY2xvc2VkLmpzXCIsXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnRhZy5lbmQuanNcIl1cblxuICBpdCBcInRva2VuaXplcyB0ZXJuYXJ5IG9wZXJhdG9yIGluc2lkZSBqc3ggY29kZSBzZWN0aW9uXCIsIC0+XG4gICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgne3g/PHRhZz48L3RhZz46bnVsbH0nKVxuICAgIGV4cGVjdCh0b2tlbnNbMF0pLnRvRXF1YWwgdmFsdWU6ICd7Jywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJtZXRhLmJyYWNlLmN1cmx5LmpzXCJdXG4gICAgZXhwZWN0KHRva2Vuc1sxXSkudG9FcXVhbCB2YWx1ZTogJ3gnLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIl1cbiAgICBleHBlY3QodG9rZW5zWzJdKS50b0VxdWFsIHZhbHVlOiAnPycsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLCBcImtleXdvcmQub3BlcmF0b3IudGVybmFyeS5qc1wiXVxuICAgIGV4cGVjdCh0b2tlbnNbM10pLnRvRXF1YWwgdmFsdWU6ICc8Jywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJ0YWcub3Blbi5qc1wiLFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuYmVnaW4uanNcIl1cbiAgICBleHBlY3QodG9rZW5zWzRdKS50b0VxdWFsIHZhbHVlOiAndGFnJywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJ0YWcub3Blbi5qc1wiLFwiZW50aXR5Lm5hbWUudGFnLmpzXCJdXG4gICAgZXhwZWN0KHRva2Vuc1s1XSkudG9FcXVhbCB2YWx1ZTogJz4nLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcInRhZy5vcGVuLmpzXCIsXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnRhZy5lbmQuanNcIl1cbiAgICBleHBlY3QodG9rZW5zWzZdKS50b0VxdWFsIHZhbHVlOiAnPC8nLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcInRhZy5jbG9zZWQuanNcIixcInB1bmN0dWF0aW9uLmRlZmluaXRpb24udGFnLmJlZ2luLmpzXCJdXG4gICAgZXhwZWN0KHRva2Vuc1s3XSkudG9FcXVhbCB2YWx1ZTogJ3RhZycsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwidGFnLmNsb3NlZC5qc1wiLFwiZW50aXR5Lm5hbWUudGFnLmpzXCJdXG4gICAgZXhwZWN0KHRva2Vuc1s4XSkudG9FcXVhbCB2YWx1ZTogJz4nLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcInRhZy5jbG9zZWQuanNcIixcInB1bmN0dWF0aW9uLmRlZmluaXRpb24udGFnLmVuZC5qc1wiXVxuICAgIGV4cGVjdCh0b2tlbnNbOV0pLnRvRXF1YWwgdmFsdWU6ICc6Jywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJrZXl3b3JkLm9wZXJhdG9yLnRlcm5hcnkuanNcIl1cbiAgICBleHBlY3QodG9rZW5zWzEwXSkudG9FcXVhbCB2YWx1ZTogJ251bGwnLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcImNvbnN0YW50Lmxhbmd1YWdlLm51bGwuanNcIl1cbiAgICBleHBlY3QodG9rZW5zWzExXSkudG9FcXVhbCB2YWx1ZTogJ30nLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcIm1ldGEuYnJhY2UuY3VybHkuanNcIl1cblxuICAgICN7dG9rZW5zfSA9IGdyYW1tYXIudG9rZW5pemVMaW5lKCc8dGFnPlxcJ2ZvbzwvdGFnPicpXG5cbiAgICAjZXhwZWN0KHRva2Vuc1swXSkudG9FcXVhbCB2YWx1ZTogJzwnLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcInRhZy5vcGVuLmpzXCIsXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnRhZy5iZWdpbi5qc1wiXVxuICAgICNleHBlY3QodG9rZW5zWzFdKS50b0VxdWFsIHZhbHVlOiAndGFnJywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJ0YWcub3Blbi5qc1wiLFwiZW50aXR5Lm5hbWUudGFnLmpzXCJdXG4gICAgI2V4cGVjdCh0b2tlbnNbMl0pLnRvRXF1YWwgdmFsdWU6ICc+Jywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJ0YWcub3Blbi5qc1wiLFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuZW5kLmpzXCJdXG4gICAgI2V4cGVjdCh0b2tlbnNbM10pLnRvRXF1YWwgdmFsdWU6ICdcXCdmb28nLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcIm1ldGEub3RoZXIucGNkYXRhLmpzXCJdXG4gICAgI2V4cGVjdCh0b2tlbnNbNF0pLnRvRXF1YWwgdmFsdWU6ICc8LycsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwidGFnLmNsb3NlZC5qc1wiLFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuYmVnaW4uanNcIl1cbiAgICAjZXhwZWN0KHRva2Vuc1s1XSkudG9FcXVhbCB2YWx1ZTogJ3RhZycsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwidGFnLmNsb3NlZC5qc1wiLFwiZW50aXR5Lm5hbWUudGFnLmpzXCJdXG4gICAgI2V4cGVjdCh0b2tlbnNbNl0pLnRvRXF1YWwgdmFsdWU6ICc+Jywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJ0YWcuY2xvc2VkLmpzXCIsXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnRhZy5lbmQuanNcIl1cblxuXG5cbiAgZGVzY3JpYmUgXCJpbmRlbnRhdGlvblwiLCAtPlxuICAgIGVkaXRvciA9IG51bGxcblxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvciA9IGJ1aWxkVGV4dEVkaXRvcigpXG4gICAgICBlZGl0b3Iuc2V0R3JhbW1hcihncmFtbWFyKVxuXG4gICAgZXhwZWN0UHJlc2VydmVkSW5kZW50YXRpb24gPSAodGV4dCkgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KHRleHQpXG4gICAgICBlZGl0b3IuYXV0b0luZGVudEJ1ZmZlclJvd3MoMCwgdGV4dC5zcGxpdChcIlxcblwiKS5sZW5ndGggLSAxKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgdGV4dFxuXG4gICAgaXQgXCJpbmRlbnRzIGFsbG1hbi1zdHlsZSBjdXJseSBicmFjZXNcIiwgLT5cbiAgICAgIGV4cGVjdFByZXNlcnZlZEluZGVudGF0aW9uIFwiXCJcIlxuICAgICAgICBpZiAodHJ1ZSlcbiAgICAgICAge1xuICAgICAgICAgIGZvciAoOzspXG4gICAgICAgICAge1xuICAgICAgICAgICAgd2hpbGUgKHRydWUpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHgoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICBkb1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHkoKTtcbiAgICAgICAgICB9IHdoaWxlICh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgXCJcIlwiXG5cbiAgICBpdCBcImluZGVudHMgbm9uLWFsbG1hbi1zdHlsZSBjdXJseSBicmFjZXNcIiwgLT5cbiAgICAgIGV4cGVjdFByZXNlcnZlZEluZGVudGF0aW9uIFwiXCJcIlxuICAgICAgICBpZiAodHJ1ZSkge1xuICAgICAgICAgIGZvciAoOzspIHtcbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgIHgoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZG8ge1xuICAgICAgICAgICAgeSgpO1xuICAgICAgICAgIH0gd2hpbGUgKHRydWUpO1xuICAgICAgICB9XG4gICAgICBcIlwiXCJcbiJdfQ==
