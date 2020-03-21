'use strict';

(function () {
  var FILES_TYPE = ['gif', 'jpg', 'jpeg', 'svg'];

  var fileChooser = document.querySelector('#upload-file');
  var picturePreview = document.querySelector('.img-upload__preview img');

  fileChooser.addEventListener('change', function () {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILES_TYPE.some(function (item) {
      return fileName.endsWith(item);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        picturePreview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });
})();
