'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function (returnValue) {
  // This will be a 2d array: list of param lists
  // for each time it was called.
  var calledWith = [];

  var call = function call() {
    for (var _len = arguments.length, passedArgs = Array(_len), _key = 0; _key < _len; _key++) {
      passedArgs[_key] = arguments[_key];
    }

    // Save all the params received to exposed local var
    calledWith.push(passedArgs);
    // Return value provided on spy init
    return returnValue === undefined ? 'called spy' : returnValue;
  };

  return {
    call: call,
    calledWith: calledWith,
    called: function called() {
      return calledWith.length;
    }
  };
};

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvbGludGVyLWVzbGludC9zcGVjL21ha2Utc3B5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQTs7Ozs7O3FCQUVJLFVBQUMsV0FBVyxFQUFLOzs7QUFHOUIsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFBOztBQUVyQixNQUFNLElBQUksR0FBRyxTQUFQLElBQUksR0FBc0I7c0NBQWYsVUFBVTtBQUFWLGdCQUFVOzs7O0FBRXpCLGNBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7O0FBRTNCLFdBQU8sV0FBVyxLQUFLLFNBQVMsR0FDNUIsWUFBWSxHQUNaLFdBQVcsQ0FBQTtHQUNoQixDQUFBOztBQUVELFNBQU87QUFDTCxRQUFJLEVBQUosSUFBSTtBQUNKLGNBQVUsRUFBVixVQUFVO0FBQ1YsVUFBTSxFQUFFO2FBQU0sVUFBVSxDQUFDLE1BQU07S0FBQTtHQUNoQyxDQUFBO0NBQ0YiLCJmaWxlIjoiL2hvbWUvdGhla2FybG85NS8uYXRvbS9wYWNrYWdlcy9saW50ZXItZXNsaW50L3NwZWMvbWFrZS1zcHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5leHBvcnQgZGVmYXVsdCAocmV0dXJuVmFsdWUpID0+IHtcbiAgLy8gVGhpcyB3aWxsIGJlIGEgMmQgYXJyYXk6IGxpc3Qgb2YgcGFyYW0gbGlzdHNcbiAgLy8gZm9yIGVhY2ggdGltZSBpdCB3YXMgY2FsbGVkLlxuICBjb25zdCBjYWxsZWRXaXRoID0gW11cblxuICBjb25zdCBjYWxsID0gKC4uLnBhc3NlZEFyZ3MpID0+IHtcbiAgICAvLyBTYXZlIGFsbCB0aGUgcGFyYW1zIHJlY2VpdmVkIHRvIGV4cG9zZWQgbG9jYWwgdmFyXG4gICAgY2FsbGVkV2l0aC5wdXNoKHBhc3NlZEFyZ3MpXG4gICAgLy8gUmV0dXJuIHZhbHVlIHByb3ZpZGVkIG9uIHNweSBpbml0XG4gICAgcmV0dXJuIHJldHVyblZhbHVlID09PSB1bmRlZmluZWRcbiAgICAgID8gJ2NhbGxlZCBzcHknXG4gICAgICA6IHJldHVyblZhbHVlXG4gIH1cblxuICByZXR1cm4ge1xuICAgIGNhbGwsXG4gICAgY2FsbGVkV2l0aCxcbiAgICBjYWxsZWQ6ICgpID0+IGNhbGxlZFdpdGgubGVuZ3RoXG4gIH1cbn1cbiJdfQ==