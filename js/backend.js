'use strict';

(function () {
  var TIMEOUT_MAX = 10000;
  var RESPONSE_TYPE = 'json';
  var URL_GET = 'https://js.dump.academy/kekstagram/data';

  var StatusCode = {
    OK: 200
  };

  var xhr = new XMLHttpRequest();

  var makeRequest = function (xhrObject, method, url, onLoad, onError, timeout, responseType) {
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

    xhr.open('GET', URL_GET);
    xhr.send();
  };

  var load = function (onLoad, onError) {
    makeRequest(xhr, 'GET', URL_GET, onLoad, onError, TIMEOUT_MAX, RESPONSE_TYPE);
  };

  window.backend = {
    load: load
  };
})();


