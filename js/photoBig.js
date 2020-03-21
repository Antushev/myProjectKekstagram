'use strict';

(function () {
  var START_INDEX_ARRAY = 0;
  var COMMENTS_STEP = 5;

  var pictureContainer = document.querySelector('.pictures');
  var picture = document.querySelector('.big-picture');
  var pictureBig = picture.querySelector('.big-picture__img img');
  var pictureClose = picture.querySelector('.big-picture__cancel');
  var pictureCloseEscape = picture.querySelector('.big-picture__cancel');
  var commentsList = picture.querySelector('.social__comments');
  var commentTemplate = commentsList.querySelector('.social__comment');
  var buttonCommentsLoader = picture.querySelector('.comments-loader');
  var idCurrentPhoto;

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

    var commentsMaxNumber;

    if (comments.length < COMMENTS_STEP) {
      commentsMaxNumber = comments.length;
    } else {
      commentsMaxNumber = COMMENTS_STEP;
    }

    for (var i = START_INDEX_ARRAY; i < commentsMaxNumber; i++) {
      fragmentComments.appendChild(createComment(comments[i]));
    }

    picture.querySelector('.social__comments').innerHTML = '';
    picture.querySelector('.social__comments').appendChild(fragmentComments);
    picture.querySelector('.comments-view').textContent = commentsMaxNumber;
  };

  var getNumberAdditionalComments = function (photo, startNumberComments) {
    var totalComments = photo.comments.length;
    var commentsMaxNumber;

    if ((totalComments - startNumberComments) < COMMENTS_STEP) {
      commentsMaxNumber = totalComments;
    } else {
      commentsMaxNumber = startNumberComments + COMMENTS_STEP;
    }

    return commentsMaxNumber;
  };

  var viewAdditionalComments = function (photo, startNumberComments) {
    var fragmentComments = document.createDocumentFragment();

    var commentsMaxNumber = getNumberAdditionalComments(photo, startNumberComments);

    for (var i = startNumberComments; i < commentsMaxNumber; i++) {
      fragmentComments.appendChild(createComment(photo.comments[i]));
    }

    commentsList.appendChild(fragmentComments);
    picture.querySelector('.comments-view').textContent = commentsMaxNumber;
  };

  var renderBigPicture = function (photo) {
    pictureBig.setAttribute('src', photo.url);
    picture.querySelector('.likes-count').textContent = photo.likes;
    picture.querySelector('.comments-count').textContent = photo.comments.length;

    renderCommentsForPicture(photo.comments);

    picture.querySelector('.social__caption').textContent = photo.description;
    picture.classList.remove('hidden');
  };

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
    if (evt.key === window.utils.Buttons.ENTER_KEY && evt.target.classList.contains('picture')) {
      var infoBigPicture = window.gallery.currentPhotos[evt.target.querySelector('.picture__img')
        .getAttribute('data-id')];
      idCurrentPhoto = evt.target.querySelector('.picture__img').getAttribute('data-id');
      openBigPicture(infoBigPicture);

      addEventKeyBigPicture();
    }
  };

  var onButtonPictureCloseEnterDown = function (evt) {
    if (evt.key === window.utils.Buttons.ENTER_KEY && evt.target === pictureCloseEscape) {
      closeBigPicture();

      removeEventKeyBigPicture();
    }
  };

  pictureContainer.addEventListener('click', function (evt) {
    if (evt.target.classList.contains('picture__img')) {
      var infoBigPicture = window.gallery.currentPhotos[evt.target.getAttribute('data-id')];
      idCurrentPhoto = evt.target.getAttribute('data-id');
      openBigPicture(infoBigPicture);

      addEventKeyBigPicture();
    }
  });

  pictureContainer.addEventListener('keydown', onButtonPictureOpenEnterDown);

  var onButtonPictureCloseEscapeDown = function (evt) {
    if (evt.key === window.utils.Buttons.ESCAPE_KEY) {
      closeBigPicture();

      removeEventKeyBigPicture();
    }
  };

  pictureClose.addEventListener('click', function () {
    closeBigPicture();

    removeEventKeyBigPicture();
  });

  buttonCommentsLoader.addEventListener('click', function () {
    var numberComments = commentsList.querySelectorAll('.social__comment').length;
    viewAdditionalComments(window.gallery.currentPhotos[idCurrentPhoto], numberComments);
  });
})();
