import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { ProcessInstance } from './process-instance.entity';

@Entity()
export class ProcessDefinition extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text' })
  bpmnXml: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.processDefinitions)
  tenant: Tenant;

  @OneToMany(() => ProcessInstance, (processInstance) => processInstance.processDefinition)
  processInstances: ProcessInstance[];
}
