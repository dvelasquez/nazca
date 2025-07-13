import {belongsTo, model, property, hasMany} from '@loopback/repository';
import { Tenant } from './tenant.model';
import {ProcessInstance} from './process-instance.model';
import { BaseEntity } from './base-entity.model';

@model()
export class ProcessDefinition extends BaseEntity {

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  bpmnXml: string;

  @belongsTo(() => Tenant)
  tenantId: string;

  @hasMany(() => ProcessInstance)
  processInstances: ProcessInstance[];

  constructor(data?: Partial<ProcessDefinition>) {
    super(data);
  }
}

export interface ProcessDefinitionRelations {
  // describe navigational properties here
}

export type ProcessDefinitionWithRelations = ProcessDefinition & ProcessDefinitionRelations;
