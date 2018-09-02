function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _srcValidateEditor = require('../../src/validate/editor');

var _makeSpy = require('../make-spy');

var _makeSpy2 = _interopRequireDefault(_makeSpy);

// NOTE throwIfInvalidPoint not covered,
// but it is a simple composition of 2 tested functions.

'use babel';

describe('isValidPoint', function () {
  it('returns true if clipped point reports being equal to point', function () {
    var mockPoint = { isEqual: function isEqual() {
        return true;
      } };
    var spy = (0, _makeSpy2['default'])(mockPoint);
    var mockTextBuffer = { clipPosition: spy.call };
    var point = [34, 110];

    var result = _srcValidateEditor.isValidPoint.apply(undefined, [mockTextBuffer].concat(point));
    expect(spy.calledWith[0][0]).toEqual(point);
    expect(result).toBe(true);
  });

  it('returns false if clipped point reports not being equal to point', function () {
    var mockPoint = { isEqual: function isEqual() {
        return false;
      } };
    var spy = (0, _makeSpy2['default'])(mockPoint);
    var mockTextBuffer = { clipPosition: spy.call };
    var point = [12, 14];

    var result = _srcValidateEditor.isValidPoint.apply(undefined, [mockTextBuffer].concat(point));
    expect(spy.calledWith[0][0]).toEqual(point);
    expect(result).toBe(false);
  });
});

