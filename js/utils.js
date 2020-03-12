'use strict';

(function () {
  var Buttons = {ESCAPE_KEY: 'Escape', ENTER_KEY: 'Enter'};

  var getNumber = function (min, max) {
    return Math.floor(Math.ceil(Math.random() * (max - min)) + min);
  };

  var getRandomElementFromArray = function (elements) {
    return elements[getNumber(0, elements.length - 1)];
  };

  window.utils = {
    Buttons: Buttons,
    getNumber: getNumber,
    getRandomElementFromArray: getRandomElementFromArray
  };
})();
