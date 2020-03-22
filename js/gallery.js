'use strict';

(function () {
  var errorBlock = document.querySelector('.error-server');
  var errorText = errorBlock.querySelector('.error-server__text');
  var pictures;

  var templatePicture = document.querySelector('#picture').content.querySelector('.picture');

  var deletePictures = function () {
    pictures.forEach(function (picture) {
      picture.remove();
    });
  };

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

    photos.forEach(function (photo, index) {
      fragment.appendChild(createElement(photo, index));
    });

    document.querySelector('.pictures').appendChild(fragment);
    pictures = document.querySelectorAll('.picture');
  };

  var onLoad = function (data) {
    errorBlock.classList.add('hidden');
    renderPictures(data);
    window.gallery.photos = data;
    window.gallery.currentPhotos = data;
    window.filters.showButtons();
  };

  var onError = function (textError) {
    errorBlock.classList.remove('hidden');
    errorText.textContent = textError;
  };

  window.backend.load(onLoad, onError);

  window.gallery = {
    photos: {},
    currentPhotos: {},
    renderPictures: renderPictures,
    deletePictures: deletePictures
  };
})();