describe('hasValidScope', function () {
  it('returns true if scopes array contains some value in validScopes', function () {
    var mockEditor = {
      getCursors: function getCursors() {
        return [{
          getScopeDescriptor: function getScopeDescriptor() {
            return {
              getScopesArray: function getScopesArray() {
                return ['valid.scope'];
              }
            };
          }
        }];
      }
    };
    var scopes = ['valid.scope'];
    var result = (0, _srcValidateEditor.hasValidScope)(mockEditor, scopes);
    expect(result).toBe(true);
  });

  it('returns false when scopes array has no values in validScopes', function () {
    var mockEditor = {
      getCursors: function getCursors() {
        return [{
          getScopeDescriptor: function getScopeDescriptor() {
            return {
              getScopesArray: function getScopesArray() {
                return ['someother.scope'];
              }
            };
          }
        }];
      }
    };
    var scopes = ['invalid.scope'];
    var result = (0, _srcValidateEditor.hasValidScope)(mockEditor, scopes);
    expect(result).toBe(false);
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RoZWthcmxvOTUvLmF0b20vcGFja2FnZXMvbGludGVyLWVzbGludC9zcGVjL3ZhbGlkYXRlL2VkaXRvci1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O2lDQUU0QywyQkFBMkI7O3VCQUNuRCxhQUFhOzs7Ozs7O0FBSGpDLFdBQVcsQ0FBQTs7QUFRWCxRQUFRLENBQUMsY0FBYyxFQUFFLFlBQU07QUFDN0IsSUFBRSxDQUFDLDREQUE0RCxFQUFFLFlBQU07QUFDckUsUUFBTSxTQUFTLEdBQUcsRUFBRSxPQUFPLEVBQUU7ZUFBTSxJQUFJO09BQUEsRUFBRSxDQUFBO0FBQ3pDLFFBQU0sR0FBRyxHQUFHLDBCQUFRLFNBQVMsQ0FBQyxDQUFBO0FBQzlCLFFBQU0sY0FBYyxHQUFHLEVBQUUsWUFBWSxFQUFFLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtBQUNqRCxRQUFNLEtBQUssR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQTs7QUFFdkIsUUFBTSxNQUFNLEdBQUcsa0RBQWEsY0FBYyxTQUFLLEtBQUssRUFBQyxDQUFBO0FBQ3JELFVBQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzNDLFVBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDMUIsQ0FBQyxDQUFBOztBQUVGLElBQUUsQ0FBQyxpRUFBaUUsRUFBRSxZQUFNO0FBQzFFLFFBQU0sU0FBUyxHQUFHLEVBQUUsT0FBTyxFQUFFO2VBQU0sS0FBSztPQUFBLEVBQUUsQ0FBQTtBQUMxQyxRQUFNLEdBQUcsR0FBRywwQkFBUSxTQUFTLENBQUMsQ0FBQTtBQUM5QixRQUFNLGNBQWMsR0FBRyxFQUFFLFlBQVksRUFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUE7QUFDakQsUUFBTSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUE7O0FBRXRCLFFBQU0sTUFBTSxHQUFHLGtEQUFhLGNBQWMsU0FBSyxLQUFLLEVBQUMsQ0FBQTtBQUNyRCxVQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUMzQyxVQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0dBQzNCLENBQUMsQ0FBQTtDQUNILENBQUMsQ0FBQTs7QUFFRixRQUFRLENBQUMsZUFBZSxFQUFFLFlBQU07QUFDOUIsSUFBRSxDQUFDLGlFQUFpRSxFQUFFLFlBQU07QUFDMUUsUUFBTSxVQUFVLEdBQUc7QUFDakIsZ0JBQVUsRUFBRTtlQUFNLENBQUM7QUFDakIsNEJBQWtCLEVBQUU7bUJBQU87QUFDekIsNEJBQWMsRUFBRTt1QkFBTSxDQUFDLGFBQWEsQ0FBQztlQUFBO2FBQ3RDO1dBQUM7U0FDSCxDQUFDO09BQUE7S0FDSCxDQUFBO0FBQ0QsUUFBTSxNQUFNLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUM5QixRQUFNLE1BQU0sR0FBRyxzQ0FBYyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUE7QUFDaEQsVUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtHQUMxQixDQUFDLENBQUE7O0FBRUYsSUFBRSxDQUFDLDhEQUE4RCxFQUFFLFlBQU07QUFDdkUsUUFBTSxVQUFVLEdBQUc7QUFDakIsZ0JBQVUsRUFBRTtlQUFNLENBQUM7QUFDakIsNEJBQWtCLEVBQUU7bUJBQU87QUFDekIsNEJBQWMsRUFBRTt1QkFBTSxDQUFDLGlCQUFpQixDQUFDO2VBQUE7YUFDMUM7V0FBQztTQUNILENBQUM7T0FBQTtLQUNILENBQUE7QUFDRCxRQUFNLE1BQU0sR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFBO0FBQ2hDLFFBQU0sTUFBTSxHQUFHLHNDQUFjLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQTtBQUNoRCxVQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0dBQzNCLENBQUMsQ0FBQTtDQUNILENBQUMsQ0FBQSIsImZpbGUiOiIvaG9tZS90aGVrYXJsbzk1Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci1lc2xpbnQvc3BlYy92YWxpZGF0ZS9lZGl0b3Itc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7IGlzVmFsaWRQb2ludCwgaGFzVmFsaWRTY29wZSB9IGZyb20gJy4uLy4uL3NyYy92YWxpZGF0ZS9lZGl0b3InXG5pbXBvcnQgbWFrZVNweSBmcm9tICcuLi9tYWtlLXNweSdcblxuLy8gTk9URSB0aHJvd0lmSW52YWxpZFBvaW50IG5vdCBjb3ZlcmVkLFxuLy8gYnV0IGl0IGlzIGEgc2ltcGxlIGNvbXBvc2l0aW9uIG9mIDIgdGVzdGVkIGZ1bmN0aW9ucy5cblxuZGVzY3JpYmUoJ2lzVmFsaWRQb2ludCcsICgpID0+IHtcbiAgaXQoJ3JldHVybnMgdHJ1ZSBpZiBjbGlwcGVkIHBvaW50IHJlcG9ydHMgYmVpbmcgZXF1YWwgdG8gcG9pbnQnLCAoKSA9PiB7XG4gICAgY29uc3QgbW9ja1BvaW50ID0geyBpc0VxdWFsOiAoKSA9PiB0cnVlIH1cbiAgICBjb25zdCBzcHkgPSBtYWtlU3B5KG1vY2tQb2ludClcbiAgICBjb25zdCBtb2NrVGV4dEJ1ZmZlciA9IHsgY2xpcFBvc2l0aW9uOiBzcHkuY2FsbCB9XG4gICAgY29uc3QgcG9pbnQgPSBbMzQsIDExMF1cblxuICAgIGNvbnN0IHJlc3VsdCA9IGlzVmFsaWRQb2ludChtb2NrVGV4dEJ1ZmZlciwgLi4ucG9pbnQpXG4gICAgZXhwZWN0KHNweS5jYWxsZWRXaXRoWzBdWzBdKS50b0VxdWFsKHBvaW50KVxuICAgIGV4cGVjdChyZXN1bHQpLnRvQmUodHJ1ZSlcbiAgfSlcblxuICBpdCgncmV0dXJucyBmYWxzZSBpZiBjbGlwcGVkIHBvaW50IHJlcG9ydHMgbm90IGJlaW5nIGVxdWFsIHRvIHBvaW50JywgKCkgPT4ge1xuICAgIGNvbnN0IG1vY2tQb2ludCA9IHsgaXNFcXVhbDogKCkgPT4gZmFsc2UgfVxuICAgIGNvbnN0IHNweSA9IG1ha2VTcHkobW9ja1BvaW50KVxuICAgIGNvbnN0IG1vY2tUZXh0QnVmZmVyID0geyBjbGlwUG9zaXRpb246IHNweS5jYWxsIH1cbiAgICBjb25zdCBwb2ludCA9IFsxMiwgMTRdXG5cbiAgICBjb25zdCByZXN1bHQgPSBpc1ZhbGlkUG9pbnQobW9ja1RleHRCdWZmZXIsIC4uLnBvaW50KVxuICAgIGV4cGVjdChzcHkuY2FsbGVkV2l0aFswXVswXSkudG9FcXVhbChwb2ludClcbiAgICBleHBlY3QocmVzdWx0KS50b0JlKGZhbHNlKVxuICB9KVxufSlcblxuZGVzY3JpYmUoJ2hhc1ZhbGlkU2NvcGUnLCAoKSA9PiB7XG4gIGl0KCdyZXR1cm5zIHRydWUgaWYgc2NvcGVzIGFycmF5IGNvbnRhaW5zIHNvbWUgdmFsdWUgaW4gdmFsaWRTY29wZXMnLCAoKSA9PiB7XG4gICAgY29uc3QgbW9ja0VkaXRvciA9IHtcbiAgICAgIGdldEN1cnNvcnM6ICgpID0+IFt7XG4gICAgICAgIGdldFNjb3BlRGVzY3JpcHRvcjogKCkgPT4gKHtcbiAgICAgICAgICBnZXRTY29wZXNBcnJheTogKCkgPT4gWyd2YWxpZC5zY29wZSddXG4gICAgICAgIH0pXG4gICAgICB9XVxuICAgIH1cbiAgICBjb25zdCBzY29wZXMgPSBbJ3ZhbGlkLnNjb3BlJ11cbiAgICBjb25zdCByZXN1bHQgPSBoYXNWYWxpZFNjb3BlKG1vY2tFZGl0b3IsIHNjb3BlcylcbiAgICBleHBlY3QocmVzdWx0KS50b0JlKHRydWUpXG4gIH0pXG5cbiAgaXQoJ3JldHVybnMgZmFsc2Ugd2hlbiBzY29wZXMgYXJyYXkgaGFzIG5vIHZhbHVlcyBpbiB2YWxpZFNjb3BlcycsICgpID0+IHtcbiAgICBjb25zdCBtb2NrRWRpdG9yID0ge1xuICAgICAgZ2V0Q3Vyc29yczogKCkgPT4gW3tcbiAgICAgICAgZ2V0U2NvcGVEZXNjcmlwdG9yOiAoKSA9PiAoe1xuICAgICAgICAgIGdldFNjb3Blc0FycmF5OiAoKSA9PiBbJ3NvbWVvdGhlci5zY29wZSddXG4gICAgICAgIH0pXG4gICAgICB9XVxuICAgIH1cbiAgICBjb25zdCBzY29wZXMgPSBbJ2ludmFsaWQuc2NvcGUnXVxuICAgIGNvbnN0IHJlc3VsdCA9IGhhc1ZhbGlkU2NvcGUobW9ja0VkaXRvciwgc2NvcGVzKVxuICAgIGV4cGVjdChyZXN1bHQpLnRvQmUoZmFsc2UpXG4gIH0pXG59KVxuIl19