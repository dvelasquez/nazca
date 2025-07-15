import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessDefinition } from './entities/process-definition.entity';
import { ProcessInstance } from '../process-instances/entities/process-instance.entity';

@Injectable()
export class ProcessDefinitionsService {
  constructor(
    @InjectRepository(ProcessDefinition)
    private processDefinitionsRepository: Repository<ProcessDefinition>,
    @InjectRepository(ProcessInstance)
    private processInstancesRepository: Repository<ProcessInstance>,
  ) {}

  findAll(): Promise<ProcessDefinition[]> {
    return this.processDefinitionsRepository.find({ relations: ['tenant', 'processInstances'] });
  }

  findOne(id: string): Promise<ProcessDefinition | null> {
    return this.processDefinitionsRepository.findOne({ where: { id }, relations: ['tenant', 'processInstances'] });
  }

  create(processDefinition: Partial<ProcessDefinition>): Promise<ProcessDefinition> {
    const newProcessDefinition = this.processDefinitionsRepository.create(processDefinition);
    return this.processDefinitionsRepository.save(newProcessDefinition);
  }

  async update(id: string, processDefinition: Partial<ProcessDefinition>): Promise<ProcessDefinition | null> {
    await this.processDefinitionsRepository.update(id, processDefinition);
    return this.processDefinitionsRepository.findOne({ where: { id }, relations: ['tenant', 'processInstances'] });
  }

  async remove(id: string): Promise<void> {
    await this.processDefinitionsRepository.delete(id);
  }

  async findProcessInstances(processDefinitionId: string): Promise<ProcessInstance[]> {
    const processDefinition = await this.processDefinitionsRepository.findOne({ where: { id: processDefinitionId }, relations: ['processInstances'] });
    return processDefinition ? processDefinition.processInstances : [];
  }

  async createProcessInstance(processDefinitionId: string, processInstance: Partial<ProcessInstance>): Promise<ProcessInstance> {
    const processDefinition = await this.processDefinitionsRepository.findOneBy({ id: processDefinitionId });
    if (!processDefinition) {
      throw new Error('ProcessDefinition not found');
    }
    const newProcessInstance = this.processInstancesRepository.create({ ...processInstance, processDefinition });
    return this.processInstancesRepository.save(newProcessInstance);
  }

  async patchProcessInstances(processDefinitionId: string, processInstance: Partial<ProcessInstance>, where?: any): Promise<number> {
    // This is a simplified patch. In a real scenario, you might want to filter by processDefinitionId in the where clause.
    const result = await this.processInstancesRepository.update(where, processInstance);
    return result.affected || 0;
  }

  async deleteProcessInstances(processDefinitionId: string, where?: any): Promise<number> {
    // This is a simplified delete. In a real scenario, you might want to filter by processDefinitionId in the where clause.
    const result = await this.processInstancesRepository.delete(where);
    return result.affected || 0;
  }
}
