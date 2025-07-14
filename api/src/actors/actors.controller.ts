import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ActorsService } from './actors.service';
import { Actor } from '../entities';
import { CreateActorDto, UpdateActorDto } from '../dto/actor.dto';

@Controller('actors')
export class ActorsController {
  constructor(private readonly actorsService: ActorsService) {}

  @Get()
  findAll() {
    return this.actorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.actorsService.findOne(id);
  }

  @Post()
  create(@Body() actor: CreateActorDto) {
    return this.actorsService.create(actor);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() actor: UpdateActorDto) {
    return this.actorsService.update(id, actor);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.actorsService.remove(id);
  }
}
