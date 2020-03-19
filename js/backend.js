'use strict';

(function () {
  var TIMEOUT_MAX = 10000;
  var RESPONSE_TYPE = 'json';
  var URL_GET = 'https://js.dump.academy/kekstagram/data';
  var URL_POST = 'https://js.dump.academy/kekstagram';

  var StatusCode = {
    OK: 200
  };

  var makeRequest = function (xhrObject, method, url, data, onLoad, onError, timeout, responseType) {
    xhrObject.timeout = timeout;
    xhrObject.responseType = responseType;

    xhrObject.addEventListener('load', function () {
      if (xhrObject.status === StatusCode.OK) {
        onLoad(xhrObject.response);
      } else {
        onError('Ответ сервера: ' + xhrObject.status + ' ' + xhrObject.statusText);
      }
    });

    xhrObject.addEventListener('error', function () {
      onError('Во время запроса к серверу произошла ошибка');
    });

    xhrObject.addEventListener('timeout', function () {
      onError('Превышено время ожидания ответа сервера');
    });

    xhrObject.open(method, url);

    if (data !== false) {
      xhrObject.send(data);
    } else {
      xhrObject.send();
    }
  };

  var load = function (onLoad, onError) {
    var data = false;
    var xhrLoad = new XMLHttpRequest();
    makeRequest(xhrLoad, 'GET', URL_GET, data, onLoad, onError, TIMEOUT_MAX, RESPONSE_TYPE);
  };

  var send = function (data, onLoad, onError) {
    var xhrSend = new XMLHttpRequest();
    makeRequest(xhrSend, 'POST', URL_POST, data, onLoad, onError, TIMEOUT_MAX, RESPONSE_TYPE);
  };

  window.backend = {
    load: load,
    send: send
  };
})();