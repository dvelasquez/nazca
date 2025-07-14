import { Controller, Get, Post, Body, Param, Put, Delete, Patch, Query } from '@nestjs/common';
import { ProcessInstancesService } from './process-instances.service';
import { ProcessInstance, UserTaskInstance } from '../entities';
import { CreateProcessInstanceDto, UpdateProcessInstanceDto } from '../dto/process-instance.dto';
import { CreateUserTaskInstanceDto, UpdateUserTaskInstanceDto } from '../dto/user-task-instance.dto';

@Controller('process-instances')
export class ProcessInstancesController {
  constructor(private readonly processInstancesService: ProcessInstancesService) {}

  @Get()
  findAll() {
    return this.processInstancesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.processInstancesService.findOne(id);
  }

  @Post()
  create(@Body() processInstance: CreateProcessInstanceDto) {
    return this.processInstancesService.create(processInstance);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() processInstance: UpdateProcessInstanceDto) {
    return this.processInstancesService.update(id, processInstance);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.processInstancesService.remove(id);
  }

  @Get(':id/user-task-instances')
  findUserTaskInstances(@Param('id') id: string) {
    return this.processInstancesService.findUserTaskInstances(id);
  }

  @Post(':id/user-task-instances')
  createUserTaskInstance(@Param('id') id: string, @Body() userTaskInstance: CreateUserTaskInstanceDto) {
    return this.processInstancesService.createUserTaskInstance(id, userTaskInstance);
  }

  @Patch(':id/user-task-instances')
  patchUserTaskInstances(@Param('id') id: string, @Body() userTaskInstance: UpdateUserTaskInstanceDto, @Query('where') where?: any) {
    return this.processInstancesService.patchUserTaskInstances(id, userTaskInstance, where);
  }

  @Delete(':id/user-task-instances')
  deleteUserTaskInstances(@Param('id') id: string, @Query('where') where?: any) {
    return this.processInstancesService.deleteUserTaskInstances(id, where);
  }
}
