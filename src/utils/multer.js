import multer from 'multer';
import path from 'path';
import { BadRequest } from '../middlewares/errorMiddleware.js';

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'file-uploads');
    console.log('Uploading to:', uploadPath);
    cb(null, 'file-uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

console.log('File storage', fileStorage);
const photoUpload = multer({
  storage: fileStorage,
  fileFilter: function (req, file, cb) {
    console.log('photo to be uploaded:', file);
    console.log('photo upload request:', req.body);
    const ext = path.extname(file.originalname);
    if (!['.jpg', '.jpeg', '.png'].includes(ext.toLowerCase())) {
      cb(new BadRequest('File type is not supported'), false);
      return;
    }
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file format'));
    }
  },
  // limits: { fileSize: 1024 * 1024 }, // 1 megabyte
});

export default photoUpload;
