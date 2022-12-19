function diff_hours(dt2, dt1) {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= (60 * 60);
  return Math.abs(Math.round(diff));
}

function datediff(first, second) {
  // Take the difference between the dates and divide by milliseconds per day.
  // Round to nearest whole number to deal with DST.
  return Math.round((second - first) / (1000 * 60 * 60 * 24));
}

const waterFall = {
  // Data Series Execution
  forEachSeries: function (dataSet, iterateFunc, finalCall) {
    var executedFunction = 0, funcLength = dataSet.length;
    function getArgs(func) {
      var args = func.toString().match(/function.*?\(([^)]*)\)/)[1];
      return args.split(',').map(function (arg) {
        return arg.replace(/\/\*.*\*\//, '').trim();
      }).filter(function (arg) {
        return arg;
      });
    };
    var argsLength = getArgs(iterateFunc).length;
    goNextIteration();
    function callback() {
      executedFunction++;
      goNextIteration();
    };
    function goNextIteration() {
      if (executedFunction < funcLength) {
        if (argsLength == 1) iterateFunc(callback);
        else if (argsLength == 2) iterateFunc(dataSet[executedFunction], callback);
        else if (argsLength == 3) iterateFunc(executedFunction, dataSet[executedFunction], callback);
      } else if (executedFunction == funcLength) {
        if (typeof finalCall == "undefined") finalCall = function () { };
        finalCall();
      }
    }
  },
  series: function (funcList, finalFunc) {
    var result = [], executedFunction = 0, passingData = [];
    var funcLength = funcList.length;
    gotoNext();
    function callback() {
      passingData = [];
      var arg = arguments[0];
      result.push(arg);
      executedFunction++;
      gotoNext();
      if (executedFunction == funcLength - 1) {
        finalFunc(result);
      }
    }
    function dispatch(fn, args) {
      fn = (typeof fn == "function") ? fn : window[fn];
      return fn.apply(this, args || []);
    }
    function gotoNext() {
      if (executedFunction < funcLength) {
        var currentFunction;
        if (typeof funcList[executedFunction] !== 'undefined') {
          currentFunction = funcList[executedFunction];
          passingData.push(callback);
          dispatch(currentFunction, passingData);
        }
      }
    }
  },
  // Water Fall method Execution
  waterFall: function (funcList, finalFunc) {
    var passingData = [], executedFunction = 0;
    var funcLength = funcList.length;
    gotoNext();
    function callback() {
      passingData = [];
      for (var i = 0; i < arguments.length; i++)
        passingData[i] = arguments[i];
      executedFunction++;
      gotoNext();
      if (executedFunction == funcLength - 1) {
        finalFunc();
      }
    }
    function dispatch(fn, args) {
      fn = (typeof fn == "function") ? fn : window[fn];
      return fn.apply(this, args || []);
    }
    function gotoNext() {
      if (executedFunction < funcLength) {
        var currentFunction;
        if (typeof funcList[executedFunction] !== 'undefined') {
          currentFunction = funcList[executedFunction];
          passingData.push(callback);
          dispatch(currentFunction, passingData);
        }
      }
    }
  }
};

function delay(ms, _callback) {
  var limit = new Date();
  limit = limit.setMilliseconds(limit.getMilliseconds() + ms);
  while ((new Date()) < limit) {
    // do nothing
    ;
  }
  _callback('Okay')
  return 'Okay'
}

// function compareQuickProspects(list1, list2){
//   _.isEq
// }

export {
  diff_hours,
  datediff,
  waterFall,
  delay
}