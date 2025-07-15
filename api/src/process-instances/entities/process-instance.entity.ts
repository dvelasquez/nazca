import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { ProcessDefinition } from '../../process-definitions/entities/process-definition.entity';
import { UserTaskInstance } from '../../user-task-instances/entities/user-task-instance.entity';

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
