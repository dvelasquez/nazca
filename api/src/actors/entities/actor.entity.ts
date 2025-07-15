import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { ActorGroup } from '../../actor-groups/entities/actor-group.entity';

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
