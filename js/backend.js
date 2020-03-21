'use strict';

(function () {
  var TIMEOUT_MAX = 10000;
  var RESPONSE_TYPE = 'json';
  var URL_GET = 'https://js.dump.academy/kekstagram/data';
  var URL_POST = 'https://js.dump.academy/kekstagram';

  var StatusCode = {
    OK: 200
  };

  var makeRequest = function (method, url, data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = RESPONSE_TYPE;
    xhr.timeout = TIMEOUT_MAX;

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

    xhr.open(method, url);
    if (!data) {
      xhr.send(data);
    } else {
      xhr.send();
    }
  };

  var load = function (onLoad, onError) {
    var data = false;
    makeRequest('GET', URL_GET, data, onLoad, onError);
  };

  var send = function (data, onLoad, onError) {
    makeRequest('POST', URL_POST, data, onLoad, onError);
  };

  window.backend = {
    load: load,
    send: send
  };
})();
