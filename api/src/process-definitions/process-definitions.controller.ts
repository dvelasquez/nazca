import { Controller, Get, Post, Body, Param, Put, Delete, Patch, Query } from '@nestjs/common';
import { ProcessDefinitionsService } from './process-definitions.service';
import { ProcessDefinition, ProcessInstance } from '../entities';
import { CreateProcessDefinitionDto, UpdateProcessDefinitionDto } from '../dto/process-definition.dto';
import { CreateProcessInstanceDto, UpdateProcessInstanceDto } from '../dto/process-instance.dto';

@Controller('process-definitions')
export class ProcessDefinitionsController {
  constructor(private readonly processDefinitionsService: ProcessDefinitionsService) {}

  @Get()
  findAll() {
    return this.processDefinitionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.processDefinitionsService.findOne(id);
  }

  @Post()
  create(@Body() processDefinition: CreateProcessDefinitionDto) {
    return this.processDefinitionsService.create(processDefinition);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() processDefinition: UpdateProcessDefinitionDto) {
    return this.processDefinitionsService.update(id, processDefinition);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.processDefinitionsService.remove(id);
  }

  @Get(':id/process-instances')
  findProcessInstances(@Param('id') id: string) {
    return this.processDefinitionsService.findProcessInstances(id);
  }

  @Post(':id/process-instances')
  createProcessInstance(@Param('id') id: string, @Body() processInstance: CreateProcessInstanceDto) {
    return this.processDefinitionsService.createProcessInstance(id, processInstance);
  }

  @Patch(':id/process-instances')
  patchProcessInstances(@Param('id') id: string, @Body() processInstance: UpdateProcessInstanceDto, @Query('where') where?: any) {
    return this.processDefinitionsService.patchProcessInstances(id, processInstance, where);
  }

  @Delete(':id/process-instances')
  deleteProcessInstances(@Param('id') id: string, @Query('where') where?: any) {
    return this.processDefinitionsService.deleteProcessInstances(id, where);
  }
}
