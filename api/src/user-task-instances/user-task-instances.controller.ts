import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UserTaskInstancesService } from './user-task-instances.service';
import { CreateUserTaskInstanceDto, UpdateUserTaskInstanceDto, ResponseUserTaskInstanceDto } from './dto/user-task-instance.dto';
import { ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';

@Controller('user-task-instances')
export class UserTaskInstancesController {
  constructor(private readonly userTaskInstancesService: UserTaskInstancesService) {}

  @Get()
  @ApiOkResponse({ type: [ResponseUserTaskInstanceDto] })
  findAll() {
    return this.userTaskInstancesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: ResponseUserTaskInstanceDto })
  findOne(@Param('id') id: string) {
    return this.userTaskInstancesService.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({ type: ResponseUserTaskInstanceDto })
  create(@Body() userTaskInstance: CreateUserTaskInstanceDto) {
    return this.userTaskInstancesService.create(userTaskInstance);
  }

  @Put(':id')
  @ApiOkResponse({ type: ResponseUserTaskInstanceDto })
  update(@Param('id') id: string, @Body() userTaskInstance: UpdateUserTaskInstanceDto) {
    return this.userTaskInstancesService.update(id, userTaskInstance);
  }

  @Delete(':id')
  @ApiOkResponse({ type: ResponseUserTaskInstanceDto })
  remove(@Param('id') id: string) {
    return this.userTaskInstancesService.remove(id);
  }

  @Get(':id/assignee')
  @ApiOkResponse({ type: Object }) // TODO: Replace with a proper response DTO if available
  findAssignee(@Param('id') id: string) {
    return this.userTaskInstancesService.findAssignee(id);
  }
}
