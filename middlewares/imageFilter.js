const fs = require('fs');

const imageFilter = function(req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
      req.fileValidationError = 'Only image files are allowed!';
      return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const audioFilter = function(req, file, cb) {
  // Accept audios only
  if (!file.originalname.match(/\.(mp3|MP3|wav|WAV|m3u|M3U)$/)) {
      req.fileValidationError = 'Only audio files with extension mp3, wav, m3u are allowed!';
      return cb(new Error('Only audio files with extension mp3, wav, m3u are allowed!'), false);
  }
  cb(null, true);
};

const sermonFilter = function(req, file, cb) {
  // Accept audios only
  if (!file.originalname.match(/\.(mp3|MP3|wav|WAV|m3u|M3U|mp4|MP4|webm|WEBM|ogv|OGV)$/)) {
      req.fileValidationError = 'Only files with extension mp3, wav, m3u, mp4, webm, ogv are allowed!';
      return cb(new Error('Only audio files with extension mp3, wav, m3u are allowed!'), false);
  }
  cb(null, true);
};

const deleteImage = (img) => {
  const path = `uploads/${img}`;

  fs.unlink(path, (err) => {
    if (err) {
      console.error(err)
      return
    }
  
    //file removed
  });
}

exports.imageFilter = imageFilter;
exports.audioFilter = audioFilter;
exports.deleteImage = deleteImage;
exports.sermonFilter = sermonFilter;