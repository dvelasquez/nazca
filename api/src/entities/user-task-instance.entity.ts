import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { ProcessInstance } from './process-instance.entity';
import { Actor } from './actor.entity';

@Entity()
export class UserTaskInstance extends BaseEntity {
  @Column()
  taskId: string;

  @Column()
  status: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.userTaskInstances)
  tenant: Tenant;

  @ManyToOne(() => ProcessInstance, (processInstance) => processInstance.userTaskInstances)
  processInstance: ProcessInstance;

  @ManyToOne(() => Actor, { nullable: true })
  assignee?: Actor;
}
