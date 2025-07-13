import {belongsTo, Entity, model, property, hasMany} from '@loopback/repository';
import { Tenant } from './tenant.model';
import {Actor} from './actor.model';

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

  @hasMany(() => Actor)
  actors: Actor[];

  constructor(data?: Partial<ActorGroup>) {
    super(data);
  }
}

export interface ActorGroupRelations {
  // describe navigational properties here
}

export type ActorGroupWithRelations = ActorGroup & ActorGroupRelations;
