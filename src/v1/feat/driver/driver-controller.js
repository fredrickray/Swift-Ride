import DriverService from './driver-service.js';

export class DriverController {
  constructor() {
    this.driverService = DriverService;
  }

  async vehicleRegistration(req, res, next) {
    await this.driverService.vehicleRegistration(req, res, next);
  }
}
