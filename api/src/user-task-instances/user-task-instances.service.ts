import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTaskInstance, Actor } from '../entities';

@Injectable()
export class UserTaskInstancesService {
  constructor(
    @InjectRepository(UserTaskInstance)
    private userTaskInstancesRepository: Repository<UserTaskInstance>,
  ) {}

  findAll(): Promise<UserTaskInstance[]> {
    return this.userTaskInstancesRepository.find({ relations: ['tenant', 'processInstance', 'assignee'] });
  }

  findOne(id: string): Promise<UserTaskInstance | null> {
    return this.userTaskInstancesRepository.findOne({ where: { id }, relations: ['tenant', 'processInstance', 'assignee'] });
  }

  create(userTaskInstance: Partial<UserTaskInstance>): Promise<UserTaskInstance> {
    const newUserTaskInstance = this.userTaskInstancesRepository.create(userTaskInstance);
    return this.userTaskInstancesRepository.save(newUserTaskInstance);
  }

  async update(id: string, userTaskInstance: Partial<UserTaskInstance>): Promise<UserTaskInstance | null> {
    await this.userTaskInstancesRepository.update(id, userTaskInstance);
    return this.userTaskInstancesRepository.findOne({ where: { id }, relations: ['tenant', 'processInstance', 'assignee'] });
  }

  async remove(id: string): Promise<void> {
    await this.userTaskInstancesRepository.delete(id);
  }

  async findAssignee(userTaskInstanceId: string): Promise<Actor | null | undefined> {
    const userTaskInstance = await this.userTaskInstancesRepository.findOne({ where: { id: userTaskInstanceId }, relations: ['assignee'] });
    return userTaskInstance ? userTaskInstance.assignee : null;
  }
}
