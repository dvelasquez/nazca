import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { Tenant } from '../entities';
import { CreateTenantDto, UpdateTenantDto } from '../dto/tenant.dto';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  findAll() {
    return this.tenantsService.findAll();
  }

  @Get('/count')
  count() {
    return this.tenantsService.count();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tenantsService.findOne(id);
  }

  @Post()
  create(@Body() tenant: CreateTenantDto) {
    return this.tenantsService.create(tenant);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() tenant: UpdateTenantDto) {
    return this.tenantsService.update(id, tenant);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tenantsService.remove(id);
  }

  @Put()
  updateAll(@Body() tenant: UpdateTenantDto) {
    return this.tenantsService.updateAll(tenant);
  }

  @Put(':id/replace')
  replaceById(@Param('id') id: string, @Body() tenant: UpdateTenantDto) {
    return this.tenantsService.replaceById(id, tenant);
  }

  @Get(':id/actors')
  findActors(@Param('id') id: string) {
    return this.tenantsService.findActors(id);
  }

  @Get(':id/actor-groups')
  findActorGroups(@Param('id') id: string) {
    return this.tenantsService.findActorGroups(id);
  }

  @Get(':id/process-definitions')
  findProcessDefinitions(@Param('id') id: string) {
    return this.tenantsService.findProcessDefinitions(id);
  }
}
