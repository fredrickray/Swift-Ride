import { Router } from 'express';
import { AuthhController } from './auth-controller.js';
import {
  signinValidator,
  signupValidator,
  verifyEmailValidator,
} from '../../../validations/auth-validation.js';
const authRouter = Router();
const authController = new AuthhController();

authRouter
  .route('/signup')
  .post(signupValidator, authController.signup.bind(authController));

authRouter
  .route('/signin')
  .post(signinValidator, authController.signin.bind(authController));

authRouter
  .route('/verify-otp')
  .post(verifyEmailValidator, authController.verifyEmail.bind(authController));

authRouter
  .route('/forgot-password')
  .post(authController.forgotPassword.bind(authController));

authRouter
  .route('/reset-password')
  .post(authController.resetPassword.bind(authController));

authRouter.route('/google').get((req, res, next) => {
  const role = req.query.role; // Ensure role is taken from query
  const state = JSON.stringify({ role });
  // console.log('Role in /google route:', role); // Debugging
  // console.log('State in /google route:', state);
  authController.googleAuth(req, res, next, state);
});
authRouter
  .route('/google/callback')
  .get(authController.googleCallback, (req, res, next) => {
    res.json({
      success: true,
      message: req.authInfo.message,
      user: req.user,
    });
  });

export default authRouter;
