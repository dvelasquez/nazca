import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/ping')
  ping(@Req() request: Request): object {
    return {
      greeting: 'Hello from NestJS',
      date: new Date(),
      url: request.url,
      headers: request.headers,
    };
  }
}
