import {belongsTo, Entity, model, property} from '@loopback/repository';
import { Tenant } from './tenant.model';
import { BaseEntity } from './base-entity.model';

@model()
export class Actor extends BaseEntity {

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
  })
  actorGroupId?: string;

  @belongsTo(() => Tenant)
  tenantId: string;
  

  constructor(data?: Partial<Actor>) {
    super(data);
  }
}

export interface ActorRelations {
  // describe navigational properties here
}

export type ActorWithRelations = Actor & ActorRelations;
