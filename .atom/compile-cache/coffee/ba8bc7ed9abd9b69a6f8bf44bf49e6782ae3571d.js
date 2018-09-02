(function() {
  var fs, path, requireBabelCore, resolveBabelCore;

  fs = require('fs-plus');

  path = require('path');

  requireBabelCore = function(dir) {
    var babelCore;
    if (dir !== path.dirname(dir)) {
      if (babelCore = resolveBabelCore(dir)) {
        return babelCore;
      } else {
        return requireBabelCore(path.dirname(dir));
      }
    }
    return resolveBabelCore('..');
  };

  resolveBabelCore = function(dir) {
    var babel, projectBabelCore;
    try {
      projectBabelCore = path.normalize(path.join(dir, '/node_modules/@babel/core'));
      babel = require(projectBabelCore);
    } catch (error) {
      try {
        projectBabelCore = path.normalize(path.join(dir, '/node_modules/babel-core'));
        babel = require(projectBabelCore);
      } catch (error) {
        return false;
      }
    }
    return {
      'babel': babel,
      'projectBabelCore': projectBabelCore
    };
  };

  module.exports = function(projectPath) {
    var babel, babelCoreUsed, callback, projectBabelCore, ref;
    callback = this.async();
    process.chdir(projectPath);
    ref = requireBabelCore(projectPath), babel = ref.babel, projectBabelCore = ref.projectBabelCore;
    babelCoreUsed = "Using babel-core at\n" + (require.resolve(projectBabelCore));
    return process.on('message', function(mObj) {
      var err, msgRet;
      if (mObj.command === 'transpile') {
        try {
          babel.transformFile(mObj.pathTo.sourceFile, mObj.babelOptions, (function(_this) {
            return function(err, result) {
              var msgRet;
              msgRet = {};
              msgRet.reqId = mObj.reqId;
              if (err) {
                msgRet.err = {};
                if (err.loc) {
                  msgRet.err.loc = err.loc;
                }
                if (err.codeFrame) {
                  msgRet.err.codeFrame = err.codeFrame;
                } else {
                  msgRet.err.codeFrame = "";
                }
                msgRet.err.message = err.message;
              }
              if (result) {
                msgRet.result = result;
                msgRet.result.ast = null;
              }
              msgRet.babelVersion = babel.version;
              msgRet.babelCoreUsed = babelCoreUsed;
              emit("transpile:" + mObj.reqId, msgRet);
              if (!mObj.pathTo.sourceFileInProject) {
                return callback();
              }
            };
          })(this));
        } catch (error) {
          err = error;
          msgRet = {};
          msgRet.reqId = mObj.reqId;
          msgRet.err = {};
          msgRet.err.message = err.message;
          msgRet.err.stack = err.stack;
          msgRet.babelCoreUsed = babelCoreUsed;
          emit("transpile:" + mObj.reqId, msgRet);
          callback();
        }
      }
      if (mObj.command === 'transpileCode') {
        try {
          msgRet = babel.transform(mObj.code, mObj.babelOptions);
          msgRet.babelVersion = babel.version;
          msgRet.babelCoreUsed = babelCoreUsed;
          emit("transpile:" + mObj.reqId, msgRet);
          if (!mObj.pathTo.sourceFileInProject) {
            callback();
          }
        } catch (error) {
          err = error;
          msgRet = {};
          msgRet.reqId = mObj.reqId;
          msgRet.err = {};
          msgRet.err.message = err.message;
          msgRet.err.stack = err.stack;
          msgRet.babelVersion = babel.version;
          msgRet.babelCoreUsed = babelCoreUsed;
          emit("transpile:" + mObj.reqId, msgRet);
          callback();
        }
      }
      if (mObj.command === 'stop') {
        return callback();
      }
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdGhla2FybG85NS8uYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1iYWJlbC9saWIvdHJhbnNwaWxlci10YXNrLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFJUCxnQkFBQSxHQUFtQixTQUFDLEdBQUQ7QUFDakIsUUFBQTtJQUFBLElBQUcsR0FBQSxLQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsR0FBYixDQUFWO01BQ0UsSUFBRyxTQUFBLEdBQVksZ0JBQUEsQ0FBaUIsR0FBakIsQ0FBZjtBQUEwQyxlQUFPLFVBQWpEO09BQUEsTUFBQTtBQUNLLGVBQU8sZ0JBQUEsQ0FBaUIsSUFBSSxDQUFDLE9BQUwsQ0FBYSxHQUFiLENBQWpCLEVBRFo7T0FERjs7QUFHQSxXQUFPLGdCQUFBLENBQWlCLElBQWpCO0VBSlU7O0VBT25CLGdCQUFBLEdBQW1CLFNBQUMsR0FBRDtBQUNqQixRQUFBO0FBQUE7TUFDRSxnQkFBQSxHQUFtQixJQUFJLENBQUMsU0FBTCxDQUFnQixJQUFJLENBQUMsSUFBTCxDQUFXLEdBQVgsRUFBZ0IsMkJBQWhCLENBQWhCO01BQ25CLEtBQUEsR0FBUSxPQUFBLENBQVEsZ0JBQVIsRUFGVjtLQUFBLGFBQUE7QUFJRTtRQUNFLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxTQUFMLENBQWdCLElBQUksQ0FBQyxJQUFMLENBQVcsR0FBWCxFQUFnQiwwQkFBaEIsQ0FBaEI7UUFDbkIsS0FBQSxHQUFRLE9BQUEsQ0FBUSxnQkFBUixFQUZWO09BQUEsYUFBQTtBQUlFLGVBQU8sTUFKVDtPQUpGOztXQVNBO01BQUEsT0FBQSxFQUFTLEtBQVQ7TUFDQSxrQkFBQSxFQUFvQixnQkFEcEI7O0VBVmlCOztFQWVuQixNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFD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QUMsR0FBRyxDQUFDLE9BQVgsR0FBcUIsR0FBRyxDQUFDO1VBQ3pCLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBWCxHQUFtQixHQUFHLENBQUM7VUFDdkIsTUFBTSxDQUFDLFlBQVAsR0FBc0IsS0FBSyxDQUFDO1VBQzVCLE1BQU0sQ0FBQyxhQUFQLEdBQXVCO1VBQ3ZCLElBQUEsQ0FBSyxZQUFBLEdBQWEsSUFBSSxDQUFDLEtBQXZCLEVBQWdDLE1BQWhDO1VBQ0EsUUFBQSxDQUFBLEVBbkJGO1NBREY7O01BdUJBLElBQUcsSUFBSSxDQUFDLE9BQUwsS0FBZ0IsTUFBbkI7ZUFDRSxRQUFBLENBQUEsRUFERjs7SUExRG9CLENBQXRCO0VBUGU7QUEzQmpCIiwic291cmNlc0NvbnRlbnQiOlsiZnMgPSByZXF1aXJlICdmcy1wbHVzJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5cbiMgcmVjdXJzZSBkaXJlY3RvcmllcyB0byByb290IGxvb2tpbmcgZm9yIGJhYmVsIGNvcmVcbiMgb3IgcHJvdmlkZSBvdXIgb3duXG5yZXF1aXJlQmFiZWxDb3JlID0gKGRpcikgLT5cbiAgaWYgZGlyICE9IHBhdGguZGlybmFtZShkaXIpXG4gICAgaWYgYmFiZWxDb3JlID0gcmVzb2x2ZUJhYmVsQ29yZShkaXIpIHRoZW4gcmV0dXJuIGJhYmVsQ29yZVxuICAgIGVsc2UgcmV0dXJuIHJlcXVpcmVCYWJlbENvcmUocGF0aC5kaXJuYW1lKGRpcikpXG4gIHJldHVybiByZXNvbHZlQmFiZWxDb3JlKCcuLicpICMgcmV0dXJuIGxhbmd1YWdlLWJhYmVsJ3MgY29weSBvZiBiYWJlbC1jb3JlXG5cbiMgcmVzb2x2ZSBhIGJhYmVsIGNvcmUgaW4gdGhlIGRpclxucmVzb2x2ZUJhYmVsQ29yZSA9IChkaXIpIC0+XG4gIHRyeVxuICAgIHByb2plY3RCYWJlbENvcmUgPSBwYXRoLm5vcm1hbGl6ZSggcGF0aC5qb2luKCBkaXIsICcvbm9kZV9tb2R1bGVzL0BiYWJlbC9jb3JlJykpXG4gICAgYmFiZWwgPSByZXF1aXJlIHByb2plY3RCYWJlbENvcmVcbiAgY2F0Y2hcbiAgICB0cnlcbiAgICAgIHByb2plY3RCYWJlbENvcmUgPSBwYXRoLm5vcm1hbGl6ZSggcGF0aC5qb2luKCBkaXIsICcvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUnKSlcbiAgICAgIGJhYmVsID0gcmVxdWlyZSBwcm9qZWN0QmFiZWxDb3JlXG4gICAgY2F0Y2hcbiAgICAgIHJldHVybiBmYWxzZVxuICAnYmFiZWwnOiBiYWJlbFxuICAncHJvamVjdEJhYmVsQ29yZSc6IHByb2plY3RCYWJlbENvcmVcblxuIyBsYW5ndWFnZS1iYWJlbCB0cmFuc3BpbGVzIHJ1biBoZXJlLlxuIyBUaGlzIHJ1bnMgYXMgYSBzZXBhcmF0ZSB0YXNrIHNvIHRoYXQgdHJhbnNwaWxlcyBjYW4gaGF2ZSB0aGVpciBvd24gZW52aXJvbm1lbnQuXG5tb2R1bGUuZXhwb3J0cyA9IChwcm9qZWN0UGF0aCkgLT5cbiAgY2FsbGJhY2sgPSBAYXN5bmMoKSAjYXN5bmMgdGFza1xuICBwcm9jZXNzLmNoZGlyKHByb2plY3RQYXRoKVxuXG4gIHsgYmFiZWwsIHByb2plY3RCYWJlbENvcmUgfSA9IHJlcXVpcmVCYWJlbENvcmUocHJvamVjdFBhdGgpXG4gIGJhYmVsQ29yZVVzZWQgPSBcIlVzaW5nIGJhYmVsLWNvcmUgYXRcXG4je3JlcXVpcmUucmVzb2x2ZSBwcm9qZWN0QmFiZWxDb3JlfVwiXG5cbiAgcHJvY2Vzcy5vbiAnbWVzc2FnZScsIChtT2JqKSAtPlxuICAgIGlmIG1PYmouY29tbWFuZCBpcyAndHJhbnNwaWxlJ1xuICAgICAgdHJ5XG4gICAgICAgIGJhYmVsLnRyYW5zZm9ybUZpbGUgbU9iai5wYXRoVG8uc291cmNlRmlsZSwgbU9iai5iYWJlbE9wdGlvbnMsIChlcnIscmVzdWx0KSA9PlxuICAgICAgICAgICMgZmlkZGx5IGZvcm1hdGluZyBhIHJldHVyblxuICAgICAgICAgIG1zZ1JldCA9IHt9XG4gICAgICAgICAgbXNnUmV0LnJlcUlkID0gbU9iai5yZXFJZCAjIHNlbmQgYmFjayB0byByZXFJZFxuICAgICAgICAgIGlmIGVyclxuICAgICAgICAgICAgbXNnUmV0LmVyciA9IHt9XG4gICAgICAgICAgICBpZiBlcnIubG9jIHRoZW4gbXNnUmV0LmVyci5sb2MgPSBlcnIubG9jXG4gICAgICAgICAgICBpZiBlcnIuY29kZUZyYW1lXG4gICAgICAgICAgICAgIG1zZ1JldC5lcnIuY29kZUZyYW1lID0gZXJyLmNvZGVGcmFtZVxuICAgICAgICAgICAgZWxzZSBtc2dSZXQuZXJyLmNvZGVGcmFtZSA9IFwiXCJcbiAgICAgICAgICAgIG1zZ1JldC5lcnIubWVzc2FnZSA9IGVyci5tZXNzYWdlXG4gICAgICAgICAgaWYgcmVzdWx0XG4gICAgICAgICAgICBtc2dSZXQucmVzdWx0ID0gcmVzdWx0XG4gICAgICAgICAgICBtc2dSZXQucmVzdWx0LmFzdCA9IG51bGw7ICMgYXN0IHNlZW1zIHRvIGNyZWF0ZSBhIEpTT04gY2lyY3VsYXIgcmVmIG9uIGVtaXRcbiAgICAgICAgICBtc2dSZXQuYmFiZWxWZXJzaW9uID0gYmFiZWwudmVyc2lvblxuICAgICAgICAgIG1zZ1JldC5iYWJlbENvcmVVc2VkID0gYmFiZWxDb3JlVXNlZFxuICAgICAgICAgIGVtaXQgXCJ0cmFuc3BpbGU6I3ttT2JqLnJlcUlkfVwiLCBtc2dSZXRcbiAgICAgICAgICAjIGlmIHRoaXMgZmlsZSB0cmFuc3BpbGF0aW9uIGlzbid0IGluIGEgQXRvbSBwcm9qZWN0IGZvbGRlciB0aGVuIHRlcm0gdGhpcyB0YXNrXG4gICAgICAgICAgIyBhcyB0aGlzIGlzIG5vcm1hbGx5IGFuIEFkLWhvYyBmaWxlIHRyYW5zcGlsZS5cbiAgICAgICAgICBpZiBub3QgbU9iai5wYXRoVG8uc291cmNlRmlsZUluUHJvamVjdFxuICAgICAgICAgICAgY2FsbGJhY2soKVxuICAgICAgY2F0Y2ggZXJyXG4gICAgICAgIG1zZ1JldCA9IHt9XG4gICAgICAgIG1zZ1JldC5yZXFJZCA9IG1PYmoucmVxSWQgIyBzZW5kIGJhY2sgdG8gcmVxSWRcbiAgICAgICAgbXNnUmV0LmVyciA9IHt9XG4gICAgICAgIG1zZ1JldC5lcnIubWVzc2FnZSA9IGVyci5tZXNzYWdlXG4gICAgICAgIG1zZ1JldC5lcnIuc3RhY2sgPSBlcnIuc3RhY2tcbiAgICAgICAgbXNnUmV0LmJhYmVsQ29yZVVzZWQgPSBiYWJlbENvcmVVc2VkXG4gICAgICAgIGVtaXQgXCJ0cmFuc3BpbGU6I3ttT2JqLnJlcUlkfVwiLCBtc2dSZXRcbiAgICAgICAgY2FsbGJhY2soKVxuXG4gICAgIyB1c2VkIGZvciBwcmV2aWV3XG4gICAgaWYgbU9iai5jb21tYW5kIGlzICd0cmFuc3BpbGVDb2RlJ1xuICAgICAgdHJ5XG4gICAgICAgIG1zZ1JldCA9IGJhYmVsLnRyYW5zZm9ybSBtT2JqLmNvZGUsIG1PYmouYmFiZWxPcHRpb25zXG4gICAgICAgICMgZmlkZGx5IGZvcm1hdGluZyBhIHJldHVyblxuICAgICAgICBtc2dSZXQuYmFiZWxWZXJzaW9uID0gYmFiZWwudmVyc2lvblxuICAgICAgICBtc2dSZXQuYmFiZWxDb3JlVXNlZCA9IGJhYmVsQ29yZVVzZWRcbiAgICAgICAgZW1pdCBcInRyYW5zcGlsZToje21PYmoucmVxSWR9XCIsIG1zZ1JldFxuICAgICAgICAjIGlmIHRoaXMgZmlsZSB0cmFuc3BpbGF0aW9uIGlzbid0IGluIGEgQXRvbSBwcm9qZWN0IGZvbGRlciB0aGVuIHRlcm0gdGhpcyB0YXNrXG4gICAgICAgICMgYXMgdGhpcyBpcyBub3JtYWxseSBhbiBBZC1ob2MgZmlsZSB0cmFuc3BpbGUuXG4gICAgICAgIGlmIG5vdCBtT2JqLnBhdGhUby5zb3VyY2VGaWxlSW5Qcm9qZWN0XG4gICAgICAgICAgY2FsbGJhY2soKVxuICAgICAgY2F0Y2ggZXJyXG4gICAgICAgIG1zZ1JldCA9IHt9XG4gICAgICAgIG1zZ1JldC5yZXFJZCA9IG1PYmoucmVxSWQgIyBzZW5kIGJhY2sgdG8gcmVxSWRcbiAgICAgICAgbXNnUmV0LmVyciA9IHt9XG4gICAgICAgIG1zZ1JldC5lcnIubWVzc2FnZSA9IGVyci5tZXNzYWdlXG4gICAgICAgIG1zZ1JldC5lcnIuc3RhY2sgPSBlcnIuc3RhY2tcbiAgICAgICAgbXNnUmV0LmJhYmVsVmVyc2lvbiA9IGJhYmVsLnZlcnNpb25cbiAgICAgICAgbXNnUmV0LmJhYmVsQ29yZVVzZWQgPSBiYWJlbENvcmVVc2VkXG4gICAgICAgIGVtaXQgXCJ0cmFuc3BpbGU6I3ttT2JqLnJlcUlkfVwiLCBtc2dSZXRcbiAgICAgICAgY2FsbGJhY2soKVxuXG4gICAgI3N0b3AgaXNzdWVkIHN0b3AgcHJvY2Vzc1xuICAgIGlmIG1PYmouY29tbWFuZCBpcyAnc3RvcCdcbiAgICAgIGNhbGxiYWNrKClcbiJdfQ==
