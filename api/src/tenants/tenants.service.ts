import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './entities/tenant.entity';
import { Actor } from '../actors/entities/actor.entity';
import { ActorGroup } from '../actor-groups/entities/actor-group.entity';
import { ProcessDefinition } from '../process-definitions/entities/process-definition.entity';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private tenantsRepository: Repository<Tenant>,
  ) {}

  findAll(): Promise<Tenant[]> {
    return this.tenantsRepository.find();
  }

  findOne(id: string): Promise<Tenant | null> {
    return this.tenantsRepository.findOneBy({ id });
  }

  create(tenant: Partial<Tenant>): Promise<Tenant> {
    const newTenant = this.tenantsRepository.create(tenant);
    return this.tenantsRepository.save(newTenant);
  }

  async update(id: string, tenant: Partial<Tenant>): Promise<Tenant | null> {
    await this.tenantsRepository.update(id, tenant);
    return this.tenantsRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.tenantsRepository.delete(id);
  }

  count(): Promise<number> {
    return this.tenantsRepository.count();
  }

  async updateAll(tenant: Partial<Tenant>): Promise<number> {
    const result = await this.tenantsRepository.update({}, tenant);
    return result.affected || 0;
  }

  async replaceById(id: string, tenant: Partial<Tenant>): Promise<void> {
    await this.tenantsRepository.save({ ...tenant, id });
  }

  async findActors(tenantId: string): Promise<Actor[]> {
    const tenant = await this.tenantsRepository.findOne({ where: { id: tenantId }, relations: ['actors'] });
    return tenant ? tenant.actors : [];
  }

  async findActorGroups(tenantId: string): Promise<ActorGroup[]> {
    const tenant = await this.tenantsRepository.findOne({ where: { id: tenantId }, relations: ['actorGroups'] });
    return tenant ? tenant.actorGroups : [];
  }

  async findProcessDefinitions(tenantId: string): Promise<ProcessDefinition[]> {
    const tenant = await this.tenantsRepository.findOne({ where: { id: tenantId }, relations: ['processDefinitions'] });
    return tenant ? tenant.processDefinitions : [];
  }
}
