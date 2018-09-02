(function() {
  var $, Autocomplete, AutocompleteView;

  $ = require('atom-space-pen-views').$;

  AutocompleteView = require('../lib/autocomplete-view');

  Autocomplete = require('../lib/autocomplete');

  describe("Autocomplete", function() {
    var activationPromise, ref, workspaceElement;
    ref = [], workspaceElement = ref[0], activationPromise = ref[1];
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open('sample.js');
      });
      return runs(function() {
        workspaceElement = atom.views.getView(atom.workspace);
        jasmine.attachToDOM(workspaceElement);
        return activationPromise = atom.packages.activatePackage('autocomplete');
      });
    });
    describe("@activate()", function() {
      return it("activates autocomplete on all existing and future editors (but not on autocomplete's own mini editor)", function() {
        var leftEditorElement, ref1, rightEditorElement;
        spyOn(AutocompleteView.prototype, 'initialize').andCallThrough();
        expect(AutocompleteView.prototype.initialize).not.toHaveBeenCalled();
        atom.workspace.getActivePane().splitRight({
          copyActiveItem: true
        });
        ref1 = workspaceElement.querySelectorAll('atom-text-editor'), leftEditorElement = ref1[0], rightEditorElement = ref1[1];
        atom.commands.dispatch(leftEditorElement, 'autocomplete:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        waits();
        runs(function() {
          expect(leftEditorElement.querySelector('.autocomplete')).toExist();
          expect(rightEditorElement.querySelector('.autocomplete')).not.toExist();
          expect(AutocompleteView.prototype.initialize).toHaveBeenCalled();
          return atom.commands.dispatch(leftEditorElement.querySelector('.autocomplete'), 'core:cancel');
        });
        waits();
        runs(function() {
          expect(leftEditorElement.querySelector('.autocomplete')).not.toExist();
          return atom.commands.dispatch(rightEditorElement, 'autocomplete:toggle');
        });
        waits();
        return runs(function() {
          return expect(rightEditorElement.querySelector('.autocomplete')).toExist();
        });
      });
    });
    describe("@deactivate()", function() {
      return it("removes all autocomplete views and doesn't create new ones when new editors are opened", function() {
        var textEditorElement;
        textEditorElement = workspaceElement.querySelector('atom-text-editor');
        atom.commands.dispatch(textEditorElement, "autocomplete:toggle");
        waitsForPromise(function() {
          return activationPromise;
        });
        waits();
        runs(function() {
          expect(textEditorElement.querySelector('.autocomplete')).toExist();
          return atom.packages.deactivatePackage('autocomplete');
        });
        waits();
        runs(function() {
          expect(textEditorElement.querySelector('.autocomplete')).not.toExist();
          atom.workspace.getActivePane().splitRight({
            copyActiveItem: true
          });
          return atom.commands.dispatch(atom.views.getView(atom.workspace.getActivePaneItem()), "autocomplete:toggle");
        });
        waits();
        return runs(function() {
          return expect(workspaceElement.querySelector('.autocomplete')).not.toExist();
        });
      });
    });
    return describe("confirming an auto-completion", function() {
      return it("updates the buffer with the selected completion and restores focus", function() {
        var editor;
        editor = null;
        runs(function() {
          var editorElement;
          editor = atom.workspace.getActiveTextEditor();
          editorElement = atom.views.getView(editor);
          editorElement.setUpdatedSynchronously(false);
          editor.getBuffer().insert([10, 0], "extra:s:extra");
          editor.setCursorBufferPosition([10, 7]);
          return atom.commands.dispatch(document.activeElement, 'autocomplete:toggle');
        });
        waitsForPromise(function() {
          return activationPromise;
        });
        waits();
        runs(function() {
          expect(editor.lineTextForBufferRow(10)).toBe("extra:shift:extra");
          return atom.commands.dispatch(document.activeElement, 'core:confirm');
        });
        waits();
        return runs(function() {
          return expect(editor.lineTextForBufferRow(10)).toBe("extra:shift:extra");
        });
      });
    });
  });

  describe("AutocompleteView", function() {
    var autocomplete, editor, miniEditor, ref;
    ref = [], autocomplete = ref[0], editor = ref[1], miniEditor = ref[2];
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open('sample.js').then(function(anEditor) {
          return editor = anEditor;
        });
      });
      return runs(function() {
        autocomplete = new AutocompleteView(editor);
        return miniEditor = autocomplete.filterEditorView;
      });
    });
    describe("when the view is attached to the DOM", function() {
      return it("focuses the filter editor", function() {
        jasmine.attachToDOM(autocomplete.element);
        return expect(miniEditor).toHaveFocus();
      });
    });
    describe('::attach', function() {
      it("adds the autocomplete view as an overlay decoration", function() {
        var overlayDecorations;
        expect(editor.getOverlayDecorations().length).toBe(0);
        autocomplete.attach();
        overlayDecorations = editor.getOverlayDecorations();
        expect(overlayDecorations.length).toBe(1);
        return expect(overlayDecorations[0].properties.item).toBe(autocomplete);
      });
      describe("when the editor is empty", function() {
        return it("displays no matches", function() {
          var overlayDecorations;
          editor.setText('');
          expect(editor.getOverlayDecorations().length).toBe(0);
          autocomplete.attach();
          overlayDecorations = editor.getOverlayDecorations();
          expect(overlayDecorations.length).toBe(1);
          expect(overlayDecorations[0].properties.item).toBe(autocomplete);
          expect(editor.getText()).toBe('');
          return expect(autocomplete.list.find('li').length).toBe(0);
        });
      });
      describe("when no text is selected", function() {
        it('autocompletes word when there is only a prefix', function() {
          editor.getBuffer().insert([10, 0], "extra:s:extra");
          editor.setCursorBufferPosition([10, 7]);
          autocomplete.attach();
          expect(editor.lineTextForBufferRow(10)).toBe("extra:shift:extra");
          expect(editor.getCursorBufferPosition()).toEqual([10, 11]);
          expect(editor.getLastSelection().getBufferRange()).toEqual([[10, 7], [10, 11]]);
          expect(autocomplete.list.find('li').length).toBe(2);
          expect(autocomplete.list.find('li:eq(0)')).toHaveText('shift');
          return expect(autocomplete.list.find('li:eq(1)')).toHaveText('sort');
        });
        it('autocompletes word when there is only a suffix', function() {
          editor.getBuffer().insert([10, 0], "extra:n:extra");
          editor.setCursorBufferPosition([10, 6]);
          autocomplete.attach();
          expect(editor.lineTextForBufferRow(10)).toBe("extra:function:extra");
          expect(editor.getCursorBufferPosition()).toEqual([10, 13]);
          expect(editor.getLastSelection().getBufferRange()).toEqual([[10, 6], [10, 13]]);
          expect(autocomplete.list.find('li').length).toBe(2);
          expect(autocomplete.list.find('li:eq(0)')).toHaveText('function');
          return expect(autocomplete.list.find('li:eq(1)')).toHaveText('return');
        });
        it('autocompletes word when there is a single prefix and suffix match', function() {
          editor.getBuffer().insert([8, 43], "q");
          editor.setCursorBufferPosition([8, 44]);
          autocomplete.attach();
          expect(editor.lineTextForBufferRow(8)).toBe("    return sort(left).concat(pivot).concat(quicksort(right));");
          expect(editor.getCursorBufferPosition()).toEqual([8, 52]);
          expect(editor.getLastSelection().getBufferRange().isEmpty()).toBeTruthy();
          return expect(autocomplete.list.find('li').length).toBe(0);
        });
        it("shows all words when there is no prefix or suffix", function() {
          editor.setCursorBufferPosition([10, 0]);
          autocomplete.attach();
          expect(autocomplete.list.find('li:eq(0)')).toHaveText('0');
          expect(autocomplete.list.find('li:eq(1)')).toHaveText('1');
          return expect(autocomplete.list.find('li').length).toBe(22);
        });
        it("autocompletes word and replaces case of prefix with case of word", function() {
          editor.getBuffer().insert([10, 0], "extra:SO:extra");
          editor.setCursorBufferPosition([10, 8]);
          autocomplete.attach();
          expect(editor.lineTextForBufferRow(10)).toBe("extra:sort:extra");
          expect(editor.getCursorBufferPosition()).toEqual([10, 10]);
          return expect(editor.getLastSelection().isEmpty()).toBeTruthy();
        });
        it("allows the completion to be undone as a single operation", function() {
          editor.getBuffer().insert([10, 0], "extra:s:extra");
          editor.setCursorBufferPosition([10, 7]);
          autocomplete.attach();
          editor.undo();
          return expect(editor.lineTextForBufferRow(10)).toBe("extra:s:extra");
        });
        describe("when `autocomplete.includeCompletionsFromAllBuffers` is true", function() {
          return it("shows words from all open buffers", function() {
            atom.config.set('autocomplete.includeCompletionsFromAllBuffers', true);
            waitsForPromise(function() {
              return atom.workspace.open('sample.txt');
            });
            return runs(function() {
              editor.getBuffer().insert([10, 0], "extra:SO:extra");
              editor.setCursorBufferPosition([10, 8]);
              autocomplete.attach();
              expect(autocomplete.list.find('li').length).toBe(2);
              expect(autocomplete.list.find('li:eq(0)')).toHaveText('Some');
              return expect(autocomplete.list.find('li:eq(1)')).toHaveText('sort');
            });
          });
        });
        return describe('where many cursors are defined', function() {
          it('autocompletes word when there is only a prefix', function() {
            editor.getBuffer().insert([10, 0], "s:extra:s");
            editor.setSelectedBufferRanges([[[10, 1], [10, 1]], [[10, 9], [10, 9]]]);
            autocomplete.attach();
            expect(editor.lineTextForBufferRow(10)).toBe("shift:extra:shift");
            expect(editor.getCursorBufferPosition()).toEqual([10, 12]);
            expect(editor.getLastSelection().getBufferRange()).toEqual([[10, 8], [10, 12]]);
            expect(editor.getSelections().length).toEqual(2);
            expect(autocomplete.list.find('li').length).toBe(2);
            expect(autocomplete.list.find('li:eq(0)')).toHaveText('shift');
            return expect(autocomplete.list.find('li:eq(1)')).toHaveText('sort');
          });
          return describe('where text differs between cursors', function() {
            return it('does not display the autocomplete overlay', function() {
              editor.getBuffer().insert([10, 0], "s:extra:a");
              editor.setSelectedBufferRanges([[[10, 1], [10, 1]], [[10, 9], [10, 9]]]);
              autocomplete.attach();
              expect(editor.lineTextForBufferRow(10)).toBe("s:extra:a");
              expect(editor.getSelections().length).toEqual(2);
              expect(editor.getSelections()[0].getBufferRange()).toEqual([[10, 1], [10, 1]]);
              expect(editor.getSelections()[1].getBufferRange()).toEqual([[10, 9], [10, 9]]);
              return expect(editor.getOverlayDecorations().length).toBe(0);
            });
          });
        });
      });
      return describe("when text is selected", function() {
        it('autocompletes word when there is only a prefix', function() {
          editor.getBuffer().insert([10, 0], "extra:sort:extra");
          editor.setSelectedBufferRange([[10, 7], [10, 10]]);
          autocomplete.attach();
          expect(editor.lineTextForBufferRow(10)).toBe("extra:shift:extra");
          expect(editor.getCursorBufferPosition()).toEqual([10, 11]);
          expect(editor.getLastSelection().getBufferRange().isEmpty()).toBeTruthy();
          return expect(autocomplete.list.find('li').length).toBe(0);
        });
        it('autocompletes word when there is only a suffix', function() {
          editor.getBuffer().insert([10, 0], "extra:current:extra");
          editor.setSelectedBufferRange([[10, 6], [10, 12]]);
          autocomplete.attach();
          expect(editor.lineTextForBufferRow(10)).toBe("extra:concat:extra");
          expect(editor.getCursorBufferPosition()).toEqual([10, 11]);
          expect(editor.getLastSelection().getBufferRange()).toEqual([[10, 6], [10, 11]]);
          expect(autocomplete.list.find('li').length).toBe(7);
          return expect(autocomplete.list.find('li:contains(current)')).not.toExist();
        });
        it('autocompletes word when there is a prefix and suffix', function() {
          editor.setSelectedBufferRange([[5, 7], [5, 12]]);
          autocomplete.attach();
          expect(editor.lineTextForBufferRow(5)).toBe("      concat = items.shift();");
          expect(editor.getCursorBufferPosition()).toEqual([5, 12]);
          expect(editor.getLastSelection().getBufferRange().isEmpty()).toBeTruthy();
          return expect(autocomplete.list.find('li').length).toBe(0);
        });
        it('replaces selection with selected match, moves the cursor to the end of the match, and removes the autocomplete overlay', function() {
          editor.getBuffer().insert([10, 0], "extra:sort:extra");
          editor.setSelectedBufferRange([[10, 7], [10, 9]]);
          autocomplete.attach();
          expect(editor.lineTextForBufferRow(10)).toBe("extra:shift:extra");
          expect(editor.getCursorBufferPosition()).toEqual([10, 11]);
          expect(editor.getLastSelection().isEmpty()).toBeTruthy();
          return expect(editor.getOverlayDecorations().length).toBe(0);
        });
        return describe("when many ranges are selected", function() {
          return it('replaces selection with selected match, moves the cursor to the end of the match, and removes the autocomplete overlay', function() {
            editor.getBuffer().insert([10, 0], "sort:extra:sort");
            editor.setSelectedBufferRanges([[[10, 1], [10, 3]], [[10, 12], [10, 14]]]);
            autocomplete.attach();
            expect(editor.lineTextForBufferRow(10)).toBe("shift:extra:shift");
            expect(editor.getSelections().length).toEqual(2);
            return expect(editor.getOverlayDecorations().length).toBe(0);
          });
        });
      });
    });
    describe('core:confirm event', function() {
      return describe("where there are matches", function() {
        return describe("where there is no selection", function() {
          return it("closes the menu and moves the cursor to the end", function() {
            editor.getBuffer().insert([10, 0], "extra:sh:extra");
            editor.setCursorBufferPosition([10, 8]);
            autocomplete.attach();
            expect(editor.lineTextForBufferRow(10)).toBe("extra:shift:extra");
            expect(editor.getCursorBufferPosition()).toEqual([10, 11]);
            expect(editor.getLastSelection().isEmpty()).toBeTruthy();
            return expect(editor.getOverlayDecorations().length).toBe(0);
          });
        });
      });
    });
    describe('core:cancel event', function() {
      describe("when there are no matches", function() {
        return it("closes the menu without changing the buffer", function() {
          editor.getBuffer().insert([10, 0], "xxx");
          editor.setCursorBufferPosition([10, 3]);
          autocomplete.attach();
          expect(editor.getOverlayDecorations().length).toBe(1);
          expect(autocomplete.error).toHaveText("No matches found");
          atom.commands.dispatch(miniEditor.element, "core:cancel");
          expect(editor.lineTextForBufferRow(10)).toBe("xxx");
          expect(editor.getCursorBufferPosition()).toEqual([10, 3]);
          expect(editor.getLastSelection().isEmpty()).toBeTruthy();
          return expect(editor.getOverlayDecorations().length).toBe(0);
        });
      });
      it('does not replace selection, removes autocomplete view and returns focus to editor', function() {
        var originalSelectionBufferRange;
        editor.getBuffer().insert([10, 0], "extra:so:extra");
        editor.setSelectedBufferRange([[10, 7], [10, 8]]);
        originalSelectionBufferRange = editor.getLastSelection().getBufferRange();
        autocomplete.attach();
        expect(editor.getOverlayDecorations().length).toBe(1);
        editor.setCursorBufferPosition([0, 0]);
        atom.commands.dispatch(miniEditor.element, "core:cancel");
        expect(editor.lineTextForBufferRow(10)).toBe("extra:so:extra");
        expect(editor.getLastSelection().getBufferRange()).toEqual(originalSelectionBufferRange);
        return expect(editor.getOverlayDecorations().length).toBe(0);
      });
      it("does not clear out a previously confirmed selection when canceling with an empty list", function() {
        editor.getBuffer().insert([10, 0], "ort\n");
        editor.setCursorBufferPosition([10, 0]);
        autocomplete.attach();
        atom.commands.dispatch(miniEditor.element, "core:confirm");
        expect(editor.lineTextForBufferRow(10)).toBe('quicksort');
        editor.setCursorBufferPosition([11, 0]);
        autocomplete.attach();
        atom.commands.dispatch(miniEditor.element, "core:cancel");
        return expect(editor.lineTextForBufferRow(10)).toBe('quicksort');
      });
      it("restores the case of the prefix to the original value", function() {
        editor.getBuffer().insert([10, 0], "extra:S:extra");
        editor.setCursorBufferPosition([10, 7]);
        autocomplete.attach();
        expect(editor.lineTextForBufferRow(10)).toBe("extra:shift:extra");
        expect(editor.getCursorBufferPosition()).toEqual([10, 11]);
        atom.commands.dispatch(miniEditor.element, "core:cancel");
        atom.commands.dispatch(autocomplete.element, 'core:cancel');
        expect(editor.lineTextForBufferRow(10)).toBe("extra:S:extra");
        return expect(editor.getCursorBufferPosition()).toEqual([10, 7]);
      });
      return it("restores the original buffer contents even if there was an additional operation after autocomplete attached (regression)", function() {
        editor.getBuffer().insert([10, 0], "extra:s:extra");
        editor.setCursorBufferPosition([10, 7]);
        autocomplete.attach();
        editor.getBuffer().append('hi');
        expect(editor.lineTextForBufferRow(10)).toBe("extra:shift:extra");
        atom.commands.dispatch(autocomplete.element, 'core:cancel');
        expect(editor.lineTextForBufferRow(10)).toBe("extra:s:extra");
        editor.redo();
        return expect(editor.lineTextForBufferRow(10)).toBe("extra:s:extra");
      });
    });
    describe('move-up event', function() {
      return it("highlights the previous match and replaces the selection with it", function() {
        editor.getBuffer().insert([10, 0], "extra:t:extra");
        editor.setCursorBufferPosition([10, 6]);
        autocomplete.attach();
        atom.commands.dispatch(miniEditor.element, "core:move-up");
        expect(editor.lineTextForBufferRow(10)).toBe("extra:sort:extra");
        expect(autocomplete.find('li:eq(0)')).not.toHaveClass('selected');
        expect(autocomplete.find('li:eq(1)')).not.toHaveClass('selected');
        expect(autocomplete.find('li:eq(7)')).toHaveClass('selected');
        atom.commands.dispatch(miniEditor.element, "core:move-up");
        expect(editor.lineTextForBufferRow(10)).toBe("extra:shift:extra");
        expect(autocomplete.find('li:eq(0)')).not.toHaveClass('selected');
        expect(autocomplete.find('li:eq(7)')).not.toHaveClass('selected');
        return expect(autocomplete.find('li:eq(6)')).toHaveClass('selected');
      });
    });
    describe('move-down event', function() {
      return it("highlights the next match and replaces the selection with it", function() {
        editor.getBuffer().insert([10, 0], "extra:s:extra");
        editor.setCursorBufferPosition([10, 7]);
        autocomplete.attach();
        atom.commands.dispatch(miniEditor.element, "core:move-down");
        expect(editor.lineTextForBufferRow(10)).toBe("extra:sort:extra");
        expect(autocomplete.find('li:eq(0)')).not.toHaveClass('selected');
        expect(autocomplete.find('li:eq(1)')).toHaveClass('selected');
        atom.commands.dispatch(miniEditor.element, "core:move-down");
        expect(editor.lineTextForBufferRow(10)).toBe("extra:shift:extra");
        expect(autocomplete.find('li:eq(0)')).toHaveClass('selected');
        return expect(autocomplete.find('li:eq(1)')).not.toHaveClass('selected');
      });
    });
    describe("when a match is clicked in the match list", function() {
      return it("selects and confirms the match", function() {
        var matchToSelect;
        editor.getBuffer().insert([10, 0], "t");
        editor.setCursorBufferPosition([10, 0]);
        autocomplete.attach();
        matchToSelect = autocomplete.list.find('li:eq(1)');
        matchToSelect.mousedown();
        expect(matchToSelect).toMatchSelector('.selected');
        matchToSelect.mouseup();
        expect(autocomplete.parent()).not.toExist();
        return expect(editor.lineTextForBufferRow(10)).toBe(matchToSelect.text());
      });
    });
    describe("when the mini-editor receives keyboard input", function() {
      beforeEach(function() {
        return jasmine.attachToDOM(autocomplete.element);
      });
      describe("when text is removed from the mini-editor", function() {
        return it("reloads the match list based on the mini-editor's text", function() {
          editor.getBuffer().insert([10, 0], "t");
          editor.setCursorBufferPosition([10, 0]);
          autocomplete.attach();
          expect(autocomplete.list.find('li').length).toBe(8);
          miniEditor.getModel().insertText('c');
          window.advanceClock(autocomplete.inputThrottle);
          expect(autocomplete.list.find('li').length).toBe(3);
          miniEditor.getModel().backspace();
          window.advanceClock(autocomplete.inputThrottle);
          return expect(autocomplete.list.find('li').length).toBe(8);
        });
      });
      describe("when the text contains only word characters", function() {
        return it("narrows the list of completions with the fuzzy match algorithm", function() {
          editor.getBuffer().insert([10, 0], "t");
          editor.setCursorBufferPosition([10, 0]);
          autocomplete.attach();
          expect(autocomplete.list.find('li').length).toBe(8);
          miniEditor.getModel().insertText('i');
          window.advanceClock(autocomplete.inputThrottle);
          expect(autocomplete.list.find('li').length).toBe(4);
          expect(autocomplete.list.find('li:eq(0)')).toHaveText('pivot');
          expect(autocomplete.list.find('li:eq(0)')).toHaveClass('selected');
          expect(autocomplete.list.find('li:eq(1)')).toHaveText('right');
          expect(autocomplete.list.find('li:eq(2)')).toHaveText('shift');
          expect(autocomplete.list.find('li:eq(3)')).toHaveText('quicksort');
          expect(editor.lineTextForBufferRow(10)).toEqual('pivot');
          miniEditor.getModel().insertText('o');
          window.advanceClock(autocomplete.inputThrottle);
          expect(autocomplete.list.find('li').length).toBe(2);
          expect(autocomplete.list.find('li:eq(0)')).toHaveText('pivot');
          return expect(autocomplete.list.find('li:eq(1)')).toHaveText('quicksort');
        });
      });
      return describe("when a non-word character is typed in the mini-editor", function() {
        return it("immediately confirms the current completion choice and inserts that character into the buffer", function() {
          editor.getBuffer().insert([10, 0], "t");
          editor.setCursorBufferPosition([10, 0]);
          autocomplete.attach();
          expect(editor.getOverlayDecorations().length).toBe(1);
          miniEditor.getModel().insertText('iv');
          window.advanceClock(autocomplete.inputThrottle);
          expect(autocomplete.list.find('li:eq(0)')).toHaveText('pivot');
          miniEditor.getModel().insertText(' ');
          window.advanceClock(autocomplete.inputThrottle);
          expect(editor.getOverlayDecorations().length).toBe(0);
          return expect(editor.lineTextForBufferRow(10)).toEqual('pivot ');
        });
      });
    });
    describe(".cancel()", function() {
      return it("removes the overlay and clears the mini editor", function() {
        autocomplete.attach();
        miniEditor.setText('foo');
        autocomplete.cancel();
        expect(editor.getOverlayDecorations().length).toBe(0);
        return expect(miniEditor.getText()).toBe('');
      });
    });
    return it("sets the width of the view to be wide enough to contain the longest completion without scrolling", function() {
      editor.insertText('thisIsAReallyReallyReallyLongCompletion ');
      editor.moveToBottom();
      editor.insertNewline();
      editor.insertText('t');
      autocomplete.attach();
      jasmine.attachToDOM(autocomplete.element);
      return expect(autocomplete.list.prop('scrollWidth')).toBeLessThan(autocomplete.list.width() + 1);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdGhla2FybG85NS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUvc3BlYy9hdXRvY29tcGxldGUtc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLElBQUssT0FBQSxDQUFRLHNCQUFSOztFQUNOLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSwwQkFBUjs7RUFDbkIsWUFBQSxHQUFlLE9BQUEsQ0FBUSxxQkFBUjs7RUFFZixRQUFBLENBQVMsY0FBVCxFQUF5QixTQUFBO0FBQ3ZCLFFBQUE7SUFBQSxNQUF3QyxFQUF4QyxFQUFDLHlCQUFELEVBQW1CO0lBRW5CLFVBQUEsQ0FBVyxTQUFBO01BQ1QsZUFBQSxDQUFnQixTQUFBO2VBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFdBQXBCO01BRGMsQ0FBaEI7YUFHQSxJQUFBLENBQUssU0FBQTtRQUNILGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEI7UUFDbkIsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsZ0JBQXBCO2VBQ0EsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGNBQTlCO01BSGpCLENBQUw7SUFKUyxDQUFYO0lBU0EsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQTthQUN0QixFQUFBLENBQUcsdUdBQUgsRUFBNEcsU0FBQTtBQUMxRyxZQUFBO1FBQUEsS0FBQSxDQUFNLGdCQUFnQixDQUFDLFNBQXZCLEVBQWtDLFlBQWxDLENBQStDLENBQUMsY0FBaEQsQ0FBQTtRQUVBLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsVUFBbEMsQ0FBNkMsQ0FBQyxHQUFHLENBQUMsZ0JBQWxELENBQUE7UUFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLFVBQS9CLENBQTBD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QUFILEVBQXVHLFNBQUE7TUFDckcsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsMENBQWxCO01BQ0EsTUFBTSxDQUFDLFlBQVAsQ0FBQTtNQUNBLE1BQU0sQ0FBQyxhQUFQLENBQUE7TUFDQSxNQUFNLENBQUMsVUFBUCxDQUFrQixHQUFsQjtNQUNBLFlBQVksQ0FBQyxNQUFiLENBQUE7TUFDQSxPQUFPLENBQUMsV0FBUixDQUFvQixZQUFZLENBQUMsT0FBakM7YUFDQSxNQUFBLENBQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFsQixDQUF1QixhQUF2QixDQUFQLENBQTZDLENBQUMsWUFBOUMsQ0FBMkQsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFsQixDQUFBLENBQUEsR0FBNEIsQ0FBdkY7SUFQcUcsQ0FBdkc7RUEvWTJCLENBQTdCO0FBckdBIiwic291cmNlc0NvbnRlbnQiOlsieyR9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5BdXRvY29tcGxldGVWaWV3ID0gcmVxdWlyZSAnLi4vbGliL2F1dG9jb21wbGV0ZS12aWV3J1xuQXV0b2NvbXBsZXRlID0gcmVxdWlyZSAnLi4vbGliL2F1dG9jb21wbGV0ZSdcblxuZGVzY3JpYmUgXCJBdXRvY29tcGxldGVcIiwgLT5cbiAgW3dvcmtzcGFjZUVsZW1lbnQsIGFjdGl2YXRpb25Qcm9taXNlXSA9IFtdXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbignc2FtcGxlLmpzJylcblxuICAgIHJ1bnMgLT5cbiAgICAgIHdvcmtzcGFjZUVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpXG4gICAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHdvcmtzcGFjZUVsZW1lbnQpXG4gICAgICBhY3RpdmF0aW9uUHJvbWlzZSA9IGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdhdXRvY29tcGxldGUnKVxuXG4gIGRlc2NyaWJlIFwiQGFjdGl2YXRlKClcIiwgLT5cbiAgICBpdCBcImFjdGl2YXRlcyBhdXRvY29tcGxldGUgb24gYWxsIGV4aXN0aW5nIGFuZCBmdXR1cmUgZWRpdG9ycyAoYnV0IG5vdCBvbiBhdXRvY29tcGxldGUncyBvd24gbWluaSBlZGl0b3IpXCIsIC0+XG4gICAgICBzcHlPbihBdXRvY29tcGxldGVWaWV3LnByb3RvdHlwZSwgJ2luaXRpYWxpemUnKS5hbmRDYWxsVGhyb3VnaCgpXG5cbiAgICAgIGV4cGVjdChBdXRvY29tcGxldGVWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuc3BsaXRSaWdodChjb3B5QWN0aXZlSXRlbTogdHJ1ZSlcblxuICAgICAgW2xlZnRFZGl0b3JFbGVtZW50LCByaWdodEVkaXRvckVsZW1lbnRdID0gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdhdG9tLXRleHQtZWRpdG9yJylcblxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCBsZWZ0RWRpdG9yRWxlbWVudCwgJ2F1dG9jb21wbGV0ZTp0b2dnbGUnXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBhY3RpdmF0aW9uUHJvbWlzZVxuXG4gICAgICB3YWl0cygpXG5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGxlZnRFZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hdXRvY29tcGxldGUnKSkudG9FeGlzdCgpXG4gICAgICAgIGV4cGVjdChyaWdodEVkaXRvckVsZW1lbnQucXVlcnlTZWxlY3RvcignLmF1dG9jb21wbGV0ZScpKS5ub3QudG9FeGlzdCgpXG4gICAgICAgIGV4cGVjdChBdXRvY29tcGxldGVWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplKS50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoIGxlZnRFZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hdXRvY29tcGxldGUnKSwgJ2NvcmU6Y2FuY2VsJ1xuXG4gICAgICB3YWl0cygpXG5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGxlZnRFZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hdXRvY29tcGxldGUnKSkubm90LnRvRXhpc3QoKVxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoIHJpZ2h0RWRpdG9yRWxlbWVudCwgJ2F1dG9jb21wbGV0ZTp0b2dnbGUnXG5cbiAgICAgIHdhaXRzKClcblxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QocmlnaHRFZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hdXRvY29tcGxldGUnKSkudG9FeGlzdCgpXG5cbiAgZGVzY3JpYmUgXCJAZGVhY3RpdmF0ZSgpXCIsIC0+XG4gICAgaXQgXCJyZW1vdmVzIGFsbCBhdXRvY29tcGxldGUgdmlld3MgYW5kIGRvZXNuJ3QgY3JlYXRlIG5ldyBvbmVzIHdoZW4gbmV3IGVkaXRvcnMgYXJlIG9wZW5lZFwiLCAtPlxuICAgICAgdGV4dEVkaXRvckVsZW1lbnQgPSB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2F0b20tdGV4dC1lZGl0b3InKVxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCB0ZXh0RWRpdG9yRWxlbWVudCwgXCJhdXRvY29tcGxldGU6dG9nZ2xlXCJcblxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGFjdGl2YXRpb25Qcm9taXNlXG5cbiAgICAgIHdhaXRzKClcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KHRleHRFZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hdXRvY29tcGxldGUnKSkudG9FeGlzdCgpXG4gICAgICAgIGF0b20ucGFja2FnZXMuZGVhY3RpdmF0ZVBhY2thZ2UoJ2F1dG9jb21wbGV0ZScpXG5cbiAgICAgIHdhaXRzKClcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KHRleHRFZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hdXRvY29tcGxldGUnKSkubm90LnRvRXhpc3QoKVxuXG4gICAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKS5zcGxpdFJpZ2h0KGNvcHlBY3RpdmVJdGVtOiB0cnVlKVxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoIGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpKSwgXCJhdXRvY29tcGxldGU6dG9nZ2xlXCJcblxuICAgICAgd2FpdHMoKVxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYXV0b2NvbXBsZXRlJykpLm5vdC50b0V4aXN0KClcblxuICBkZXNjcmliZSBcImNvbmZpcm1pbmcgYW4gYXV0by1jb21wbGV0aW9uXCIsIC0+XG4gICAgaXQgXCJ1cGRhdGVzIHRoZSBidWZmZXIgd2l0aCB0aGUgc2VsZWN0ZWQgY29tcGxldGlvbiBhbmQgcmVzdG9yZXMgZm9jdXNcIiwgLT5cbiAgICAgIGVkaXRvciA9IG51bGxcblxuICAgICAgcnVucyAtPlxuICAgICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgZWRpdG9yRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpXG4gICAgICAgIGVkaXRvckVsZW1lbnQuc2V0VXBkYXRlZFN5bmNocm9ub3VzbHkoZmFsc2UpXG5cbiAgICAgICAgZWRpdG9yLmdldEJ1ZmZlcigpLmluc2VydChbMTAsMF0gLFwiZXh0cmE6czpleHRyYVwiKVxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzEwLDddKVxuXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggZG9jdW1lbnQuYWN0aXZlRWxlbWVudCwgJ2F1dG9jb21wbGV0ZTp0b2dnbGUnXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhY3RpdmF0aW9uUHJvbWlzZVxuICAgICAgd2FpdHMoKVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coMTApKS50b0JlIFwiZXh0cmE6c2hpZnQ6ZXh0cmFcIlxuXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggZG9jdW1lbnQuYWN0aXZlRWxlbWVudCwgJ2NvcmU6Y29uZmlybSdcblxuICAgICAgd2FpdHMoKVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coMTApKS50b0JlIFwiZXh0cmE6c2hpZnQ6ZXh0cmFcIlxuXG5kZXNjcmliZSBcIkF1dG9jb21wbGV0ZVZpZXdcIiwgLT5cbiAgW2F1dG9jb21wbGV0ZSwgZWRpdG9yLCBtaW5pRWRpdG9yXSA9IFtdXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbignc2FtcGxlLmpzJykudGhlbiAoYW5FZGl0b3IpIC0+IGVkaXRvciA9IGFuRWRpdG9yXG5cbiAgICBydW5zIC0+XG4gICAgICBhdXRvY29tcGxldGUgPSBuZXcgQXV0b2NvbXBsZXRlVmlldyhlZGl0b3IpXG4gICAgICBtaW5pRWRpdG9yID0gYXV0b2NvbXBsZXRlLmZpbHRlckVkaXRvclZpZXdcblxuICBkZXNjcmliZSBcIndoZW4gdGhlIHZpZXcgaXMgYXR0YWNoZWQgdG8gdGhlIERPTVwiLCAtPlxuICAgIGl0IFwiZm9jdXNlcyB0aGUgZmlsdGVyIGVkaXRvclwiLCAtPlxuICAgICAgamFzbWluZS5hdHRhY2hUb0RPTShhdXRvY29tcGxldGUuZWxlbWVudClcbiAgICAgIGV4cGVjdChtaW5pRWRpdG9yKS50b0hhdmVGb2N1cygpXG5cbiAgZGVzY3JpYmUgJzo6YXR0YWNoJywgLT5cbiAgICBpdCBcImFkZHMgdGhlIGF1dG9jb21wbGV0ZSB2aWV3IGFzIGFuIG92ZXJsYXkgZGVjb3JhdGlvblwiLCAtPlxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRPdmVybGF5RGVjb3JhdGlvbnMoKS5sZW5ndGgpLnRvQmUgMFxuICAgICAgYXV0b2NvbXBsZXRlLmF0dGFjaCgpXG4gICAgICBvdmVybGF5RGVjb3JhdGlvbnMgPSBlZGl0b3IuZ2V0T3ZlcmxheURlY29yYXRpb25zKClcbiAgICAgIGV4cGVjdChvdmVybGF5RGVjb3JhdGlvbnMubGVuZ3RoKS50b0JlIDFcbiAgICAgIGV4cGVjdChvdmVybGF5RGVjb3JhdGlvbnNbMF0ucHJvcGVydGllcy5pdGVtKS50b0JlIGF1dG9jb21wbGV0ZVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIHRoZSBlZGl0b3IgaXMgZW1wdHlcIiwgLT5cbiAgICAgIGl0IFwiZGlzcGxheXMgbm8gbWF0Y2hlc1wiLCAtPlxuICAgICAgICBlZGl0b3Iuc2V0VGV4dCgnJylcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRPdmVybGF5RGVjb3JhdGlvbnMoKS5sZW5ndGgpLnRvQmUgMFxuXG4gICAgICAgIGF1dG9jb21wbGV0ZS5hdHRhY2goKVxuXG4gICAgICAgIG92ZXJsYXlEZWNvcmF0aW9ucyA9IGVkaXRvci5nZXRPdmVybGF5RGVjb3JhdGlvbnMoKVxuICAgICAgICBleHBlY3Qob3ZlcmxheURlY29yYXRpb25zLmxlbmd0aCkudG9CZSAxXG4gICAgICAgIGV4cGVjdChvdmVybGF5RGVjb3JhdGlvbnNbMF0ucHJvcGVydGllcy5pdGVtKS50b0JlIGF1dG9jb21wbGV0ZVxuXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICcnXG4gICAgICAgIGV4cGVjdChhdXRvY29tcGxldGUubGlzdC5maW5kKCdsaScpLmxlbmd0aCkudG9CZSAwXG5cbiAgICBkZXNjcmliZSBcIndoZW4gbm8gdGV4dCBpcyBzZWxlY3RlZFwiLCAtPlxuICAgICAgaXQgJ2F1dG9jb21wbGV0ZXMgd29yZCB3aGVuIHRoZXJlIGlzIG9ubHkgYSBwcmVmaXgnLCAtPlxuICAgICAgICBlZGl0b3IuZ2V0QnVmZmVyKCkuaW5zZXJ0KFsxMCwwXSAsXCJleHRyYTpzOmV4dHJhXCIpXG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMTAsN10pXG4gICAgICAgIGF1dG9jb21wbGV0ZS5hdHRhY2goKVxuXG4gICAgICAgIGV4cGVjdChlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coMTApKS50b0JlIFwiZXh0cmE6c2hpZnQ6ZXh0cmFcIlxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwgWzEwLDExXVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldExhc3RTZWxlY3Rpb24oKS5nZXRCdWZmZXJSYW5nZSgpKS50b0VxdWFsIFtbMTAsN10sIFsxMCwxMV1dXG5cbiAgICAgICAgZXhwZWN0KGF1dG9jb21wbGV0ZS5saXN0LmZpbmQoJ2xpJykubGVuZ3RoKS50b0JlIDJcbiAgICAgICAgZXhwZWN0KGF1dG9jb21wbGV0ZS5saXN0LmZpbmQoJ2xpOmVxKDApJykpLnRvSGF2ZVRleHQoJ3NoaWZ0JylcbiAgICAgICAgZXhwZWN0KGF1dG9jb21wbGV0ZS5saXN0LmZpbmQoJ2xpOmVxKDEpJykpLnRvSGF2ZVRleHQoJ3NvcnQnKVxuXG4gICAgICBpdCAnYXV0b2NvbXBsZXRlcyB3b3JkIHdoZW4gdGhlcmUgaXMgb25seSBhIHN1ZmZpeCcsIC0+XG4gICAgICAgIGVkaXRvci5nZXRCdWZmZXIoKS5pbnNlcnQoWzEwLDBdICxcImV4dHJhOm46ZXh0cmFcIilcbiAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFsxMCw2XSlcbiAgICAgICAgYXV0b2NvbXBsZXRlLmF0dGFjaCgpXG5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdygxMCkpLnRvQmUgXCJleHRyYTpmdW5jdGlvbjpleHRyYVwiXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbCBbMTAsMTNdXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0TGFzdFNlbGVjdGlvbigpLmdldEJ1ZmZlclJhbmdlKCkpLnRvRXF1YWwgW1sxMCw2XSwgWzEwLDEzXV1cblxuICAgICAgICBleHBlY3QoYXV0b2NvbXBsZXRlLmxpc3QuZmluZCgnbGknKS5sZW5ndGgpLnRvQmUgMlxuICAgICAgICBleHBlY3QoYXV0b2NvbXBsZXRlLmxpc3QuZmluZCgnbGk6ZXEoMCknKSkudG9IYXZlVGV4dCgnZnVuY3Rpb24nKVxuICAgICAgICBleHBlY3QoYXV0b2NvbXBsZXRlLmxpc3QuZmluZCgnbGk6ZXEoMSknKSkudG9IYXZlVGV4dCgncmV0dXJuJylcblxuICAgICAgaXQgJ2F1dG9jb21wbGV0ZXMgd29yZCB3aGVuIHRoZXJlIGlzIGEgc2luZ2xlIHByZWZpeCBhbmQgc3VmZml4IG1hdGNoJywgLT5cbiAgICAgICAgZWRpdG9yLmdldEJ1ZmZlcigpLmluc2VydChbOCw0M10gLFwicVwiKVxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzgsNDRdKVxuICAgICAgICBhdXRvY29tcGxldGUuYXR0YWNoKClcblxuICAgICAgICBleHBlY3QoZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KDgpKS50b0JlIFwiICAgIHJldHVybiBzb3J0KGxlZnQpLmNvbmNhdChwaXZvdCkuY29uY2F0KHF1aWNrc29ydChyaWdodCkpO1wiXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbCBbOCw1Ml1cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRMYXN0U2VsZWN0aW9uKCkuZ2V0QnVmZmVyUmFuZ2UoKS5pc0VtcHR5KCkpLnRvQmVUcnV0aHkoKVxuXG4gICAgICAgIGV4cGVjdChhdXRvY29tcGxldGUubGlzdC5maW5kKCdsaScpLmxlbmd0aCkudG9CZSAwXG5cbiAgICAgIGl0IFwic2hvd3MgYWxsIHdvcmRzIHdoZW4gdGhlcmUgaXMgbm8gcHJlZml4IG9yIHN1ZmZpeFwiLCAtPlxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzEwLCAwXSlcbiAgICAgICAgYXV0b2NvbXBsZXRlLmF0dGFjaCgpXG5cbiAgICAgICAgZXhwZWN0KGF1dG9jb21wbGV0ZS5saXN0LmZpbmQoJ2xpOmVxKDApJykpLnRvSGF2ZVRleHQoJzAnKVxuICAgICAgICBleHBlY3QoYXV0b2NvbXBsZXRlLmxpc3QuZmluZCgnbGk6ZXEoMSknKSkudG9IYXZlVGV4dCgnMScpXG4gICAgICAgIGV4cGVjdChhdXRvY29tcGxldGUubGlzdC5maW5kKCdsaScpLmxlbmd0aCkudG9CZSAyMlxuXG4gICAgICBpdCBcImF1dG9jb21wbGV0ZXMgd29yZCBhbmQgcmVwbGFjZXMgY2FzZSBvZiBwcmVmaXggd2l0aCBjYXNlIG9mIHdvcmRcIiwgLT5cbiAgICAgICAgZWRpdG9yLmdldEJ1ZmZlcigpLmluc2VydChbMTAsMF0gLFwiZXh0cmE6U086ZXh0cmFcIilcbiAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFsxMCw4XSlcbiAgICAgICAgYXV0b2NvbXBsZXRlLmF0dGFjaCgpXG5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdygxMCkpLnRvQmUgXCJleHRyYTpzb3J0OmV4dHJhXCJcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFsxMCwxMF1cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRMYXN0U2VsZWN0aW9uKCkuaXNFbXB0eSgpKS50b0JlVHJ1dGh5KClcblxuICAgICAgaXQgXCJhbGxvd3MgdGhlIGNvbXBsZXRpb24gdG8gYmUgdW5kb25lIGFzIGEgc2luZ2xlIG9wZXJhdGlvblwiLCAtPlxuICAgICAgICBlZGl0b3IuZ2V0QnVmZmVyKCkuaW5zZXJ0KFsxMCwwXSAsXCJleHRyYTpzOmV4dHJhXCIpXG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMTAsN10pXG4gICAgICAgIGF1dG9jb21wbGV0ZS5hdHRhY2goKVxuXG4gICAgICAgIGVkaXRvci51bmRvKClcblxuICAgICAgICBleHBlY3QoZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KDEwKSkudG9CZSBcImV4dHJhOnM6ZXh0cmFcIlxuXG4gICAgICBkZXNjcmliZSBcIndoZW4gYGF1dG9jb21wbGV0ZS5pbmNsdWRlQ29tcGxldGlvbnNGcm9tQWxsQnVmZmVyc2AgaXMgdHJ1ZVwiLCAtPlxuICAgICAgICBpdCBcInNob3dzIHdvcmRzIGZyb20gYWxsIG9wZW4gYnVmZmVyc1wiLCAtPlxuICAgICAgICAgIGF0b20uY29uZmlnLnNldCgnYXV0b2NvbXBsZXRlLmluY2x1ZGVDb21wbGV0aW9uc0Zyb21BbGxCdWZmZXJzJywgdHJ1ZSlcblxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbignc2FtcGxlLnR4dCcpXG5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBlZGl0b3IuZ2V0QnVmZmVyKCkuaW5zZXJ0KFsxMCwwXSAsXCJleHRyYTpTTzpleHRyYVwiKVxuICAgICAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFsxMCw4XSlcbiAgICAgICAgICAgIGF1dG9jb21wbGV0ZS5hdHRhY2goKVxuXG4gICAgICAgICAgICBleHBlY3QoYXV0b2NvbXBsZXRlLmxpc3QuZmluZCgnbGknKS5sZW5ndGgpLnRvQmUgMlxuICAgICAgICAgICAgZXhwZWN0KGF1dG9jb21wbGV0ZS5saXN0LmZpbmQoJ2xpOmVxKDApJykpLnRvSGF2ZVRleHQoJ1NvbWUnKVxuICAgICAgICAgICAgZXhwZWN0KGF1dG9jb21wbGV0ZS5saXN0LmZpbmQoJ2xpOmVxKDEpJykpLnRvSGF2ZVRleHQoJ3NvcnQnKVxuXG4gICAgICBkZXNjcmliZSAnd2hlcmUgbWFueSBjdXJzb3JzIGFyZSBkZWZpbmVkJywgLT5cbiAgICAgICAgaXQgJ2F1dG9jb21wbGV0ZXMgd29yZCB3aGVuIHRoZXJlIGlzIG9ubHkgYSBwcmVmaXgnLCAtPlxuICAgICAgICAgIGVkaXRvci5nZXRCdWZmZXIoKS5pbnNlcnQoWzEwLDBdICxcInM6ZXh0cmE6c1wiKVxuICAgICAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcyhbW1sxMCwxXSxbMTAsMV1dLCBbWzEwLDldLFsxMCw5XV1dKVxuICAgICAgICAgIGF1dG9jb21wbGV0ZS5hdHRhY2goKVxuXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdygxMCkpLnRvQmUgXCJzaGlmdDpleHRyYTpzaGlmdFwiXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFsxMCwxMl1cbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldExhc3RTZWxlY3Rpb24oKS5nZXRCdWZmZXJSYW5nZSgpKS50b0VxdWFsIFtbMTAsOF0sIFsxMCwxMl1dXG5cbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFNlbGVjdGlvbnMoKS5sZW5ndGgpLnRvRXF1YWwoMilcblxuICAgICAgICAgIGV4cGVjdChhdXRvY29tcGxldGUubGlzdC5maW5kKCdsaScpLmxlbmd0aCkudG9CZSAyXG4gICAgICAgICAgZXhwZWN0KGF1dG9jb21wbGV0ZS5saXN0LmZpbmQoJ2xpOmVxKDApJykpLnRvSGF2ZVRleHQoJ3NoaWZ0JylcbiAgICAgICAgICBleHBlY3QoYXV0b2NvbXBsZXRlLmxpc3QuZmluZCgnbGk6ZXEoMSknKSkudG9IYXZlVGV4dCgnc29ydCcpXG5cbiAgICAgICAgZGVzY3JpYmUgJ3doZXJlIHRleHQgZGlmZmVycyBiZXR3ZWVuIGN1cnNvcnMnLCAtPlxuICAgICAgICAgIGl0ICdkb2VzIG5vdCBkaXNwbGF5IHRoZSBhdXRvY29tcGxldGUgb3ZlcmxheScsIC0+XG4gICAgICAgICAgICBlZGl0b3IuZ2V0QnVmZmVyKCkuaW5zZXJ0KFsxMCwwXSAsXCJzOmV4dHJhOmFcIilcbiAgICAgICAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcyhbW1sxMCwxXSxbMTAsMV1dLCBbWzEwLDldLFsxMCw5XV1dKVxuICAgICAgICAgICAgYXV0b2NvbXBsZXRlLmF0dGFjaCgpXG5cbiAgICAgICAgICAgIGV4cGVjdChlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coMTApKS50b0JlIFwiczpleHRyYTphXCJcbiAgICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0U2VsZWN0aW9ucygpLmxlbmd0aCkudG9FcXVhbCgyKVxuICAgICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3Rpb25zKClbMF0uZ2V0QnVmZmVyUmFuZ2UoKSkudG9FcXVhbCBbWzEwLDFdLCBbMTAsMV1dXG4gICAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFNlbGVjdGlvbnMoKVsxXS5nZXRCdWZmZXJSYW5nZSgpKS50b0VxdWFsIFtbMTAsOV0sIFsxMCw5XV1cblxuICAgICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRPdmVybGF5RGVjb3JhdGlvbnMoKS5sZW5ndGgpLnRvQmUgMFxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIHRleHQgaXMgc2VsZWN0ZWRcIiwgLT5cbiAgICAgIGl0ICdhdXRvY29tcGxldGVzIHdvcmQgd2hlbiB0aGVyZSBpcyBvbmx5IGEgcHJlZml4JywgLT5cbiAgICAgICAgZWRpdG9yLmdldEJ1ZmZlcigpLmluc2VydChbMTAsMF0gLFwiZXh0cmE6c29ydDpleHRyYVwiKVxuICAgICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZSBbWzEwLDddLCBbMTAsMTBdXVxuICAgICAgICBhdXRvY29tcGxldGUuYXR0YWNoKClcblxuICAgICAgICBleHBlY3QoZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KDEwKSkudG9CZSBcImV4dHJhOnNoaWZ0OmV4dHJhXCJcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFsxMCwxMV1cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRMYXN0U2VsZWN0aW9uKCkuZ2V0QnVmZmVyUmFuZ2UoKS5pc0VtcHR5KCkpLnRvQmVUcnV0aHkoKVxuXG4gICAgICAgIGV4cGVjdChhdXRvY29tcGxldGUubGlzdC5maW5kKCdsaScpLmxlbmd0aCkudG9CZSAwXG5cbiAgICAgIGl0ICdhdXRvY29tcGxldGVzIHdvcmQgd2hlbiB0aGVyZSBpcyBvbmx5IGEgc3VmZml4JywgLT5cbiAgICAgICAgZWRpdG9yLmdldEJ1ZmZlcigpLmluc2VydChbMTAsMF0gLFwiZXh0cmE6Y3VycmVudDpleHRyYVwiKVxuICAgICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZSBbWzEwLDZdLFsxMCwxMl1dXG4gICAgICAgIGF1dG9jb21wbGV0ZS5hdHRhY2goKVxuXG4gICAgICAgIGV4cGVjdChlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coMTApKS50b0JlIFwiZXh0cmE6Y29uY2F0OmV4dHJhXCJcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFsxMCwxMV1cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRMYXN0U2VsZWN0aW9uKCkuZ2V0QnVmZmVyUmFuZ2UoKSkudG9FcXVhbCBbWzEwLDZdLFsxMCwxMV1dXG5cbiAgICAgICAgZXhwZWN0KGF1dG9jb21wbGV0ZS5saXN0LmZpbmQoJ2xpJykubGVuZ3RoKS50b0JlIDdcbiAgICAgICAgZXhwZWN0KGF1dG9jb21wbGV0ZS5saXN0LmZpbmQoJ2xpOmNvbnRhaW5zKGN1cnJlbnQpJykpLm5vdC50b0V4aXN0KClcblxuICAgICAgaXQgJ2F1dG9jb21wbGV0ZXMgd29yZCB3aGVuIHRoZXJlIGlzIGEgcHJlZml4IGFuZCBzdWZmaXgnLCAtPlxuICAgICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZSBbWzUsN10sWzUsMTJdXVxuICAgICAgICBhdXRvY29tcGxldGUuYXR0YWNoKClcblxuICAgICAgICBleHBlY3QoZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KDUpKS50b0JlIFwiICAgICAgY29uY2F0ID0gaXRlbXMuc2hpZnQoKTtcIlxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwgWzUsMTJdXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0TGFzdFNlbGVjdGlvbigpLmdldEJ1ZmZlclJhbmdlKCkuaXNFbXB0eSgpKS50b0JlVHJ1dGh5KClcblxuICAgICAgICBleHBlY3QoYXV0b2NvbXBsZXRlLmxpc3QuZmluZCgnbGknKS5sZW5ndGgpLnRvQmUgMFxuXG4gICAgICBpdCAncmVwbGFjZXMgc2VsZWN0aW9uIHdpdGggc2VsZWN0ZWQgbWF0Y2gsIG1vdmVzIHRoZSBjdXJzb3IgdG8gdGhlIGVuZCBvZiB0aGUgbWF0Y2gsIGFuZCByZW1vdmVzIHRoZSBhdXRvY29tcGxldGUgb3ZlcmxheScsIC0+XG4gICAgICAgIGVkaXRvci5nZXRCdWZmZXIoKS5pbnNlcnQoWzEwLDBdICxcImV4dHJhOnNvcnQ6ZXh0cmFcIilcbiAgICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UgW1sxMCw3XSwgWzEwLDldXVxuICAgICAgICBhdXRvY29tcGxldGUuYXR0YWNoKClcblxuICAgICAgICBleHBlY3QoZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KDEwKSkudG9CZSBcImV4dHJhOnNoaWZ0OmV4dHJhXCJcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFsxMCwxMV1cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRMYXN0U2VsZWN0aW9uKCkuaXNFbXB0eSgpKS50b0JlVHJ1dGh5KClcblxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldE92ZXJsYXlEZWNvcmF0aW9ucygpLmxlbmd0aCkudG9CZSAwXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiBtYW55IHJhbmdlcyBhcmUgc2VsZWN0ZWRcIiwgLT5cbiAgICAgICAgaXQgJ3JlcGxhY2VzIHNlbGVjdGlvbiB3aXRoIHNlbGVjdGVkIG1hdGNoLCBtb3ZlcyB0aGUgY3Vyc29yIHRvIHRoZSBlbmQgb2YgdGhlIG1hdGNoLCBhbmQgcmVtb3ZlcyB0aGUgYXV0b2NvbXBsZXRlIG92ZXJsYXknLCAtPlxuICAgICAgICAgIGVkaXRvci5nZXRCdWZmZXIoKS5pbnNlcnQoWzEwLDBdICxcInNvcnQ6ZXh0cmE6c29ydFwiKVxuICAgICAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcyBbW1sxMCwxXSwgWzEwLDNdXSwgW1sxMCwxMl0sIFsxMCwxNF1dXVxuICAgICAgICAgIGF1dG9jb21wbGV0ZS5hdHRhY2goKVxuXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdygxMCkpLnRvQmUgXCJzaGlmdDpleHRyYTpzaGlmdFwiXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRTZWxlY3Rpb25zKCkubGVuZ3RoKS50b0VxdWFsKDIpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRPdmVybGF5RGVjb3JhdGlvbnMoKS5sZW5ndGgpLnRvQmUgMFxuXG4gIGRlc2NyaWJlICdjb3JlOmNvbmZpcm0gZXZlbnQnLCAtPlxuICAgIGRlc2NyaWJlIFwid2hlcmUgdGhlcmUgYXJlIG1hdGNoZXNcIiwgLT5cbiAgICAgIGRlc2NyaWJlIFwid2hlcmUgdGhlcmUgaXMgbm8gc2VsZWN0aW9uXCIsIC0+XG4gICAgICAgIGl0IFwiY2xvc2VzIHRoZSBtZW51IGFuZCBtb3ZlcyB0aGUgY3Vyc29yIHRvIHRoZSBlbmRcIiwgLT5cbiAgICAgICAgICBlZGl0b3IuZ2V0QnVmZmVyKCkuaW5zZXJ0KFsxMCwwXSAsXCJleHRyYTpzaDpleHRyYVwiKVxuICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMTAsOF0pXG4gICAgICAgICAgYXV0b2NvbXBsZXRlLmF0dGFjaCgpXG5cbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KDEwKSkudG9CZSBcImV4dHJhOnNoaWZ0OmV4dHJhXCJcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwgWzEwLDExXVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0TGFzdFNlbGVjdGlvbigpLmlzRW1wdHkoKSkudG9CZVRydXRoeSgpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRPdmVybGF5RGVjb3JhdGlvbnMoKS5sZW5ndGgpLnRvQmUgMFxuXG4gIGRlc2NyaWJlICdjb3JlOmNhbmNlbCBldmVudCcsIC0+XG4gICAgZGVzY3JpYmUgXCJ3aGVuIHRoZXJlIGFyZSBubyBtYXRjaGVzXCIsIC0+XG4gICAgICBpdCBcImNsb3NlcyB0aGUgbWVudSB3aXRob3V0IGNoYW5naW5nIHRoZSBidWZmZXJcIiwgLT5cbiAgICAgICAgZWRpdG9yLmdldEJ1ZmZlcigpLmluc2VydChbMTAsMF0gLFwieHh4XCIpXG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbiBbMTAsIDNdXG4gICAgICAgIGF1dG9jb21wbGV0ZS5hdHRhY2goKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldE92ZXJsYXlEZWNvcmF0aW9ucygpLmxlbmd0aCkudG9CZSAxXG4gICAgICAgIGV4cGVjdChhdXRvY29tcGxldGUuZXJyb3IpLnRvSGF2ZVRleHQgXCJObyBtYXRjaGVzIGZvdW5kXCJcblxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoIG1pbmlFZGl0b3IuZWxlbWVudCwgXCJjb3JlOmNhbmNlbFwiXG5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdygxMCkpLnRvQmUgXCJ4eHhcIlxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwgWzEwLDNdXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0TGFzdFNlbGVjdGlvbigpLmlzRW1wdHkoKSkudG9CZVRydXRoeSgpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0T3ZlcmxheURlY29yYXRpb25zKCkubGVuZ3RoKS50b0JlIDBcblxuICAgIGl0ICdkb2VzIG5vdCByZXBsYWNlIHNlbGVjdGlvbiwgcmVtb3ZlcyBhdXRvY29tcGxldGUgdmlldyBhbmQgcmV0dXJucyBmb2N1cyB0byBlZGl0b3InLCAtPlxuICAgICAgZWRpdG9yLmdldEJ1ZmZlcigpLmluc2VydChbMTAsMF0gLFwiZXh0cmE6c286ZXh0cmFcIilcbiAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlIFtbMTAsN10sIFsxMCw4XV1cbiAgICAgIG9yaWdpbmFsU2VsZWN0aW9uQnVmZmVyUmFuZ2UgPSBlZGl0b3IuZ2V0TGFzdFNlbGVjdGlvbigpLmdldEJ1ZmZlclJhbmdlKClcblxuICAgICAgYXV0b2NvbXBsZXRlLmF0dGFjaCgpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldE92ZXJsYXlEZWNvcmF0aW9ucygpLmxlbmd0aCkudG9CZSAxXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24gWzAsIDBdICMgZXZlbiBpZiBzZWxlY3Rpb24gY2hhbmdlcyBiZWZvcmUgY2FuY2VsLCBpdCBzaG91bGQgd29ya1xuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCBtaW5pRWRpdG9yLmVsZW1lbnQsIFwiY29yZTpjYW5jZWxcIlxuXG4gICAgICBleHBlY3QoZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KDEwKSkudG9CZSBcImV4dHJhOnNvOmV4dHJhXCJcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0TGFzdFNlbGVjdGlvbigpLmdldEJ1ZmZlclJhbmdlKCkpLnRvRXF1YWwgb3JpZ2luYWxTZWxlY3Rpb25CdWZmZXJSYW5nZVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRPdmVybGF5RGVjb3JhdGlvbnMoKS5sZW5ndGgpLnRvQmUgMFxuXG4gICAgaXQgXCJkb2VzIG5vdCBjbGVhciBvdXQgYSBwcmV2aW91c2x5IGNvbmZpcm1lZCBzZWxlY3Rpb24gd2hlbiBjYW5jZWxpbmcgd2l0aCBhbiBlbXB0eSBsaXN0XCIsIC0+XG4gICAgICBlZGl0b3IuZ2V0QnVmZmVyKCkuaW5zZXJ0KFsxMCwgMF0sIFwib3J0XFxuXCIpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzEwLCAwXSlcblxuICAgICAgYXV0b2NvbXBsZXRlLmF0dGFjaCgpXG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoIG1pbmlFZGl0b3IuZWxlbWVudCwgXCJjb3JlOmNvbmZpcm1cIlxuICAgICAgZXhwZWN0KGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdygxMCkpLnRvQmUgJ3F1aWNrc29ydCdcblxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFsxMSwgMF0pXG4gICAgICBhdXRvY29tcGxldGUuYXR0YWNoKClcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggbWluaUVkaXRvci5lbGVtZW50LCBcImNvcmU6Y2FuY2VsXCJcbiAgICAgIGV4cGVjdChlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coMTApKS50b0JlICdxdWlja3NvcnQnXG5cbiAgICBpdCBcInJlc3RvcmVzIHRoZSBjYXNlIG9mIHRoZSBwcmVmaXggdG8gdGhlIG9yaWdpbmFsIHZhbHVlXCIsIC0+XG4gICAgICBlZGl0b3IuZ2V0QnVmZmVyKCkuaW5zZXJ0KFsxMCwwXSAsXCJleHRyYTpTOmV4dHJhXCIpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzEwLDddKVxuICAgICAgYXV0b2NvbXBsZXRlLmF0dGFjaCgpXG5cbiAgICAgIGV4cGVjdChlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coMTApKS50b0JlIFwiZXh0cmE6c2hpZnQ6ZXh0cmFcIlxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFsxMCwxMV1cbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggbWluaUVkaXRvci5lbGVtZW50LCBcImNvcmU6Y2FuY2VsXCJcblxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCBhdXRvY29tcGxldGUuZWxlbWVudCwgJ2NvcmU6Y2FuY2VsJ1xuICAgICAgZXhwZWN0KGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdygxMCkpLnRvQmUgXCJleHRyYTpTOmV4dHJhXCJcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbCBbMTAsN11cblxuICAgIGl0IFwicmVzdG9yZXMgdGhlIG9yaWdpbmFsIGJ1ZmZlciBjb250ZW50cyBldmVuIGlmIHRoZXJlIHdhcyBhbiBhZGRpdGlvbmFsIG9wZXJhdGlvbiBhZnRlciBhdXRvY29tcGxldGUgYXR0YWNoZWQgKHJlZ3Jlc3Npb24pXCIsIC0+XG4gICAgICBlZGl0b3IuZ2V0QnVmZmVyKCkuaW5zZXJ0KFsxMCwwXSAsXCJleHRyYTpzOmV4dHJhXCIpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzEwLDddKVxuICAgICAgYXV0b2NvbXBsZXRlLmF0dGFjaCgpXG5cbiAgICAgIGVkaXRvci5nZXRCdWZmZXIoKS5hcHBlbmQoJ2hpJylcbiAgICAgIGV4cGVjdChlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coMTApKS50b0JlIFwiZXh0cmE6c2hpZnQ6ZXh0cmFcIlxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCBhdXRvY29tcGxldGUuZWxlbWVudCwgJ2NvcmU6Y2FuY2VsJ1xuICAgICAgZXhwZWN0KGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdygxMCkpLnRvQmUgXCJleHRyYTpzOmV4dHJhXCJcblxuICAgICAgZWRpdG9yLnJlZG8oKVxuICAgICAgZXhwZWN0KGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdygxMCkpLnRvQmUgXCJleHRyYTpzOmV4dHJhXCJcblxuICBkZXNjcmliZSAnbW92ZS11cCBldmVudCcsIC0+XG4gICAgaXQgXCJoaWdobGlnaHRzIHRoZSBwcmV2aW91cyBtYXRjaCBhbmQgcmVwbGFjZXMgdGhlIHNlbGVjdGlvbiB3aXRoIGl0XCIsIC0+XG4gICAgICBlZGl0b3IuZ2V0QnVmZmVyKCkuaW5zZXJ0KFsxMCwwXSAsXCJleHRyYTp0OmV4dHJhXCIpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzEwLDZdKVxuICAgICAgYXV0b2NvbXBsZXRlLmF0dGFjaCgpXG5cbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggbWluaUVkaXRvci5lbGVtZW50LCBcImNvcmU6bW92ZS11cFwiXG4gICAgICBleHBlY3QoZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KDEwKSkudG9CZSBcImV4dHJhOnNvcnQ6ZXh0cmFcIlxuICAgICAgZXhwZWN0KGF1dG9jb21wbGV0ZS5maW5kKCdsaTplcSgwKScpKS5ub3QudG9IYXZlQ2xhc3MoJ3NlbGVjdGVkJylcbiAgICAgIGV4cGVjdChhdXRvY29tcGxldGUuZmluZCgnbGk6ZXEoMSknKSkubm90LnRvSGF2ZUNsYXNzKCdzZWxlY3RlZCcpXG4gICAgICBleHBlY3QoYXV0b2NvbXBsZXRlLmZpbmQoJ2xpOmVxKDcpJykpLnRvSGF2ZUNsYXNzKCdzZWxlY3RlZCcpXG5cbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggbWluaUVkaXRvci5lbGVtZW50LCBcImNvcmU6bW92ZS11cFwiXG4gICAgICBleHBlY3QoZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KDEwKSkudG9CZSBcImV4dHJhOnNoaWZ0OmV4dHJhXCJcbiAgICAgIGV4cGVjdChhdXRvY29tcGxldGUuZmluZCgnbGk6ZXEoMCknKSkubm90LnRvSGF2ZUNsYXNzKCdzZWxlY3RlZCcpXG4gICAgICBleHBlY3QoYXV0b2NvbXBsZXRlLmZpbmQoJ2xpOmVxKDcpJykpLm5vdC50b0hhdmVDbGFzcygnc2VsZWN0ZWQnKVxuICAgICAgZXhwZWN0KGF1dG9jb21wbGV0ZS5maW5kKCdsaTplcSg2KScpKS50b0hhdmVDbGFzcygnc2VsZWN0ZWQnKVxuXG4gIGRlc2NyaWJlICdtb3ZlLWRvd24gZXZlbnQnLCAtPlxuICAgIGl0IFwiaGlnaGxpZ2h0cyB0aGUgbmV4dCBtYXRjaCBhbmQgcmVwbGFjZXMgdGhlIHNlbGVjdGlvbiB3aXRoIGl0XCIsIC0+XG4gICAgICBlZGl0b3IuZ2V0QnVmZmVyKCkuaW5zZXJ0KFsxMCwwXSAsXCJleHRyYTpzOmV4dHJhXCIpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzEwLDddKVxuICAgICAgYXV0b2NvbXBsZXRlLmF0dGFjaCgpXG5cbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggbWluaUVkaXRvci5lbGVtZW50LCBcImNvcmU6bW92ZS1kb3duXCJcbiAgICAgIGV4cGVjdChlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coMTApKS50b0JlIFwiZXh0cmE6c29ydDpleHRyYVwiXG4gICAgICBleHBlY3QoYXV0b2NvbXBsZXRlLmZpbmQoJ2xpOmVxKDApJykpLm5vdC50b0hhdmVDbGFzcygnc2VsZWN0ZWQnKVxuICAgICAgZXhwZWN0KGF1dG9jb21wbGV0ZS5maW5kKCdsaTplcSgxKScpKS50b0hhdmVDbGFzcygnc2VsZWN0ZWQnKVxuXG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoIG1pbmlFZGl0b3IuZWxlbWVudCwgXCJjb3JlOm1vdmUtZG93blwiXG4gICAgICBleHBlY3QoZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KDEwKSkudG9CZSBcImV4dHJhOnNoaWZ0OmV4dHJhXCJcbiAgICAgIGV4cGVjdChhdXRvY29tcGxldGUuZmluZCgnbGk6ZXEoMCknKSkudG9IYXZlQ2xhc3MoJ3NlbGVjdGVkJylcbiAgICAgIGV4cGVjdChhdXRvY29tcGxldGUuZmluZCgnbGk6ZXEoMSknKSkubm90LnRvSGF2ZUNsYXNzKCdzZWxlY3RlZCcpXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIGEgbWF0Y2ggaXMgY2xpY2tlZCBpbiB0aGUgbWF0Y2ggbGlzdFwiLCAtPlxuICAgIGl0IFwic2VsZWN0cyBhbmQgY29uZmlybXMgdGhlIG1hdGNoXCIsIC0+XG4gICAgICBlZGl0b3IuZ2V0QnVmZmVyKCkuaW5zZXJ0KFsxMCwwXSAsXCJ0XCIpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzEwLCAwXSlcbiAgICAgIGF1dG9jb21wbGV0ZS5hdHRhY2goKVxuXG4gICAgICBtYXRjaFRvU2VsZWN0ID0gYXV0b2NvbXBsZXRlLmxpc3QuZmluZCgnbGk6ZXEoMSknKVxuICAgICAgbWF0Y2hUb1NlbGVjdC5tb3VzZWRvd24oKVxuICAgICAgZXhwZWN0KG1hdGNoVG9TZWxlY3QpLnRvTWF0Y2hTZWxlY3RvcignLnNlbGVjdGVkJylcbiAgICAgIG1hdGNoVG9TZWxlY3QubW91c2V1cCgpXG5cbiAgICAgIGV4cGVjdChhdXRvY29tcGxldGUucGFyZW50KCkpLm5vdC50b0V4aXN0KClcbiAgICAgIGV4cGVjdChlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coMTApKS50b0JlIG1hdGNoVG9TZWxlY3QudGV4dCgpXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIHRoZSBtaW5pLWVkaXRvciByZWNlaXZlcyBrZXlib2FyZCBpbnB1dFwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICMgTGlzdCBwb3B1bGF0aW9uIGlzIGFzeW5jLCBzbyBpdCByZXF1aXJlcyBET00gYXR0YWNobWVudFxuICAgICAgamFzbWluZS5hdHRhY2hUb0RPTShhdXRvY29tcGxldGUuZWxlbWVudClcblxuICAgIGRlc2NyaWJlIFwid2hlbiB0ZXh0IGlzIHJlbW92ZWQgZnJvbSB0aGUgbWluaS1lZGl0b3JcIiwgLT5cbiAgICAgIGl0IFwicmVsb2FkcyB0aGUgbWF0Y2ggbGlzdCBiYXNlZCBvbiB0aGUgbWluaS1lZGl0b3IncyB0ZXh0XCIsIC0+XG4gICAgICAgIGVkaXRvci5nZXRCdWZmZXIoKS5pbnNlcnQoWzEwLDBdLCBcInRcIilcbiAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFsxMCwwXSlcbiAgICAgICAgYXV0b2NvbXBsZXRlLmF0dGFjaCgpXG5cbiAgICAgICAgZXhwZWN0KGF1dG9jb21wbGV0ZS5saXN0LmZpbmQoJ2xpJykubGVuZ3RoKS50b0JlIDhcbiAgICAgICAgbWluaUVkaXRvci5nZXRNb2RlbCgpLmluc2VydFRleHQoJ2MnKVxuICAgICAgICB3aW5kb3cuYWR2YW5jZUNsb2NrKGF1dG9jb21wbGV0ZS5pbnB1dFRocm90dGxlKVxuICAgICAgICBleHBlY3QoYXV0b2NvbXBsZXRlLmxpc3QuZmluZCgnbGknKS5sZW5ndGgpLnRvQmUgM1xuICAgICAgICBtaW5pRWRpdG9yLmdldE1vZGVsKCkuYmFja3NwYWNlKClcbiAgICAgICAgd2luZG93LmFkdmFuY2VDbG9jayhhdXRvY29tcGxldGUuaW5wdXRUaHJvdHRsZSlcbiAgICAgICAgZXhwZWN0KGF1dG9jb21wbGV0ZS5saXN0LmZpbmQoJ2xpJykubGVuZ3RoKS50b0JlIDhcblxuICAgIGRlc2NyaWJlIFwid2hlbiB0aGUgdGV4dCBjb250YWlucyBvbmx5IHdvcmQgY2hhcmFjdGVyc1wiLCAtPlxuICAgICAgaXQgXCJuYXJyb3dzIHRoZSBsaXN0IG9mIGNvbXBsZXRpb25zIHdpdGggdGhlIGZ1enp5IG1hdGNoIGFsZ29yaXRobVwiLCAtPlxuICAgICAgICBlZGl0b3IuZ2V0QnVmZmVyKCkuaW5zZXJ0KFsxMCwwXSAsXCJ0XCIpXG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMTAsMF0pXG4gICAgICAgIGF1dG9jb21wbGV0ZS5hdHRhY2goKVxuXG4gICAgICAgIGV4cGVjdChhdXRvY29tcGxldGUubGlzdC5maW5kKCdsaScpLmxlbmd0aCkudG9CZSA4XG4gICAgICAgIG1pbmlFZGl0b3IuZ2V0TW9kZWwoKS5pbnNlcnRUZXh0KCdpJylcbiAgICAgICAgd2luZG93LmFkdmFuY2VDbG9jayhhdXRvY29tcGxldGUuaW5wdXRUaHJvdHRsZSlcbiAgICAgICAgZXhwZWN0KGF1dG9jb21wbGV0ZS5saXN0LmZpbmQoJ2xpJykubGVuZ3RoKS50b0JlIDRcbiAgICAgICAgZXhwZWN0KGF1dG9jb21wbGV0ZS5saXN0LmZpbmQoJ2xpOmVxKDApJykpLnRvSGF2ZVRleHQgJ3Bpdm90J1xuICAgICAgICBleHBlY3QoYXV0b2NvbXBsZXRlLmxpc3QuZmluZCgnbGk6ZXEoMCknKSkudG9IYXZlQ2xhc3MgJ3NlbGVjdGVkJ1xuICAgICAgICBleHBlY3QoYXV0b2NvbXBsZXRlLmxpc3QuZmluZCgnbGk6ZXEoMSknKSkudG9IYXZlVGV4dCAncmlnaHQnXG4gICAgICAgIGV4cGVjdChhdXRvY29tcGxldGUubGlzdC5maW5kKCdsaTplcSgyKScpKS50b0hhdmVUZXh0ICdzaGlmdCdcbiAgICAgICAgZXhwZWN0KGF1dG9jb21wbGV0ZS5saXN0LmZpbmQoJ2xpOmVxKDMpJykpLnRvSGF2ZVRleHQgJ3F1aWNrc29ydCdcbiAgICAgICAgZXhwZWN0KGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdygxMCkpLnRvRXF1YWwgJ3Bpdm90J1xuXG4gICAgICAgIG1pbmlFZGl0b3IuZ2V0TW9kZWwoKS5pbnNlcnRUZXh0KCdvJylcbiAgICAgICAgd2luZG93LmFkdmFuY2VDbG9jayhhdXRvY29tcGxldGUuaW5wdXRUaHJvdHRsZSlcbiAgICAgICAgZXhwZWN0KGF1dG9jb21wbGV0ZS5saXN0LmZpbmQoJ2xpJykubGVuZ3RoKS50b0JlIDJcbiAgICAgICAgZXhwZWN0KGF1dG9jb21wbGV0ZS5saXN0LmZpbmQoJ2xpOmVxKDApJykpLnRvSGF2ZVRleHQgJ3Bpdm90J1xuICAgICAgICBleHBlY3QoYXV0b2NvbXBsZXRlLmxpc3QuZmluZCgnbGk6ZXEoMSknKSkudG9IYXZlVGV4dCAncXVpY2tzb3J0J1xuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIGEgbm9uLXdvcmQgY2hhcmFjdGVyIGlzIHR5cGVkIGluIHRoZSBtaW5pLWVkaXRvclwiLCAtPlxuICAgICAgaXQgXCJpbW1lZGlhdGVseSBjb25maXJtcyB0aGUgY3VycmVudCBjb21wbGV0aW9uIGNob2ljZSBhbmQgaW5zZXJ0cyB0aGF0IGNoYXJhY3RlciBpbnRvIHRoZSBidWZmZXJcIiwgLT5cbiAgICAgICAgZWRpdG9yLmdldEJ1ZmZlcigpLmluc2VydChbMTAsMF0gLFwidFwiKVxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzEwLDBdKVxuICAgICAgICBhdXRvY29tcGxldGUuYXR0YWNoKClcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRPdmVybGF5RGVjb3JhdGlvbnMoKS5sZW5ndGgpLnRvQmUgMVxuXG4gICAgICAgIG1pbmlFZGl0b3IuZ2V0TW9kZWwoKS5pbnNlcnRUZXh0KCdpdicpXG4gICAgICAgIHdpbmRvdy5hZHZhbmNlQ2xvY2soYXV0b2NvbXBsZXRlLmlucHV0VGhyb3R0bGUpXG4gICAgICAgIGV4cGVjdChhdXRvY29tcGxldGUubGlzdC5maW5kKCdsaTplcSgwKScpKS50b0hhdmVUZXh0ICdwaXZvdCdcblxuICAgICAgICBtaW5pRWRpdG9yLmdldE1vZGVsKCkuaW5zZXJ0VGV4dCgnICcpXG4gICAgICAgIHdpbmRvdy5hZHZhbmNlQ2xvY2soYXV0b2NvbXBsZXRlLmlucHV0VGhyb3R0bGUpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0T3ZlcmxheURlY29yYXRpb25zKCkubGVuZ3RoKS50b0JlIDBcbiAgICAgICAgZXhwZWN0KGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdygxMCkpLnRvRXF1YWwgJ3Bpdm90ICdcblxuICBkZXNjcmliZSBcIi5jYW5jZWwoKVwiLCAtPlxuICAgIGl0IFwicmVtb3ZlcyB0aGUgb3ZlcmxheSBhbmQgY2xlYXJzIHRoZSBtaW5pIGVkaXRvclwiLCAtPlxuICAgICAgYXV0b2NvbXBsZXRlLmF0dGFjaCgpXG4gICAgICBtaW5pRWRpdG9yLnNldFRleHQoJ2ZvbycpXG5cbiAgICAgIGF1dG9jb21wbGV0ZS5jYW5jZWwoKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRPdmVybGF5RGVjb3JhdGlvbnMoKS5sZW5ndGgpLnRvQmUgMFxuICAgICAgZXhwZWN0KG1pbmlFZGl0b3IuZ2V0VGV4dCgpKS50b0JlICcnXG5cbiAgaXQgXCJzZXRzIHRoZSB3aWR0aCBvZiB0aGUgdmlldyB0byBiZSB3aWRlIGVub3VnaCB0byBjb250YWluIHRoZSBsb25nZXN0IGNvbXBsZXRpb24gd2l0aG91dCBzY3JvbGxpbmdcIiwgLT5cbiAgICBlZGl0b3IuaW5zZXJ0VGV4dCgndGhpc0lzQVJlYWxseVJlYWxseVJlYWxseUxvbmdDb21wbGV0aW9uICcpXG4gICAgZWRpdG9yLm1vdmVUb0JvdHRvbSgpXG4gICAgZWRpdG9yLmluc2VydE5ld2xpbmUoKVxuICAgIGVkaXRvci5pbnNlcnRUZXh0KCd0JylcbiAgICBhdXRvY29tcGxldGUuYXR0YWNoKClcbiAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKGF1dG9jb21wbGV0ZS5lbGVtZW50KVxuICAgIGV4cGVjdChhdXRvY29tcGxldGUubGlzdC5wcm9wKCdzY3JvbGxXaWR0aCcpKS50b0JlTGVzc1RoYW4gYXV0b2NvbXBsZXRlLmxpc3Qud2lkdGgoKSArIDFcbiJdfQ==
