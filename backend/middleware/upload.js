import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|ppt|pptx|zip|rar/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  cb(null, extname);
};

export const upload = multer({ storage, fileFilter });
