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

var Buttons = {ESCAPE_KEY: 'Escape', ENTER_KEY: 'Enter'};

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

var picture = document.querySelector('.big-picture');
var commentTemplate = document.querySelector('.social__comment');

var createComment = function (comment) {
  var commentNode = commentTemplate.cloneNode(true);

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

  picture.querySelector('.social__comments').innerHTML = '';
  picture.querySelector('.social__comments').appendChild(fragmentComments);
};

var renderBigPicture = function (photo) {
  picture.querySelector('.big-picture__img').setAttribute('src', photo.url);
  picture.querySelector('.likes-count').textContent = photo.likes;
  picture.querySelector('.comments-count').textContent = photo.comments.length;

  renderCommentsForPicture(photo.comments);

  picture.querySelector('.social__caption').textContent = photo.description;

  // picture.classList.remove('hidden');
};

document.querySelector('.social__comment-count').classList.add('hidden');
document.querySelector('.comments-loader').classList.add('hidden');
document.body.classList.add('modal-open');
renderBigPicture(allPhotos[0]);

// Личный проект: доверяй, но проверяй (часть 1)

// Эффекты
var picturePreviewOpen = document.querySelector('#upload-file');
var picturePreviewClose = document.querySelector('#upload-cancel');
var picturePreviewForm = document.querySelector('.img-upload__overlay');

var picturePreview = document.querySelector('.img-upload__preview img');
var effectsList = document.querySelector('.effects__list');
var pinEffectLevel = document.querySelector('.effect-level__pin');
var inputEffectValue;
var inputEffectLevel = document.querySelector('.effect-level__value');

var effectLevelDepth = document.querySelector('.effect-level__depth');

var onButtonEscapeDown = function () {
  document.addEventListener('keydown', function (evt) {
    picturePreviewOpen.value = '';
    if (evt.key === Buttons.ESCAPE_KEY) {
      picturePreviewForm.classList.add('hidden');
    }
  });
};

picturePreviewOpen.addEventListener('change', function () {
  picturePreviewForm.classList.remove('hidden');

  document.addEventListener('keydown', onButtonEscapeDown);
});

picturePreviewClose.addEventListener('click', function () {
  picturePreviewOpen.value = '';
  picturePreviewForm.classList.add('hidden');
  document.removeEventListener('keydown', onButtonEscapeDown);
});

effectsList.addEventListener('click', function (evt) {
  if (evt.target.tagName === 'INPUT') {
    inputEffectValue = evt.target.value;
    picturePreview.classList = '';
    picturePreview.classList.add('effects__preview--' + inputEffectValue);
    picturePreview.style = '';
  }
});

pinEffectLevel.addEventListener('mouseup', function () {
  var effectLineWidth = effectLevelDepth.clientWidth;
  var effectLineTotal = document.querySelector('.effect-level__line').clientWidth;
  var effectDepth = effectLineWidth / effectLineTotal;
  if (inputEffectValue === 'chrome') {
    inputEffectLevel.value = effectDepth;
    picturePreview.style.filter = 'grayscale(' + effectDepth + ')';
  } else if (inputEffectValue === 'sepia') {
    inputEffectLevel.value = effectDepth;
    picturePreview.style.filter = 'sepia(' + effectDepth + ')';
  } else if (inputEffectValue === 'marvin') {
    effectDepth = effectDepth * 100;
    inputEffectLevel.value = effectDepth;
    picturePreview.style.filter = 'invert(' + effectDepth + '%)';
  } else if (inputEffectValue === 'phobos') {
    effectDepth = effectDepth * 3;
    inputEffectLevel.value = effectDepth;
    picturePreview.style.filter = 'blur(' + effectDepth * 3 + 'px)';
  } else if (inputEffectValue === 'heat') {
    effectDepth = effectDepth * 3;
    inputEffectLevel.value = effectDepth;
    picturePreview.style.filter = 'brightness(' + effectDepth * 3 + ')';
  } else if (inputEffectValue === 'none') {
    picturePreview.style.filter = '';
  }
});

// Масштабирование
var SCALE_STEP = 25;
var SCALE_MIN = 25;
var SCALE_MAX = 100;

var scaleControlSmaller = picturePreviewForm.querySelector('.scale__control--smaller');
var scaleControlBigger = picturePreviewForm.querySelector('.scale__control--bigger');
var scaleValue = picturePreviewForm.querySelector('.scale__control--value');

var scaleBiggerPicture = function () {
  var scale = Number(scaleValue.value);
  if (scale < SCALE_MAX) {
    scale = scale + SCALE_STEP;
    scaleValue.value = scale;
    picturePreview.style.transform = 'scale(' + scale / 100 + ')';
  }
};

var scaleSmallerPicture = function () {
  var scale = Number(scaleValue.value);
  if (scale > SCALE_MIN) {
    scale = scale - SCALE_STEP;
    scaleValue.value = scale;
    picturePreview.style.transform = 'scale(' + scale / 100 + ')';
  }
};

scaleControlSmaller.addEventListener('click', function () {
  scaleSmallerPicture();
});

scaleControlBigger.addEventListener('click', function () {
  scaleBiggerPicture();
});

// Валидация формы с хеш-тегами

var inputHashtag = picturePreviewForm.querySelector('.text__hashtags');
var textHashtag = inputHashtag.value;
var hashtags = textHashtag.split(' ');

inputHashtag.validity.valid = false;

inputHashtag.addEventListener('invalid', function () {
  inputHashtag.setCustomValidity('Неправильно написаны хеш-теги');
});


