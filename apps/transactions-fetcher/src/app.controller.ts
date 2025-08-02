import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/test")
  async test() {
    try {
      return await this.appService.workflow();
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  }
}