'use strict';

(function () {
  var errorBlock = document.querySelector('.error-server');
  var errorText = errorBlock.querySelector('.error-server__text');
  var PHOTOS_MAX_COUNT = 25;

  var templatePicture = document.querySelector('#picture').content.querySelector('.picture');

  var createElement = function (photo, id) {
    var picture = templatePicture.cloneNode(true);

    picture.querySelector('.picture__img').setAttribute('data-id', id);
    picture.querySelector('.picture__img').setAttribute('src', photo.url);
    picture.querySelector('.picture__likes').textContent = photo.likes;
    picture.querySelector('.picture__comments').textContent = photo.comments.length;

    return picture;
  };

  var renderPictures = function (photos) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < PHOTOS_MAX_COUNT; i++) {
      fragment.appendChild(createElement(photos[i], i));
    }
    document.querySelector('.pictures').appendChild(fragment);
  };

  var onLoad = function (data) {
    errorBlock.classList.add('hidden');
    renderPictures(data);
    window.photos = data;
  };

  var onError = function (textError) {
    errorBlock.classList.remove('hidden');
    errorText.textContent = textError;
  };

  window.backend.load(onLoad, onError);
})();
