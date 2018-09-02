(function() {
  var fs, path;

  fs = require("fs-plus");

  path = require("path");

  module.exports = {
    repositoryForPath: function(goalPath) {
      var directory, i, j, len, ref;
      ref = atom.project.getDirectories();
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        directory = ref[i];
        if (goalPath === directory.getPath() || directory.contains(goalPath)) {
          return atom.project.getRepositories()[i];
        }
      }
      return null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdGhla2FybG85NS8uYXRvbS9wYWNrYWdlcy9taW5pbWFwLWdpdC1kaWZmL2xpYi9oZWxwZXJzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUCxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsaUJBQUEsRUFBbUIsU0FBQyxRQUFEO0FBQ2pCLFVBQUE7QUFBQTtBQUFBLFdBQUEsNkNBQUE7O1FBQ0UsSUFBRyxRQUFBLEtBQVksU0FBUyxDQUFDLE9BQVYsQ0FBQSxDQUFaLElBQW1DLFNBQVMsQ0FBQyxRQUFWLENBQW1CLFFBQW5CLENBQXRDO0FBQ0UsaUJBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFiLENBQUEsQ0FBK0IsQ0FBQSxDQUFBLEVBRHhDOztBQURGO2FBR0E7SUFKaUIsQ0FBbkI7O0FBSkYiLCJzb3VyY2VzQ29udGVudCI6WyJmcyA9IHJlcXVpcmUgXCJmcy1wbHVzXCJcbnBhdGggPSByZXF1aXJlIFwicGF0aFwiXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgcmVwb3NpdG9yeUZvclBhdGg6IChnb2FsUGF0aCkgLT5cbiAgICBmb3IgZGlyZWN0b3J5LCBpIGluIGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpXG4gICAgICBpZiBnb2FsUGF0aCBpcyBkaXJlY3RvcnkuZ2V0UGF0aCgpIG9yIGRpcmVjdG9yeS5jb250YWlucyhnb2FsUGF0aClcbiAgICAgICAgcmV0dXJuIGF0b20ucHJvamVjdC5nZXRSZXBvc2l0b3JpZXMoKVtpXVxuICAgIG51bGxcbiJdfQ==
