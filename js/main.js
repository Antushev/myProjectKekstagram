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
      id: i,
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

  picture.querySelector('.picture__img').setAttribute('data-id', photo.id);
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

var inputHashtag = picturePreviewForm.querySelector('.text__hashtags');
var textareaCommentPreview = picturePreviewForm.querySelector('.text__description');

var EffectsDepthHandlers = {
  'chrome': function (depth) {
    inputEffectLevel.value = depth;
    return 'grayscale(' + depth + ')';
  },
  'sepia': function (depth) {
    inputEffectLevel.value = depth;
    return 'sepia(' + depth + ')';
  },
  'marvin': function (depth) {
    inputEffectLevel.value = depth * 100;
    return 'invert(' + depth * 100 + '%)';
  },
  'phobos': function (depth) {
    inputEffectLevel.value = depth * 3;
    return 'blur(' + depth * 3 + 'px)';
  },
  'heat': function (depth) {
    inputEffectLevel.value = depth * 3;
    return 'brightness(' + depth * 3 + ')';
  },
  'none': function () {
    inputEffectLevel.value = 0;
    return '';
  }
};

var onButtonEscapeDown = function () {
  document.addEventListener('keydown', function (evt) {
    picturePreviewOpen.value = '';
    if (evt.key === Buttons.ESCAPE_KEY
      && evt.target !== inputHashtag
      && evt.target !== textareaCommentPreview) {
      picturePreviewForm.classList.add('hidden');
      document.body.classList.remove('modal-open');
    }
  });
};

picturePreviewOpen.addEventListener('change', function () {
  picturePreviewForm.classList.remove('hidden');
  document.body.classList.add('modal-open');

  document.addEventListener('keydown', onButtonEscapeDown);
});

picturePreviewClose.addEventListener('click', function () {
  picturePreviewOpen.value = '';
  picturePreviewForm.classList.add('hidden');
  document.body.classList.remove('modal-open');
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

var getEffectDepth = function () {
  var effectLineWidth = effectLevelDepth.clientWidth;
  var effectLineTotal = document.querySelector('.effect-level__line').clientWidth;
  return effectLineWidth / effectLineTotal;
};

var applyEffect = function (depth) {
  var handler = EffectsDepthHandlers[inputEffectValue];
  picturePreview.style.filter = handler(depth);
};

pinEffectLevel.addEventListener('mouseup', function () {
  var effectDepth = getEffectDepth();
  applyEffect(effectDepth);
});

// Масштабирование
var SCALE_STEP = 25;
var SCALE_MIN = 25;
var SCALE_MAX = 100;
var MAX_HASHTAGS = 5;

var scaleControlSmaller = picturePreviewForm.querySelector('.scale__control--smaller');
var scaleControlBigger = picturePreviewForm.querySelector('.scale__control--bigger');
var scaleValue = picturePreviewForm.querySelector('.scale__control--value');

var scalePicture = function (isScale) {
  var scale = Number(scaleValue.value);

  if (isScale && scale < SCALE_MAX) {
    scale = scale + SCALE_STEP;
  }
  if (!isScale && scale > SCALE_MIN) {
    scale = scale - SCALE_STEP;
  }

  scaleValue.value = scale;
  picturePreview.style.transform = 'scale(' + scale / 100 + ')';
};

scaleControlBigger.addEventListener('click', function () {
  var isScale = true;
  scalePicture(isScale);
});

scaleControlSmaller.addEventListener('click', function () {
  var isScale = false;
  scalePicture(isScale);
});

// Валидация формы с хеш-тегами

var searchSameHashtags = function (hashtags) {
  var sameElements = {};
  for (var i = 0; i < hashtags.length; i++) {
    if (sameElements[hashtags[i]]) {
      return true;
    }
  }
  return false;
};

var validityInputHashtags = function (hashtagsText) {
  var hashtags = hashtagsText.toLowerCase().trim().split(' ');
  var regular = /^#[А-Яа-яЁёA-Za-z0-9]{1,20}$/;
  for (var i = 0; i < hashtags.length; i++) {
    var hashtag = hashtags[i].trim();
    if (hashtag.search(regular) === -1 && hashtag !== '') {
      return inputHashtag.setCustomValidity('Хеш-тег ' + hashtag + ' записан неверно!');
    }

    if (searchSameHashtags(hashtags)) {
      return inputHashtag.setCustomValidity('Повторяющихся хеш-тегов быть не должно!');
    }

    if (hashtags.length > MAX_HASHTAGS) {
      return inputHashtag.setCustomValidity('Нельзя указывать больше 5 хеш-тегов!');
    }
  }

  return inputHashtag.setCustomValidity('');
};

inputHashtag.addEventListener('input', function () {
  var hashtagsText = inputHashtag.value;
  validityInputHashtags(hashtagsText);
});

// Личный проект: доверяй, но проверяй (часть 2)

// Подготовка изображения

var pictureContainer = document.querySelector('.pictures');
var picture = document.querySelector('.big-picture');
var pictureBig = picture.querySelector('.big-picture__img img');
var pictureClose = picture.querySelector('.big-picture__cancel');
var pictureCloseEscape = picture.querySelector('.big-picture__cancel');
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
  pictureBig.setAttribute('src', photo.url);
  picture.querySelector('.likes-count').textContent = photo.likes;
  picture.querySelector('.comments-count').textContent = photo.comments.length;

  renderCommentsForPicture(photo.comments);

  picture.querySelector('.social__caption').textContent = photo.description;
  picture.classList.remove('hidden');
};

document.querySelector('.social__comment-count').classList.add('hidden');
document.querySelector('.comments-loader').classList.add('hidden');

// Обработка событий

var openBigPicture = function (pictureCurrent) {
  renderBigPicture(pictureCurrent);
  picture.classList.remove('hidden');
};

var closeBigPicture = function () {
  picture.classList.add('hidden');
};

var addEventKeyBigPicture = function () {
  document.addEventListener('keydown', onButtonPictureCloseEnterDown);
  document.addEventListener('keydown', onButtonPictureCloseEscapeDown);
};

var removeEventKeyBigPicture = function () {
  document.removeEventListener('keydown', onButtonPictureCloseEnterDown);
  document.removeEventListener('keydown', onButtonPictureCloseEscapeDown);
};

var onButtonPictureOpenEnterDown = function (evt) {
  if (evt.key === Buttons.ENTER_KEY && evt.target.classList.contains('picture')) {
    var infoBigPicture = allPhotos[evt.target.querySelector('.picture__img')
      .getAttribute('data-id')];
    openBigPicture(infoBigPicture);

    addEventKeyBigPicture();
  }
};

var onButtonPictureCloseEnterDown = function (evt) {
  if (evt.key === Buttons.ENTER_KEY && evt.target === pictureCloseEscape) {
    closeBigPicture();

    removeEventKeyBigPicture();
  }
};

pictureContainer.addEventListener('click', function (evt) {
  if (evt.target.classList.contains('picture__img')) {
    var infoBigPicture = allPhotos[evt.target
      .getAttribute('data-id')];
    openBigPicture(infoBigPicture);

    addEventKeyBigPicture();
  }
});

pictureContainer.addEventListener('keydown', onButtonPictureOpenEnterDown);

var onButtonPictureCloseEscapeDown = function (evt) {
  if (evt.key === Buttons.ESCAPE_KEY) {
    closeBigPicture();

    removeEventKeyBigPicture();
  }
};

pictureClose.addEventListener('click', function () {
  closeBigPicture();

  removeEventKeyBigPicture();
});


