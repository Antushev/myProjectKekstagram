'use strict';

var PHOTOS_MAX_COUNT = 25;
var MIN_LIKES = 15;
var MAX_LIKES = 200;

var MIN_NUMBER_AVATAR = 1;
var MAX_NUMBER_AVATAR = 6;

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

var getRandomElementFromArray = function (elements) {
  return elements[getNumber(0, elements.length - 1)];
};

var getMessage = function (messages) {
  return getRandomElementFromArray(messages);
};

var generateComments = function (messages) {
  var comments = [];
  for (var i = 0; i < NUMBER_COMMENTS; i++) {
    comments.push({
      avatar: 'img/avatar-' + getNumber(MIN_NUMBER_AVATAR, MAX_NUMBER_AVATAR) + '.svg',
      message: getMessage(messages),
      name: getRandomElementFromArray(USER_NAMES)
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

var renderPictures = function (photos) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < PHOTOS_MAX_COUNT; i++) {
    fragment.appendChild(createElement(photos[i]));
  }
  document.querySelector('.pictures').appendChild(fragment);
};

var allPhotos = generatePhotos();

renderPictures(allPhotos);

// Личный проект: больше деталей (часть 2)

var createComment = function (comment) {
  var commentNode = document.querySelector('.social__comment').cloneNode(true);

  commentNode.querySelector('.social__picture')
    .setAttribute('src', comment.avatar);
  commentNode.querySelector('.social__picture')
    .setAttribute('alt', comment.name);
  commentNode.querySelector('.social__text').textContent = comment.message;

  return commentNode;
};

var renderCommentsForPicture = function (comments) {
  var fragmentComments = document.createDocumentFragment();

  for (var i = 0; i < comments.length; i++) {
    fragmentComments.appendChild(createComment(comments[i]));
  }

  document.querySelector('.social__comments').innerHTML = '';
  document.querySelector('.social__comments').appendChild(fragmentComments);
};

var renderPicture = function (photo) {
  var picture = document.querySelector('.big-picture');

  picture.querySelector('.big-picture__img').setAttribute('src', photo.url);
  picture.querySelector('.likes-count').textContent = photo.likes;
  picture.querySelector('.comments-count').textContent = photo.comments.length;

  renderCommentsForPicture(photo.comments);

  picture.querySelector('.social__caption').textContent = allPhotos[0].description;

  picture.classList.remove('hidden');
};

document.querySelector('.social__comment-count').classList.add('hidden');
document.querySelector('.comments-loader').classList.add('hidden');
document.body.classList.add('modal-open');
renderPicture(allPhotos[0]);
