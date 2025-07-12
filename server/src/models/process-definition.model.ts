import {belongsTo, Entity, model, property} from '@loopback/repository';
import { Tenant } from './tenant.model';

@model()
export class ProcessDefinition extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

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

  constructor(data?: Partial<ProcessDefinition>) {
    super(data);
  }
}

export interface ProcessDefinitionRelations {
  // describe navigational properties here
}

export type ProcessDefinitionWithRelations = ProcessDefinition & ProcessDefinitionRelations;
