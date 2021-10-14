const multer = require("multer");
const mkdirp = require("mkdirp");
const uploadImageSingle = (type) => {
  const made = mkdirp.sync(`./public/images/${type}`);
  // setup path save file & name file
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./public/images/${type}`);
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  });
  const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
      const extensionImageList = ["png", "jpg", "jpeg"];
      const words = file.originalname.split(".");
      const extension = words[words.length - 1].toLowerCase();
      if (extensionImageList.includes(extension)) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
      }
    },
  });
  return upload.single(type);
};

module.exports = {
  uploadImageSingle,
};
