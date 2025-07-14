import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ProcessDefinition } from './process-definition.entity';
import { Actor } from './actor.entity';
import { ActorGroup } from './actor-group.entity';
import { ProcessInstance } from './process-instance.entity';
import { UserTaskInstance } from './user-task-instance.entity';

@Entity()
export class Tenant extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => ProcessDefinition, (processDefinition) => processDefinition.tenant)
  processDefinitions: ProcessDefinition[];

  @OneToMany(() => Actor, (actor) => actor.tenant)
  actors: Actor[];

  @OneToMany(() => ActorGroup, (actorGroup) => actorGroup.tenant)
  actorGroups: ActorGroup[];

  @OneToMany(() => ProcessInstance, (processInstance) => processInstance.tenant)
  processInstances: ProcessInstance[];

  @OneToMany(() => UserTaskInstance, (userTaskInstance) => userTaskInstance.tenant)
  userTaskInstances: UserTaskInstance[];
}
