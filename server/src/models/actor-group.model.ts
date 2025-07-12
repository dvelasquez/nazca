import {belongsTo, Entity, model, property} from '@loopback/repository';
import { Tenant } from './tenant.model';

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

  @belongsTo(() => Tenant)
  tenantId: string;
  

  constructor(data?: Partial<ActorGroup>) {
    super(data);
  }
}

export interface ActorGroupRelations {
  // describe navigational properties here
}

export type ActorGroupWithRelations = ActorGroup & ActorGroupRelations;
