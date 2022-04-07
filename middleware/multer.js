const multer = require("multer");
const AppError = require("../utils/errorsHandler");
const { dirname } = require("path");


const fileFilter = (req, file, cb) => {
  console.log({ file });
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Make sure to upload image file png/jpeg/jpg/..", 400));
  }
};

const storage = multer.memoryStorage();
exports.upload = multer({ storage, fileFilter });
