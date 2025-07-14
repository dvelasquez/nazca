import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { ActorGroup } from './actor-group.entity';

@Entity()
export class Actor extends BaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.actors)
  tenant: Tenant;

  @ManyToOne(() => ActorGroup, (actorGroup) => actorGroup.actors, { nullable: true })
  actorGroup?: ActorGroup;
}
