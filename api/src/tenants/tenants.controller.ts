import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto, UpdateTenantDto, ResponseTenantDto } from './dto/tenant.dto';
import { ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  @ApiOkResponse({ type: [ResponseTenantDto] })
  findAll() {
    return this.tenantsService.findAll();
  }

  @Get('/count')
  @ApiOkResponse({ type: Number })
  count() {
    return this.tenantsService.count();
  }

  @Get(':id')
  @ApiOkResponse({ type: ResponseTenantDto })
  findOne(@Param('id') id: string) {
    return this.tenantsService.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({ type: ResponseTenantDto })
  create(@Body() tenant: CreateTenantDto) {
    return this.tenantsService.create(tenant);
  }

  @Put(':id')
  @ApiOkResponse({ type: ResponseTenantDto })
  update(@Param('id') id: string, @Body() tenant: UpdateTenantDto) {
    return this.tenantsService.update(id, tenant);
  }

  @Delete(':id')
  @ApiOkResponse({ type: ResponseTenantDto })
  remove(@Param('id') id: string) {
    return this.tenantsService.remove(id);
  }

  @Put()
  @ApiOkResponse({ type: ResponseTenantDto })
  updateAll(@Body() tenant: UpdateTenantDto) {
    return this.tenantsService.updateAll(tenant);
  }

  @Put(':id/replace')
  @ApiOkResponse({ type: ResponseTenantDto })
  replaceById(@Param('id') id: string, @Body() tenant: UpdateTenantDto) {
    return this.tenantsService.replaceById(id, tenant);
  }

  @Get(':id/actors')
  @ApiOkResponse({ type: [Object] }) // TODO: Replace with a proper response DTO if available
  findActors(@Param('id') id: string) {
    return this.tenantsService.findActors(id);
  }

  @Get(':id/actor-groups')
  @ApiOkResponse({ type: [Object] }) // TODO: Replace with a proper response DTO if available
  findActorGroups(@Param('id') id: string) {
    return this.tenantsService.findActorGroups(id);
  }

  @Get(':id/process-definitions')
  @ApiOkResponse({ type: [Object] }) // TODO: Replace with a proper response DTO if available
  findProcessDefinitions(@Param('id') id: string) {
    return this.tenantsService.findProcessDefinitions(id);
  }
}
