import AuthService from './auth-service.js';

export class AuthhController {
  constructor() {
    this.authService = AuthService;
    // Bind methods to ensure 'this' context
    this.googleAuth = this.googleAuth.bind(this);
    this.googleCallback = this.googleCallback.bind(this);
  }

  /**
   * @route POST api/auth/signup
   * @desc Register a user
   * @access Public
   */
  async signup(req, res, next) {
    await this.authService.signup(req, res, next);
  }

  /**
   * @route POST api/auth/signin
   * @desc Login a user
   * @access Public
   */
  async signin(req, res, next) {
    await this.authService.signin(req, res, next);
  }

  /**
   * @route POST api/auth/verify-otp
   * @desc Verify a user
   * @access Public
   */
  async verifyEmail(req, res, next) {
    await this.authService.verifyEmail(req, res, next);
  }

  /**
   * @route POST api/auth/forgot-password
   * @desc Send verification link
   * @access Public
   */
  async forgotPassword(req, res, next) {
    await this.authService.forgotPassword(req, res, next);
  }

  /**
   * @route POST api/auth/reset-password
   * @desc Verify a user
   * @access Public
   */
  async resetPassword(req, res, next) {
    await this.authService.resetPassword(req, res, next);
  }

  async googleAuth(req, res, next, state) {
    await this.authService.authenticateGoogle(req, res, next, state);
  }

  /**
   * @route GET api/auth/google/callback
   * @desc Google OAuth callback
   * @access Public
   */
  async googleCallback(req, res, next) {
    await this.authService.handleGoogleCallback(req, res, next);
  }
}
