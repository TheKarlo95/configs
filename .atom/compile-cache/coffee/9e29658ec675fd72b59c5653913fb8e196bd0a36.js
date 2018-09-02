(function() {
  var TagMacher;

  TagMacher = (function() {
    TagMacher.prototype.startRegex = /\S/;

    TagMacher.prototype.endRegex = /\S(\s+)?$/;

    function TagMacher(editor) {
      this.editor = editor;
    }

    TagMacher.prototype.lineStartsWithOpeningTag = function(bufferLine) {
      var match, scopeDescriptor;
      if (match = bufferLine.match(/\S/)) {
        scopeDescriptor = this.editor.tokenForBufferPosition([bufferRow, match.index]);
        return scopeDescriptor.scopes.indexOf('tag.open.js') > -1 && scopeDescriptor.scopes.indexOf('meta.tag.attribute-name.js') === -1;
      }
      return false;
    };

    TagMacher.prototype.lineStartWithAttribute = function(bufferLine) {
      var match, scopeDescriptor;
      if (match = bufferLine.match(/\S/)) {
        scopeDescriptor = this.editor.tokenForBufferPosition([bufferRow, match.index]);
        return scopeDescriptor.scopes.indexOf('meta.tag.attribute-name.js') > -1;
      }
      return false;
    };

    TagMacher.prototype.lineStartsWithClosingTag = function(bufferRow) {
      var match, scopeDescriptor;
      if (match = bufferLine.match(/\S/)) {
        scopeDescriptor = this.editor.tokenForBufferPosition([bufferRow, match.index]);
        return scopeDescriptor.scopes.indexOf('tag.closed.js') > -1;
      }
      return false;
    };

    return TagMacher;

  })();

  module.exports = TagMacher;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdGhla2FybG85NS8uYXRvbS9wYWNrYWdlcy9yZWFjdC9saWIvdGFnLW1hdGNoZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBTTt3QkFDSixVQUFBLEdBQVk7O3dCQUNaLFFBQUEsR0FBVTs7SUFFRyxtQkFBQyxNQUFEO01BQ1gsSUFBQyxDQUFBLE1BQUQsR0FBVTtJQURDOzt3QkFHYix3QkFBQSxHQUEwQixTQUFDLFVBQUQ7QUFDeEIsVUFBQTtNQUFBLElBQUcsS0FBQSxHQUFRLFVBQVUsQ0FBQyxLQUFYLENBQWlCLElBQWpCLENBQVg7UUFDRSxlQUFBLEdBQWtCLElBQUMsQ0FBQSxNQUFNLENBQUMsc0JBQVIsQ0FBK0IsQ0FBQyxTQUFELEVBQVksS0FBSyxDQUFDLEtBQWxCLENBQS9CO0FBQ2xCLGVBQU8sZUFBZSxDQUFDLE1BQU0sQ0FBQyxPQUF2QixDQUErQixhQUEvQixDQUFBLEdBQWdELENBQUMsQ0FBakQsSUFDQSxlQUFlLENBQUMsTUFBTSxDQUFDLE9BQXZCLENBQStCLDRCQUEvQixDQUFBLEtBQWdFLENBQUMsRUFIMUU7O0FBS0EsYUFBTztJQU5pQjs7d0JBUTFCLHNCQUFBLEdBQXdCLFNBQUMsVUFBRDtBQUN0QixVQUFBO01BQUEsSUFBRyxLQUFBLEdBQVEsVUFBVSxDQUFDLEtBQVgsQ0FBaUIsSUFBakIsQ0FBWDtRQUNFLGVBQUEsR0FBa0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxzQkFBUixDQUErQixDQUFDLFNBQUQsRUFBWSxLQUFLLENBQUMsS0FBbEIsQ0FBL0I7QUFDbEIsZUFBTyxlQUFlLENBQUMsTUFBTSxDQUFDLE9BQXZCLENBQStCLDRCQUEvQixDQUFBLEdBQStELENBQUMsRUFGekU7O0FBSUEsYUFBTztJQUxlOzt3QkFPeEIsd0JBQUEsR0FBMEIsU0FBQyxTQUFEO0FBQ3hCLFVBQUE7TUFBQSxJQUFHLEtBQUEsR0FBUSxVQUFVLENBQUMsS0FBWCxDQUFpQixJQUFqQixDQUFYO1FBQ0UsZUFBQSxHQUFrQixJQUFDLENBQUEsTUFBTSxDQUFDLHNCQUFSLENBQStCLENBQUMsU0FBRCxFQUFZLEtBQUssQ0FBQyxLQUFsQixDQUEvQjtBQUNsQixlQUFPLGVBQWUsQ0FBQyxNQUFNLENBQUMsT0FBdkIsQ0FBK0IsZUFBL0IsQ0FBQSxHQUFrRCxDQUFDLEVBRjVEOztBQUlBLGFBQU87SUFMaUI7Ozs7OztFQU81QixNQUFNLENBQUMsT0FBUCxHQUFpQjtBQTdCakIiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBUYWdNYWNoZXJcbiAgc3RhcnRSZWdleDogL1xcUy9cbiAgZW5kUmVnZXg6IC9cXFMoXFxzKyk/JC9cblxuICBjb25zdHJ1Y3RvcjogKGVkaXRvcikgLT5cbiAgICBAZWRpdG9yID0gZWRpdG9yXG5cbiAgbGluZVN0YXJ0c1dpdGhPcGVuaW5nVGFnOiAoYnVmZmVyTGluZSkgLT5cbiAgICBpZiBtYXRjaCA9IGJ1ZmZlckxpbmUubWF0Y2goL1xcUy8pXG4gICAgICBzY29wZURlc2NyaXB0b3IgPSBAZWRpdG9yLnRva2VuRm9yQnVmZmVyUG9zaXRpb24oW2J1ZmZlclJvdywgbWF0Y2guaW5kZXhdKVxuICAgICAgcmV0dXJuIHNjb3BlRGVzY3JpcHRvci5zY29wZXMuaW5kZXhPZigndGFnLm9wZW4uanMnKSA+IC0xIGFuZFxuICAgICAgICAgICAgIHNjb3BlRGVzY3JpcHRvci5zY29wZXMuaW5kZXhPZignbWV0YS50YWcuYXR0cmlidXRlLW5hbWUuanMnKSA9PSAtMVxuXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgbGluZVN0YXJ0V2l0aEF0dHJpYnV0ZTogKGJ1ZmZlckxpbmUpIC0+XG4gICAgaWYgbWF0Y2ggPSBidWZmZXJMaW5lLm1hdGNoKC9cXFMvKVxuICAgICAgc2NvcGVEZXNjcmlwdG9yID0gQGVkaXRvci50b2tlbkZvckJ1ZmZlclBvc2l0aW9uKFtidWZmZXJSb3csIG1hdGNoLmluZGV4XSlcbiAgICAgIHJldHVybiBzY29wZURlc2NyaXB0b3Iuc2NvcGVzLmluZGV4T2YoJ21ldGEudGFnLmF0dHJpYnV0ZS1uYW1lLmpzJykgPiAtMVxuXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgbGluZVN0YXJ0c1dpdGhDbG9zaW5nVGFnOiAoYnVmZmVyUm93KSAtPlxuICAgIGlmIG1hdGNoID0gYnVmZmVyTGluZS5tYXRjaCgvXFxTLylcbiAgICAgIHNjb3BlRGVzY3JpcHRvciA9IEBlZGl0b3IudG9rZW5Gb3JCdWZmZXJQb3NpdGlvbihbYnVmZmVyUm93LCBtYXRjaC5pbmRleF0pXG4gICAgICByZXR1cm4gc2NvcGVEZXNjcmlwdG9yLnNjb3Blcy5pbmRleE9mKCd0YWcuY2xvc2VkLmpzJykgPiAtMVxuXG4gICAgcmV0dXJuIGZhbHNlXG5cbm1vZHVsZS5leHBvcnRzID0gVGFnTWFjaGVyO1xuIl19
