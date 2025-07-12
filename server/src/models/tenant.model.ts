import {Entity, model, property, hasMany} from '@loopback/repository';
import {ProcessDefinition} from './process-definition.model';
import {Actor} from './actor.model';
import { ActorGroup } from './actor-group.model';
import { UserTaskInstance } from './user-task-instance.model';
import { ProcessInstance } from './process-instance.model';

export type TenantRelations = {
  processDefinitions?: ProcessDefinition[];
  actors?: Actor[];
  actorGroups?: ActorGroup[];
  processInstances?: ProcessInstance[];
  userTaskInstances?: UserTaskInstance[];
};

@model()
export class Tenant extends Entity {
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
