import AdminService from './admin-service';

export class AdminController {
  constructor() {
    this.adminService = AdminService;
  }

  /**
   * @route POST api/admin/users?role
   * @desc Get all drivers
   * @access Public
   */
  async getUsers(req, res, next) {
    await this.adminService.getUsers(req, res, next);
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
