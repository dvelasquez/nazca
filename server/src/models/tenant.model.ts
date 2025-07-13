import {model, property, hasMany} from '@loopback/repository';
import {ProcessDefinition} from './process-definition.model';
import {Actor} from './actor.model';
import { ActorGroup } from './actor-group.model';
import { UserTaskInstance } from './user-task-instance.model';
import { ProcessInstance } from './process-instance.model';
import { BaseEntity } from './base-entity.model';

export type TenantRelations = {
  processDefinitions?: ProcessDefinition[];
  actors?: Actor[];
  actorGroups?: ActorGroup[];
  processInstances?: ProcessInstance[];
  userTaskInstances?: UserTaskInstance[];
};

@model()
export class Tenant extends BaseEntity {

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @hasMany(() => ProcessDefinition)
  processDefinitions: ProcessDefinition[];

  @hasMany(() => Actor)
  actors: Actor[];

  @hasMany(() => ActorGroup)
  actorGroups: ActorGroup[];

  @hasMany(() => ProcessInstance)
  processInstances: ProcessInstance[];

  @hasMany(() => UserTaskInstance)
  userTaskInstances: UserTaskInstance[];

  constructor(data?: Partial<Tenant>) {
    super(data);
  }
}
