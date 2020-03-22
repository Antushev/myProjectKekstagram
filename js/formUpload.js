'use strict';

(function () {
  var SCALE_STEP = 25;
  var SCALE_MIN = 25;
  var SCALE_MAX = 100;
  var MAX_HASHTAGS = 5;

  var MAX_DEPTH_WIDTH = 453;

  var TEXT_DEFAULT_BUTTON = 'Отправить';
  var TEXT_SEND_BUTTON = 'Загрузка...';

  var BORDER_VALUE_INPUT = '3px solid #F00';
  var NO_BORDER_VALUE = 'none';

  var mainContent = document.querySelector('main');
  var templateSuccess = document.querySelector('#success').content.querySelector('.success');
  var templateError = document.querySelector('#error').content.querySelector('.error');
  var successInner = templateSuccess.querySelector('.success__inner');
  var errorInner = templateError.querySelector('.error__inner');
  var successTitle = successInner.querySelector('.success__title');
  var errorTitle = successInner.querySelector('.error__title');
  var buttonCloseSuccess = templateSuccess.querySelector('.success__button');
  var buttonCloseError = templateError.querySelector('.error__button');
  templateSuccess.classList.add('visually-hidden');
  templateError.classList.add('visually-hidden');
  mainContent.prepend(templateSuccess);
  mainContent.prepend(templateError);

  var formUpload = document.querySelector('.img-upload__form');
  var picturePreviewOpen = document.querySelector('#upload-file');
  var picturePreviewForm = formUpload.querySelector('.img-upload__overlay');
  var picturePreviewClose = picturePreviewForm.querySelector('#upload-cancel');
  var buttonFormUpload = formUpload.querySelector('.img-upload__submit');

  var picturePreview = picturePreviewForm.querySelector('.img-upload__preview img');
  var effectsList = picturePreviewForm.querySelector('.effects__list');
  var effectLevelBlock = picturePreviewForm.querySelector('.img-upload__effect-level');
  effectLevelBlock.classList.add('hidden');
  var inputEffectLevel = effectLevelBlock.querySelector('.effect-level__value');
  var effectLineTotal = effectLevelBlock.querySelector('.effect-level__line');
  var pinEffectLevel = effectLineTotal.querySelector('.effect-level__pin');
  var effectLevelDepth = effectLevelBlock.querySelector('.effect-level__depth');
  var inputEffectValue = 'none';

  var inputHashtag = picturePreviewForm.querySelector('.text__hashtags');
  var textareaCommentPreview = picturePreviewForm.querySelector('.text__description');

  var EffectsDepthHandlers = {
    'chrome': function (depth) {
      inputEffectLevel.value = Math.ceil(depth);
      return 'grayscale(' + depth + ')';
    },
    'sepia': function (depth) {
      inputEffectLevel.value = Math.ceil(depth);
      return 'sepia(' + depth + ')';
    },
    'marvin': function (depth) {
      inputEffectLevel.value = Math.ceil(depth * 100);
      return 'invert(' + depth * 100 + '%)';
    },
    'phobos': function (depth) {
      inputEffectLevel.value = Math.ceil(depth * 3);
      return 'blur(' + depth * 3 + 'px)';
    },
    'heat': function (depth) {
      inputEffectLevel.value = Math.ceil(depth * 3);
      return 'brightness(' + depth * 3 + ')';
    },
    'none': function () {
      inputEffectLevel.value = 0;
      return '';
    }
  };

  var closeFormWindow = function () {
    picturePreviewOpen.value = '';
    picturePreviewForm.classList.add('hidden');
    document.body.classList.remove('modal-open');

    document.removeEventListener('keydown', onButtonEscapeDown);
    document.removeEventListener('input', onFieldEnterInput);
    resetForm();
  };

  var resetForm = function () {
    picturePreview.classList = '';
    picturePreview.style.transform = 'scale(1)';
    scaleValue.value = '100%';
    effectLevelBlock.classList.add('hidden');
    picturePreview.style.filter = '';
    pinEffectLevel.style.left = '100%';
    effectLevelDepth.style.width = '100%';
    formUpload.reset();
  };

  var onButtonEscapeDown = function (evt) {
    if (evt.key === window.utils.Buttons.ESCAPE_KEY
      && evt.target !== inputHashtag
      && evt.target !== textareaCommentPreview) {
      closeFormWindow();
    }
  };

  picturePreviewOpen.addEventListener('change', function () {
    picturePreviewForm.classList.remove('hidden');
    document.body.classList.add('modal-open');

    document.addEventListener('keydown', onButtonEscapeDown);
  });

  picturePreviewClose.addEventListener('click', function () {
    closeFormWindow();
  });

  effectsList.addEventListener('click', function (evt) {
    if (evt.target.tagName === 'INPUT') {
      scaleValue.value = '100%';
      inputEffectValue = evt.target.value;
      picturePreview.classList = '';
      picturePreview.classList.add('effects__preview--' + inputEffectValue);
      picturePreview.style = '';
      pinEffectLevel.style.left = '100%';
      effectLevelDepth.style.width = '100%';
      effectLevelBlock.classList.remove('hidden');
      if (inputEffectValue === 'none') {
        effectLevelBlock.classList.add('hidden');
      }
    }
  });

  var getEffectDepth = function () {
    var effectTotalWidth = effectLineTotal.clientWidth;
    var effectLineWidth = effectLevelDepth.clientWidth;
    return effectLineWidth / effectTotalWidth;
  };

  var applyEffect = function (depth) {
    var handler = EffectsDepthHandlers[inputEffectValue];
    picturePreview.style.filter = handler(depth);
  };

  pinEffectLevel.addEventListener('mousedown', function (evt) {
    var startCoords = {
      x: evt.clientX
    };

    var onMouseMove = function (moveEvt) {
      var shift = {
        x: startCoords.x - moveEvt.clientX
      };

      startCoords = {
        x: moveEvt.clientX
      };

      var depth = getEffectDepth();
      var effectDepthWidth = effectLevelDepth.clientWidth;
      if (effectDepthWidth - shift.x > 0
        && effectDepthWidth - shift.x < MAX_DEPTH_WIDTH
        && pinEffectLevel.offsetLeft - shift.x > 0
        && pinEffectLevel.offsetLeft - shift.x < MAX_DEPTH_WIDTH) {
        pinEffectLevel.style.left = (pinEffectLevel.offsetLeft - shift.x) + 'px';
        effectLevelDepth.style.width = (pinEffectLevel.offsetLeft - shift.x) + 'px';
        applyEffect(depth);
      }
    };

    var onMouseUp = function () {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  var scaleControlSmaller = picturePreviewForm.querySelector('.scale__control--smaller');
  var scaleControlBigger = picturePreviewForm.querySelector('.scale__control--bigger');
  var scaleValue = picturePreviewForm.querySelector('.scale__control--value');

  var scalePicture = function (isScale) {
    var scale = Number(scaleValue.value.replace('%', ''));

    if (isScale && scale < SCALE_MAX) {
      scale = scale + SCALE_STEP;
    }
    if (!isScale && scale > SCALE_MIN) {
      scale = scale - SCALE_STEP;
    }

    scaleValue.value = scale + '%';
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

  var searchSameHashtags = function (hashtags) {
    var sameElements = {};

    return hashtags.some(function (hashtag) {
      if (sameElements.hasOwnProperty(hashtag)) {
        return true;
      }
      sameElements[hashtag] = false;
      return false;
    });
  };

  var validityInputHashtags = function (hashtagsText) {
    var hashtags = hashtagsText.toLowerCase().trim().split(' ');
    var regular = /^#[А-Яа-яЁёA-Za-z0-9]{1,20}$/;
    return hashtags.forEach(function (item) {
      var hashtag = item.trim();
      if (hashtag.search(regular) === -1 && hashtag !== '') {
        inputHashtag.style.outline = BORDER_VALUE_INPUT;
        return inputHashtag.setCustomValidity('Хеш-тег ' + hashtag + ' записан неверно!');
      }

      if (searchSameHashtags(hashtags)) {
        inputHashtag.style.outline = BORDER_VALUE_INPUT;
        return inputHashtag.setCustomValidity('Повторяющихся хеш-тегов быть не должно!');
      }

      if (hashtags.length > MAX_HASHTAGS) {
        inputHashtag.style.outline = BORDER_VALUE_INPUT;
        return inputHashtag.setCustomValidity('Нельзя указывать больше 5 хеш-тегов!');
      }

      inputHashtag.style.outline = NO_BORDER_VALUE;
      return inputHashtag.setCustomValidity('');
    });
  };

  var onFieldEnterInput = function () {
    var hashtagsText = inputHashtag.value;
    validityInputHashtags(hashtagsText);
  };

  inputHashtag.addEventListener('input', onFieldEnterInput);

  var onLoad = function () {
    picturePreviewForm.classList.add('hidden');
    document.body.classList.remove('modal-open');
    buttonFormUpload.textContent = TEXT_DEFAULT_BUTTON;
    openSuccessWindow();
    resetForm();
  };

  var onError = function () {
    picturePreviewForm.classList.add('hidden');
    document.body.classList.remove('modal-open');
    buttonFormUpload.textContent = TEXT_DEFAULT_BUTTON;
    openErrorWindow();
    resetForm();
  };

  formUpload.addEventListener('submit', function (evt) {
    evt.preventDefault();
    buttonFormUpload.textContent = TEXT_SEND_BUTTON;
    window.backend.send(new FormData(formUpload), onLoad, onError);
  });

  var openSuccessWindow = function () {
    templateSuccess.classList.remove('visually-hidden');

    document.removeEventListener('keydown', onButtonEscapeDown);
    document.addEventListener('keydown', onEscapeDownSuccessWindow);
    window.addEventListener('click', onClickUnderModalWindow);
  };

  var openErrorWindow = function () {
    templateError.classList.remove('visually-hidden');

    document.removeEventListener('keydown', onButtonEscapeDown);
    document.addEventListener('keydown', onEscapeDownErrorWindow);
    window.addEventListener('click', onClickUnderModalWindow);
  };

  var closeSuccessWindow = function () {
    templateSuccess.classList.add('visually-hidden');

    document.removeEventListener('keydown', onEscapeDownSuccessWindow);
    window.removeEventListener('click', onClickUnderModalWindow);
  };

  var closeErrorWindow = function () {
    templateError.classList.add('visually-hidden');

    document.removeEventListener('keydown', onEscapeDownErrorWindow);
    window.removeEventListener('click', onClickUnderModalWindow);
  };

  var onEscapeDownSuccessWindow = function (evt) {
    if (evt.key === window.utils.Buttons.ESCAPE_KEY) {
      closeSuccessWindow();
    }
  };

  var onEscapeDownErrorWindow = function (evt) {
    if (evt.key === window.utils.Buttons.ESCAPE_KEY) {
      closeErrorWindow();
    }
  };

  var onClickUnderModalWindow = function (evt) {
    if (evt.target !== errorInner
      && evt.target !== successInner
      && evt.target !== successTitle
      && evt.target !== errorTitle) {
      closeErrorWindow();
      closeSuccessWindow();
    }
  };

  buttonCloseSuccess.addEventListener('click', function () {
    closeSuccessWindow();
  });

  buttonCloseError.addEventListener('click', function () {
    closeErrorWindow();
  });
})();
