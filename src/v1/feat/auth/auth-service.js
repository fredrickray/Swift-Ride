import bcrypt from 'bcrypt';
import {
  ResourceNotFound,
  InvalidInput,
  BadRequest,
  Unauthorized,
} from '../../../middlewares/errorMiddleware.js';
import db from '../../../config/db.js';
import generateOtp from '../../../utils/otp.js';
import sendMail from '../../../utils/mail.js';
import {
  createToken,
  verifyToken,
  expiryTime,
} from '../../../middlewares/authMiddleware.js';
import passport from '../../../utils/passport.js';

class AuthService {
  static async signup(req, res, next) {
    try {
      const { email, password, name, phone_number, role } = req.body;
      const userExist = await db('User').where({ email }).first();
      if (userExist) {
        throw new BadRequest('Email already exist, try again');
      }

      let roleRecord = await db('Role').where({ name: role }).first();
      if (!roleRecord) {
        const [roleId] = await db('Role').insert({ name: role });
        roleRecord = { id: roleId };
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationCode = generateOtp();

      const [userId] = await db('User').insert({
        name,
        email,
        password: hashedPassword,
        phone_number,
        role_id: roleRecord.id,
        otp: verificationCode,
        otpExpiry: expiryTime,
        created_at: db.fn.now(),
        updated_at: db.fn.now(),
      });

      if (role.toLowerCase() === 'passenger') {
        await db('Passenger').insert({
          user_id: userId,
        });
      } else if (role.toLowerCase() === 'driver') {
        await db('Driver').insert({
          user_id: userId,
        });
      }

      await sendMail(
        email,
        'Email verification',
        `Email verification code is ${verificationCode}`
      );

      const resPayload = {
        success: true,
        message: `A verification code was sent to ${email}`,
      };

      res.status(201).json(resPayload);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async signin(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await db('User').where({ email }).first();
      if (!user) {
        throw new ResourceNotFound('Invalid credentials');
      }

      // console.log('passwordInDB:', user.password);
      const isPasswordValid = await bcrypt.compare(password, user.password);
      // console.log('inputPassword:', password);
      if (!isPasswordValid) {
        throw new ResourceNotFound('Invalid credentials');
      }

      if (user.isVerified === 0 || user.isVerified === false) {
        const verificationCode = generateOtp();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await db('User')
          .where({ email })
          .update({ otpExpiry, otp: verificationCode });

        await sendMail(
          email,
          'Email verification',
          `Email verification code is ${verificationCode}`
        );

        throw new Unauthorized(
          'User is not verified, check your email for verification code'
        );
      }

      const token = createToken(user.id);

      const resPayload = {
        success: true,
        mnessage: 'Login successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone_number: user.phone_number,
        },
      };

      res.status(200).set('Authorization', `Bearer ${token}`).json(resPayload);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async verifyEmail(req, res, next) {
    try {
      const { email, otp } = req.body;

      const user = await db('User').where({ email }).first();

      if (!user) {
        throw new ResourceNotFound('User not found');
      }

      if (otp !== user.otp) {
        // console.log('Line 74:', otp);
        // console.log('Line 75:', user.otp);
        throw new Unauthorized('Invalid OTP');
      }

      const otpExpiry = new Date(user.otpExpiry);
      const currentDate = new Date();
      const differenceInMilliseconds = otpExpiry - currentDate;

      // Convert the difference to minutes
      //   const differenceInMinutes = Math.floor(
      //     differenceInMilliseconds / (1000 * 60)
      //   );

      // Log the remaining time
      // console.log(`Time left before OTP expires: ${differenceInMinutes} minutes`);

      // Ensure otpExpiry is a Date object
      if (differenceInMilliseconds <= 0) {
        const verificationCode = generateOtp();

        await sendMail(
          email,
          'Email Verification',
          `Your verification code is: ${verificationCode}`
        );
        // httpLogger.info("Verification email sent successfully");

        await db('User').where({ email }).update({
          otp: verificationCode,
          otpExpiry: expiryTime,
          updated_at: db.fn.now(),
        });

        throw new Unauthorized('OTP expired, check your email for new OTP');
      }

      await db('User').where({ email }).update({
        otp: null,
        otpExpiry: null,
        verified: 1,
      });

      const resPayload = {
        success: true,
        message: 'Account verified succesfully',
        // user: {
        //     id: user.id,
        //     name: user.name,
        //     email: user.email,
        //     phone_number: user.phone_number,
        // },
      };

      res.status(200).json(resPayload);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      if (!email) {
        throw new InvalidInput('Email is required');
      }

      const user = await db('User').where({ email }).first();

      if (!user) {
        throw new ResourceNotFound('Account not found');
      }

      const token = createToken(user.id);

      const frontend_url = process.env.FRONTEND_BASE_URL;

      if (frontend_url == null) {
        throw new Error('Frontend URL is not defined');
      }

      const reset_url = `${frontend_url}/auth/forgot-password?token=${token}`;

      await sendMail(
        email,
        'Reset Password',
        `Click the link to reset your password: ${reset_url}`
      );

      await db('User').where({ email }).update({
        passwordResetToken: token,
        passwordResetExpiry: expiryTime,
      });

      const resPayload = {
        success: true,
        message: `A verification link was sent to ${email}`,
      };

      res.header('authorization', `Bearer ${token}`);
      res.status(200).json(resPayload);
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req, res, next) {
    try {
      const { token } = req.query;
      const { password, confirmPassword } = req.body;

      if (!token) {
        throw new Unauthorized('Authorization token required');
      }

      const errors = validatePassword(password);

      const { id } = verifyToken(token);

      const user = await db('User').where({ id });
      if (!user) {
        throw new ResourceNotFound('User not found');
      }

      if (expiryTime > user.passwordResetExpiry) {
        throw new Unauthorized('OTP has expired or is invalid');
      }

      if (errors.length > 0) {
        throw new InvalidInput('Invalid input', errors);
      }

      if (confirmPassword !== password) {
        throw new InvalidInput('Password and Confirm Password do not match');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await db('User').where({ id }).update({
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpiry: null,
      });

      const resPayload = {
        success: true,
        message: 'Password reset succesfully',
      };

      res.status(200).json(resPayload);
    } catch (error) {
      next(error);
    }
  }

  static authenticateGoogle(req, res, next, state) {
    return passport.authenticate('google', {
      scope: ['email', 'profile'],
      state,
    })(req, res, next);
  }

  static handleGoogleCallback(req, res, next) {
    return passport.authenticate('google', {
      session: false,
    })(req, res, next);
  }
}

export default AuthService;
