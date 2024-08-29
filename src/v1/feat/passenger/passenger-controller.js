import PassengerService from './passenger-service.js';

export class PassengerController {
  constructor() {
    this.passengerService = PassengerService;
  }

  async initiateRide(req, res, next) {
    await this.passengerService.test2(req, res, next);
  }

  async availableDrivers(req, res, next) {
    await this.passengerService.availableDrivers(req, res, next);
  }

  async selectDriver(req, res, next) {
    await this.passengerService.selectDriver(req, res, next);
  }
}
