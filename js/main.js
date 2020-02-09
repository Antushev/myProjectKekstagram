'use strict';

var LENGTH_ARRAY = 25;
var MIN_LIKES = 15;
var MAX_LIKES = 200;

var MAX_NUMBER_AVATAR = 1;
var MIN_NUMBER_AVATAR = 6;

var NUMBER_COMMENTS = 4;

var arrayMessages = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концо это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой нудачный момент?!'
];
var arrayNames = [
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
  return messages[getNumber(0, arrayMessages.length) - 1];
};

var getArrayComments = function (messages) {
  var arrayComments = [];
  for (var i = 0; i < NUMBER_COMMENTS; i++) {
    arrayComments[i] = {
      avatar: 'img/avatar-' + getNumber(MIN_NUMBER_AVATAR, MAX_NUMBER_AVATAR),
      message: getMessage(messages),
      name: arrayNames[getNumber(0, arrayNames.length)]
    };
  }

  return arrayComments;
};

var addArrayWithData = function () {
  var dataArray = [];

  for (var i = 0; i < LENGTH_ARRAY; i++) {
    dataArray[i] = {
      url: 'photos/' + (i + 1) + '.jpg',
      description: 'description photo',
      likes: getNumber(MIN_LIKES, MAX_LIKES),
      comments: getArrayComments(arrayMessages)
    };
  }

  return dataArray;
};

var createElement = function (dataPhoto) {
  var picture = templatePicture.cloneNode(true);

  picture.querySelector('.picture__img').setAttribute('src', dataPhoto.url);
  picture.querySelector('.picture__likes').textContent = dataPhoto.likes;
  picture.querySelector('.picture__comments').textContent = dataPhoto.comments.length;

  return picture;
};

var addPictures = function (arrayPhotos) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < LENGTH_ARRAY; i++) {
    fragment.appendChild(createElement(arrayPhotos[i]));
  }
  document.querySelector('.pictures').appendChild(fragment);
};

var dataArrayPhotos = addArrayWithData();

addPictures(dataArrayPhotos);
