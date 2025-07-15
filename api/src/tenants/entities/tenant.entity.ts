import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';
import { ProcessDefinition } from '../../process-definitions/entities/process-definition.entity';
import { Actor } from '../../actors/entities/actor.entity';
import { ActorGroup } from '../../actor-groups/entities/actor-group.entity';
import { ProcessInstance } from '../../process-instances/entities/process-instance.entity';
import { UserTaskInstance } from '../../user-task-instances/entities/user-task-instance.entity';

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
