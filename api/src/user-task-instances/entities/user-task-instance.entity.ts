import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { ProcessInstance } from '../../process-instances/entities/process-instance.entity';
import { Actor } from '../../actors/entities/actor.entity';

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
