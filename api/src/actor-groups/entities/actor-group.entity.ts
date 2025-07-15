import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { Actor } from '../../actors/entities/actor.entity';

@Entity()
export class ActorGroup extends BaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.actorGroups)
  tenant: Tenant;

  @OneToMany(() => Actor, (actor) => actor.actorGroup)
  actors: Actor[];
}
