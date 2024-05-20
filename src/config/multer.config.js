const multer = require("multer");
const AppError = require("../errors/AppError");
const storage = multer.memoryStorage();
const allowedFormats = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/svg+xml",
];
const upload = multer({
  storage,
  limits: {
    fileSize: 3000000, //3mb
  },
  fileFilter(req, file, cb) {
    console.log(file.mimetype);
    if (file.mimetype.startsWith("image")) {
      if (file.size > 3000000) {
        return next(
          new AppError("File too large. Exceeds the 3MB limits.", 413)
        );
      }
      if (!allowedFormats.includes(file.mimetype)) {
        return next(
          new AppError("Only JPEG, JPG, PNG and SVG files are allowed", 400)
        );
      }
    } else {
      return next(new AppError("Only images are allowed.", 400));
    }
  },
});

module.exports = upload;
