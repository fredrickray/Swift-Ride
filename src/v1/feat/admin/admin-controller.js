import AdminService from './admin-service.js';

export class AdminController {
  constructor() {
    this.adminService = AdminService;
  }

  /**
   * @route POST api/admin/signin
   * @desc Signin admin
   * @access Public
   */
  async signin(req, res, next) {
    await this.adminService.signin(req, res, next);
  }
  /**
   * @route POST api/admin/users?role
   * @desc Get all users
   * @access Public
   */
  async getUsers(req, res, next) {
    await this.adminService.getUsers(req, res, next);
  }

  /**
   * @route POST api/admin/users/:id
   * @desc Get a user
   * @access Public
   */
  async getUser(req, res, next) {
    await this.adminService.getUser(req, res, next);
  }

  /**
   * @route POST api/admin/vehicle/type
   * @desc Create a vehicle type
   * @access Public
   */
  async createVehicleType(req, res, next) {
    await this.adminService.createVehicleType(req, res, next);
  }

  /**
   * @route POST api/admin/vehicle/make
   * @desc Create a vehicle make
   * @access Public
   */
  async createVehicleMake(req, res, next) {
    await this.adminService.createVehicleMake(req, res, next);
  }

  /**
   * @route POST api/vehicle/:id/verify
   * @desc Verify a vehicle
   * @access Public
   */
  async verifyDriverVehicle(req, res, next) {
    await this.adminService.verifyDriverVehicle(req, res, next);
  }
}
