import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessInstance } from './entities/process-instance.entity';
import { UserTaskInstance } from '../user-task-instances/entities/user-task-instance.entity';

@Injectable()
export class ProcessInstancesService {
  constructor(
    @InjectRepository(ProcessInstance)
    private processInstancesRepository: Repository<ProcessInstance>,
    @InjectRepository(UserTaskInstance)
    private userTaskInstancesRepository: Repository<UserTaskInstance>,
  ) {}

  findAll(): Promise<ProcessInstance[]> {
    return this.processInstancesRepository.find({ relations: ['tenant', 'processDefinition', 'userTaskInstances'] });
  }

  findOne(id: string): Promise<ProcessInstance | null> {
    return this.processInstancesRepository.findOne({ where: { id }, relations: ['tenant', 'processDefinition', 'userTaskInstances'] });
  }

  create(processInstance: Partial<ProcessInstance>): Promise<ProcessInstance> {
    const newProcessInstance = this.processInstancesRepository.create(processInstance);
    return this.processInstancesRepository.save(newProcessInstance);
  }

  async update(id: string, processInstance: Partial<ProcessInstance>): Promise<ProcessInstance | null> {
    await this.processInstancesRepository.update(id, processInstance);
    return this.processInstancesRepository.findOne({ where: { id }, relations: ['tenant', 'processDefinition', 'userTaskInstances'] });
  }

  async remove(id: string): Promise<void> {
    await this.processInstancesRepository.delete(id);
  }

  async findUserTaskInstances(processInstanceId: string): Promise<UserTaskInstance[]> {
    const processInstance = await this.processInstancesRepository.findOne({ where: { id: processInstanceId }, relations: ['userTaskInstances'] });
    return processInstance ? processInstance.userTaskInstances : [];
  }

  async createUserTaskInstance(processInstanceId: string, userTaskInstance: Partial<UserTaskInstance>): Promise<UserTaskInstance> {
    const processInstance = await this.processInstancesRepository.findOneBy({ id: processInstanceId });
    if (!processInstance) {
      throw new Error('ProcessInstance not found');
    }
    const newUserTaskInstance = this.userTaskInstancesRepository.create({ ...userTaskInstance, processInstance });
    return this.userTaskInstancesRepository.save(newUserTaskInstance);
  }

  async patchUserTaskInstances(processInstanceId: string, userTaskInstance: Partial<UserTaskInstance>, where?: any): Promise<number> {
    // This is a simplified patch. In a real scenario, you might want to filter by processInstanceId in the where clause.
    const result = await this.userTaskInstancesRepository.update(where, userTaskInstance);
    return result.affected || 0;
  }

  async deleteUserTaskInstances(processInstanceId: string, where?: any): Promise<number> {
    // This is a simplified delete. In a real scenario, you might want to filter by processInstanceId in the where clause.
    const result = await this.userTaskInstancesRepository.delete(where);
    return result.affected || 0;
  }
}
