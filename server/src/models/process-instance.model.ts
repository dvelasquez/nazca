import {belongsTo, Entity, model, property, hasMany} from '@loopback/repository';
import { Tenant } from './tenant.model';
import {UserTaskInstance} from './user-task-instance.model';

@model()
export class ProcessInstance extends Entity {
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
  definitionId: string;

  @property({
    type: 'string',
    required: true,
  })
  status: string;

  @property({
    type: 'object',
  })
  variables?: object;

  @property({
    type: 'object',
    required: false,
  })
  state?: object;

  @belongsTo(() => Tenant)
  tenantId: string;

  @property({
    type: 'string',
  })
  processDefinitionId?: string;

  @hasMany(() => UserTaskInstance)
  userTaskInstances: UserTaskInstance[];

  constructor(data?: Partial<ProcessInstance>) {
    super(data);
  }
}

export interface ProcessInstanceRelations {
  // describe navigational properties here
}

export type ProcessInstanceWithRelations = ProcessInstance & ProcessInstanceRelations;
