import {belongsTo, Entity, model, property} from '@loopback/repository';
import { Tenant } from './tenant.model';
import {Actor} from './actor.model';

@model()
export class UserTaskInstance extends Entity {
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
  instanceId: string;

  @property({
    type: 'string',
    required: true,
  })
  taskId: string;

  @property({
    type: 'string',
  })
  assigneeId?: string;

  @property({
    type: 'string',
    required: true,
  })
  status: string;

  @belongsTo(() => Tenant)
  tenantId: string;

  @property({
    type: 'string',
  })
  processInstanceId?: string;

  @belongsTo(() => Actor, {name: 'assignee'})
  actorId: string;

  constructor(data?: Partial<UserTaskInstance>) {
    super(data);
  }
}

export interface UserTaskInstanceRelations {
  // describe navigational properties here
}

export type UserTaskInstanceWithRelations = UserTaskInstance & UserTaskInstanceRelations;
