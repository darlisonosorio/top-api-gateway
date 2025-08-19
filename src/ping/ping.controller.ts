import { Controller, Get } from "@nestjs/common";
import { PingService } from "./ping.service";

@Controller()
export class PingController {
  constructor(private readonly pingService: PingService) {}

  @Get("/ping-users")
  pingUsers() {
    return this.pingService.pingUsers();
  }

  @Get("/ping-finance")
  pingFinance() {
    return this.pingService.pingFinance();
  }
}