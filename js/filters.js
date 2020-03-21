'use strict';

(function () {
  var NUMBER_RANDOM_ELEMENTS = 10;

  var imgFilter = document.querySelector('.img-filters');
  var buttonFilterDefault = imgFilter.querySelector('#filter-default');
  var buttonFilterRandom = imgFilter.querySelector('#filter-random');
  var buttonFilterDiscussed = imgFilter.querySelector('#filter-discussed');

  var refreshClassActiveButton = function (button) {
    imgFilter.querySelector('.img-filters__button--active').classList
      .remove('img-filters__button--active');
    button.classList.add('img-filters__button--active');
  };

  var showFilters = function () {
    imgFilter.classList.remove('img-filters--inactive');
  };

  var sortCommentsDesc = function (array) {
    return array.sort(function (elementNext, elementPrevious) {
      return elementPrevious.comments.length - elementNext.comments.length;
    });
  };

  var refreshPhotos = function (photos) {
    window.gallery.deletePictures();
    window.gallery.renderPictures(photos);
  };

  var onButtonFilterDefaultClick = window.debounce(function () {
    refreshClassActiveButton(buttonFilterDefault);

    refreshPhotos(window.gallery.photos);
  });

  var onButtonFilterRandomClick = window.debounce(function () {
    refreshClassActiveButton(buttonFilterRandom);

    var photos = window.utils.getRandomElementsFromArray(window.gallery.photos.slice(), NUMBER_RANDOM_ELEMENTS);

    refreshPhotos(photos);
  });

  var onButtonFilterCommentsDescClick = window.debounce(function () {
    refreshClassActiveButton(buttonFilterDiscussed);

    var photos = sortCommentsDesc(window.gallery.photos.slice());

    refreshPhotos(photos);
  });

  buttonFilterDefault.addEventListener('click', onButtonFilterDefaultClick);
  buttonFilterRandom.addEventListener('click', onButtonFilterRandomClick);
  buttonFilterDiscussed.addEventListener('click', onButtonFilterCommentsDescClick);

  window.filters = {
    showFilters: showFilters
  };
})();
