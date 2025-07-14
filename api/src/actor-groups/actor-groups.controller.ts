import { Controller, Get, Post, Body, Param, Put, Delete, Patch, Query } from '@nestjs/common';
import { ActorGroupsService } from './actor-groups.service';
import { ActorGroup, Actor } from '../entities';
import { CreateActorGroupDto, UpdateActorGroupDto } from '../dto/actor-group.dto';
import { CreateActorDto, UpdateActorDto } from '../dto/actor.dto';

@Controller('actor-groups')
export class ActorGroupsController {
  constructor(private readonly actorGroupsService: ActorGroupsService) {}

  @Get()
  findAll() {
    return this.actorGroupsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.actorGroupsService.findOne(id);
  }

  @Post()
  create(@Body() actorGroup: CreateActorGroupDto) {
    return this.actorGroupsService.create(actorGroup);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() actorGroup: UpdateActorGroupDto) {
    return this.actorGroupsService.update(id, actorGroup);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.actorGroupsService.remove(id);
  }

  @Get(':id/actors')
  findActors(@Param('id') id: string) {
    return this.actorGroupsService.findActors(id);
  }

  @Post(':id/actors')
  createActor(@Param('id') id: string, @Body() actor: CreateActorDto) {
    return this.actorGroupsService.createActor(id, actor);
  }

  @Patch(':id/actors')
  patchActors(@Param('id') id: string, @Body() actor: UpdateActorDto, @Query('where') where?: any) {
    return this.actorGroupsService.patchActors(id, actor, where);
  }

  @Delete(':id/actors')
  deleteActors(@Param('id') id: string, @Query('where') where?: any) {
    return this.actorGroupsService.deleteActors(id, where);
  }
}
