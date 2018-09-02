(function() {
  var COMPLETIONS, JSXATTRIBUTE, JSXENDTAGSTART, JSXREGEXP, JSXSTARTTAGEND, JSXTAG, Point, REACTURL, Range, TAGREGEXP, filter, ref, ref1, score,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ref = require("atom"), Range = ref.Range, Point = ref.Point;

  ref1 = require("fuzzaldrin"), filter = ref1.filter, score = ref1.score;

  JSXSTARTTAGEND = 0;

  JSXENDTAGSTART = 1;

  JSXTAG = 2;

  JSXATTRIBUTE = 3;

  JSXREGEXP = /(?:(<)|(<\/))([$_A-Za-z](?:[$._:\-a-zA-Z0-9])*)|(?:(\/>)|(>))|(<\s*>)/g;

  TAGREGEXP = /<([$_a-zA-Z][$._:\-a-zA-Z0-9]*)($|\s|\/>|>)/g;

  COMPLETIONS = require("./completions-jsx");

  REACTURL = "http://facebook.github.io/react/docs/tags-and-attributes.html";

  module.exports = {
    selector: ".meta.tag.jsx",
    inclusionPriority: 10000,
    excludeLowerPriority: false,
    getSuggestions: function(opts) {
      var attribute, attributes, bufferPosition, editor, elementObj, filteredAttributes, htmlElement, htmlElements, i, j, jsxRange, jsxTag, k, len, len1, len2, prefix, ref2, scopeDescriptor, startOfJSX, suggestions, tagName, tagNameStack;
      editor = opts.editor, bufferPosition = opts.bufferPosition, scopeDescriptor = opts.scopeDescriptor, prefix = opts.prefix;
      jsxTag = this.getTriggerTag(editor, bufferPosition);
      if (jsxTag == null) {
        return;
      }
      suggestions = [];
      if (jsxTag === JSXSTARTTAGEND) {
        startOfJSX = this.getStartOfJSX(editor, bufferPosition);
        jsxRange = new Range(startOfJSX, bufferPosition);
        tagNameStack = this.buildTagStack(editor, jsxRange);
        while ((tagName = tagNameStack.pop()) != null) {
          suggestions.push({
            snippet: "$1</" + tagName + ">",
            type: "tag",
            description: "language-babel tag closer"
          });
        }
      } else if (jsxTag === JSXENDTAGSTART) {
        startOfJSX = this.getStartOfJSX(editor, bufferPosition);
        jsxRange = new Range(startOfJSX, bufferPosition);
        tagNameStack = this.buildTagStack(editor, jsxRange);
        while ((tagName = tagNameStack.pop()) != null) {
          suggestions.push({
            snippet: tagName + ">",
            type: "tag",
            description: "language-babel tag closer"
          });
        }
      } else if (jsxTag === JSXTAG) {
        if (!/^[a-z]/g.exec(prefix)) {
          return;
        }
        htmlElements = filter(COMPLETIONS.htmlElements, prefix, {
          key: "name"
        });
        for (i = 0, len = htmlElements.length; i < len; i++) {
          htmlElement = htmlElements[i];
          if (score(htmlElement.name, prefix) < 0.07) {
            continue;
          }
          suggestions.push({
            snippet: htmlElement.name,
            type: "tag",
            description: "language-babel JSX supported elements",
            descriptionMoreURL: REACTURL
          });
        }
      } else if (jsxTag === JSXATTRIBUTE) {
        tagName = this.getThisTagName(editor, bufferPosition);
        if (tagName == null) {
          return;
        }
        ref2 = COMPLETIONS.htmlElements;
        for (j = 0, len1 = ref2.length; j < len1; j++) {
          elementObj = ref2[j];
          if (elementObj.name === tagName) {
            break;
          }
        }
        attributes = elementObj.attributes.concat(COMPLETIONS.globalAttributes);
        attributes = attributes.concat(COMPLETIONS.events);
        filteredAttributes = filter(attributes, prefix, {
          key: "name"
        });
        for (k = 0, len2 = filteredAttributes.length; k < len2; k++) {
          attribute = filteredAttributes[k];
          if (score(attribute.name, prefix) < 0.07) {
            continue;
          }
          suggestions.push({
            snippet: attribute.name,
            type: "attribute",
            rightLabel: "<" + tagName + ">",
            description: "language-babel JSXsupported attributes/events",
            descriptionMoreURL: REACTURL
          });
        }
      } else {
        return;
      }
      return suggestions;
    },
    getThisTagName: function(editor, bufferPosition) {
      var column, match, matches, row, rowText, scopes;
      row = bufferPosition.row;
      column = null;
      while (row >= 0) {
        rowText = editor.lineTextForBufferRow(row);
        if (column == null) {
          rowText = rowText.substr(0, column = bufferPosition.column);
        }
        matches = [];
        while ((match = TAGREGEXP.exec(rowText)) !== null) {
          scopes = editor.scopeDescriptorForBufferPosition([row, match.index + 1]).getScopesArray();
          if (indexOf.call(scopes, "entity.name.tag.open.jsx") >= 0) {
            matches.push(match[1]);
          }
        }
        if (matches.length) {
          return matches.pop();
        } else {
          row--;
        }
      }
    },
    getTriggerTag: function(editor, bufferPosition) {
      var column, scopes;
      column = bufferPosition.column - 1;
      if (column >= 0) {
        scopes = editor.scopeDescriptorForBufferPosition([bufferPosition.row, column]).getScopesArray();
        if (indexOf.call(scopes, "entity.other.attribute-name.jsx") >= 0) {
          return JSXATTRIBUTE;
        }
        if (indexOf.call(scopes, "entity.name.tag.open.jsx") >= 0) {
          return JSXTAG;
        }
        if (indexOf.call(scopes, "JSXStartTagEnd") >= 0) {
          return JSXSTARTTAGEND;
        }
        if (indexOf.call(scopes, "JSXEndTagStart") >= 0) {
          return JSXENDTAGSTART;
        }
      }
    },
    getStartOfJSX: function(editor, bufferPosition) {
      var column, columnLen, row;
      row = bufferPosition.row;
      while (row >= 0) {
        if (indexOf.call(editor.scopeDescriptorForBufferPosition([row, 0]).getScopesArray(), "meta.tag.jsx") < 0) {
          break;
        }
        row--;
      }
      if (row < 0) {
        row = 0;
      }
      columnLen = editor.lineTextForBufferRow(row).length;
      column = 0;
      while (column < columnLen) {
        if (indexOf.call(editor.scopeDescriptorForBufferPosition([row, column]).getScopesArray(), "meta.tag.jsx") >= 0) {
          break;
        }
        column++;
      }
      if (column === columnLen) {
        row++;
        column = 0;
      }
      return new Point(row, column);
    },
    buildTagStack: function(editor, range) {
      var closedtag, line, match, matchColumn, matchPointEnd, matchPointStart, matchRange, row, scopes, tagNameStack;
      tagNameStack = [];
      row = range.start.row;
      while (row <= range.end.row) {
        line = editor.lineTextForBufferRow(row);
        if (row === range.end.row) {
          line = line.substr(0, range.end.column);
        }
        while ((match = JSXREGEXP.exec(line)) !== null) {
          matchColumn = match.index;
          matchPointStart = new Point(row, matchColumn);
          matchPointEnd = new Point(row, matchColumn + match[0].length - 1);
          matchRange = new Range(matchPointStart, matchPointEnd);
          if (range.intersectsWith(matchRange)) {
            scopes = editor.scopeDescriptorForBufferPosition([row, match.index]).getScopesArray();
            if (indexOf.call(scopes, "punctuation.definition.tag.jsx") < 0) {
              continue;
            }
            if (match[1] != null) {
              tagNameStack.push(match[3]);
            } else if (match[2] != null) {
              closedtag = tagNameStack.pop();
              if (closedtag !== match[3]) {
                tagNameStack.push(closedtag);
              }
            } else if (match[4] != null) {
              tagNameStack.pop();
            } else if (match[6] != null) {
              tagNameStack.push("");
            }
          }
        }
        row++;
      }
      return tagNameStack;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdGhla2FybG85NS8uYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1iYWJlbC9saWIvYXV0by1jb21wbGV0ZS1qc3guY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSx5SUFBQTtJQUFBOztFQUFBLE1BQWlCLE9BQUEsQ0FBUSxNQUFSLENBQWpCLEVBQUMsaUJBQUQsRUFBUTs7RUFDUixPQUFrQixPQUFBLENBQVEsWUFBUixDQUFsQixFQUFDLG9CQUFELEVBQVM7O0VBR1QsY0FBQSxHQUFpQjs7RUFDakIsY0FBQSxHQUFpQjs7RUFDakIsTUFBQSxHQUFTOztFQUNULFlBQUEsR0FBZTs7RUFFZixTQUFBLEdBQVk7O0VBQ1osU0FBQSxHQUFhOztFQUNiLFdBQUEsR0FBYyxPQUFBLENBQVEsbUJBQVI7O0VBQ2QsUUFBQSxHQUFXOztFQUVYLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxRQUFBLEVBQVUsZUFBVjtJQUNBLGlCQUFBLEVBQW1CLEtBRG5CO0lBRUEsb0JBQUEsRUFBc0IsS0FGdEI7SUFLQSxjQUFBLEVBQWdCLFNBQUMsSUFBRDtBQUNkLFVBQUE7TUFBQyxvQkFBRCxFQUFTLG9DQUFULEVBQXlCLHNDQUF6QixFQUEwQztNQUUxQyxNQUFBLEdBQVMsSUFBQyxDQUFBLGFBQUQsQ0FBZSxNQUFmLEVBQXVCLGNBQXZCO01BQ1QsSUFBYyxjQUFkO0FBQUEsZUFBQTs7TUFHQSxXQUFBLEdBQWM7TUFFZCxJQUFHLE1BQUEsS0FBVSxjQUFiO1FBQ0UsVUFBQSxHQUFhLElBQUMsQ0FBQSxhQUFELENBQWUsTUFBZixFQUF1QixjQUF2QjtRQUNiLFFBQUEsR0FBVyxJQUFJLEtBQUosQ0FBVSxVQUFWLEVBQXNCLGNBQXRCO1FBQ1gsWUFBQSxHQUFlLElBQUMsQ0FBQSxhQUFELENBQWUsTUFBZixFQUF1QixRQUF2QjtBQUNmLGVBQU0sc0NBQU47VUFDRSxXQUFXLENBQUMsSUFBWixD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QUEsR0FBYyxLQUFLLENBQUM7VUFDcEIsZUFBQSxHQUFrQixJQUFJLEtBQUosQ0FBVSxHQUFWLEVBQWUsV0FBZjtVQUNsQixhQUFBLEdBQWdCLElBQUksS0FBSixDQUFVLEdBQVYsRUFBZSxXQUFBLEdBQWMsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLE1BQXZCLEdBQWdDLENBQS9DO1VBQ2hCLFVBQUEsR0FBYSxJQUFJLEtBQUosQ0FBVSxlQUFWLEVBQTJCLGFBQTNCO1VBQ2IsSUFBRyxLQUFLLENBQUMsY0FBTixDQUFxQixVQUFyQixDQUFIO1lBQ0UsTUFBQSxHQUFTLE1BQU0sQ0FBQyxnQ0FBUCxDQUF3QyxDQUFDLEdBQUQsRUFBTSxLQUFLLENBQUMsS0FBWixDQUF4QyxDQUEyRCxDQUFDLGNBQTVELENBQUE7WUFDVCxJQUFZLGFBQXdDLE1BQXhDLEVBQUEsZ0NBQUEsS0FBWjtBQUFBLHVCQUFBOztZQUVBLElBQUcsZ0JBQUg7Y0FDRSxZQUFZLENBQUMsSUFBYixDQUFrQixLQUFNLENBQUEsQ0FBQSxDQUF4QixFQURGO2FBQUEsTUFFSyxJQUFHLGdCQUFIO2NBQ0gsU0FBQSxHQUFZLFlBQVksQ0FBQyxHQUFiLENBQUE7Y0FDWixJQUFHLFNBQUEsS0FBZSxLQUFNLENBQUEsQ0FBQSxDQUF4QjtnQkFDRSxZQUFZLENBQUMsSUFBYixDQUFrQixTQUFsQixFQURGO2VBRkc7YUFBQSxNQUlBLElBQUcsZ0JBQUg7Y0FDSCxZQUFZLENBQUMsR0FBYixDQUFBLEVBREc7YUFBQSxNQUVBLElBQUcsZ0JBQUg7Y0FDSCxZQUFZLENBQUMsSUFBYixDQUFrQixFQUFsQixFQURHO2FBWlA7O1FBTEY7UUFvQkEsR0FBQTtNQXhCRjthQXlCQTtJQTVCYSxDQXJIZjs7QUFmRiIsInNvdXJjZXNDb250ZW50IjpbIntSYW5nZSwgUG9pbnR9ID0gcmVxdWlyZSBcImF0b21cIlxue2ZpbHRlciwgc2NvcmV9ID0gcmVxdWlyZSBcImZ1enphbGRyaW5cIlxuXG4jIHRhZ3Mgd2UgYXJlIGludGVyZXN0ZWQgaW4gYXJlIG1hcmtlZCBieSB0aGUgZ3JhbW1hclxuSlNYU1RBUlRUQUdFTkQgPSAwXG5KU1hFTkRUQUdTVEFSVCA9IDFcbkpTWFRBRyA9IDJcbkpTWEFUVFJJQlVURSA9IDNcbiMgcmVnZXggdG8gc2VhcmNoIGZvciB0YWcgb3Blbi9jbG9zZSB0YWcgYW5kIGNsb3NlIHRhZ1xuSlNYUkVHRVhQID0gLyg/Oig8KXwoPFxcLykpKFskX0EtWmEtel0oPzpbJC5fOlxcLWEtekEtWjAtOV0pKil8KD86KFxcLz4pfCg+KSl8KDxcXHMqPikvZ1xuVEFHUkVHRVhQID0gIC88KFskX2EtekEtWl1bJC5fOlxcLWEtekEtWjAtOV0qKSgkfFxcc3xcXC8+fD4pL2dcbkNPTVBMRVRJT05TID0gcmVxdWlyZSBcIi4vY29tcGxldGlvbnMtanN4XCJcblJFQUNUVVJMID0gXCJodHRwOi8vZmFjZWJvb2suZ2l0aHViLmlvL3JlYWN0L2RvY3MvdGFncy1hbmQtYXR0cmlidXRlcy5odG1sXCJcblxubW9kdWxlLmV4cG9ydHMgPVxuICBzZWxlY3RvcjogXCIubWV0YS50YWcuanN4XCJcbiAgaW5jbHVzaW9uUHJpb3JpdHk6IDEwMDAwXG4gIGV4Y2x1ZGVMb3dlclByaW9yaXR5OiBmYWxzZVxuXG5cbiAgZ2V0U3VnZ2VzdGlvbnM6IChvcHRzKSAtPlxuICAgIHtlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uLCBzY29wZURlc2NyaXB0b3IsIHByZWZpeH0gPSBvcHRzXG5cbiAgICBqc3hUYWcgPSBAZ2V0VHJpZ2dlclRhZyBlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uXG4gICAgcmV0dXJuIGlmIG5vdCBqc3hUYWc/XG5cbiAgICAjIGJ1aWxkIGF1dG9jb21wbGV0ZSBsaXN0XG4gICAgc3VnZ2VzdGlvbnMgPSBbXVxuXG4gICAgaWYganN4VGFnIGlzIEpTWFNUQVJUVEFHRU5EXG4gICAgICBzdGFydE9mSlNYID0gQGdldFN0YXJ0T2ZKU1ggZWRpdG9yLCBidWZmZXJQb3NpdGlvblxuICAgICAganN4UmFuZ2UgPSBuZXcgUmFuZ2Uoc3RhcnRPZkpTWCwgYnVmZmVyUG9zaXRpb24pXG4gICAgICB0YWdOYW1lU3RhY2sgPSBAYnVpbGRUYWdTdGFjayhlZGl0b3IsIGpzeFJhbmdlKVxuICAgICAgd2hpbGUgKCB0YWdOYW1lID0gdGFnTmFtZVN0YWNrLnBvcCgpKT9cbiAgICAgICAgc3VnZ2VzdGlvbnMucHVzaFxuICAgICAgICAgIHNuaXBwZXQ6IFwiJDE8LyN7dGFnTmFtZX0+XCJcbiAgICAgICAgICB0eXBlOiBcInRhZ1wiXG4gICAgICAgICAgZGVzY3JpcHRpb246IFwibGFuZ3VhZ2UtYmFiZWwgdGFnIGNsb3NlclwiXG5cbiAgICBlbHNlIGlmICBqc3hUYWcgaXMgSlNYRU5EVEFHU1RBUlRcbiAgICAgIHN0YXJ0T2ZKU1ggPSBAZ2V0U3RhcnRPZkpTWCBlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uXG4gICAgICBqc3hSYW5nZSA9IG5ldyBSYW5nZShzdGFydE9mSlNYLCBidWZmZXJQb3NpdGlvbilcbiAgICAgIHRhZ05hbWVTdGFjayA9IEBidWlsZFRhZ1N0YWNrKGVkaXRvciwganN4UmFuZ2UpXG4gICAgICB3aGlsZSAoIHRhZ05hbWUgPSB0YWdOYW1lU3RhY2sucG9wKCkpP1xuICAgICAgICBzdWdnZXN0aW9ucy5wdXNoXG4gICAgICAgICAgc25pcHBldDogXCIje3RhZ05hbWV9PlwiXG4gICAgICAgICAgdHlwZTogXCJ0YWdcIlxuICAgICAgICAgIGRlc2NyaXB0aW9uOiBcImxhbmd1YWdlLWJhYmVsIHRhZyBjbG9zZXJcIlxuXG4gICAgZWxzZSBpZiBqc3hUYWcgaXMgSlNYVEFHXG4gICAgICByZXR1cm4gaWYgbm90IC9eW2Etel0vZy5leGVjKHByZWZpeClcbiAgICAgIGh0bWxFbGVtZW50cyA9IGZpbHRlcihDT01QTEVUSU9OUy5odG1sRWxlbWVudHMsIHByZWZpeCwge2tleTogXCJuYW1lXCJ9KVxuICAgICAgZm9yIGh0bWxFbGVtZW50IGluIGh0bWxFbGVtZW50c1xuICAgICAgICBpZiBzY29yZShodG1sRWxlbWVudC5uYW1lLCBwcmVmaXgpIDwgMC4wNyB0aGVuIGNvbnRpbnVlXG4gICAgICAgIHN1Z2dlc3Rpb25zLnB1c2hcbiAgICAgICAgICBzbmlwcGV0OiBodG1sRWxlbWVudC5uYW1lXG4gICAgICAgICAgdHlwZTogXCJ0YWdcIlxuICAgICAgICAgIGRlc2NyaXB0aW9uOiBcImxhbmd1YWdlLWJhYmVsIEpTWCBzdXBwb3J0ZWQgZWxlbWVudHNcIlxuICAgICAgICAgIGRlc2NyaXB0aW9uTW9yZVVSTDogUkVBQ1RVUkxcblxuICAgIGVsc2UgaWYganN4VGFnIGlzIEpTWEFUVFJJQlVURVxuICAgICAgdGFnTmFtZSA9IEBnZXRUaGlzVGFnTmFtZSBlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uXG4gICAgICByZXR1cm4gaWYgbm90IHRhZ05hbWU/XG4gICAgICBmb3IgZWxlbWVudE9iaiBpbiBDT01QTEVUSU9OUy5odG1sRWxlbWVudHNcbiAgICAgICAgaWYgZWxlbWVudE9iai5uYW1lIGlzIHRhZ05hbWUgdGhlbiBicmVha1xuICAgICAgYXR0cmlidXRlcyA9IGVsZW1lbnRPYmouYXR0cmlidXRlcy5jb25jYXQgQ09NUExFVElPTlMuZ2xvYmFsQXR0cmlidXRlc1xuICAgICAgYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXMuY29uY2F0IENPTVBMRVRJT05TLmV2ZW50c1xuICAgICAgZmlsdGVyZWRBdHRyaWJ1dGVzID0gZmlsdGVyKGF0dHJpYnV0ZXMsIHByZWZpeCwge2tleTogXCJuYW1lXCJ9KVxuICAgICAgZm9yIGF0dHJpYnV0ZSBpbiBmaWx0ZXJlZEF0dHJpYnV0ZXNcbiAgICAgICAgaWYgc2NvcmUoYXR0cmlidXRlLm5hbWUsIHByZWZpeCkgPCAwLjA3IHRoZW4gY29udGludWVcbiAgICAgICAgc3VnZ2VzdGlvbnMucHVzaFxuICAgICAgICAgIHNuaXBwZXQ6IGF0dHJpYnV0ZS5uYW1lXG4gICAgICAgICAgdHlwZTogXCJhdHRyaWJ1dGVcIlxuICAgICAgICAgIHJpZ2h0TGFiZWw6IFwiPCN7dGFnTmFtZX0+XCJcbiAgICAgICAgICBkZXNjcmlwdGlvbjogXCJsYW5ndWFnZS1iYWJlbCBKU1hzdXBwb3J0ZWQgYXR0cmlidXRlcy9ldmVudHNcIlxuICAgICAgICAgIGRlc2NyaXB0aW9uTW9yZVVSTDogUkVBQ1RVUkxcblxuICAgIGVsc2UgcmV0dXJuXG4gICAgc3VnZ2VzdGlvbnNcblxuICAjIGdldCB0YWduYW1lIGZvciB0aGlzIGF0dHJpYnV0ZVxuICBnZXRUaGlzVGFnTmFtZTogKCBlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKSAtPlxuICAgIHJvdyA9IGJ1ZmZlclBvc2l0aW9uLnJvd1xuICAgIGNvbHVtbiA9IG51bGxcbiAgICB3aGlsZSByb3cgPj0gMFxuICAgICAgcm93VGV4dCA9IGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhyb3cpXG4gICAgICBpZiBub3QgY29sdW1uP1xuICAgICAgICByb3dUZXh0ID0gcm93VGV4dC5zdWJzdHIgMCwgY29sdW1uID0gYnVmZmVyUG9zaXRpb24uY29sdW1uXG4gICAgICBtYXRjaGVzID0gW11cbiAgICAgIHdoaWxlICgoIG1hdGNoID0gVEFHUkVHRVhQLmV4ZWMocm93VGV4dCkpIGlzbnQgbnVsbCApXG4gICAgICAgICMgc2F2ZSB0aGlzIG1hdGNoIGlmIGl0IGEgdmFsaWQgdGFnXG4gICAgICAgIHNjb3BlcyA9IGVkaXRvci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihbcm93LCBtYXRjaC5pbmRleCsxXSkuZ2V0U2NvcGVzQXJyYXkoKVxuICAgICAgICBpZiBcImVudGl0eS5uYW1lLnRhZy5vcGVuLmpzeFwiIGluIHNjb3BlcyB0aGVuIG1hdGNoZXMucHVzaCBtYXRjaFsxXVxuICAgICAgIyByZXR1cm4gdGhlIHRhZyB0aGF0IGlzIHRoZSBsYXN0IG9uZSBmb3VuZFxuICAgICAgaWYgbWF0Y2hlcy5sZW5ndGhcbiAgICAgICAgcmV0dXJuIG1hdGNoZXMucG9wKClcbiAgICAgIGVsc2Ugcm93LS1cblxuXG4gIGdldFRyaWdnZXJUYWc6IChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKSAtPlxuICAgICMgSlNYIHRhZyBzY29wZXMgd2UgYXJlIGludGVyZXN0ZWQgaW4gbWF5IGFscmVhZHkgY2xvc2VkIG9uY2UgdHlwZWRcbiAgICAjIHNvIHdlIGhhdmUgdG8gYmFja3RyYWNrIGJ5IG9uZSBjaGFyIHRvIHNlZSBpZiB0aGV5IHdlcmUgdHlwZWRcbiAgICBjb2x1bW4gPSBidWZmZXJQb3NpdGlvbi5jb2x1bW4tMVxuICAgIGlmIGNvbHVtbiA+PSAwXG4gICAgICBzY29wZXMgPSBlZGl0b3Iuc2NvcGVEZXNjcmlwdG9yRm9yQnVmZmVyUG9zaXRpb24oW2J1ZmZlclBvc2l0aW9uLnJvdywgY29sdW1uXSkuZ2V0U2NvcGVzQXJyYXkoKVxuICAgICAgaWYgXCJlbnRpdHkub3RoZXIuYXR0cmlidXRlLW5hbWUuanN4XCIgaW4gc2NvcGVzIHRoZW4gcmV0dXJuIEpTWEFUVFJJQlVURVxuICAgICAgaWYgXCJlbnRpdHkubmFtZS50YWcub3Blbi5qc3hcIiBpbiBzY29wZXMgdGhlbiByZXR1cm4gSlNYVEFHXG4gICAgICBpZiBcIkpTWFN0YXJ0VGFnRW5kXCIgaW4gc2NvcGVzIHRoZW4gcmV0dXJuIEpTWFNUQVJUVEFHRU5EXG4gICAgICBpZiBcIkpTWEVuZFRhZ1N0YXJ0XCIgaW4gc2NvcGVzIHRoZW4gcmV0dXJuIEpTWEVORFRBR1NUQVJUXG5cblxuICAjIGZpbmQgYmVnZ2luaW5nIG9mIEpTWCBpbiBidWZmZXIgYW5kIHJldHVybiBQb2ludFxuICBnZXRTdGFydE9mSlNYOiAoZWRpdG9yLCBidWZmZXJQb3NpdGlvbikgLT5cbiAgICByb3cgPSBidWZmZXJQb3NpdGlvbi5yb3dcbiAgICAjIGZpbmQgcHJldmlvdXMgc3RhcnQgb2Ygcm93IHRoYXQgaGFzIG5vIGpzeCB0YWdcbiAgICB3aGlsZSByb3cgPj0gMFxuICAgICAgYnJlYWsgaWYgXCJtZXRhLnRhZy5qc3hcIiBub3QgaW4gZWRpdG9yLnNjb3BlRGVzY3JpcHRvckZvckJ1ZmZlclBvc2l0aW9uKFtyb3csIDBdKS5nZXRTY29wZXNBcnJheSgpXG4gICAgICByb3ctLVxuICAgIGlmIHJvdyA8IDAgdGhlbiByb3cgPSAwXG4gICAgIyBtYXliZSBqc3ggYXBwYWVhcnMgbGF0ZXIgaW4gcm93XG4gICAgY29sdW1uTGVuID0gZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KHJvdykubGVuZ3RoXG4gICAgY29sdW1uID0gMFxuICAgIHdoaWxlIGNvbHVtbiA8IGNvbHVtbkxlblxuICAgICAgYnJlYWsgaWYgXCJtZXRhLnRhZy5qc3hcIiBpbiBlZGl0b3Iuc2NvcGVEZXNjcmlwdG9yRm9yQnVmZmVyUG9zaXRpb24oW3JvdywgY29sdW1uXSkuZ2V0U2NvcGVzQXJyYXkoKVxuICAgICAgY29sdW1uKytcbiAgICAjIGFkanVzdCByb3cgY29sdW1uIGlmIGpzeCBub3QgaW4gdGhpcyByb3cgYXQgYWxsXG4gICAgaWYgY29sdW1uIGlzIGNvbHVtbkxlblxuICAgICAgcm93KytcbiAgICAgIGNvbHVtbiA9IDBcbiAgICBuZXcgUG9pbnQocm93LCBjb2x1bW4pXG5cbiAgIyBidWlsZCBzdGFjayBvZiB0YWduYW1lcyBvcGVuZWQgYnV0IG5vdCBjbG9zZWQgaW4gUmFuZ2VcbiAgYnVpbGRUYWdTdGFjazogKGVkaXRvciwgcmFuZ2UpIC0+XG4gICAgdGFnTmFtZVN0YWNrID0gW11cbiAgICByb3cgPSByYW5nZS5zdGFydC5yb3dcbiAgICB3aGlsZSByb3cgPD0gcmFuZ2UuZW5kLnJvd1xuICAgICAgbGluZSA9IGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyByb3dcbiAgICAgIGlmIHJvdyBpcyByYW5nZS5lbmQucm93XG4gICAgICAgIGxpbmUgPSBsaW5lLnN1YnN0ciAwLCByYW5nZS5lbmQuY29sdW1uXG4gICAgICB3aGlsZSAoKCBtYXRjaCA9IEpTWFJFR0VYUC5leGVjKGxpbmUpKSBpc250IG51bGwgKVxuICAgICAgICBtYXRjaENvbHVtbiA9IG1hdGNoLmluZGV4XG4gICAgICAgIG1hdGNoUG9pbnRTdGFydCA9IG5ldyBQb2ludChyb3csIG1hdGNoQ29sdW1uKVxuICAgICAgICBtYXRjaFBvaW50RW5kID0gbmV3IFBvaW50KHJvdywgbWF0Y2hDb2x1bW4gKyBtYXRjaFswXS5sZW5ndGggLSAxKVxuICAgICAgICBtYXRjaFJhbmdlID0gbmV3IFJhbmdlKG1hdGNoUG9pbnRTdGFydCwgbWF0Y2hQb2ludEVuZClcbiAgICAgICAgaWYgcmFuZ2UuaW50ZXJzZWN0c1dpdGgobWF0Y2hSYW5nZSlcbiAgICAgICAgICBzY29wZXMgPSBlZGl0b3Iuc2NvcGVEZXNjcmlwdG9yRm9yQnVmZmVyUG9zaXRpb24oW3JvdywgbWF0Y2guaW5kZXhdKS5nZXRTY29wZXNBcnJheSgpXG4gICAgICAgICAgY29udGludWUgaWYgXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnRhZy5qc3hcIiBub3QgaW4gc2NvcGVzXG4gICAgICAgICAgI2NoZWNrIGNhcHR1cmUgZ3JvdXBzXG4gICAgICAgICAgaWYgbWF0Y2hbMV0/ICMgdGFncyBzdGFydGluZyA8dGFnXG4gICAgICAgICAgICB0YWdOYW1lU3RhY2sucHVzaCBtYXRjaFszXVxuICAgICAgICAgIGVsc2UgaWYgbWF0Y2hbMl0/ICMgdGFncyBlbmRpbmcgPC90YWdcbiAgICAgICAgICAgIGNsb3NlZHRhZyA9IHRhZ05hbWVTdGFjay5wb3AoKVxuICAgICAgICAgICAgaWYgY2xvc2VkdGFnIGlzbnQgbWF0Y2hbM11cbiAgICAgICAgICAgICAgdGFnTmFtZVN0YWNrLnB1c2ggY2xvc2VkdGFnXG4gICAgICAgICAgZWxzZSBpZiBtYXRjaFs0XT8gIyB0YWdzIGFuZCBmcmFnbWVudHMgZW5kaW5nIC8+XG4gICAgICAgICAgICB0YWdOYW1lU3RhY2sucG9wKClcbiAgICAgICAgICBlbHNlIGlmIG1hdGNoWzZdPyAjIHRhZyBmcmFnbWVudCBzdGF0aW5nIDw+XG4gICAgICAgICAgICB0YWdOYW1lU3RhY2sucHVzaCBcIlwiXG5cbiAgICAgIHJvdysrXG4gICAgdGFnTmFtZVN0YWNrXG4iXX0=
