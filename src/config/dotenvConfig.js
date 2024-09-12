import dotenv from 'dotenv';
dotenv.config();

const dotenvConfig = {
  Database: {
    user: process.env.DB_USER,
    name: process.env.DB_NAME,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    client: process.env.DB_CLIENT,
    port: process.env.DB_PORT,
  },
  Mail: {
    service: process.env.EMAIL_SERVICE,
    email_port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
  },
  JWT: {
    accessToken: process.env.ACCESS_TOKEN_SECRET,
  },
  TokenExpiry: {
    accessToken: process.env.ACCESS_TOKEN_EXPIRY,
  },
  Cloud: {
    name: process.env.CLOUDINARY_CLOUD_NAME,
    key: process.env.CLOUDINARY_API_KEY,
    secret: process.env.CLOUDINARY_API_SECRET,
    preset: process.env.CLOUDINARY_PROFILE_IMAGE_UPLOAD_PRESET,
  },
  Google: {
    clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_AUTH_CALLBACK_URL,
    successUrl: process.env.SUCCESS_REDIRECT_URL,
    failureUrl: process.env.FAILURE_REDIRECT_URL,
    mapSecretKey: process.env.GOOGLE_MAP_SECRET_KEY,
  },
  Flutterwave: {
    secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
    publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY,
    paymentUrl: process.env.FLUTTERWAVE_PAYMENT_URL,
  },
  serverBaseUrl: process.env.SERVER,
  frontendBaseUrl: process.env.FRONTEND_BASE_URL,
  bcryptSalt: process.env.BCRYPT_SALT,
};

export default dotenvConfig;
