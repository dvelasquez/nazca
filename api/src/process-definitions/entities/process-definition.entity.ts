import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { ProcessInstance } from '../../process-instances/entities/process-instance.entity';

@Entity()
export class ProcessDefinition extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  bpmnXml?: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.processDefinitions)
  tenant: Tenant;

  @OneToMany(() => ProcessInstance, (processInstance) => processInstance.processDefinition)
  processInstances: ProcessInstance[];
}
