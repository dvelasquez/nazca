import { Controller, Get, Post, Body, Param, Put, Delete, Patch, Query } from '@nestjs/common';
import { ActorGroupsService } from './actor-groups.service';
import { CreateActorGroupDto, UpdateActorGroupDto, ResponseActorGroupDto } from './dto/actor-group.dto';
import { CreateActorDto, UpdateActorDto, ResponseActorDto } from '../actors/dto/actor.dto';
import { ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';

@Controller('actor-groups')
export class ActorGroupsController {
  constructor(private readonly actorGroupsService: ActorGroupsService) {}

  @Get()
  @ApiOkResponse({ type: [ResponseActorGroupDto] })
  findAll() {
    return this.actorGroupsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: ResponseActorGroupDto })
  findOne(@Param('id') id: string) {
    return this.actorGroupsService.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({ type: ResponseActorGroupDto })
  create(@Body() actorGroup: CreateActorGroupDto) {
    return this.actorGroupsService.create(actorGroup);
  }

  @Put(':id')
  @ApiOkResponse({ type: ResponseActorGroupDto })
  update(@Param('id') id: string, @Body() actorGroup: UpdateActorGroupDto) {
    return this.actorGroupsService.update(id, actorGroup);
  }

  @Delete(':id')
  @ApiOkResponse({ type: ResponseActorGroupDto })
  remove(@Param('id') id: string) {
    return this.actorGroupsService.remove(id);
  }

  @Get(':id/actors')
  @ApiOkResponse({ type: [ResponseActorDto] })
  findActors(@Param('id') id: string) {
    return this.actorGroupsService.findActors(id);
  }

  @Post(':id/actors')
  @ApiCreatedResponse({ type: ResponseActorDto })
  createActor(@Param('id') id: string, @Body() actor: CreateActorDto) {
    return this.actorGroupsService.createActor(id, actor);
  }

  @Patch(':id/actors')
  @ApiOkResponse({ type: ResponseActorDto })
  patchActors(@Param('id') id: string, @Body() actor: UpdateActorDto, @Query('where') where?: any) {
    return this.actorGroupsService.patchActors(id, actor, where);
  }

  @Delete(':id/actors')
  @ApiOkResponse({ type: ResponseActorDto })
  deleteActors(@Param('id') id: string, @Query('where') where?: any) {
    return this.actorGroupsService.deleteActors(id, where);
  }
}
