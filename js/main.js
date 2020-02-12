'use strict';

var PHOTOS_MAX_COUNT = 25;
var MIN_LIKES = 15;
var MAX_LIKES = 200;

var MAX_NUMBER_AVATAR = 1;
var MIN_NUMBER_AVATAR = 6;

var NUMBER_COMMENTS = 4;

var USER_MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концо это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой нудачный момент?!'
];
var USER_NAMES = [
  'Дима',
  'Александр',
  'Джон',
  'Дункан Айдахо',
  'Жилгорден',
  'Катя',
  'Поля',
  'Джамбула'
];

var templatePicture = document.querySelector('#picture').content.querySelector('.picture');

var getNumber = function (min, max) {
  return Math.floor(Math.ceil(Math.random() * (max - min)) + min);
};

var getMessage = function (messages) {
  return messages[getNumber(0, messages.length) - 1];
};

var generateComments = function (messages) {
  var comments = [];
  for (var i = 0; i < NUMBER_COMMENTS; i++) {
    comments.push({
      avatar: 'img/avatar-' + getNumber(MIN_NUMBER_AVATAR, MAX_NUMBER_AVATAR),
      message: getMessage(messages),
      name: USER_NAMES[getNumber(0, USER_NAMES.length) - 1]
    });
  }

  return comments;
};

var generatePhotos = function () {
  var infoPhotos = [];

  for (var i = 0; i < PHOTOS_MAX_COUNT; i++) {
    infoPhotos.push({
      url: 'photos/' + (i + 1) + '.jpg',
      description: 'description photo',
      likes: getNumber(MIN_LIKES, MAX_LIKES),
      comments: generateComments(USER_MESSAGES)
    });
  }

  return infoPhotos;
};

var createElement = function (photo) {
  var picture = templatePicture.cloneNode(true);

  picture.querySelector('.picture__img').setAttribute('src', photo.url);
  picture.querySelector('.picture__likes').textContent = photo.likes;
  picture.querySelector('.picture__comments').textContent = photo.comments.length;

  return picture;
};

var addPictures = function (photos) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < PHOTOS_MAX_COUNT; i++) {
    fragment.appendChild(createElement(photos[i]));
  }
  document.querySelector('.pictures').appendChild(fragment);
};

var allPhotos = generatePhotos();

addPictures(allPhotos);
