import DriverService from './driver-service';

export class DriverController {
  constructor() {
    this.driverService = DriverService;
  }

  async vehicleRegistration(req, res, next) {
    await this.driverService.vehicleRegistration(req, res, next);
  }
}
