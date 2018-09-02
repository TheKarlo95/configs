(function() {
  var AutoIndent, Point, Range, fs, path, ref;

  ref = require('atom'), Range = ref.Range, Point = ref.Point;

  fs = require('fs-plus');

  path = require('path');

  AutoIndent = require('../lib/auto-indent');

  describe('auto-indent', function() {
    var autoIndent, editor, indentJSXRange, notifications, ref1, sourceCode, sourceCodeRange;
    ref1 = [], autoIndent = ref1[0], editor = ref1[1], notifications = ref1[2], sourceCode = ref1[3], sourceCodeRange = ref1[4], indentJSXRange = ref1[5];
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.packages.activatePackage('language-babel');
      });
    });
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open('non-existent.js').then(function(o) {
          return editor = o;
        });
      });
      return runs(function() {
        autoIndent = new AutoIndent(editor);
        return notifications = atom.notifications;
      });
    });
    describe('::constructor', function() {
      return it(' should setup some valid indentation defaults', function() {
        var expectedResult;
        expectedResult = {
          jsxIndent: [1, 1],
          jsxIndentProps: [1, 1],
          jsxClosingBracketLocation: [
            1, {
              selfClosing: 'tag-aligned',
              nonEmpty: 'tag-aligned'
            }
          ]
        };
        return expect(autoIndent.eslintIndentOptions).toEqual(expectedResult);
      });
    });
    describe('::getEslintrcFilename', function() {
      it('returns a correct project path for the source file', function() {
        return expect(path.dirname(autoIndent.getEslintrcFilename())).toEqual(path.dirname(editor.getPath()));
      });
      return it('returns a .eslintrc file name', function() {
        return expect(path.basename(autoIndent.getEslintrcFilename())).toEqual('.eslintrc');
      });
    });
    return describe('::readEslintrcOptions', function() {
      it('returns an empty object on a missing .eslintrc', function() {
        return expect(autoIndent.readEslintrcOptions('.missing')).toEqual({});
      });
      it('returns an empty Object and a notification message on bad eslint', function() {
        var obj;
        spyOn(fs, 'isFileSync').andReturn(true);
        spyOn(fs, 'readFileSync').andReturn('{');
        spyOn(notifications, 'addError').andCallThrough();
        obj = autoIndent.readEslintrcOptions();
        expect(notifications.addError).toHaveBeenCalled();
        return expect(obj).toEqual({});
      });
      it('returns an empty Object when attempting to read something other than a file', function() {
        var obj;
        spyOn(fs, 'isFileSync').andReturn(false);
        spyOn(fs, 'readFileSync');
        spyOn(notifications, 'addError').andCallThrough();
        obj = autoIndent.readEslintrcOptions();
        expect(fs.readFileSync).not.toHaveBeenCalled();
        expect(notifications.addError).not.toHaveBeenCalled();
        return expect(obj).toEqual({});
      });
      it('returns an empty Object when eslint with no rules is read', function() {
        var obj;
        spyOn(fs, 'isFileSync').andReturn(true);
        spyOn(fs, 'readFileSync').andReturn('{}');
        spyOn(notifications, 'addError').andCallThrough();
        obj = autoIndent.readEslintrcOptions();
        expect(notifications.addError).not.toHaveBeenCalled();
        return expect(obj).toEqual({});
      });
      describe('::translateIndentOptions', function() {
        it('should return expected defaults when no object is input', function() {
          var expectedResult, result;
          result = autoIndent.translateIndentOptions();
          expectedResult = {
            jsxIndent: [1, 1],
            jsxIndentProps: [1, 1],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'tag-aligned',
                nonEmpty: 'tag-aligned'
              }
            ]
          };
          return expect(result).toEqual(expectedResult);
        });
        it('should return expected defaults when no valid object is input', function() {
          var expectedResult, result;
          result = autoIndent.translateIndentOptions({});
          expectedResult = {
            jsxIndent: [1, 1],
            jsxIndentProps: [1, 1],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'tag-aligned',
                nonEmpty: 'tag-aligned'
              }
            ]
          };
          return expect(result).toEqual(expectedResult);
        });
        it('should return two tab markers for jsx and props when an indent of 4 spaces is found', function() {
          var expectedResult, result, rules;
          rules = {
            "indent": [1, 4]
          };
          result = autoIndent.translateIndentOptions(rules);
          expectedResult = {
            jsxIndent: [1, 2],
            jsxIndentProps: [1, 2],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'tag-aligned',
                nonEmpty: 'tag-aligned'
              }
            ]
          };
          return expect(result).toEqual(expectedResult);
        });
        it('should return one tab markers for jsx and props when an indent "tab" is found', function() {
          var expectedResult, result, rules;
          rules = {
            "indent": [1, "tab"]
          };
          result = autoIndent.translateIndentOptions(rules);
          expectedResult = {
            jsxIndent: [1, 1],
            jsxIndentProps: [1, 1],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'tag-aligned',
                nonEmpty: 'tag-aligned'
              }
            ]
          };
          return expect(result).toEqual(expectedResult);
        });
        it('should return jsxIndent of 2 tabs and jsxIndentProps of 3', function() {
          var expectedResult, result, rules;
          rules = {
            "indent": [1, 6],
            "react/jsx-indent": ["warn", 4]
          };
          result = autoIndent.translateIndentOptions(rules);
          expectedResult = {
            jsxIndent: ['warn', 2],
            jsxIndentProps: [1, 3],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'tag-aligned',
                nonEmpty: 'tag-aligned'
              }
            ]
          };
          return expect(result).toEqual(expectedResult);
        });
        it('should return jsxIndent of 2 tabs and jsxIndentProps of 2', function() {
          var expectedResult, result, rules;
          rules = {
            "indent": [1, 6],
            "react/jsx-indent": ["warn", 4],
            "react/jsx-indent-props": [2, 4]
          };
          result = autoIndent.translateIndentOptions(rules);
          expectedResult = {
            jsxIndent: ['warn', 2],
            jsxIndentProps: [2, 2],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'tag-aligned',
                nonEmpty: 'tag-aligned'
              }
            ]
          };
          return expect(result).toEqual(expectedResult);
        });
        it('should return jsxIndent of 2 tabs and jsxIndentProps of 2, line-aligned', function() {
          var expectedResult, result, rules;
          rules = {
            "indent": [1, 6],
            "react/jsx-indent": ["warn", 4],
            "react/jsx-indent-props": [2, 4],
            'react/jsx-closing-bracket-location': [1, 'line-aligned']
          };
          result = autoIndent.translateIndentOptions(rules);
          expectedResult = {
            jsxIndent: ['warn', 2],
            jsxIndentProps: [2, 2],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'line-aligned',
                nonEmpty: 'line-aligned'
              }
            ]
          };
          return expect(result).toEqual(expectedResult);
        });
        return it('should return jsxIndent of 2 tabs and jsxIndentProps of 2, line-aligned and props-aligned', function() {
          var expectedResult, result, rules;
          rules = {
            "indent": [1, 6],
            "react/jsx-indent": ["warn", 4],
            "react/jsx-indent-props": [2, 4],
            "react/jsx-closing-bracket-location": [
              1, {
                "nonEmpty": "props-aligned",
                "selfClosing": "line-aligned"
              }
            ]
          };
          result = autoIndent.translateIndentOptions(rules);
          expectedResult = {
            jsxIndent: ['warn', 2],
            jsxIndentProps: [2, 2],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'line-aligned',
                nonEmpty: 'props-aligned'
              }
            ]
          };
          return expect(result).toEqual(expectedResult);
        });
      });
      describe('::indentJSX', function() {
        beforeEach(function() {
          sourceCode = "<div className={rootClass}>\n{this._renderPlaceholder()}\n<div\nclassName={cx('DraftEditor/editorContainer')}\nkey={'editor' + this.state.containerKey}\nref=\"editorContainer\"\n>\n<div\naria-activedescendant={\nreadOnly ? null : this.props.ariaActiveDescendantID\n}\naria-autocomplete={readOnly ? null : this.props.ariaAutoComplete}\n>\n{this._renderPlaceholder()}\n<Component p1\np2\n/>\n</div>\n{ // tests inline JSX\ntrainerProfile.backgroundImageLink\n? <Image style={styles.video} source={{uri: `${AppConfig.apiURL}${trainerProfile.backgroundImageLink}`}} />\n: <Image style={styles.video} source={{uri: `https://placehold.it/375x140`}} />\n}\n{\ncond ?\n<span/>:\n<span></span>\n}\n</div>\n</div>\n";
          editor.insertText(sourceCode);
          sourceCodeRange = new Range(new Point(0, 0), new Point(31, 0));
          return indentJSXRange = new Range(new Point(0, 0), new Point(30, 1));
        });
        it('should indent JSX according to eslint rules', function() {
          var indentedCode;
          indentedCode = "<div className={rootClass}>\n  {this._renderPlaceholder()}\n  <div\n    className={cx('DraftEditor/editorContainer')}\n    key={'editor' + this.state.containerKey}\n    ref=\"editorContainer\"\n  >\n    <div\n      aria-activedescendant={\n        readOnly ? null : this.props.ariaActiveDescendantID\n      }\n      aria-autocomplete={readOnly ? null : this.props.ariaAutoComplete}\n    >\n      {this._renderPlaceholder()}\n      <Component p1\n        p2\n      />\n    </div>\n    { // tests inline JSX\n      trainerProfile.backgroundImageLink\n        ? <Image style={styles.video} source={{uri: `${AppConfig.apiURL}${trainerProfile.backgroundImageLink}`}} />\n        : <Image style={styles.video} source={{uri: `https://placehold.it/375x140`}} />\n    }\n    {\n      cond ?\n        <span/>:\n        <span></span>\n    }\n  </div>\n</div>\n";
          autoIndent.eslintIndentOptions = {
            jsxIndent: [1, 1],
            jsxIndentProps: [1, 1],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'tag-aligned',
                nonEmpty: 'tag-aligned'
              }
            ]
          };
          autoIndent.autoJsx = true;
          autoIndent.indentJSX(indentJSXRange);
          return expect(editor.getTextInBufferRange(sourceCodeRange)).toEqual(indentedCode);
        });
        return it('should indent JSX according to eslint rules and tag closing alignment', function() {
          var indentedCode;
          indentedCode = "<div className={rootClass}>\n    {this._renderPlaceholder()}\n    <div\n        className={cx('DraftEditor/editorContainer')}\n        key={'editor' + this.state.containerKey}\n        ref=\"editorContainer\"\n        >\n        <div\n            aria-activedescendant={\n                readOnly ? null : this.props.ariaActiveDescendantID\n            }\n            aria-autocomplete={readOnly ? null : this.props.ariaAutoComplete}\n            >\n            {this._renderPlaceholder()}\n            <Component p1\n                p2\n                />\n        </div>\n        { // tests inline JSX\n            trainerProfile.backgroundImageLink\n                ? <Image style={styles.video} source={{uri: `${AppConfig.apiURL}${trainerProfile.backgroundImageLink}`}} />\n                : <Image style={styles.video} source={{uri: `https://placehold.it/375x140`}} />\n        }\n        {\n            cond ?\n                <span/>:\n                <span></span>\n        }\n    </div>\n</div>\n";
          autoIndent.eslintIndentOptions = {
            jsxIndent: [1, 2],
            jsxIndentProps: [1, 2],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'props-aligned',
                nonEmpty: 'props-aligned'
              }
            ]
          };
          autoIndent.autoJsx = true;
          autoIndent.indentJSX(indentJSXRange);
          return expect(editor.getTextInBufferRange(sourceCodeRange)).toEqual(indentedCode);
        });
      });
      return describe('insert-nl-jsx', function() {
        return it('should insert two new lines and position cursor between JSX tags', function() {
          autoIndent.eslintIndentOptions = {
            jsxIndent: [1, 1],
            jsxIndentProps: [1, 1],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'tabs-aligned',
                nonEmpty: 'tabs-aligned'
              }
            ]
          };
          autoIndent.autoJsx = true;
          editor.insertText('<div></div>');
          editor.setCursorBufferPosition([0, 5]);
          editor.insertText('\n');
          expect(editor.getTextInBufferRange([[0, 0], [0, 5]])).toEqual("<div>");
          expect(editor.getTextInBufferRange([[1, 0], [1, 2]])).toEqual("  ");
          expect(editor.getTextInBufferRange([[2, 0], [2, 6]])).toEqual("</div>");
          return expect(editor.getCursorBufferPosition()).toEqual([1, 2]);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdGhla2FybG85NS8uYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1iYWJlbC9zcGVjL2F1dG8taW5kZW50LXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0FBQUEsTUFBQTs7RUFBQSxNQUFpQixPQUFBLENBQVEsTUFBUixDQUFqQixFQUFDLGlCQUFELEVBQVE7O0VBQ1IsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxVQUFBLEdBQWEsT0FBQSxDQUFRLG9CQUFSOztFQUViLFFBQUEsQ0FBUyxhQUFULEVBQXdCLFNBQUE7QUFDdEIsUUFBQTtJQUFBLE9BQW1GLEVBQW5GLEVBQUMsb0JBQUQsRUFBYSxnQkFBYixFQUFxQix1QkFBckIsRUFBb0Msb0JBQXBDLEVBQWdELHlCQUFoRCxFQUFpRTtJQUVqRSxVQUFBLENBQVcsU0FBQTthQUNULGVBQUEsQ0FBZ0IsU0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixnQkFBOUI7TUFEYyxDQUFoQjtJQURTLENBQVg7SUFJQSxVQUFBLENBQVcsU0FBQTtNQUNULGVBQUEsQ0FBZ0IsU0FBQTtlQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixpQkFBcEIsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxTQUFDLENBQUQ7aUJBQU8sTUFBQSxHQUFTO1FBQWhCLENBQTVDO01BRGMsQ0FBaEI7YUFHQSxJQUFBLENBQUssU0FBQTtRQUNILFVBQUEsR0FBYSxJQUFJLFVBQUosQ0FBZSxNQUFmO2VBQ2IsYUFBQSxHQUFnQixJQUFJLENBQUM7TUFGbEIsQ0FBTDtJQUpTLENBQVg7SUFVQSxRQUFBLENBQVMsZUFBVCxFQUEwQixTQUFBO2FBQ3hCLEVBQUEsQ0FBRywrQ0FBSCxFQUFvRCxTQUFBO0FBQ2xELFlBQUE7UUFBQSxjQUFBLEdBQ0U7VUFBQSxTQUFB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QTNEO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixDQUFDLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBRCxFQUFPLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBUCxDQUE1QixDQUFQLENBQWtELENBQUMsT0FBbkQsQ0FBMkQsUUFBM0Q7aUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFDLENBQUQsRUFBRyxDQUFILENBQWpEO1FBaEJxRSxDQUF2RTtNQUZ3QixDQUExQjtJQTNQZ0MsQ0FBbEM7RUFsQ3NCLENBQXhCO0FBTEEiLCJzb3VyY2VzQ29udGVudCI6WyIjIFRlc3RzIGZvciBBdXRvIEluZGVudGluZyBKU1hcblxue1JhbmdlLCBQb2ludH0gPSByZXF1aXJlICdhdG9tJ1xuZnMgPSByZXF1aXJlICdmcy1wbHVzJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5BdXRvSW5kZW50ID0gcmVxdWlyZSAnLi4vbGliL2F1dG8taW5kZW50J1xuXG5kZXNjcmliZSAnYXV0by1pbmRlbnQnLCAtPlxuICBbYXV0b0luZGVudCwgZWRpdG9yLCBub3RpZmljYXRpb25zLCBzb3VyY2VDb2RlLCBzb3VyY2VDb2RlUmFuZ2UsIGluZGVudEpTWFJhbmdlXSA9IFtdXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xhbmd1YWdlLWJhYmVsJylcblxuICBiZWZvcmVFYWNoIC0+XG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdub24tZXhpc3RlbnQuanMnKS50aGVuIChvKSAtPiBlZGl0b3IgPSBvXG5cbiAgICBydW5zIC0+XG4gICAgICBhdXRvSW5kZW50ID0gbmV3IEF1dG9JbmRlbnQoZWRpdG9yKVxuICAgICAgbm90aWZpY2F0aW9ucyA9IGF0b20ubm90aWZpY2F0aW9uc1xuXG5cbiAgIyA6OiBjb25zdHJ1Y3RvclxuICBkZXNjcmliZSAnOjpjb25zdHJ1Y3RvcicsIC0+XG4gICAgaXQgJyBzaG91bGQgc2V0dXAgc29tZSB2YWxpZCBpbmRlbnRhdGlvbiBkZWZhdWx0cycsIC0+XG4gICAgICBleHBlY3RlZFJlc3VsdCA9XG4gICAgICAgIGpzeEluZGVudDogWzEsMV1cbiAgICAgICAganN4SW5kZW50UHJvcHM6IFsxLDFdXG4gICAgICAgIGpzeENsb3NpbmdCcmFja2V0TG9jYXRpb246IFsgMSwgeyBzZWxmQ2xvc2luZzogJ3RhZy1hbGlnbmVkJywgbm9uRW1wdHk6ICd0YWctYWxpZ25lZCd9IF1cbiAgICAgIGV4cGVjdChhdXRvSW5kZW50LmVzbGludEluZGVudE9wdGlvbnMpLnRvRXF1YWwoZXhwZWN0ZWRSZXN1bHQpXG5cbiAgIyA6OmdldEVzbGludHJjRmlsZW5hbWVcbiAgZGVzY3JpYmUgJzo6Z2V0RXNsaW50cmNGaWxlbmFtZScsIC0+XG4gICAgaXQgJ3JldHVybnMgYSBjb3JyZWN0IHByb2plY3QgcGF0aCBmb3IgdGhlIHNvdXJjZSBmaWxlJywgLT5cbiAgICAgIGV4cGVjdChwYXRoLmRpcm5hbWUoYXV0b0luZGVudC5nZXRFc2xpbnRyY0ZpbGVuYW1lKCkpKS50b0VxdWFsKHBhdGguZGlybmFtZShlZGl0b3IuZ2V0UGF0aCgpKSlcblxuICAgIGl0ICdyZXR1cm5zIGEgLmVzbGludHJjIGZpbGUgbmFtZScsIC0+XG4gICAgICBleHBlY3QocGF0aC5iYXNlbmFtZShhdXRvSW5kZW50LmdldEVzbGludHJjRmlsZW5hbWUoKSkpLnRvRXF1YWwoJy5lc2xpbnRyYycpXG5cbiAgIyA6OnJlYWRFc2xpbnRyY09wdGlvbnNcbiAgZGVzY3JpYmUgJzo6cmVhZEVzbGludHJjT3B0aW9ucycsIC0+XG4gICAgaXQgJ3JldHVybnMgYW4gZW1wdHkgb2JqZWN0IG9uIGEgbWlzc2luZyAuZXNsaW50cmMnLCAtPlxuICAgICAgZXhwZWN0KGF1dG9JbmRlbnQucmVhZEVzbGludHJjT3B0aW9ucygnLm1pc3NpbmcnKSkudG9FcXVhbCh7fSlcblxuICAgIGl0ICdyZXR1cm5zIGFuIGVtcHR5IE9iamVjdCBhbmQgYSBub3RpZmljYXRpb24gbWVzc2FnZSBvbiBiYWQgZXNsaW50JywgLT5cbiAgICAgIHNweU9uKGZzLCAnaXNGaWxlU3luYycpLmFuZFJldHVybih0cnVlKVxuICAgICAgc3B5T24oZnMsICdyZWFkRmlsZVN5bmMnKS5hbmRSZXR1cm4oJ3snKVxuICAgICAgc3B5T24obm90aWZpY2F0aW9ucywgJ2FkZEVycm9yJykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgb2JqID0gYXV0b0luZGVudC5yZWFkRXNsaW50cmNPcHRpb25zKClcbiAgICAgIGV4cGVjdChub3RpZmljYXRpb25zLmFkZEVycm9yKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChvYmopLnRvRXF1YWwoe30pXG5cbiAgICBpdCAncmV0dXJucyBhbiBlbXB0eSBPYmplY3Qgd2hlbiBhdHRlbXB0aW5nIHRvIHJlYWQgc29tZXRoaW5nIG90aGVyIHRoYW4gYSBmaWxlJywgLT5cbiAgICAgIHNweU9uKGZzLCAnaXNGaWxlU3luYycpLmFuZFJldHVybihmYWxzZSlcbiAgICAgIHNweU9uKGZzLCAncmVhZEZpbGVTeW5jJylcbiAgICAgIHNweU9uKG5vdGlmaWNhdGlvbnMsICdhZGRFcnJvcicpLmFuZENhbGxUaHJvdWdoKClcbiAgICAgIG9iaiA9IGF1dG9JbmRlbnQucmVhZEVzbGludHJjT3B0aW9ucygpXG4gICAgICBleHBlY3QoZnMucmVhZEZpbGVTeW5jKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICBleHBlY3Qobm90aWZpY2F0aW9ucy5hZGRFcnJvcikubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgZXhwZWN0KG9iaikudG9FcXVhbCh7fSlcblxuICAgIGl0ICdyZXR1cm5zIGFuIGVtcHR5IE9iamVjdCB3aGVuIGVzbGludCB3aXRoIG5vIHJ1bGVzIGlzIHJlYWQnLCAtPlxuICAgICAgc3B5T24oZnMsICdpc0ZpbGVTeW5jJykuYW5kUmV0dXJuKHRydWUpXG4gICAgICBzcHlPbihmcywgJ3JlYWRGaWxlU3luYycpLmFuZFJldHVybigne30nKVxuICAgICAgc3B5T24obm90aWZpY2F0aW9ucywgJ2FkZEVycm9yJykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgb2JqID0gYXV0b0luZGVudC5yZWFkRXNsaW50cmNPcHRpb25zKClcbiAgICAgIGV4cGVjdChub3RpZmljYXRpb25zLmFkZEVycm9yKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICBleHBlY3Qob2JqKS50b0VxdWFsKHt9KVxuXG4gICAgIyA6OnRyYW5zbGF0ZUluZGVudE9wdGlvbnNcbiAgICBkZXNjcmliZSAnOjp0cmFuc2xhdGVJbmRlbnRPcHRpb25zJywgLT5cbiAgICAgIGl0ICdzaG91bGQgcmV0dXJuIGV4cGVjdGVkIGRlZmF1bHRzIHdoZW4gbm8gb2JqZWN0IGlzIGlucHV0JywgLT5cbiAgICAgICAgcmVzdWx0ID0gYXV0b0luZGVudC50cmFuc2xhdGVJbmRlbnRPcHRpb25zKClcbiAgICAgICAgZXhwZWN0ZWRSZXN1bHQgPVxuICAgICAgICAgIGpzeEluZGVudDogWzEsMV1cbiAgICAgICAgICBqc3hJbmRlbnRQcm9wczogWzEsMV1cbiAgICAgICAgICBqc3hDbG9zaW5nQnJhY2tldExvY2F0aW9uOiBbIDEsIHsgc2VsZkNsb3Npbmc6ICd0YWctYWxpZ25lZCcsIG5vbkVtcHR5OiAndGFnLWFsaWduZWQnfSBdXG4gICAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoZXhwZWN0ZWRSZXN1bHQpXG5cbiAgICAgIGl0ICdzaG91bGQgcmV0dXJuIGV4cGVjdGVkIGRlZmF1bHRzIHdoZW4gbm8gdmFsaWQgb2JqZWN0IGlzIGlucHV0JywgLT5cbiAgICAgICAgcmVzdWx0ID0gYXV0b0luZGVudC50cmFuc2xhdGVJbmRlbnRPcHRpb25zKHt9KVxuICAgICAgICBleHBlY3RlZFJlc3VsdCA9XG4gICAgICAgICAganN4SW5kZW50OiBbMSwxXVxuICAgICAgICAgIGpzeEluZGVudFByb3BzOiBbMSwxXVxuICAgICAgICAgIGpzeENsb3NpbmdCcmFja2V0TG9jYXRpb246IFsgMSwgeyBzZWxmQ2xvc2luZzogJ3RhZy1hbGlnbmVkJywgbm9uRW1wdHk6ICd0YWctYWxpZ25lZCd9IF1cbiAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChleHBlY3RlZFJlc3VsdClcblxuICAgICAgaXQgJ3Nob3VsZCByZXR1cm4gdHdvIHRhYiBtYXJrZXJzIGZvciBqc3ggYW5kIHByb3BzIHdoZW4gYW4gaW5kZW50IG9mIDQgc3BhY2VzIGlzIGZvdW5kJywgLT5cbiAgICAgICAgcnVsZXMgPVxuICAgICAgICAgIFwiaW5kZW50XCI6IFsxLCA0XVxuICAgICAgICByZXN1bHQgPSBhdXRvSW5kZW50LnRyYW5zbGF0ZUluZGVudE9wdGlvbnMocnVsZXMpXG4gICAgICAgIGV4cGVjdGVkUmVzdWx0ID1cbiAgICAgICAgICBqc3hJbmRlbnQ6IFsxLDJdXG4gICAgICAgICAganN4SW5kZW50UHJvcHM6IFsxLDJdXG4gICAgICAgICAganN4Q2xvc2luZ0JyYWNrZXRMb2NhdGlvbjogWyAxLCB7IHNlbGZDbG9zaW5nOiAndGFnLWFsaWduZWQnLCBub25FbXB0eTogJ3RhZy1hbGlnbmVkJ30gXVxuICAgICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKGV4cGVjdGVkUmVzdWx0KVxuXG4gICAgICBpdCAnc2hvdWxkIHJldHVybiBvbmUgdGFiIG1hcmtlcnMgZm9yIGpzeCBhbmQgcHJvcHMgd2hlbiBhbiBpbmRlbnQgXCJ0YWJcIiBpcyBmb3VuZCcsIC0+XG4gICAgICAgIHJ1bGVzID1cbiAgICAgICAgICBcImluZGVudFwiOiBbMSwgXCJ0YWJcIl1cbiAgICAgICAgcmVzdWx0ID0gYXV0b0luZGVudC50cmFuc2xhdGVJbmRlbnRPcHRpb25zKHJ1bGVzKVxuICAgICAgICBleHBlY3RlZFJlc3VsdCA9XG4gICAgICAgICAganN4SW5kZW50OiBbMSwxXVxuICAgICAgICAgIGpzeEluZGVudFByb3BzOiBbMSwxXVxuICAgICAgICAgIGpzeENsb3NpbmdCcmFja2V0TG9jYXRpb246IFsgMSwgeyBzZWxmQ2xvc2luZzogJ3RhZy1hbGlnbmVkJywgbm9uRW1wdHk6ICd0YWctYWxpZ25lZCd9IF1cbiAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChleHBlY3RlZFJlc3VsdClcblxuICAgICAgaXQgJ3Nob3VsZCByZXR1cm4ganN4SW5kZW50IG9mIDIgdGFicyBhbmQganN4SW5kZW50UHJvcHMgb2YgMycsIC0+XG4gICAgICAgIHJ1bGVzID1cbiAgICAgICAgICBcImluZGVudFwiOiBbMSwgNl1cbiAgICAgICAgICBcInJlYWN0L2pzeC1pbmRlbnRcIjogW1wid2FyblwiLCA0XVxuICAgICAgICByZXN1bHQgPSBhdXRvSW5kZW50LnRyYW5zbGF0ZUluZGVudE9wdGlvbnMocnVsZXMpXG4gICAgICAgIGV4cGVjdGVkUmVzdWx0ID1cbiAgICAgICAgICBqc3hJbmRlbnQ6IFsnd2FybicsIDJdXG4gICAgICAgICAganN4SW5kZW50UHJvcHM6IFsxLCAzXVxuICAgICAgICAgIGpzeENsb3NpbmdCcmFja2V0TG9jYXRpb246IFsgMSwgeyBzZWxmQ2xvc2luZzogJ3RhZy1hbGlnbmVkJywgbm9uRW1wdHk6ICd0YWctYWxpZ25lZCd9IF1cbiAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChleHBlY3RlZFJlc3VsdClcblxuICAgICAgaXQgJ3Nob3VsZCByZXR1cm4ganN4SW5kZW50IG9mIDIgdGFicyBhbmQganN4SW5kZW50UHJvcHMgb2YgMicsIC0+XG4gICAgICAgIHJ1bGVzID1cbiAgICAgICAgICBcImluZGVudFwiOiBbMSwgNl1cbiAgICAgICAgICBcInJlYWN0L2pzeC1pbmRlbnRcIjogW1wid2FyblwiLCA0XVxuICAgICAgICAgIFwicmVhY3QvanN4LWluZGVudC1wcm9wc1wiOiBbMiwgNF1cbiAgICAgICAgcmVzdWx0ID0gYXV0b0luZGVudC50cmFuc2xhdGVJbmRlbnRPcHRpb25zKHJ1bGVzKVxuICAgICAgICBleHBlY3RlZFJlc3VsdCA9XG4gICAgICAgICAganN4SW5kZW50OiBbJ3dhcm4nLCAyXVxuICAgICAgICAgIGpzeEluZGVudFByb3BzOiBbMiwgMl1cbiAgICAgICAgICBqc3hDbG9zaW5nQnJhY2tldExvY2F0aW9uOiBbIDEsIHsgc2VsZkNsb3Npbmc6ICd0YWctYWxpZ25lZCcsIG5vbkVtcHR5OiAndGFnLWFsaWduZWQnfSBdXG4gICAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoZXhwZWN0ZWRSZXN1bHQpXG5cbiAgICAgIGl0ICdzaG91bGQgcmV0dXJuIGpzeEluZGVudCBvZiAyIHRhYnMgYW5kIGpzeEluZGVudFByb3BzIG9mIDIsIGxpbmUtYWxpZ25lZCcsIC0+XG4gICAgICAgIHJ1bGVzID1cbiAgICAgICAgICBcImluZGVudFwiOiBbMSwgNl1cbiAgICAgICAgICBcInJlYWN0L2pzeC1pbmRlbnRcIjogW1wid2FyblwiLCA0XVxuICAgICAgICAgIFwicmVhY3QvanN4LWluZGVudC1wcm9wc1wiOiBbMiwgNF1cbiAgICAgICAgICAncmVhY3QvanN4LWNsb3NpbmctYnJhY2tldC1sb2NhdGlvbic6IFsxLCAnbGluZS1hbGlnbmVkJ11cbiAgICAgICAgcmVzdWx0ID0gYXV0b0luZGVudC50cmFuc2xhdGVJbmRlbnRPcHRpb25zKHJ1bGVzKVxuICAgICAgICBleHBlY3RlZFJlc3VsdCA9XG4gICAgICAgICAganN4SW5kZW50OiBbJ3dhcm4nLCAyXVxuICAgICAgICAgIGpzeEluZGVudFByb3BzOiBbMiwgMl1cbiAgICAgICAgICBqc3hDbG9zaW5nQnJhY2tldExvY2F0aW9uOiBbIDEsIHsgc2VsZkNsb3Npbmc6ICdsaW5lLWFsaWduZWQnLCBub25FbXB0eTogJ2xpbmUtYWxpZ25lZCd9IF1cbiAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChleHBlY3RlZFJlc3VsdClcblxuICAgICAgaXQgJ3Nob3VsZCByZXR1cm4ganN4SW5kZW50IG9mIDIgdGFicyBhbmQganN4SW5kZW50UHJvcHMgb2YgMiwgbGluZS1hbGlnbmVkIGFuZCBwcm9wcy1hbGlnbmVkJywgLT5cbiAgICAgICAgcnVsZXMgPVxuICAgICAgICAgIFwiaW5kZW50XCI6IFsxLCA2XVxuICAgICAgICAgIFwicmVhY3QvanN4LWluZGVudFwiOiBbXCJ3YXJuXCIsIDRdXG4gICAgICAgICAgXCJyZWFjdC9qc3gtaW5kZW50LXByb3BzXCI6IFsyLCA0XVxuICAgICAgICAgIFwicmVhY3QvanN4LWNsb3NpbmctYnJhY2tldC1sb2NhdGlvblwiOiBbIDEsXG4gICAgICAgICAgICBcIm5vbkVtcHR5XCI6IFwicHJvcHMtYWxpZ25lZFwiLFxuICAgICAgICAgICAgXCJzZWxmQ2xvc2luZ1wiOiBcImxpbmUtYWxpZ25lZFwiXG4gICAgICAgICAgXVxuICAgICAgICByZXN1bHQgPSBhdXRvSW5kZW50LnRyYW5zbGF0ZUluZGVudE9wdGlvbnMocnVsZXMpXG4gICAgICAgIGV4cGVjdGVkUmVzdWx0ID1cbiAgICAgICAgICBqc3hJbmRlbnQ6IFsnd2FybicsIDJdXG4gICAgICAgICAganN4SW5kZW50UHJvcHM6IFsyLCAyXVxuICAgICAgICAgIGpzeENsb3NpbmdCcmFja2V0TG9jYXRpb246IFsgMSwgeyBzZWxmQ2xvc2luZzogJ2xpbmUtYWxpZ25lZCcsIG5vbkVtcHR5OiAncHJvcHMtYWxpZ25lZCd9IF1cbiAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChleHBlY3RlZFJlc3VsdClcblxuICAgICM6IGluZGVudEpTWFxuICAgIGRlc2NyaWJlICc6OmluZGVudEpTWCcsIC0+XG5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgc291cmNlQ29kZSA9IFwiXCJcIlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtyb290Q2xhc3N9PlxuICAgICAgICAgIHt0aGlzLl9yZW5kZXJQbGFjZWhvbGRlcigpfVxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9e2N4KCdEcmFmdEVkaXRvci9lZGl0b3JDb250YWluZXInKX1cbiAgICAgICAgICBrZXk9eydlZGl0b3InICsgdGhpcy5zdGF0ZS5jb250YWluZXJLZXl9XG4gICAgICAgICAgcmVmPVwiZWRpdG9yQ29udGFpbmVyXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgIGFyaWEtYWN0aXZlZGVzY2VuZGFudD17XG4gICAgICAgICAgcmVhZE9ubHkgPyBudWxsIDogdGhpcy5wcm9wcy5hcmlhQWN0aXZlRGVzY2VuZGFudElEXG4gICAgICAgICAgfVxuICAgICAgICAgIGFyaWEtYXV0b2NvbXBsZXRlPXtyZWFkT25seSA/IG51bGwgOiB0aGlzLnByb3BzLmFyaWFBdXRvQ29tcGxldGV9XG4gICAgICAgICAgPlxuICAgICAgICAgIHt0aGlzLl9yZW5kZXJQbGFjZWhvbGRlcigpfVxuICAgICAgICAgIDxDb21wb25lbnQgcDFcbiAgICAgICAgICBwMlxuICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgeyAvLyB0ZXN0cyBpbmxpbmUgSlNYXG4gICAgICAgICAgdHJhaW5lclByb2ZpbGUuYmFja2dyb3VuZEltYWdlTGlua1xuICAgICAgICAgID8gPEltYWdlIHN0eWxlPXtzdHlsZXMudmlkZW99IHNvdXJjZT17e3VyaTogYCR7QXBwQ29uZmlnLmFwaVVSTH0ke3RyYWluZXJQcm9maWxlLmJhY2tncm91bmRJbWFnZUxpbmt9YH19IC8+XG4gICAgICAgICAgOiA8SW1hZ2Ugc3R5bGU9e3N0eWxlcy52aWRlb30gc291cmNlPXt7dXJpOiBgaHR0cHM6Ly9wbGFjZWhvbGQuaXQvMzc1eDE0MGB9fSAvPlxuICAgICAgICAgIH1cbiAgICAgICAgICB7XG4gICAgICAgICAgY29uZCA/XG4gICAgICAgICAgPHNwYW4vPjpcbiAgICAgICAgICA8c3Bhbj48L3NwYW4+XG4gICAgICAgICAgfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgXCJcIlwiXG4gICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KHNvdXJjZUNvZGUpXG4gICAgICAgIHNvdXJjZUNvZGVSYW5nZSA9IG5ldyBSYW5nZShuZXcgUG9pbnQoMCwwKSwgbmV3IFBvaW50KDMxLDApKVxuICAgICAgICBpbmRlbnRKU1hSYW5nZSA9IG5ldyBSYW5nZShuZXcgUG9pbnQoMCwwKSwgbmV3IFBvaW50KDMwLDEpKVxuXG4gICAgICBpdCAnc2hvdWxkIGluZGVudCBKU1ggYWNjb3JkaW5nIHRvIGVzbGludCBydWxlcycsIC0+XG4gICAgICAgIGluZGVudGVkQ29kZSA9IFwiXCJcIlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtyb290Q2xhc3N9PlxuICAgICAgICAgICAge3RoaXMuX3JlbmRlclBsYWNlaG9sZGVyKCl9XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17Y3goJ0RyYWZ0RWRpdG9yL2VkaXRvckNvbnRhaW5lcicpfVxuICAgICAgICAgICAgICBrZXk9eydlZGl0b3InICsgdGhpcy5zdGF0ZS5jb250YWluZXJLZXl9XG4gICAgICAgICAgICAgIHJlZj1cImVkaXRvckNvbnRhaW5lclwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBhcmlhLWFjdGl2ZWRlc2NlbmRhbnQ9e1xuICAgICAgICAgICAgICAgICAgcmVhZE9ubHkgPyBudWxsIDogdGhpcy5wcm9wcy5hcmlhQWN0aXZlRGVzY2VuZGFudElEXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFyaWEtYXV0b2NvbXBsZXRlPXtyZWFkT25seSA/IG51bGwgOiB0aGlzLnByb3BzLmFyaWFBdXRvQ29tcGxldGV9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7dGhpcy5fcmVuZGVyUGxhY2Vob2xkZXIoKX1cbiAgICAgICAgICAgICAgICA8Q29tcG9uZW50IHAxXG4gICAgICAgICAgICAgICAgICBwMlxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICB7IC8vIHRlc3RzIGlubGluZSBKU1hcbiAgICAgICAgICAgICAgICB0cmFpbmVyUHJvZmlsZS5iYWNrZ3JvdW5kSW1hZ2VMaW5rXG4gICAgICAgICAgICAgICAgICA/IDxJbWFnZSBzdHlsZT17c3R5bGVzLnZpZGVvfSBzb3VyY2U9e3t1cmk6IGAke0FwcENvbmZpZy5hcGlVUkx9JHt0cmFpbmVyUHJvZmlsZS5iYWNrZ3JvdW5kSW1hZ2VMaW5rfWB9fSAvPlxuICAgICAgICAgICAgICAgICAgOiA8SW1hZ2Ugc3R5bGU9e3N0eWxlcy52aWRlb30gc291cmNlPXt7dXJpOiBgaHR0cHM6Ly9wbGFjZWhvbGQuaXQvMzc1eDE0MGB9fSAvPlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25kID9cbiAgICAgICAgICAgICAgICAgIDxzcGFuLz46XG4gICAgICAgICAgICAgICAgICA8c3Bhbj48L3NwYW4+XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgXCJcIlwiXG4gICAgICAgICMgcmVtZW1iZXIgdGhpcyBpcyB0YWJzIGJhc2VkIG9uIGF0b20gZGVmYXVsdFxuICAgICAgICBhdXRvSW5kZW50LmVzbGludEluZGVudE9wdGlvbnMgPVxuICAgICAgICAgIGpzeEluZGVudDogWzEsIDFdXG4gICAgICAgICAganN4SW5kZW50UHJvcHM6IFsxLCAxXVxuICAgICAgICAgIGpzeENsb3NpbmdCcmFja2V0TG9jYXRpb246IFsgMSxcbiAgICAgICAgICAgc2VsZkNsb3Npbmc6ICd0YWctYWxpZ25lZCdcbiAgICAgICAgICAgbm9uRW1wdHk6ICd0YWctYWxpZ25lZCcgXVxuICAgICAgICAgYXV0b0luZGVudC5hdXRvSnN4ID0gdHJ1ZVxuICAgICAgICAgYXV0b0luZGVudC5pbmRlbnRKU1goaW5kZW50SlNYUmFuZ2UpXG4gICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKHNvdXJjZUNvZGVSYW5nZSkpLnRvRXF1YWwoaW5kZW50ZWRDb2RlKVxuXG4gICAgICBpdCAnc2hvdWxkIGluZGVudCBKU1ggYWNjb3JkaW5nIHRvIGVzbGludCBydWxlcyBhbmQgdGFnIGNsb3NpbmcgYWxpZ25tZW50JywgLT5cbiAgICAgICAgaW5kZW50ZWRDb2RlID0gXCJcIlwiXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9e3Jvb3RDbGFzc30+XG4gICAgICAgICAgICAgIHt0aGlzLl9yZW5kZXJQbGFjZWhvbGRlcigpfVxuICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2N4KCdEcmFmdEVkaXRvci9lZGl0b3JDb250YWluZXInKX1cbiAgICAgICAgICAgICAgICAgIGtleT17J2VkaXRvcicgKyB0aGlzLnN0YXRlLmNvbnRhaW5lcktleX1cbiAgICAgICAgICAgICAgICAgIHJlZj1cImVkaXRvckNvbnRhaW5lclwiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICAgYXJpYS1hY3RpdmVkZXNjZW5kYW50PXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhZE9ubHkgPyBudWxsIDogdGhpcy5wcm9wcy5hcmlhQWN0aXZlRGVzY2VuZGFudElEXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIGFyaWEtYXV0b2NvbXBsZXRlPXtyZWFkT25seSA/IG51bGwgOiB0aGlzLnByb3BzLmFyaWFBdXRvQ29tcGxldGV9XG4gICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLl9yZW5kZXJQbGFjZWhvbGRlcigpfVxuICAgICAgICAgICAgICAgICAgICAgIDxDb21wb25lbnQgcDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcDJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgeyAvLyB0ZXN0cyBpbmxpbmUgSlNYXG4gICAgICAgICAgICAgICAgICAgICAgdHJhaW5lclByb2ZpbGUuYmFja2dyb3VuZEltYWdlTGlua1xuICAgICAgICAgICAgICAgICAgICAgICAgICA/IDxJbWFnZSBzdHlsZT17c3R5bGVzLnZpZGVvfSBzb3VyY2U9e3t1cmk6IGAke0FwcENvbmZpZy5hcGlVUkx9JHt0cmFpbmVyUHJvZmlsZS5iYWNrZ3JvdW5kSW1hZ2VMaW5rfWB9fSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA6IDxJbWFnZSBzdHlsZT17c3R5bGVzLnZpZGVvfSBzb3VyY2U9e3t1cmk6IGBodHRwczovL3BsYWNlaG9sZC5pdC8zNzV4MTQwYH19IC8+XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgY29uZCA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuLz46XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICBcIlwiXCJcbiAgICAgICAgIyByZW1lbWJlciB0aGlzIGlzIHRhYnMgYmFzZWQgb24gYXRvbSBkZWZhdWx0XG4gICAgICAgIGF1dG9JbmRlbnQuZXNsaW50SW5kZW50T3B0aW9ucyA9XG4gICAgICAgICAganN4SW5kZW50OiBbMSwgMl1cbiAgICAgICAgICBqc3hJbmRlbnRQcm9wczogWzEsIDJdXG4gICAgICAgICAganN4Q2xvc2luZ0JyYWNrZXRMb2NhdGlvbjogWyAxLFxuICAgICAgICAgICAgc2VsZkNsb3Npbmc6ICdwcm9wcy1hbGlnbmVkJ1xuICAgICAgICAgICAgbm9uRW1wdHk6ICdwcm9wcy1hbGlnbmVkJyBdXG4gICAgICAgICBhdXRvSW5kZW50LmF1dG9Kc3ggPSB0cnVlXG4gICAgICAgICBhdXRvSW5kZW50LmluZGVudEpTWChpbmRlbnRKU1hSYW5nZSlcbiAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2Uoc291cmNlQ29kZVJhbmdlKSkudG9FcXVhbChpbmRlbnRlZENvZGUpXG5cbiAgICAjIHRlc3QgaW5zZXJ0IG5ld2xpbmUgYmV0d2VlbiBvcGVuaW5nIGNsb3NpbmcgSlNYIHRhZ3NcbiAgICBkZXNjcmliZSAnaW5zZXJ0LW5sLWpzeCcsIC0+XG5cbiAgICAgIGl0ICdzaG91bGQgaW5zZXJ0IHR3byBuZXcgbGluZXMgYW5kIHBvc2l0aW9uIGN1cnNvciBiZXR3ZWVuIEpTWCB0YWdzJywgLT5cbiAgICAgICAgIyByZW1lbWJlciB0aGlzIGlzIHRhYnMgYmFzZWQgb24gYXRvbSBkZWZhdWx0XG4gICAgICAgIGF1dG9JbmRlbnQuZXNsaW50SW5kZW50T3B0aW9ucyA9XG4gICAgICAgICAganN4SW5kZW50OiBbMSwgMV1cbiAgICAgICAgICBqc3hJbmRlbnRQcm9wczogWzEsIDFdXG4gICAgICAgICAganN4Q2xvc2luZ0JyYWNrZXRMb2NhdGlvbjogWyAxLFxuICAgICAgICAgICAgc2VsZkNsb3Npbmc6ICd0YWJzLWFsaWduZWQnXG4gICAgICAgICAgICBub25FbXB0eTogJ3RhYnMtYWxpZ25lZCcgXVxuICAgICAgICBhdXRvSW5kZW50LmF1dG9Kc3ggPSB0cnVlXG4gICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KCc8ZGl2PjwvZGl2PicpXG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCw1XSlcbiAgICAgICAgZWRpdG9yLmluc2VydFRleHQoJ1xcbicpXG5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShbWzAsMF0sWzAsNV1dKSkudG9FcXVhbChcIjxkaXY+XCIpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UoW1sxLDBdLFsxLDJdXSkpLnRvRXF1YWwoXCIgIFwiKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKFtbMiwwXSxbMiw2XV0pKS50b0VxdWFsKFwiPC9kaXY+XCIpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbChbMSwyXSlcbiJdfQ==
