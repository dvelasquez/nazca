import {Entity, model, property} from '@loopback/repository';

@model()
export class ActorGroup extends Entity {
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
  tenantId: string;


  constructor(data?: Partial<ActorGroup>) {
    super(data);
  }
}

export interface ActorGroupRelations {
  // describe navigational properties here
}

export type ActorGroupWithRelations = ActorGroup & ActorGroupRelations;
