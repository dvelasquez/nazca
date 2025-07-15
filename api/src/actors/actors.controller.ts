import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ActorsService } from './actors.service';
import { CreateActorDto, UpdateActorDto, ResponseActorDto } from './dto/actor.dto';
import { ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';

@Controller('actors')
export class ActorsController {
  constructor(private readonly actorsService: ActorsService) {}

  @Get()
  @ApiOkResponse({ type: [ResponseActorDto] })
  findAll() {
    return this.actorsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: ResponseActorDto })
  findOne(@Param('id') id: string) {
    return this.actorsService.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({ type: ResponseActorDto })
  create(@Body() actor: CreateActorDto) {
    return this.actorsService.create(actor);
  }

  @Put(':id')
  @ApiOkResponse({ type: ResponseActorDto })
  update(@Param('id') id: string, @Body() actor: UpdateActorDto) {
    return this.actorsService.update(id, actor);
  }

  @Delete(':id')
  @ApiOkResponse({ type: ResponseActorDto })
  remove(@Param('id') id: string) {
    return this.actorsService.remove(id);
  }
}
