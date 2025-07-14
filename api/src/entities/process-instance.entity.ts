import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { ProcessDefinition } from './process-definition.entity';
import { UserTaskInstance } from './user-task-instance.entity';

@Entity()
export class ProcessInstance extends BaseEntity {
  @Column()
  status: string;

  @Column({ type: 'jsonb', nullable: true })
  variables?: object;

  @Column({ type: 'jsonb', nullable: true })
  state?: object;

  @ManyToOne(() => Tenant, (tenant) => tenant.processInstances)
  tenant: Tenant;

  @ManyToOne(() => ProcessDefinition, (processDefinition) => processDefinition.processInstances)
  processDefinition: ProcessDefinition;

  @OneToMany(() => UserTaskInstance, (userTaskInstance) => userTaskInstance.processInstance)
  userTaskInstances: UserTaskInstance[];
}
