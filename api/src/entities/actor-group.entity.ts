import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Actor } from './actor.entity';

@Entity()
export class ActorGroup extends BaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.actorGroups)
  tenant: Tenant;

  @OneToMany(() => Actor, (actor) => actor.actorGroup)
  actors: Actor[];
}
