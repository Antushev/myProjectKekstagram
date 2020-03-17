'use strict';

(function () {
  var TIMEOUT_MAX = 10000;
  var RESPONSE_TYPE = 'json';
  var URL_GET = 'https://js.dump.academy/kekstagram/data';

  var StatusCode = {
    OK: 200
  };

  var settingXhr = function (xhr, onLoad, onError, timeout, responseType) {
    xhr.timeout = timeout;
    xhr.responseType = responseType;

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onLoad(xhr.response);
      } else {
        onError('Ответ сервера: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Во время запроса к серверу произошла ошибка');
    });

    xhr.addEventListener('timeout', function () {
      onError('Превышено время ожидания ответа сервера');
    });
  };

  var load = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    settingXhr(xhr, onLoad, onError, TIMEOUT_MAX, RESPONSE_TYPE);

    xhr.open('GET', URL_GET);
    xhr.send();
  };

  window.backend = {
    load: load
  };
})();


