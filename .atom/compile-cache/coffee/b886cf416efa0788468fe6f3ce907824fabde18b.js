(function() {
  var MinimapFindAndReplace, WorkspaceView;

  MinimapFindAndReplace = require('../lib/minimap-find-and-replace');

  WorkspaceView = require('atom').WorkspaceView;

  describe("MinimapFindAndReplace", function() {
    beforeEach(function() {
      runs(function() {
        atom.workspaceView = new WorkspaceView;
        return atom.workspaceView.openSync('sample.js');
      });
      runs(function() {
        var editorView;
        atom.workspaceView.attachToDom();
        editorView = atom.workspaceView.getActiveView();
        return editorView.setText("This is the file content");
      });
      waitsForPromise(function() {
        var promise;
        promise = atom.packages.activatePackage('minimap');
        atom.workspaceView.trigger('minimap:toggle');
        return promise;
      });
      return waitsForPromise(function() {
        var promise;
        promise = atom.packages.activatePackage('find-and-replace');
        atom.workspaceView.trigger('find-and-replace:show');
        return promise;
      });
    });
    return describe("when the toggle event is triggered", function() {
      beforeEach(function() {
        return waitsForPromise(function() {
          var promise;
          promise = atom.packages.activatePackage('minimap-find-and-replace');
          atom.workspaceView.trigger('minimap-find-and-replace:toggle');
          return promise;
        });
      });
      return it('should exist', function() {
        return expect();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdGhla2FybG85NS8uYXRvbS9wYWNrYWdlcy9taW5pbWFwLWZpbmQtYW5kLXJlcGxhY2Uvc3BlYy9taW5pbWFwLWZpbmQtYW5kLXJlcGxhY2Utc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLHFCQUFBLEdBQXdCLE9BQUEsQ0FBUSxpQ0FBUjs7RUFDdkIsZ0JBQWlCLE9BQUEsQ0FBUSxNQUFSOztFQUVsQixRQUFBLENBQVMsdUJBQVQsRUFBa0MsU0FBQTtJQUNoQyxVQUFBLENBQVcsU0FBQTtNQUNULElBQUEsQ0FBSyxTQUFBO1FBQ0gsSUFBSSxDQUFDLGFBQUwsR0FBcUIsSUFBSTtlQUN6QixJQUFJLENBQUMsYUFBYSxDQUFDLFFBQW5CLENBQTRCLFdBQTVCO01BRkcsQ0FBTDtNQUlBLElBQUEsQ0FBSyxTQUFBO0FBQ0gsWUFBQTtRQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBbkIsQ0FBQTtRQUNBLFVBQUEsR0FBYSxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQW5CLENBQUE7ZUFDYixVQUFVLENBQUMsT0FBWCxDQUFtQiwwQkFBbkI7TUFIRyxDQUFMO01BS0EsZUFBQSxDQUFnQixTQUFBO0FBQ2QsWUFBQTtRQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsU0FBOUI7UUFDVixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLGdCQUEzQjtlQUNBO01BSGMsQ0FBaEI7YUFLQSxlQUFBLENBQWdCLFNBQUE7QUFDZCxZQUFBO1FBQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixrQkFBOUI7UUFDVixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLHVCQUEzQjtlQUNBO01BSGMsQ0FBaEI7SUFmUyxDQUFYO1dBb0JBLFFBQUEsQ0FBUyxvQ0FBVCxFQUErQyxTQUFBO01BQzdDLFVBQUEsQ0FBVyxTQUFBO2VBQ1QsZUFBQSxDQUFnQixTQUFBO0FBQ2QsY0FBQTtVQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsMEJBQTlCO1VBQ1YsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQixpQ0FBM0I7aUJBQ0E7UUFIYyxDQUFoQjtNQURTLENBQVg7YUFNQSxFQUFBLENBQUcsY0FBSCxFQUFtQixTQUFBO2VBQ2pCLE1BQUEsQ0FBQTtNQURpQixDQUFuQjtJQVA2QyxDQUEvQztFQXJCZ0MsQ0FBbEM7QUFIQSIsInNvdXJjZXNDb250ZW50IjpbIk1pbmltYXBGaW5kQW5kUmVwbGFjZSA9IHJlcXVpcmUgJy4uL2xpYi9taW5pbWFwLWZpbmQtYW5kLXJlcGxhY2UnXG57V29ya3NwYWNlVmlld30gPSByZXF1aXJlICdhdG9tJ1xuXG5kZXNjcmliZSBcIk1pbmltYXBGaW5kQW5kUmVwbGFjZVwiLCAtPlxuICBiZWZvcmVFYWNoIC0+XG4gICAgcnVucyAtPlxuICAgICAgYXRvbS53b3Jrc3BhY2VWaWV3ID0gbmV3IFdvcmtzcGFjZVZpZXdcbiAgICAgIGF0b20ud29ya3NwYWNlVmlldy5vcGVuU3luYygnc2FtcGxlLmpzJylcblxuICAgIHJ1bnMgLT5cbiAgICAgIGF0b20ud29ya3NwYWNlVmlldy5hdHRhY2hUb0RvbSgpXG4gICAgICBlZGl0b3JWaWV3ID0gYXRvbS53b3Jrc3BhY2VWaWV3LmdldEFjdGl2ZVZpZXcoKVxuICAgICAgZWRpdG9yVmlldy5zZXRUZXh0KFwiVGhpcyBpcyB0aGUgZmlsZSBjb250ZW50XCIpXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIHByb21pc2UgPSBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnbWluaW1hcCcpXG4gICAgICBhdG9tLndvcmtzcGFjZVZpZXcudHJpZ2dlciAnbWluaW1hcDp0b2dnbGUnXG4gICAgICBwcm9taXNlXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIHByb21pc2UgPSBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnZmluZC1hbmQtcmVwbGFjZScpXG4gICAgICBhdG9tLndvcmtzcGFjZVZpZXcudHJpZ2dlciAnZmluZC1hbmQtcmVwbGFjZTpzaG93J1xuICAgICAgcHJvbWlzZVxuXG4gIGRlc2NyaWJlIFwid2hlbiB0aGUgdG9nZ2xlIGV2ZW50IGlzIHRyaWdnZXJlZFwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBwcm9taXNlID0gYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ21pbmltYXAtZmluZC1hbmQtcmVwbGFjZScpXG4gICAgICAgIGF0b20ud29ya3NwYWNlVmlldy50cmlnZ2VyICdtaW5pbWFwLWZpbmQtYW5kLXJlcGxhY2U6dG9nZ2xlJ1xuICAgICAgICBwcm9taXNlXG5cbiAgICBpdCAnc2hvdWxkIGV4aXN0JywgLT5cbiAgICAgIGV4cGVjdCgpXG4iXX0=
