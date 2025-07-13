import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  UserTaskInstance,
  Actor,
} from '../models';
import {UserTaskInstanceRepository} from '../repositories';

export class UserTaskInstanceActorController {
  constructor(
    @repository(UserTaskInstanceRepository)
    public userTaskInstanceRepository: UserTaskInstanceRepository,
  ) { }

  @get('/user-task-instances/{id}/actor', {
    responses: {
      '200': {
        description: 'Actor belonging to UserTaskInstance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Actor),
          },
        },
      },
    },
  })
  async getActor(
    @param.path.string('id') id: typeof UserTaskInstance.prototype.id,
  ): Promise<Actor> {
    return this.userTaskInstanceRepository.assignee(id);
  }
}
