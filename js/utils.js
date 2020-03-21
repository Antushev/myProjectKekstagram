'use strict';

(function () {
  var START_INDEX_ARRAY = 0;

  var Buttons = {ESCAPE_KEY: 'Escape', ENTER_KEY: 'Enter'};

  var getNumber = function (min, max) {
    return Math.floor(Math.ceil(Math.random() * (max - min)) + min);
  };

  var getRandomElementFromArray = function (elements) {
    return elements[getNumber(0, elements.length - 1)];
  };

  var getRandomElementsFromArray = function (elements, numberElements) {
    return elements.sort(function () {
      return Math.random() - 0.5;
    }).slice(START_INDEX_ARRAY, numberElements);
  };

  window.utils = {
    Buttons: Buttons,
    getNumber: getNumber,
    getRandomElementFromArray: getRandomElementFromArray,
    getRandomElementsFromArray: getRandomElementsFromArray
  };
})();
