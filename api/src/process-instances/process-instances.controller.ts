import { Controller, Get, Post, Body, Param, Put, Delete, Patch, Query } from '@nestjs/common';
import { ProcessInstancesService } from './process-instances.service';
import { CreateProcessInstanceDto, UpdateProcessInstanceDto, ResponseProcessInstanceDto } from './dto/process-instance.dto';
import { CreateUserTaskInstanceDto, UpdateUserTaskInstanceDto, ResponseUserTaskInstanceDto } from '../user-task-instances/dto/user-task-instance.dto';
import { ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';

@Controller('process-instances')
export class ProcessInstancesController {
  constructor(private readonly processInstancesService: ProcessInstancesService) {}

  @Get()
  @ApiOkResponse({ type: [ResponseProcessInstanceDto] })
  findAll() {
    return this.processInstancesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: ResponseProcessInstanceDto })
  findOne(@Param('id') id: string) {
    return this.processInstancesService.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({ type: ResponseProcessInstanceDto })
  create(@Body() processInstance: CreateProcessInstanceDto) {
    return this.processInstancesService.create(processInstance);
  }

  @Put(':id')
  @ApiOkResponse({ type: ResponseProcessInstanceDto })
  update(@Param('id') id: string, @Body() processInstance: UpdateProcessInstanceDto) {
    return this.processInstancesService.update(id, processInstance);
  }

  @Delete(':id')
  @ApiOkResponse({ type: ResponseProcessInstanceDto })
  remove(@Param('id') id: string) {
    return this.processInstancesService.remove(id);
  }

  @Get(':id/user-task-instances')
  @ApiOkResponse({ type: [ResponseUserTaskInstanceDto] })
  findUserTaskInstances(@Param('id') id: string) {
    return this.processInstancesService.findUserTaskInstances(id);
  }

  @Post(':id/user-task-instances')
  @ApiCreatedResponse({ type: ResponseUserTaskInstanceDto })
  createUserTaskInstance(@Param('id') id: string, @Body() userTaskInstance: CreateUserTaskInstanceDto) {
    return this.processInstancesService.createUserTaskInstance(id, userTaskInstance);
  }

  @Patch(':id/user-task-instances')
  @ApiOkResponse({ type: ResponseUserTaskInstanceDto })
  patchUserTaskInstances(@Param('id') id: string, @Body() userTaskInstance: UpdateUserTaskInstanceDto, @Query('where') where?: any) {
    return this.processInstancesService.patchUserTaskInstances(id, userTaskInstance, where);
  }

  @Delete(':id/user-task-instances')
  @ApiOkResponse({ type: ResponseUserTaskInstanceDto })
  deleteUserTaskInstances(@Param('id') id: string, @Query('where') where?: any) {
    return this.processInstancesService.deleteUserTaskInstances(id, where);
  }
}
