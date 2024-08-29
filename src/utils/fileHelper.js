import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import { BadRequest, ServerError } from '../middlewares/errorMiddleware.js';
import fs from 'fs';

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

const uploadToCloudinary = async (fileToUpload) => {
  try {
    const data = await cloudinary.uploader.upload(fileToUpload, {
      resource_type: 'auto',
    });
    console.log('cloudinary data:', data);
    console.log('file to upload:', fileToUpload);
    deleteFromDiskStorage(fileToUpload);
    return data;
  } catch (error) {
    console.log('uploadToCloudinaryError:', error);
    deleteFromDiskStorage(fileToUpload);
    if (error.name === 'TimeoutError') {
      throw new Timeout('Request Timeout, please try again');
    }
    throw new ServerError(`Internal Server Error (cloudinary), ${error}`);
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const deleteFromDiskStorage = (filePath) => {
  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    console.log('Error deleting from disk', error);
    // httpLogger.error(`Internal Server Error (disk), ${error}`);
  }
};

export { uploadToCloudinary, deleteFromCloudinary, deleteFromDiskStorage };
