import { Controller, Get, Post, Body, Param, Put, Delete, Patch, Query } from '@nestjs/common';
import { ProcessDefinitionsService } from './process-definitions.service';
import { CreateProcessDefinitionDto, UpdateProcessDefinitionDto, ResponseProcessDefinitionDto } from './dto/process-definition.dto';
import { CreateProcessInstanceDto, UpdateProcessInstanceDto } from '../process-instances/dto/process-instance.dto';
import { ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { ResponseProcessInstanceDto } from '../process-instances/dto/process-instance.dto';

@Controller('process-definitions')
export class ProcessDefinitionsController {
  constructor(private readonly processDefinitionsService: ProcessDefinitionsService) {}

  @Get()
  @ApiOkResponse({ type: [ResponseProcessDefinitionDto] })
  findAll() {
    return this.processDefinitionsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: ResponseProcessDefinitionDto })
  findOne(@Param('id') id: string) {
    return this.processDefinitionsService.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({ type: ResponseProcessDefinitionDto })
  create(@Body() processDefinition: CreateProcessDefinitionDto) {
    return this.processDefinitionsService.create(processDefinition);
  }

  @Put(':id')
  @ApiOkResponse({ type: ResponseProcessDefinitionDto })
  update(@Param('id') id: string, @Body() processDefinition: UpdateProcessDefinitionDto) {
    return this.processDefinitionsService.update(id, processDefinition);
  }

  @Delete(':id')
  @ApiOkResponse({ type: ResponseProcessDefinitionDto })
  remove(@Param('id') id: string) {
    return this.processDefinitionsService.remove(id);
  }

  @Get(':id/process-instances')
  @ApiOkResponse({ type: [ResponseProcessInstanceDto] })
  findProcessInstances(@Param('id') id: string) {
    return this.processDefinitionsService.findProcessInstances(id);
  }

  @Post(':id/process-instances')
  @ApiCreatedResponse({ type: ResponseProcessInstanceDto })
  createProcessInstance(@Param('id') id: string, @Body() processInstance: CreateProcessInstanceDto) {
    return this.processDefinitionsService.createProcessInstance(id, processInstance);
  }

  @Patch(':id/process-instances')
  @ApiOkResponse({ type: ResponseProcessInstanceDto })
  patchProcessInstances(@Param('id') id: string, @Body() processInstance: UpdateProcessInstanceDto, @Query('where') where?: any) {
    return this.processDefinitionsService.patchProcessInstances(id, processInstance, where);
  }

  @Delete(':id/process-instances')
  @ApiOkResponse({ type: ResponseProcessInstanceDto })
  deleteProcessInstances(@Param('id') id: string, @Query('where') where?: any) {
    return this.processDefinitionsService.deleteProcessInstances(id, where);
  }
}
