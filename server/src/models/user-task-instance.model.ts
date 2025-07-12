import {Entity, model, property} from '@loopback/repository';

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

  @property({
    type: 'string',
    required: true,
  })
  tenantId: string;


  constructor(data?: Partial<UserTaskInstance>) {
    super(data);
  }
}

export interface UserTaskInstanceRelations {
  // describe navigational properties here
}

export type UserTaskInstanceWithRelations = UserTaskInstance & UserTaskInstanceRelations;
