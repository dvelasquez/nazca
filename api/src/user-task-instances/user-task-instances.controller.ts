import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UserTaskInstancesService } from './user-task-instances.service';
import { UserTaskInstance } from '../entities';
import { CreateUserTaskInstanceDto, UpdateUserTaskInstanceDto } from '../dto/user-task-instance.dto';

@Controller('user-task-instances')
export class UserTaskInstancesController {
  constructor(private readonly userTaskInstancesService: UserTaskInstancesService) {}

  @Get()
  findAll() {
    return this.userTaskInstancesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userTaskInstancesService.findOne(id);
  }

  @Post()
  create(@Body() userTaskInstance: CreateUserTaskInstanceDto) {
    return this.userTaskInstancesService.create(userTaskInstance);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() userTaskInstance: UpdateUserTaskInstanceDto) {
    return this.userTaskInstancesService.update(id, userTaskInstance);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userTaskInstancesService.remove(id);
  }

  @Get(':id/assignee')
  findAssignee(@Param('id') id: string) {
    return this.userTaskInstancesService.findAssignee(id);
  }
}
