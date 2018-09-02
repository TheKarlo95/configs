(function() {
  var LB, chai, defaultConfig, expect, fs, grammarTest, path, temp;

  chai = require('../node_modules/chai');

  expect = chai.expect;

  fs = require('fs-plus');

  path = require('path');

  defaultConfig = require('./default-config');

  grammarTest = require('atom-grammar-test');

  temp = require('temp');

  LB = 'language-babel';

  describe('language-babel', function() {
    var config, lb;
    lb = null;
    config = {};
    beforeEach(function() {
      temp.cleanup();
      waitsForPromise(function() {
        return atom.packages.activatePackage(LB);
      });
      config = JSON.parse(JSON.stringify(defaultConfig));
      return runs(function() {
        return lb = atom.packages.getActivePackage(LB).mainModule.transpiler;
      });
    });
    describe('Reading real config', function() {
      return it('should read all possible configuration keys', function() {
        var key, realConfig, results, value;
        realConfig = lb.getConfig();
        results = [];
        for (key in config) {
          value = config[key];
          results.push(expect(realConfig).to.contain.all.keys(key));
        }
        return results;
      });
    });
    describe(':getPaths', function() {
      if (!process.platform.match(/^win/)) {
        it('returns paths for a named sourcefile with default config', function() {
          var ret, tempProj1, tempProj2;
          tempProj1 = temp.mkdirSync();
          tempProj2 = temp.mkdirSync();
          atom.project.setPaths([tempProj1, tempProj2]);
          ret = lb.getPaths(tempProj1 + '/source/dira/fauxfile.js', config);
          expect(ret.sourceFile).to.equal(tempProj1 + '/source/dira/fauxfile.js');
          expect(ret.sourceFileDir).to.equal(tempProj1 + '/source/dira');
          expect(ret.mapFile).to.equal(tempProj1 + '/source/dira/fauxfile.js.map');
          expect(ret.transpiledFile).to.equal(tempProj1 + '/source/dira/fauxfile.js');
          expect(ret.sourceRoot).to.equal(tempProj1);
          return expect(ret.projectPath).to.equal(tempProj1);
        });
        it('returns paths for a named sourcefile with default + keepFileExtentions', function() {
          var ret, tempProj1, tempProj2;
          config.keepFileExtension = true;
          tempProj1 = temp.mkdirSync();
          tempProj2 = temp.mkdirSync();
          atom.project.setPaths([tempProj1, tempProj2]);
          ret = lb.getPaths(tempProj1 + '/source/dira/fauxfile.js', config);
          expect(ret.sourceFile).to.equal(tempProj1 + '/source/dira/fauxfile.js');
          expect(ret.sourceFileDir).to.equal(tempProj1 + '/source/dira');
          expect(ret.mapFile).to.equal(tempProj1 + '/source/dira/fauxfile.js.map');
          expect(ret.transpiledFile).to.equal(tempProj1 + '/source/dira/fauxfile.js');
          expect(ret.sourceRoot).to.equal(tempProj1);
          return expect(ret.projectPath).to.equal(tempProj1);
        });
        it('returns paths config with target & source paths set', function() {
          var ret, tempProj1, tempProj2;
          tempProj1 = temp.mkdirSync();
          tempProj2 = temp.mkdirSync();
          atom.project.setPaths([tempProj1, tempProj2]);
          config.babelSourcePath = '/source';
          config.babelMapsPath = 'mapspath';
          config.babelTranspilePath = '/transpath';
          ret = lb.getPaths(tempProj1 + '/source/dira/fauxfile.js', config);
          expect(ret.sourceFile).to.equal(tempProj1 + '/source/dira/fauxfile.js');
          expect(ret.sourceFileDir).to.equal(tempProj1 + '/source/dira');
          expect(ret.mapFile).to.equal(tempProj1 + '/mapspath/dira/fauxfile.js.map');
          expect(ret.transpiledFile).to.equal(tempProj1 + '/transpath/dira/fauxfile.js');
          expect(ret.sourceRoot).to.equal(tempProj1 + '/source');
          return expect(ret.projectPath).to.equal(tempProj1);
        });
        it('returns correct paths with project in root directory', function() {
          var ret, tempProj1, tempProj2;
          tempProj1 = temp.mkdirSync();
          tempProj2 = temp.mkdirSync();
          atom.project.setPaths(['/']);
          config.babelSourcePath = 'source';
          config.babelMapsPath = 'mapspath';
          config.babelTranspilePath = 'transpath';
          ret = lb.getPaths('/source/dira/fauxfile.js', config);
          expect(ret.sourceFile).to.equal('/source/dira/fauxfile.js');
          expect(ret.sourceFileDir).to.equal('/source/dira');
          expect(ret.mapFile).to.equal('/mapspath/dira/fauxfile.js.map');
          expect(ret.transpiledFile).to.equal('/transpath/dira/fauxfile.js');
          expect(ret.sourceRoot).to.equal('/source');
          return expect(ret.projectPath).to.equal('/');
        });
      }
      if (process.platform.match(/^win/)) {
        it('returns paths for a named sourcefile with default config', function() {
          var ret, tempProj1, tempProj2;
          tempProj1 = temp.mkdirSync();
          tempProj2 = temp.mkdirSync();
          atom.project.setPaths([tempProj1, tempProj2]);
          ret = lb.getPaths(tempProj1 + '\\source\\dira\\fauxfile.js', config);
          expect(ret.sourceFile).to.equal(tempProj1 + '\\source\\dira\\fauxfile.js');
          expect(ret.sourceFileDir).to.equal(tempProj1 + '\\source\\dira');
          expect(ret.mapFile).to.equal(tempProj1 + '\\source\\dira\\fauxfile.js.map');
          expect(ret.transpiledFile).to.equal(tempProj1 + '\\source\\dira\\fauxfile.js');
          expect(ret.sourceRoot).to.equal(tempProj1);
          return expect(ret.projectPath).to.equal(tempProj1);
        });
        it('returns paths for a named sourcefile with default config + keepFileExtentions', function() {
          var ret, tempProj1, tempProj2;
          config.keepFileExtension = true;
          tempProj1 = temp.mkdirSync();
          tempProj2 = temp.mkdirSync();
          atom.project.setPaths([tempProj1, tempProj2]);
          ret = lb.getPaths(tempProj1 + '\\source\\dira\\fauxfile.js', config);
          expect(ret.sourceFile).to.equal(tempProj1 + '\\source\\dira\\fauxfile.js');
          expect(ret.sourceFileDir).to.equal(tempProj1 + '\\source\\dira');
          expect(ret.mapFile).to.equal(tempProj1 + '\\source\\dira\\fauxfile.js.map');
          expect(ret.transpiledFile).to.equal(tempProj1 + '\\source\\dira\\fauxfile.js');
          expect(ret.sourceRoot).to.equal(tempProj1);
          return expect(ret.projectPath).to.equal(tempProj1);
        });
        it('returns paths config with target & source paths set', function() {
          var ret, tempProj1, tempProj2;
          tempProj1 = temp.mkdirSync();
          tempProj2 = temp.mkdirSync();
          atom.project.setPaths([tempProj1, tempProj2]);
          config.babelSourcePath = '\\source';
          config.babelMapsPath = 'mapspath';
          config.babelTranspilePath = '\\transpath';
          ret = lb.getPaths(tempProj1 + '\\source\\dira\\fauxfile.js', config);
          expect(ret.sourceFile).to.equal(tempProj1 + '\\source\\dira\\fauxfile.js');
          expect(ret.sourceFileDir).to.equal(tempProj1 + '\\source\\dira');
          expect(ret.mapFile).to.equal(tempProj1 + '\\mapspath\\dira\\fauxfile.js.map');
          expect(ret.transpiledFile).to.equal(tempProj1 + '\\transpath\\dira\\fauxfile.js');
          expect(ret.sourceRoot).to.equal(tempProj1 + '\\source');
          return expect(ret.projectPath).to.equal(tempProj1);
        });
        return it('returns correct paths with project in root directory', function() {
          var ret;
          atom.project.setPaths(['C:\\']);
          config.babelSourcePath = 'source';
          config.babelMapsPath = 'mapspath';
          config.babelTranspilePath = 'transpath';
          ret = lb.getPaths('C:\\source\\dira\\fauxfile.js', config);
          expect(ret.sourceFile).to.equal('C:\\source\\dira\\fauxfile.js');
          expect(ret.sourceFileDir).to.equal('C:\\source\\dira');
          expect(ret.mapFile).to.equal('C:\\mapspath\\dira\\fauxfile.js.map');
          expect(ret.transpiledFile).to.equal('C:\\transpath\\dira\\fauxfile.js');
          expect(ret.sourceRoot).to.equal('C:\\source');
          return expect(ret.projectPath).to.equal('C:\\');
        });
      }
    });
    return describe(':transpile', function() {
      var notification, notificationSpy, writeFileName, writeFileStub;
      notificationSpy = null;
      notification = null;
      writeFileStub = null;
      writeFileName = null;
      beforeEach(function() {
        notificationSpy = jasmine.createSpy('notificationSpy');
        notification = atom.notifications.onDidAddNotification(notificationSpy);
        writeFileName = null;
        return writeFileStub = spyOn(fs, 'writeFileSync').andCallFake(function(path) {
          return writeFileName = path;
        });
      });
      afterEach(function() {
        return notification.dispose();
      });
      describe('when transpileOnSave is false', function() {
        return it('does nothing', function() {
          config.transpileOnSave = false;
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          lb.transpile('somefilename');
          expect(notificationSpy.callCount).to.equal(0);
          return expect(writeFileStub.callCount).to.equal(0);
        });
      });
      describe('When a source file is outside the "babelSourcePath" & suppress msgs false', function() {
        return it('notifies sourcefile is not inside sourcepath', function() {
          var msg, type;
          atom.project.setPaths([__dirname]);
          config.babelSourcePath = 'fixtures';
          config.babelTranspilePath = 'fixtures';
          config.babelMapsPath = 'fixtures';
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          lb.transpile(__dirname + '/fake.js');
          expect(notificationSpy.callCount).to.equal(1);
          msg = notificationSpy.calls[0].args[0].message;
          type = notificationSpy.calls[0].args[0].type;
          expect(msg).to.match(/^LB: Babel file is not inside/);
          return expect(writeFileStub.callCount).to.equal(0);
        });
      });
      describe('When a source file is outside the "babelSourcePath" & suppress msgs true', function() {
        return it('exects no notifications', function() {
          atom.project.setPaths([__dirname]);
          config.babelSourcePath = 'fixtures';
          config.babelTranspilePath = 'fixtures';
          config.babelMapsPath = 'fixtures';
          config.suppressSourcePathMessages = true;
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          lb.transpile(__dirname + '/fake.js');
          expect(notificationSpy.callCount).to.equal(0);
          return expect(writeFileStub.callCount).to.equal(0);
        });
      });
      describe('When a js files is transpiled and gets an error', function() {
        return it('it issues a notification error message', function() {
          atom.project.setPaths([__dirname]);
          config.babelSourcePath = 'fixtures';
          config.babelTranspilePath = 'fixtures';
          config.babelMapsPath = 'fixtures';
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          lb.transpile(path.resolve(__dirname, 'fixtures/dira/dira.1/dira.2/bad.js'));
          waitsFor(function() {
            return notificationSpy.callCount;
          });
          return runs(function() {
            var msg;
            expect(notificationSpy.callCount).to.equal(1);
            msg = notificationSpy.calls[0].args[0].message;
            expect(msg).to.match(/^LB: Babel.*Transpiler Error/);
            return expect(writeFileStub.callCount).to.equal(0);
          });
        });
      });
      describe('When a js file saved but no output is set', function() {
        return it('calls the transpiler but doesnt save output', function() {
          atom.project.setPaths([__dirname]);
          config.babelSourcePath = 'fixtures';
          config.babelTranspilePath = 'fixtures';
          config.babelMapsPath = 'fixtures';
          config.createTranspiledCode = false;
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          lb.transpile(path.resolve(__dirname, 'fixtures/dira/dira.1/dira.2/react.jsx'));
          waitsFor(function() {
            return notificationSpy.callCount > 1;
          });
          return runs(function() {
            var msg;
            expect(notificationSpy.callCount).to.equal(2);
            msg = notificationSpy.calls[0].args[0].message;
            expect(msg).to.match(/^LB: Babel.*Transpiler Success/);
            msg = notificationSpy.calls[1].args[0].message;
            expect(msg).to.match(/^LB: No transpiled output configured/);
            return expect(writeFileStub.callCount).to.equal(0);
          });
        });
      });
      describe('When a js file saved but no transpile path is set', function() {
        return it('calls the transpiler and transpiles OK but doesnt save and issues msg', function() {
          atom.project.setPaths([__dirname]);
          config.babelSourcePath = 'fixtures';
          config.babelTranspilePath = 'fixtures';
          config.babelMapsPath = 'fixtures';
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          lb.transpile(path.resolve(__dirname, 'fixtures/dira/dira.1/dira.2/good.js'));
          waitsFor(function() {
            return notificationSpy.callCount > 1;
          });
          return runs(function() {
            var msg;
            expect(notificationSpy.callCount).to.equal(2);
            msg = notificationSpy.calls[0].args[0].message;
            expect(msg).to.match(/^LB: Babel.*Transpiler Success/);
            msg = notificationSpy.calls[1].args[0].message;
            expect(msg).to.match(/^LB: Transpiled file would overwrite source file/);
            return expect(writeFileStub.callCount).to.equal(0);
          });
        });
      });
      describe('When a jsx file saved,transpile path is set, source maps enabled', function() {
        return it('calls the transpiler and transpiles OK, saves as .js and issues msg', function() {
          atom.project.setPaths([__dirname]);
          config.babelSourcePath = 'fixtures';
          config.babelTranspilePath = 'fixtures-transpiled';
          config.babelMapsPath = 'fixtures-maps';
          config.createMap = true;
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          lb.transpile(path.resolve(__dirname, 'fixtures/dira/dira.1/dira.2/react.jsx'));
          waitsFor(function() {
            return writeFileStub.callCount;
          });
          return runs(function() {
            var expectedFileName, msg, savedFilename;
            expect(notificationSpy.callCount).to.equal(1);
            msg = notificationSpy.calls[0].args[0].message;
            expect(msg).to.match(/^LB: Babel.*Transpiler Success/);
            expect(writeFileStub.callCount).to.equal(2);
            savedFilename = writeFileStub.calls[0].args[0];
            expectedFileName = path.resolve(__dirname, 'fixtures-transpiled/dira/dira.1/dira.2/react.js');
            expect(savedFilename).to.equal(expectedFileName);
            savedFilename = writeFileStub.calls[1].args[0];
            expectedFileName = path.resolve(__dirname, 'fixtures-maps/dira/dira.1/dira.2/react.js.map');
            return expect(savedFilename).to.equal(expectedFileName);
          });
        });
      });
      describe('When a jsx file saved,transpile path is set, source maps enabled, success suppressed', function() {
        return it('calls the transpiler and transpiles OK, saves as .js and issues msg', function() {
          atom.project.setPaths([__dirname]);
          config.babelSourcePath = 'fixtures';
          config.babelTranspilePath = 'fixtures-transpiled';
          config.babelMapsPath = 'fixtures-maps';
          config.createMap = true;
          config.suppressTranspileOnSaveMessages = true;
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          lb.transpile(path.resolve(__dirname, 'fixtures/dira/dira.1/dira.2/react.jsx'));
          waitsFor(function() {
            return writeFileStub.callCount;
          });
          return runs(function() {
            var expectedFileName, savedFilename;
            expect(notificationSpy.callCount).to.equal(0);
            expect(writeFileStub.callCount).to.equal(2);
            savedFilename = writeFileStub.calls[0].args[0];
            expectedFileName = path.resolve(__dirname, 'fixtures-transpiled/dira/dira.1/dira.2/react.js');
            expect(savedFilename).to.equal(expectedFileName);
            savedFilename = writeFileStub.calls[1].args[0];
            expectedFileName = path.resolve(__dirname, 'fixtures-maps/dira/dira.1/dira.2/react.js.map');
            return expect(savedFilename).to.equal(expectedFileName);
          });
        });
      });
      describe('When a js file saved , babelrc in path and flag disableWhenNoBabelrcFileInPath is set', function() {
        return it('calls the transpiler', function() {
          atom.project.setPaths([__dirname]);
          config.babelSourcePath = 'fixtures';
          config.babelTranspilePath = 'fixtures';
          config.babelMapsPath = 'fixtures';
          config.createTranspiledCode = false;
          config.disableWhenNoBabelrcFileInPath = true;
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          lb.transpile(path.resolve(__dirname, 'fixtures/dira/dira.1/dira.2/good.js'));
          waitsFor(function() {
            return notificationSpy.callCount;
          });
          return runs(function() {
            var msg;
            expect(notificationSpy.callCount).to.equal(2);
            msg = notificationSpy.calls[0].args[0].message;
            expect(msg).to.match(/^LB: Babel.*Transpiler Success/);
            msg = notificationSpy.calls[1].args[0].message;
            expect(msg).to.match(/^LB: No transpiled output configured/);
            return expect(writeFileStub.callCount).to.equal(0);
          });
        });
      });
      describe('When a js file saved , babelrc in not in path and flag disableWhenNoBabelrcFileInPath is set', function() {
        return it('does nothing', function() {
          atom.project.setPaths([__dirname]);
          config.babelSourcePath = 'fixtures';
          config.babelTranspilePath = 'fixtures';
          config.babelMapsPath = 'fixtures';
          config.createTranspiledCode = false;
          config.disableWhenNoBabelrcFileInPath = true;
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          lb.transpile(path.resolve(__dirname, 'fixtures/dirb/good.js'));
          expect(notificationSpy.callCount).to.equal(0);
          return expect(writeFileStub.callCount).to.equal(0);
        });
      });
      describe('When a js file saved in a nested project', function() {
        return it('creates a file in the correct location based upon .languagebabel', function() {
          var sourceFile, targetFile;
          atom.project.setPaths([__dirname]);
          config.allowLocalOverride = true;
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          sourceFile = path.resolve(__dirname, 'fixtures/projectRoot/src/test.js');
          targetFile = path.resolve(__dirname, 'fixtures/projectRoot/test.js');
          lb.transpile(sourceFile);
          waitsFor(function() {
            return writeFileStub.callCount;
          });
          return runs(function() {
            return expect(writeFileName).to.equal(targetFile);
          });
        });
      });
      return describe('When a directory is compiled', function() {
        return it('transpiles the js,jsx,es,es6,babel files but ignores minified files', function() {
          var sourceDir;
          atom.project.setPaths([__dirname]);
          config.allowLocalOverride = true;
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          sourceDir = path.resolve(__dirname, 'fixtures/projectRoot/src/');
          lb.transpileDirectory({
            directory: sourceDir
          });
          waitsFor(function() {
            return writeFileStub.callCount >= 5;
          });
          return runs(function() {
            return expect(writeFileStub.callCount).to.equal(5);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdGhla2FybG85NS8uYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1iYWJlbC9zcGVjL3RyYW5zcGlsZS1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxzQkFBUjs7RUFDUCxNQUFBLEdBQVMsSUFBSSxDQUFDOztFQUNkLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsYUFBQSxHQUFnQixPQUFBLENBQVEsa0JBQVI7O0VBQ2hCLFdBQUEsR0FBYyxPQUFBLENBQVEsbUJBQVI7O0VBQ2QsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLEVBQUEsR0FBSzs7RUFRTCxRQUFBLENBQVMsZ0JBQVQsRUFBMkIsU0FBQTtBQUN6QixRQUFBO0lBQUEsRUFBQSxHQUFLO0lBQ0wsTUFBQSxHQUFVO0lBQ1YsVUFBQSxDQUFXLFNBQUE7TUFDVCxJQUFJLENBQUMsT0FBTCxDQUFBO01BQ0EsZUFBQSxDQUFnQixTQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLEVBQTlCO01BRGMsQ0FBaEI7TUFFQSxNQUFBLEdBQVMsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFJLENBQUMsU0FBTCxDQUFlLGFBQWYsQ0FBWDthQUVULElBQUEsQ0FBSyxTQUFBO2VBQ0gsRUFBQSxHQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWQsQ0FBK0IsRUFBL0IsQ0FBa0MsQ0FBQyxVQUFVLENBQUM7TUFEaEQsQ0FBTDtJQU5TLENBQVg7SUFTQSxRQUFBLENBQVMscUJBQVQsRUFBZ0MsU0FBQTthQUM5QixFQUFBLENBQUcsNkNBQUgsRUFBa0QsU0FBQTtBQUNoRCxZQUFBO1FBQUEsVUFBQSxHQUFhLEVBQUUsQ0FBQyxTQUFILENBQUE7QUFDYjthQUFBLGFBQUE7O3VC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QUF5QyxDQUF6QztVQURHLENBQUw7UUFUd0UsQ0FBMUU7TUFEdUMsQ0FBekM7SUFuTnFCLENBQXZCO0VBakp5QixDQUEzQjtBQWhCQSIsInNvdXJjZXNDb250ZW50IjpbImNoYWkgPSByZXF1aXJlICcuLi9ub2RlX21vZHVsZXMvY2hhaSdcbmV4cGVjdCA9IGNoYWkuZXhwZWN0XG5mcyA9IHJlcXVpcmUgJ2ZzLXBsdXMnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcbmRlZmF1bHRDb25maWcgPSByZXF1aXJlICcuL2RlZmF1bHQtY29uZmlnJ1xuZ3JhbW1hclRlc3QgPSByZXF1aXJlICdhdG9tLWdyYW1tYXItdGVzdCdcbnRlbXAgPSByZXF1aXJlKCd0ZW1wJyk7XG5cbkxCID0gJ2xhbmd1YWdlLWJhYmVsJ1xuIyB3ZSB1c2UgYXRvbSBzZXRQYXRocyBpbiB0aGlzIHNwZWMuIHNldFBhdGhzIGNoZWNrcyBpZiBkaXJlY3RvcmllcyBleGlzdFxuIyB0aHVzOi0gc2V0UGF0aHMoWycvcm9vdC9Qcm9qZWN0MSddKSBtYXkgZmluZCAvcm9vdCBidXQgbm90IC9yb290L1Byb2plY3QxXG4jIGFuZCBzZXRzIHRoZSBwcm9qIGRpciBhcyAvcm9vdCByYXRoZXIgdGhhbiAvcm9vdC9Qcm9qZWN0MS4gSWYgL3Jvb3QvUHJvamVjdDFcbiMgd2VyZSBubyBmb3VuZCwgYXRvbSBzZXRzIHRoZSBkaXJlY3RvcnkgdG8gdGhlIGZ1bGwgbmFtZS5cbiMgV2UgbmVlZCBzb21lIHByZWZpeCBkaXJlY3RvcnkgZmF1eCBuYW1lcyBmb3IgcG9zaXggYW5kIHdpbmRvd3MgdG8gZW5zdXJlXG4jIHdlIGFsd2F5cyBnZXQgYSBwcm9qZWN0IG5hbWUgd2Ugc2V0XG5cbmRlc2NyaWJlICdsYW5ndWFnZS1iYWJlbCcsIC0+XG4gIGxiID0gbnVsbFxuICBjb25maWcgPSAge31cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHRlbXAuY2xlYW51cCgpXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZShMQilcbiAgICBjb25maWcgPSBKU09OLnBhcnNlIEpTT04uc3RyaW5naWZ5IGRlZmF1bHRDb25maWdcblxuICAgIHJ1bnMgLT5cbiAgICAgIGxiID0gYXRvbS5wYWNrYWdlcy5nZXRBY3RpdmVQYWNrYWdlKExCKS5tYWluTW9kdWxlLnRyYW5zcGlsZXJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlICdSZWFkaW5nIHJlYWwgY29uZmlnJywgLT5cbiAgICBpdCAnc2hvdWxkIHJlYWQgYWxsIHBvc3NpYmxlIGNvbmZpZ3VyYXRpb24ga2V5cycsIC0+XG4gICAgICByZWFsQ29uZmlnID0gbGIuZ2V0Q29uZmlnKClcbiAgICAgIGV4cGVjdChyZWFsQ29uZmlnKS50by5jb250YWluLmFsbC5rZXlzIGtleSBmb3Iga2V5LCB2YWx1ZSBvZiBjb25maWdcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlICc6Z2V0UGF0aHMnLCAtPlxuXG4gICAgaWYgbm90IHByb2Nlc3MucGxhdGZvcm0ubWF0Y2ggL153aW4vXG4gICAgICBpdCAncmV0dXJucyBwYXRocyBmb3IgYSBuYW1lZCBzb3VyY2VmaWxlIHdpdGggZGVmYXVsdCBjb25maWcnLCAtPlxuICAgICAgICB0ZW1wUHJvajEgPSB0ZW1wLm1rZGlyU3luYygpXG4gICAgICAgIHRlbXBQcm9qMiA9IHRlbXAubWtkaXJTeW5jKClcbiAgICAgICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzKFt0ZW1wUHJvajEsdGVtcFByb2oyXSlcblxuICAgICAgICByZXQgPSBsYi5nZXRQYXRocyh0ZW1wUHJvajErJy9zb3VyY2UvZGlyYS9mYXV4ZmlsZS5qcycsY29uZmlnKVxuXG4gICAgICAgIGV4cGVjdChyZXQuc291cmNlRmlsZSkudG8uZXF1YWwodGVtcFByb2oxKycvc291cmNlL2RpcmEvZmF1eGZpbGUuanMnKVxuICAgICAgICBleHBlY3QocmV0LnNvdXJjZUZpbGVEaXIpLnRvLmVxdWFsKHRlbXBQcm9qMSsnL3NvdXJjZS9kaXJhJylcbiAgICAgICAgZXhwZWN0KHJldC5tYXBGaWxlKS50by5lcXVhbCh0ZW1wUHJvajErJy9zb3VyY2UvZGlyYS9mYXV4ZmlsZS5qcy5tYXAnKVxuICAgICAgICBleHBlY3QocmV0LnRyYW5zcGlsZWRGaWxlKS50by5lcXVhbCh0ZW1wUHJvajErJy9zb3VyY2UvZGlyYS9mYXV4ZmlsZS5qcycpXG4gICAgICAgIGV4cGVjdChyZXQuc291cmNlUm9vdCkudG8uZXF1YWwodGVtcFByb2oxKVxuICAgICAgICBleHBlY3QocmV0LnByb2plY3RQYXRoKS50by5lcXVhbCh0ZW1wUHJvajEpXG5cbiAgICAgIGl0ICdyZXR1cm5zIHBhdGhzIGZvciBhIG5hbWVkIHNvdXJjZWZpbGUgd2l0aCBkZWZhdWx0ICsga2VlcEZpbGVFeHRlbnRpb25zJywgLT5cbiAgICAgICAgY29uZmlnLmtlZXBGaWxlRXh0ZW5zaW9uID0gdHJ1ZVxuICAgICAgICB0ZW1wUHJvajEgPSB0ZW1wLm1rZGlyU3luYygpXG4gICAgICAgIHRlbXBQcm9qMiA9IHRlbXAubWtkaXJTeW5jKClcbiAgICAgICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzKFt0ZW1wUHJvajEsdGVtcFByb2oyXSlcblxuICAgICAgICByZXQgPSBsYi5nZXRQYXRocyh0ZW1wUHJvajErJy9zb3VyY2UvZGlyYS9mYXV4ZmlsZS5qcycsY29uZmlnKVxuXG4gICAgICAgIGV4cGVjdChyZXQuc291cmNlRmlsZSkudG8uZXF1YWwodGVtcFByb2oxKycvc291cmNlL2RpcmEvZmF1eGZpbGUuanMnKVxuICAgICAgICBleHBlY3QocmV0LnNvdXJjZUZpbGVEaXIpLnRvLmVxdWFsKHRlbXBQcm9qMSsnL3NvdXJjZS9kaXJhJylcbiAgICAgICAgZXhwZWN0KHJldC5tYXBGaWxlKS50by5lcXVhbCh0ZW1wUHJvajErJy9zb3VyY2UvZGlyYS9mYXV4ZmlsZS5qcy5tYXAnKVxuICAgICAgICBleHBlY3QocmV0LnRyYW5zcGlsZWRGaWxlKS50by5lcXVhbCh0ZW1wUHJvajErJy9zb3VyY2UvZGlyYS9mYXV4ZmlsZS5qcycpXG4gICAgICAgIGV4cGVjdChyZXQuc291cmNlUm9vdCkudG8uZXF1YWwodGVtcFByb2oxKVxuICAgICAgICBleHBlY3QocmV0LnByb2plY3RQYXRoKS50by5lcXVhbCh0ZW1wUHJvajEpXG5cbiAgICAgIGl0ICdyZXR1cm5zIHBhdGhzIGNvbmZpZyB3aXRoIHRhcmdldCAmIHNvdXJjZSBwYXRocyBzZXQnLCAtPlxuICAgICAgICB0ZW1wUHJvajEgPSB0ZW1wLm1rZGlyU3luYygpXG4gICAgICAgIHRlbXBQcm9qMiA9IHRlbXAubWtkaXJTeW5jKClcbiAgICAgICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzKFt0ZW1wUHJvajEsdGVtcFByb2oyXSlcbiAgICAgICAgY29uZmlnLmJhYmVsU291cmNlUGF0aCA9ICcvc291cmNlJyAjIHdpdGggZGlyIHByZWZpeFxuICAgICAgICBjb25maWcuYmFiZWxNYXBzUGF0aCA9J21hcHNwYXRoJyAjIGFuZCB3aXRob3V0XG4gICAgICAgIGNvbmZpZy5iYWJlbFRyYW5zcGlsZVBhdGggPSAnL3RyYW5zcGF0aCdcblxuICAgICAgICByZXQgPSBsYi5nZXRQYXRocyh0ZW1wUHJvajErJy9zb3VyY2UvZGlyYS9mYXV4ZmlsZS5qcycsY29uZmlnKVxuXG4gICAgICAgIGV4cGVjdChyZXQuc291cmNlRmlsZSkudG8uZXF1YWwodGVtcFByb2oxKycvc291cmNlL2RpcmEvZmF1eGZpbGUuanMnKVxuICAgICAgICBleHBlY3QocmV0LnNvdXJjZUZpbGVEaXIpLnRvLmVxdWFsKHRlbXBQcm9qMSsnL3NvdXJjZS9kaXJhJylcbiAgICAgICAgZXhwZWN0KHJldC5tYXBGaWxlKS50by5lcXVhbCh0ZW1wUHJvajErJy9tYXBzcGF0aC9kaXJhL2ZhdXhmaWxlLmpzLm1hcCcpXG4gICAgICAgIGV4cGVjdChyZXQudHJhbnNwaWxlZEZpbGUpLnRvLmVxdWFsKHRlbXBQcm9qMSsnL3RyYW5zcGF0aC9kaXJhL2ZhdXhmaWxlLmpzJylcbiAgICAgICAgZXhwZWN0KHJldC5zb3VyY2VSb290KS50by5lcXVhbCh0ZW1wUHJvajErJy9zb3VyY2UnKVxuICAgICAgICBleHBlY3QocmV0LnByb2plY3RQYXRoKS50by5lcXVhbCh0ZW1wUHJvajEpXG5cbiAgICAgIGl0ICdyZXR1cm5zIGNvcnJlY3QgcGF0aHMgd2l0aCBwcm9qZWN0IGluIHJvb3QgZGlyZWN0b3J5JywgLT5cbiAgICAgICAgdGVtcFByb2oxID0gdGVtcC5ta2RpclN5bmMoKVxuICAgICAgICB0ZW1wUHJvajIgPSB0ZW1wLm1rZGlyU3luYygpXG4gICAgICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyhbJy8nXSlcbiAgICAgICAgY29uZmlnLmJhYmVsU291cmNlUGF0aCA9ICdzb3VyY2UnXG4gICAgICAgIGNvbmZpZy5iYWJlbE1hcHNQYXRoID0nbWFwc3BhdGgnXG4gICAgICAgIGNvbmZpZy5iYWJlbFRyYW5zcGlsZVBhdGggPSAndHJhbnNwYXRoJ1xuXG4gICAgICAgIHJldCA9IGxiLmdldFBhdGhzKCcvc291cmNlL2RpcmEvZmF1eGZpbGUuanMnLGNvbmZpZylcblxuICAgICAgICBleHBlY3QocmV0LnNvdXJjZUZpbGUpLnRvLmVxdWFsKCcvc291cmNlL2RpcmEvZmF1eGZpbGUuanMnKVxuICAgICAgICBleHBlY3QocmV0LnNvdXJjZUZpbGVEaXIpLnRvLmVxdWFsKCcvc291cmNlL2RpcmEnKVxuICAgICAgICBleHBlY3QocmV0Lm1hcEZpbGUpLnRvLmVxdWFsKCcvbWFwc3BhdGgvZGlyYS9mYXV4ZmlsZS5qcy5tYXAnKVxuICAgICAgICBleHBlY3QocmV0LnRyYW5zcGlsZWRGaWxlKS50by5lcXVhbCgnL3RyYW5zcGF0aC9kaXJhL2ZhdXhmaWxlLmpzJylcbiAgICAgICAgZXhwZWN0KHJldC5zb3VyY2VSb290KS50by5lcXVhbCgnL3NvdXJjZScpXG4gICAgICAgIGV4cGVjdChyZXQucHJvamVjdFBhdGgpLnRvLmVxdWFsKCcvJylcblxuICAgIGlmIHByb2Nlc3MucGxhdGZvcm0ubWF0Y2ggL153aW4vXG4gICAgICBpdCAncmV0dXJucyBwYXRocyBmb3IgYSBuYW1lZCBzb3VyY2VmaWxlIHdpdGggZGVmYXVsdCBjb25maWcnLCAtPlxuICAgICAgICB0ZW1wUHJvajEgPSB0ZW1wLm1rZGlyU3luYygpXG4gICAgICAgIHRlbXBQcm9qMiA9IHRlbXAubWtkaXJTeW5jKClcbiAgICAgICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzKFt0ZW1wUHJvajEsdGVtcFByb2oyXSlcblxuICAgICAgICByZXQgPSBsYi5nZXRQYXRocyh0ZW1wUHJvajErJ1xcXFxzb3VyY2VcXFxcZGlyYVxcXFxmYXV4ZmlsZS5qcycsY29uZmlnKVxuXG4gICAgICAgIGV4cGVjdChyZXQuc291cmNlRmlsZSkudG8uZXF1YWwodGVtcFByb2oxKydcXFxcc291cmNlXFxcXGRpcmFcXFxcZmF1eGZpbGUuanMnKVxuICAgICAgICBleHBlY3QocmV0LnNvdXJjZUZpbGVEaXIpLnRvLmVxdWFsKHRlbXBQcm9qMSsnXFxcXHNvdXJjZVxcXFxkaXJhJylcbiAgICAgICAgZXhwZWN0KHJldC5tYXBGaWxlKS50by5lcXVhbCh0ZW1wUHJvajErJ1xcXFxzb3VyY2VcXFxcZGlyYVxcXFxmYXV4ZmlsZS5qcy5tYXAnKVxuICAgICAgICBleHBlY3QocmV0LnRyYW5zcGlsZWRGaWxlKS50by5lcXVhbCh0ZW1wUHJvajErJ1xcXFxzb3VyY2VcXFxcZGlyYVxcXFxmYXV4ZmlsZS5qcycpXG4gICAgICAgIGV4cGVjdChyZXQuc291cmNlUm9vdCkudG8uZXF1YWwodGVtcFByb2oxKVxuICAgICAgICBleHBlY3QocmV0LnByb2plY3RQYXRoKS50by5lcXVhbCh0ZW1wUHJvajEpXG5cbiAgICAgIGl0ICdyZXR1cm5zIHBhdGhzIGZvciBhIG5hbWVkIHNvdXJjZWZpbGUgd2l0aCBkZWZhdWx0IGNvbmZpZyArIGtlZXBGaWxlRXh0ZW50aW9ucycsIC0+XG4gICAgICAgIGNvbmZpZy5rZWVwRmlsZUV4dGVuc2lvbiA9IHRydWU7XG4gICAgICAgIHRlbXBQcm9qMSA9IHRlbXAubWtkaXJTeW5jKClcbiAgICAgICAgdGVtcFByb2oyID0gdGVtcC5ta2RpclN5bmMoKVxuICAgICAgICBhdG9tLnByb2plY3Quc2V0UGF0aHMoW3RlbXBQcm9qMSx0ZW1wUHJvajJdKVxuXG4gICAgICAgIHJldCA9IGxiLmdldFBhdGhzKHRlbXBQcm9qMSsnXFxcXHNvdXJjZVxcXFxkaXJhXFxcXGZhdXhmaWxlLmpzJyxjb25maWcpXG5cbiAgICAgICAgZXhwZWN0KHJldC5zb3VyY2VGaWxlKS50by5lcXVhbCh0ZW1wUHJvajErJ1xcXFxzb3VyY2VcXFxcZGlyYVxcXFxmYXV4ZmlsZS5qcycpXG4gICAgICAgIGV4cGVjdChyZXQuc291cmNlRmlsZURpcikudG8uZXF1YWwodGVtcFByb2oxKydcXFxcc291cmNlXFxcXGRpcmEnKVxuICAgICAgICBleHBlY3QocmV0Lm1hcEZpbGUpLnRvLmVxdWFsKHRlbXBQcm9qMSsnXFxcXHNvdXJjZVxcXFxkaXJhXFxcXGZhdXhmaWxlLmpzLm1hcCcpXG4gICAgICAgIGV4cGVjdChyZXQudHJhbnNwaWxlZEZpbGUpLnRvLmVxdWFsKHRlbXBQcm9qMSsnXFxcXHNvdXJjZVxcXFxkaXJhXFxcXGZhdXhmaWxlLmpzJylcbiAgICAgICAgZXhwZWN0KHJldC5zb3VyY2VSb290KS50by5lcXVhbCh0ZW1wUHJvajEpXG4gICAgICAgIGV4cGVjdChyZXQucHJvamVjdFBhdGgpLnRvLmVxdWFsKHRlbXBQcm9qMSlcblxuICAgICAgaXQgJ3JldHVybnMgcGF0aHMgY29uZmlnIHdpdGggdGFyZ2V0ICYgc291cmNlIHBhdGhzIHNldCcsIC0+XG4gICAgICAgIHRlbXBQcm9qMSA9IHRlbXAubWtkaXJTeW5jKClcbiAgICAgICAgdGVtcFByb2oyID0gdGVtcC5ta2RpclN5bmMoKVxuICAgICAgICBhdG9tLnByb2plY3Quc2V0UGF0aHMoW3RlbXBQcm9qMSwgdGVtcFByb2oyXSlcbiAgICAgICAgY29uZmlnLmJhYmVsU291cmNlUGF0aCA9ICdcXFxcc291cmNlJyAjIHdpdGggZGlyIHByZWZpeFxuICAgICAgICBjb25maWcuYmFiZWxNYXBzUGF0aCA9J21hcHNwYXRoJyAjIGFuZCB3aXRob3V0XG4gICAgICAgIGNvbmZpZy5iYWJlbFRyYW5zcGlsZVBhdGggPSAnXFxcXHRyYW5zcGF0aCdcblxuICAgICAgICByZXQgPSBsYi5nZXRQYXRocyh0ZW1wUHJvajErJ1xcXFxzb3VyY2VcXFxcZGlyYVxcXFxmYXV4ZmlsZS5qcycsY29uZmlnKVxuXG4gICAgICAgIGV4cGVjdChyZXQuc291cmNlRmlsZSkudG8uZXF1YWwodGVtcFByb2oxKydcXFxcc291cmNlXFxcXGRpcmFcXFxcZmF1eGZpbGUuanMnKVxuICAgICAgICBleHBlY3QocmV0LnNvdXJjZUZpbGVEaXIpLnRvLmVxdWFsKHRlbXBQcm9qMSsnXFxcXHNvdXJjZVxcXFxkaXJhJylcbiAgICAgICAgZXhwZWN0KHJldC5tYXBGaWxlKS50by5lcXVhbCh0ZW1wUHJvajErJ1xcXFxtYXBzcGF0aFxcXFxkaXJhXFxcXGZhdXhmaWxlLmpzLm1hcCcpXG4gICAgICAgIGV4cGVjdChyZXQudHJhbnNwaWxlZEZpbGUpLnRvLmVxdWFsKHRlbXBQcm9qMSsnXFxcXHRyYW5zcGF0aFxcXFxkaXJhXFxcXGZhdXhmaWxlLmpzJylcbiAgICAgICAgZXhwZWN0KHJldC5zb3VyY2VSb290KS50by5lcXVhbCh0ZW1wUHJvajErJ1xcXFxzb3VyY2UnKVxuICAgICAgICBleHBlY3QocmV0LnByb2plY3RQYXRoKS50by5lcXVhbCh0ZW1wUHJvajEpXG5cbiAgICAgIGl0ICdyZXR1cm5zIGNvcnJlY3QgcGF0aHMgd2l0aCBwcm9qZWN0IGluIHJvb3QgZGlyZWN0b3J5JywgLT5cbiAgICAgICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzKFsnQzpcXFxcJ10pXG4gICAgICAgIGNvbmZpZy5iYWJlbFNvdXJjZVBhdGggPSAnc291cmNlJ1xuICAgICAgICBjb25maWcuYmFiZWxNYXBzUGF0aCA9J21hcHNwYXRoJ1xuICAgICAgICBjb25maWcuYmFiZWxUcmFuc3BpbGVQYXRoID0gJ3RyYW5zcGF0aCdcblxuICAgICAgICByZXQgPSBsYi5nZXRQYXRocygnQzpcXFxcc291cmNlXFxcXGRpcmFcXFxcZmF1eGZpbGUuanMnLGNvbmZpZylcblxuICAgICAgICBleHBlY3QocmV0LnNvdXJjZUZpbGUpLnRvLmVxdWFsKCdDOlxcXFxzb3VyY2VcXFxcZGlyYVxcXFxmYXV4ZmlsZS5qcycpXG4gICAgICAgIGV4cGVjdChyZXQuc291cmNlRmlsZURpcikudG8uZXF1YWwoJ0M6XFxcXHNvdXJjZVxcXFxkaXJhJylcbiAgICAgICAgZXhwZWN0KHJldC5tYXBGaWxlKS50by5lcXVhbCgnQzpcXFxcbWFwc3BhdGhcXFxcZGlyYVxcXFxmYXV4ZmlsZS5qcy5tYXAnKVxuICAgICAgICBleHBlY3QocmV0LnRyYW5zcGlsZWRGaWxlKS50by5lcXVhbCgnQzpcXFxcdHJhbnNwYXRoXFxcXGRpcmFcXFxcZmF1eGZpbGUuanMnKVxuICAgICAgICBleHBlY3QocmV0LnNvdXJjZVJvb3QpLnRvLmVxdWFsKCdDOlxcXFxzb3VyY2UnKVxuICAgICAgICBleHBlY3QocmV0LnByb2plY3RQYXRoKS50by5lcXVhbCgnQzpcXFxcJylcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlICc6dHJhbnNwaWxlJywgLT5cbiAgICBub3RpZmljYXRpb25TcHkgPSBudWxsXG4gICAgbm90aWZpY2F0aW9uID0gbnVsbFxuICAgIHdyaXRlRmlsZVN0dWIgPSBudWxsXG4gICAgd3JpdGVGaWxlTmFtZSA9IG51bGxcblxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIG5vdGlmaWNhdGlvblNweSA9IGphc21pbmUuY3JlYXRlU3B5ICdub3RpZmljYXRpb25TcHknXG4gICAgICBub3RpZmljYXRpb24gPSBhdG9tLm5vdGlmaWNhdGlvbnMub25EaWRBZGROb3RpZmljYXRpb24gbm90aWZpY2F0aW9uU3B5XG4gICAgICB3cml0ZUZpbGVOYW1lID0gbnVsbFxuICAgICAgd3JpdGVGaWxlU3R1YiA9IHNweU9uKGZzLCd3cml0ZUZpbGVTeW5jJykuYW5kQ2FsbEZha2UgKHBhdGgpLT5cbiAgICAgICAgd3JpdGVGaWxlTmFtZSA9IHBhdGhcbiAgICBhZnRlckVhY2ggLT5cbiAgICAgIG5vdGlmaWNhdGlvbi5kaXNwb3NlKClcblxuICAgIGRlc2NyaWJlICd3aGVuIHRyYW5zcGlsZU9uU2F2ZSBpcyBmYWxzZScsIC0+XG4gICAgICBpdCAnZG9lcyBub3RoaW5nJywgLT5cbiAgICAgICAgY29uZmlnLnRyYW5zcGlsZU9uU2F2ZSA9IGZhbHNlXG5cbiAgICAgICAgc3B5T24obGIsICdnZXRDb25maWcnKS5hbmRDYWxsRmFrZSAtPiBjb25maWdcbiAgICAgICAgbGIudHJhbnNwaWxlKCdzb21lZmlsZW5hbWUnKVxuICAgICAgICBleHBlY3Qobm90aWZpY2F0aW9uU3B5LmNhbGxDb3VudCkudG8uZXF1YWwoMClcbiAgICAgICAgZXhwZWN0KHdyaXRlRmlsZVN0dWIuY2FsbENvdW50KS50by5lcXVhbCgwKVxuXG4gICAgZGVzY3JpYmUgJ1doZW4gYSBzb3VyY2UgZmlsZSBpcyBvdXRzaWRlIHRoZSBcImJhYmVsU291cmNlUGF0aFwiICYgc3VwcHJlc3MgbXNncyBmYWxzZScsIC0+XG4gICAgICBpdCAnbm90aWZpZXMgc291cmNlZmlsZSBpcyBub3QgaW5zaWRlIHNvdXJjZXBhdGgnLCAtPlxuICAgICAgICBhdG9tLnByb2plY3Quc2V0UGF0aHMoW19fZGlybmFtZV0pXG4gICAgICAgIGNvbmZpZy5iYWJlbFNvdXJjZVBhdGggPSAnZml4dHVyZXMnXG4gICAgICAgIGNvbmZpZy5iYWJlbFRyYW5zcGlsZVBhdGggPSAnZml4dHVyZXMnXG4gICAgICAgIGNvbmZpZy5iYWJlbE1hcHNQYXRoID0gJ2ZpeHR1cmVzJ1xuXG4gICAgICAgIHNweU9uKGxiLCAnZ2V0Q29uZmlnJykuYW5kQ2FsbEZha2UgLT4gY29uZmlnXG4gICAgICAgIGxiLnRyYW5zcGlsZShfX2Rpcm5hbWUrJy9mYWtlLmpzJylcbiAgICAgICAgZXhwZWN0KG5vdGlmaWNhdGlvblNweS5jYWxsQ291bnQpLnRvLmVxdWFsKDEpXG4gICAgICAgIG1zZyA9IG5vdGlmaWNhdGlvblNweS5jYWxsc1swXS5hcmdzWzBdLm1lc3NhZ2UgIyBmaXJzdCBjYWxsLCBmaXJzdCBhcmdcbiAgICAgICAgdHlwZSA9IG5vdGlmaWNhdGlvblNweS5jYWxsc1swXS5hcmdzWzBdLnR5cGVcbiAgICAgICAgZXhwZWN0KG1zZykudG8ubWF0Y2goL15MQjogQmFiZWwgZmlsZSBpcyBub3QgaW5zaWRlLylcbiAgICAgICAgZXhwZWN0KHdyaXRlRmlsZVN0dWIuY2FsbENvdW50KS50by5lcXVhbCgwKVxuXG4gICAgZGVzY3JpYmUgJ1doZW4gYSBzb3VyY2UgZmlsZSBpcyBvdXRzaWRlIHRoZSBcImJhYmVsU291cmNlUGF0aFwiICYgc3VwcHJlc3MgbXNncyB0cnVlJywgLT5cbiAgICAgIGl0ICdleGVjdHMgbm8gbm90aWZpY2F0aW9ucycsIC0+XG4gICAgICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyhbX19kaXJuYW1lXSlcbiAgICAgICAgY29uZmlnLmJhYmVsU291cmNlUGF0aCA9ICdmaXh0dXJlcydcbiAgICAgICAgY29uZmlnLmJhYmVsVHJhbnNwaWxlUGF0aCA9ICdmaXh0dXJlcydcbiAgICAgICAgY29uZmlnLmJhYmVsTWFwc1BhdGggPSAnZml4dHVyZXMnXG4gICAgICAgIGNvbmZpZy5zdXBwcmVzc1NvdXJjZVBhdGhNZXNzYWdlcyA9IHRydWVcblxuICAgICAgICBzcHlPbihsYiwgJ2dldENvbmZpZycpLmFuZENhbGxGYWtlIC0+IGNvbmZpZ1xuICAgICAgICBsYi50cmFuc3BpbGUoX19kaXJuYW1lKycvZmFrZS5qcycpXG4gICAgICAgIGV4cGVjdChub3RpZmljYXRpb25TcHkuY2FsbENvdW50KS50by5lcXVhbCgwKVxuICAgICAgICBleHBlY3Qod3JpdGVGaWxlU3R1Yi5jYWxsQ291bnQpLnRvLmVxdWFsKDApXG5cbiAgICBkZXNjcmliZSAnV2hlbiBhIGpzIGZpbGVzIGlzIHRyYW5zcGlsZWQgYW5kIGdldHMgYW4gZXJyb3InLCAtPlxuICAgICAgaXQgJ2l0IGlzc3VlcyBhIG5vdGlmaWNhdGlvbiBlcnJvciBtZXNzYWdlJywgLT5cbiAgICAgICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzKFtfX2Rpcm5hbWVdKVxuICAgICAgICBjb25maWcuYmFiZWxTb3VyY2VQYXRoID0gJ2ZpeHR1cmVzJ1xuICAgICAgICBjb25maWcuYmFiZWxUcmFuc3BpbGVQYXRoID0gJ2ZpeHR1cmVzJ1xuICAgICAgICBjb25maWcuYmFiZWxNYXBzUGF0aCA9ICdmaXh0dXJlcydcblxuICAgICAgICBzcHlPbihsYiwgJ2dldENvbmZpZycpLmFuZENhbGxGYWtlIC0+Y29uZmlnXG4gICAgICAgIGxiLnRyYW5zcGlsZShwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnZml4dHVyZXMvZGlyYS9kaXJhLjEvZGlyYS4yL2JhZC5qcycpKVxuICAgICAgICAjbWF5IHRha2UgYSB3aGlsZSBmb3IgdGhlIHRyYW5zcGlsZXIgdG8gcnVuIGFuZCBjYWxsIGhvbWVcbiAgICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgICBub3RpZmljYXRpb25TcHkuY2FsbENvdW50XG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBleHBlY3Qobm90aWZpY2F0aW9uU3B5LmNhbGxDb3VudCkudG8uZXF1YWwoMSlcbiAgICAgICAgICBtc2cgPSBub3RpZmljYXRpb25TcHkuY2FsbHNbMF0uYXJnc1swXS5tZXNzYWdlXG4gICAgICAgICAgZXhwZWN0KG1zZykudG8ubWF0Y2goL15MQjogQmFiZWwuKlRyYW5zcGlsZXIgRXJyb3IvKVxuICAgICAgICAgIGV4cGVjdCh3cml0ZUZpbGVTdHViLmNhbGxDb3VudCkudG8uZXF1YWwoMClcblxuICAgIGRlc2NyaWJlICdXaGVuIGEganMgZmlsZSBzYXZlZCBidXQgbm8gb3V0cHV0IGlzIHNldCcsIC0+XG4gICAgICBpdCAnY2FsbHMgdGhlIHRyYW5zcGlsZXIgYnV0IGRvZXNudCBzYXZlIG91dHB1dCcsIC0+XG4gICAgICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyhbX19kaXJuYW1lXSlcbiAgICAgICAgY29uZmlnLmJhYmVsU291cmNlUGF0aCA9ICdmaXh0dXJlcydcbiAgICAgICAgY29uZmlnLmJhYmVsVHJhbnNwaWxlUGF0aCA9ICdmaXh0dXJlcydcbiAgICAgICAgY29uZmlnLmJhYmVsTWFwc1BhdGggPSAnZml4dHVyZXMnXG4gICAgICAgIGNvbmZpZy5jcmVhdGVUcmFuc3BpbGVkQ29kZSA9IGZhbHNlXG5cbiAgICAgICAgc3B5T24obGIsICdnZXRDb25maWcnKS5hbmRDYWxsRmFrZSAtPmNvbmZpZ1xuICAgICAgICBsYi50cmFuc3BpbGUocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2ZpeHR1cmVzL2RpcmEvZGlyYS4xL2RpcmEuMi9yZWFjdC5qc3gnKSlcbiAgICAgICAgI21heSB0YWtlIGEgd2hpbGUgZm9yIHRoZSB0cmFuc3BpbGVyIHRvIHJ1biBhbmQgY2FsbCBob21lXG4gICAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgICAgbm90aWZpY2F0aW9uU3B5LmNhbGxDb3VudCA+IDFcbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGV4cGVjdChub3RpZmljYXRpb25TcHkuY2FsbENvdW50KS50by5lcXVhbCgyKVxuICAgICAgICAgIG1zZyA9IG5vdGlmaWNhdGlvblNweS5jYWxsc1swXS5hcmdzWzBdLm1lc3NhZ2VcbiAgICAgICAgICBleHBlY3QobXNnKS50by5tYXRjaCgvXkxCOiBCYWJlbC4qVHJhbnNwaWxlciBTdWNjZXNzLylcbiAgICAgICAgICBtc2cgPSBub3RpZmljYXRpb25TcHkuY2FsbHNbMV0uYXJnc1swXS5tZXNzYWdlXG4gICAgICAgICAgZXhwZWN0KG1zZykudG8ubWF0Y2goL15MQjogTm8gdHJhbnNwaWxlZCBvdXRwdXQgY29uZmlndXJlZC8pXG4gICAgICAgICAgZXhwZWN0KHdyaXRlRmlsZVN0dWIuY2FsbENvdW50KS50by5lcXVhbCgwKVxuXG5cbiAgICBkZXNjcmliZSAnV2hlbiBhIGpzIGZpbGUgc2F2ZWQgYnV0IG5vIHRyYW5zcGlsZSBwYXRoIGlzIHNldCcsIC0+XG4gICAgICBpdCAnY2FsbHMgdGhlIHRyYW5zcGlsZXIgYW5kIHRyYW5zcGlsZXMgT0sgYnV0IGRvZXNudCBzYXZlIGFuZCBpc3N1ZXMgbXNnJywgLT5cbiAgICAgICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzKFtfX2Rpcm5hbWVdKVxuICAgICAgICBjb25maWcuYmFiZWxTb3VyY2VQYXRoID0gJ2ZpeHR1cmVzJ1xuICAgICAgICBjb25maWcuYmFiZWxUcmFuc3BpbGVQYXRoID0gJ2ZpeHR1cmVzJ1xuICAgICAgICBjb25maWcuYmFiZWxNYXBzUGF0aCA9ICdmaXh0dXJlcydcblxuICAgICAgICBzcHlPbihsYiwgJ2dldENvbmZpZycpLmFuZENhbGxGYWtlIC0+Y29uZmlnXG4gICAgICAgIGxiLnRyYW5zcGlsZShwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnZml4dHVyZXMvZGlyYS9kaXJhLjEvZGlyYS4yL2dvb2QuanMnKSlcbiAgICAgICAgI21heSB0YWtlIGEgd2hpbGUgZm9yIHRoZSB0cmFuc3BpbGVyIHRvIHJ1biBhbmQgY2FsbCBob21lXG4gICAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgICAgbm90aWZpY2F0aW9uU3B5LmNhbGxDb3VudCA+IDFcbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGV4cGVjdChub3RpZmljYXRpb25TcHkuY2FsbENvdW50KS50by5lcXVhbCgyKVxuICAgICAgICAgIG1zZyA9IG5vdGlmaWNhdGlvblNweS5jYWxsc1swXS5hcmdzWzBdLm1lc3NhZ2UgIyBmaXJzdCBjYWxsLCBmaXJzdCBhcmdcbiAgICAgICAgICBleHBlY3QobXNnKS50by5tYXRjaCgvXkxCOiBCYWJlbC4qVHJhbnNwaWxlciBTdWNjZXNzLylcbiAgICAgICAgICBtc2cgPSBub3RpZmljYXRpb25TcHkuY2FsbHNbMV0uYXJnc1swXS5tZXNzYWdlXG4gICAgICAgICAgZXhwZWN0KG1zZykudG8ubWF0Y2goL15MQjogVHJhbnNwaWxlZCBmaWxlIHdvdWxkIG92ZXJ3cml0ZSBzb3VyY2UgZmlsZS8pXG4gICAgICAgICAgZXhwZWN0KHdyaXRlRmlsZVN0dWIuY2FsbENvdW50KS50by5lcXVhbCgwKVxuXG4gICAgZGVzY3JpYmUgJ1doZW4gYSBqc3ggZmlsZSBzYXZlZCx0cmFuc3BpbGUgcGF0aCBpcyBzZXQsIHNvdXJjZSBtYXBzIGVuYWJsZWQnLCAtPlxuICAgICAgaXQgJ2NhbGxzIHRoZSB0cmFuc3BpbGVyIGFuZCB0cmFuc3BpbGVzIE9LLCBzYXZlcyBhcyAuanMgYW5kIGlzc3VlcyBtc2cnLCAtPlxuICAgICAgICBhdG9tLnByb2plY3Quc2V0UGF0aHMoW19fZGlybmFtZV0pXG4gICAgICAgIGNvbmZpZy5iYWJlbFNvdXJjZVBhdGggPSAnZml4dHVyZXMnXG4gICAgICAgIGNvbmZpZy5iYWJlbFRyYW5zcGlsZVBhdGggPSAnZml4dHVyZXMtdHJhbnNwaWxlZCdcbiAgICAgICAgY29uZmlnLmJhYmVsTWFwc1BhdGggPSAnZml4dHVyZXMtbWFwcydcbiAgICAgICAgY29uZmlnLmNyZWF0ZU1hcCA9IHRydWVcblxuICAgICAgICBzcHlPbihsYiwgJ2dldENvbmZpZycpLmFuZENhbGxGYWtlIC0+Y29uZmlnXG4gICAgICAgIGxiLnRyYW5zcGlsZShwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnZml4dHVyZXMvZGlyYS9kaXJhLjEvZGlyYS4yL3JlYWN0LmpzeCcpKVxuICAgICAgICAjbWF5IHRha2UgYSB3aGlsZSBmb3IgdGhlIHRyYW5zcGlsZXIgdG8gcnVuIGFuZCBjYWxsIGhvbWVcbiAgICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgICB3cml0ZUZpbGVTdHViLmNhbGxDb3VudFxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZXhwZWN0KG5vdGlmaWNhdGlvblNweS5jYWxsQ291bnQpLnRvLmVxdWFsKDEpXG4gICAgICAgICAgbXNnID0gbm90aWZpY2F0aW9uU3B5LmNhbGxzWzBdLmFyZ3NbMF0ubWVzc2FnZSAjIGZpcnN0IGNhbGwsIGZpcnN0IGFyZ1xuICAgICAgICAgIGV4cGVjdChtc2cpLnRvLm1hdGNoKC9eTEI6IEJhYmVsLipUcmFuc3BpbGVyIFN1Y2Nlc3MvKVxuICAgICAgICAgIGV4cGVjdCh3cml0ZUZpbGVTdHViLmNhbGxDb3VudCkudG8uZXF1YWwoMilcbiAgICAgICAgICBzYXZlZEZpbGVuYW1lID0gd3JpdGVGaWxlU3R1Yi5jYWxsc1swXS5hcmdzWzBdXG4gICAgICAgICAgZXhwZWN0ZWRGaWxlTmFtZSA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdmaXh0dXJlcy10cmFuc3BpbGVkL2RpcmEvZGlyYS4xL2RpcmEuMi9yZWFjdC5qcycpXG4gICAgICAgICAgZXhwZWN0KHNhdmVkRmlsZW5hbWUpLnRvLmVxdWFsKGV4cGVjdGVkRmlsZU5hbWUpXG4gICAgICAgICAgc2F2ZWRGaWxlbmFtZSA9IHdyaXRlRmlsZVN0dWIuY2FsbHNbMV0uYXJnc1swXVxuICAgICAgICAgIGV4cGVjdGVkRmlsZU5hbWUgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnZml4dHVyZXMtbWFwcy9kaXJhL2RpcmEuMS9kaXJhLjIvcmVhY3QuanMubWFwJylcbiAgICAgICAgICBleHBlY3Qoc2F2ZWRGaWxlbmFtZSkudG8uZXF1YWwoZXhwZWN0ZWRGaWxlTmFtZSlcblxuICAgIGRlc2NyaWJlICdXaGVuIGEganN4IGZpbGUgc2F2ZWQsdHJhbnNwaWxlIHBhdGggaXMgc2V0LCBzb3VyY2UgbWFwcyBlbmFibGVkLCBzdWNjZXNzIHN1cHByZXNzZWQnLCAtPlxuICAgICAgaXQgJ2NhbGxzIHRoZSB0cmFuc3BpbGVyIGFuZCB0cmFuc3BpbGVzIE9LLCBzYXZlcyBhcyAuanMgYW5kIGlzc3VlcyBtc2cnLCAtPlxuICAgICAgICBhdG9tLnByb2plY3Quc2V0UGF0aHMoW19fZGlybmFtZV0pXG4gICAgICAgIGNvbmZpZy5iYWJlbFNvdXJjZVBhdGggPSAnZml4dHVyZXMnXG4gICAgICAgIGNvbmZpZy5iYWJlbFRyYW5zcGlsZVBhdGggPSAnZml4dHVyZXMtdHJhbnNwaWxlZCdcbiAgICAgICAgY29uZmlnLmJhYmVsTWFwc1BhdGggPSAnZml4dHVyZXMtbWFwcydcbiAgICAgICAgY29uZmlnLmNyZWF0ZU1hcCA9IHRydWVcbiAgICAgICAgY29uZmlnLnN1cHByZXNzVHJhbnNwaWxlT25TYXZlTWVzc2FnZXMgPSB0cnVlXG5cbiAgICAgICAgc3B5T24obGIsICdnZXRDb25maWcnKS5hbmRDYWxsRmFrZSAtPmNvbmZpZ1xuICAgICAgICBsYi50cmFuc3BpbGUocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2ZpeHR1cmVzL2RpcmEvZGlyYS4xL2RpcmEuMi9yZWFjdC5qc3gnKSlcbiAgICAgICAgI21heSB0YWtlIGEgd2hpbGUgZm9yIHRoZSB0cmFuc3BpbGVyIHRvIHJ1biBhbmQgY2FsbCBob21lXG4gICAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgICAgd3JpdGVGaWxlU3R1Yi5jYWxsQ291bnRcbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGV4cGVjdChub3RpZmljYXRpb25TcHkuY2FsbENvdW50KS50by5lcXVhbCgwKVxuICAgICAgICAgIGV4cGVjdCh3cml0ZUZpbGVTdHViLmNhbGxDb3VudCkudG8uZXF1YWwoMilcbiAgICAgICAgICBzYXZlZEZpbGVuYW1lID0gd3JpdGVGaWxlU3R1Yi5jYWxsc1swXS5hcmdzWzBdXG4gICAgICAgICAgZXhwZWN0ZWRGaWxlTmFtZSA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdmaXh0dXJlcy10cmFuc3BpbGVkL2RpcmEvZGlyYS4xL2RpcmEuMi9yZWFjdC5qcycpXG4gICAgICAgICAgZXhwZWN0KHNhdmVkRmlsZW5hbWUpLnRvLmVxdWFsKGV4cGVjdGVkRmlsZU5hbWUpXG4gICAgICAgICAgc2F2ZWRGaWxlbmFtZSA9IHdyaXRlRmlsZVN0dWIuY2FsbHNbMV0uYXJnc1swXVxuICAgICAgICAgIGV4cGVjdGVkRmlsZU5hbWUgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnZml4dHVyZXMtbWFwcy9kaXJhL2RpcmEuMS9kaXJhLjIvcmVhY3QuanMubWFwJylcbiAgICAgICAgICBleHBlY3Qoc2F2ZWRGaWxlbmFtZSkudG8uZXF1YWwoZXhwZWN0ZWRGaWxlTmFtZSlcblxuICAgIGRlc2NyaWJlICdXaGVuIGEganMgZmlsZSBzYXZlZCAsIGJhYmVscmMgaW4gcGF0aCBhbmQgZmxhZyBkaXNhYmxlV2hlbk5vQmFiZWxyY0ZpbGVJblBhdGggaXMgc2V0JywgLT5cbiAgICAgIGl0ICdjYWxscyB0aGUgdHJhbnNwaWxlcicsIC0+XG4gICAgICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyhbX19kaXJuYW1lXSlcbiAgICAgICAgY29uZmlnLmJhYmVsU291cmNlUGF0aCA9ICdmaXh0dXJlcydcbiAgICAgICAgY29uZmlnLmJhYmVsVHJhbnNwaWxlUGF0aCA9ICdmaXh0dXJlcydcbiAgICAgICAgY29uZmlnLmJhYmVsTWFwc1BhdGggPSAnZml4dHVyZXMnXG4gICAgICAgIGNvbmZpZy5jcmVhdGVUcmFuc3BpbGVkQ29kZSA9IGZhbHNlXG4gICAgICAgIGNvbmZpZy5kaXNhYmxlV2hlbk5vQmFiZWxyY0ZpbGVJblBhdGggPSB0cnVlXG5cbiAgICAgICAgc3B5T24obGIsICdnZXRDb25maWcnKS5hbmRDYWxsRmFrZSAtPmNvbmZpZ1xuICAgICAgICBsYi50cmFuc3BpbGUocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2ZpeHR1cmVzL2RpcmEvZGlyYS4xL2RpcmEuMi9nb29kLmpzJykpXG4gICAgICAgICNtYXkgdGFrZSBhIHdoaWxlIGZvciB0aGUgdHJhbnNwaWxlciB0byBydW4gYW5kIGNhbGwgaG9tZVxuICAgICAgICB3YWl0c0ZvciAtPlxuICAgICAgICAgIG5vdGlmaWNhdGlvblNweS5jYWxsQ291bnRcbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGV4cGVjdChub3RpZmljYXRpb25TcHkuY2FsbENvdW50KS50by5lcXVhbCgyKVxuICAgICAgICAgIG1zZyA9IG5vdGlmaWNhdGlvblNweS5jYWxsc1swXS5hcmdzWzBdLm1lc3NhZ2VcbiAgICAgICAgICBleHBlY3QobXNnKS50by5tYXRjaCgvXkxCOiBCYWJlbC4qVHJhbnNwaWxlciBTdWNjZXNzLylcbiAgICAgICAgICBtc2cgPSBub3RpZmljYXRpb25TcHkuY2FsbHNbMV0uYXJnc1swXS5tZXNzYWdlXG4gICAgICAgICAgZXhwZWN0KG1zZykudG8ubWF0Y2goL15MQjogTm8gdHJhbnNwaWxlZCBvdXRwdXQgY29uZmlndXJlZC8pXG4gICAgICAgICAgZXhwZWN0KHdyaXRlRmlsZVN0dWIuY2FsbENvdW50KS50by5lcXVhbCgwKVxuXG4gICAgZGVzY3JpYmUgJ1doZW4gYSBqcyBmaWxlIHNhdmVkICwgYmFiZWxyYyBpbiBub3QgaW4gcGF0aCBhbmQgZmxhZyBkaXNhYmxlV2hlbk5vQmFiZWxyY0ZpbGVJblBhdGggaXMgc2V0JywgLT5cbiAgICAgIGl0ICdkb2VzIG5vdGhpbmcnLCAtPlxuICAgICAgICBhdG9tLnByb2plY3Quc2V0UGF0aHMoW19fZGlybmFtZV0pXG4gICAgICAgIGNvbmZpZy5iYWJlbFNvdXJjZVBhdGggPSAnZml4dHVyZXMnXG4gICAgICAgIGNvbmZpZy5iYWJlbFRyYW5zcGlsZVBhdGggPSAnZml4dHVyZXMnXG4gICAgICAgIGNvbmZpZy5iYWJlbE1hcHNQYXRoID0gJ2ZpeHR1cmVzJ1xuICAgICAgICBjb25maWcuY3JlYXRlVHJhbnNwaWxlZENvZGUgPSBmYWxzZVxuICAgICAgICBjb25maWcuZGlzYWJsZVdoZW5Ob0JhYmVscmNGaWxlSW5QYXRoID0gdHJ1ZVxuXG4gICAgICAgIHNweU9uKGxiLCAnZ2V0Q29uZmlnJykuYW5kQ2FsbEZha2UgLT5jb25maWdcbiAgICAgICAgbGIudHJhbnNwaWxlKHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdmaXh0dXJlcy9kaXJiL2dvb2QuanMnKSlcbiAgICAgICAgZXhwZWN0KG5vdGlmaWNhdGlvblNweS5jYWxsQ291bnQpLnRvLmVxdWFsKDApXG4gICAgICAgIGV4cGVjdCh3cml0ZUZpbGVTdHViLmNhbGxDb3VudCkudG8uZXF1YWwoMClcblxuICAgIGRlc2NyaWJlICdXaGVuIGEganMgZmlsZSBzYXZlZCBpbiBhIG5lc3RlZCBwcm9qZWN0JywgLT5cbiAgICAgIGl0ICdjcmVhdGVzIGEgZmlsZSBpbiB0aGUgY29ycmVjdCBsb2NhdGlvbiBiYXNlZCB1cG9uIC5sYW5ndWFnZWJhYmVsJywgLT5cbiAgICAgICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzKFtfX2Rpcm5hbWVdKVxuICAgICAgICBjb25maWcuYWxsb3dMb2NhbE92ZXJyaWRlID0gdHJ1ZVxuXG4gICAgICAgIHNweU9uKGxiLCAnZ2V0Q29uZmlnJykuYW5kQ2FsbEZha2UgLT4gY29uZmlnXG4gICAgICAgIHNvdXJjZUZpbGUgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnZml4dHVyZXMvcHJvamVjdFJvb3Qvc3JjL3Rlc3QuanMnKVxuICAgICAgICB0YXJnZXRGaWxlID0gIHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdmaXh0dXJlcy9wcm9qZWN0Um9vdC90ZXN0LmpzJylcbiAgICAgICAgbGIudHJhbnNwaWxlKHNvdXJjZUZpbGUpXG4gICAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgICAgd3JpdGVGaWxlU3R1Yi5jYWxsQ291bnRcbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGV4cGVjdCh3cml0ZUZpbGVOYW1lKS50by5lcXVhbCh0YXJnZXRGaWxlKVxuXG4gICAgZGVzY3JpYmUgJ1doZW4gYSBkaXJlY3RvcnkgaXMgY29tcGlsZWQnLCAtPlxuICAgICAgaXQgJ3RyYW5zcGlsZXMgdGhlIGpzLGpzeCxlcyxlczYsYmFiZWwgZmlsZXMgYnV0IGlnbm9yZXMgbWluaWZpZWQgZmlsZXMnLCAtPlxuICAgICAgICBhdG9tLnByb2plY3Quc2V0UGF0aHMoW19fZGlybmFtZV0pXG4gICAgICAgIGNvbmZpZy5hbGxvd0xvY2FsT3ZlcnJpZGUgPSB0cnVlXG5cbiAgICAgICAgc3B5T24obGIsICdnZXRDb25maWcnKS5hbmRDYWxsRmFrZSAtPiBjb25maWdcbiAgICAgICAgc291cmNlRGlyID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2ZpeHR1cmVzL3Byb2plY3RSb290L3NyYy8nKVxuICAgICAgICBsYi50cmFuc3BpbGVEaXJlY3Rvcnkoe2RpcmVjdG9yeTogc291cmNlRGlyfSlcbiAgICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgICB3cml0ZUZpbGVTdHViLmNhbGxDb3VudCA+PSA1XG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBleHBlY3Qod3JpdGVGaWxlU3R1Yi5jYWxsQ291bnQpLnRvLmVxdWFsKDUpXG4iXX0=
