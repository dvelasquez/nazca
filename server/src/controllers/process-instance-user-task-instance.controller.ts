import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  ProcessInstance,
  UserTaskInstance,
} from '../models';
import {ProcessInstanceRepository} from '../repositories';

export class ProcessInstanceUserTaskInstanceController {
  constructor(
    @repository(ProcessInstanceRepository) protected processInstanceRepository: ProcessInstanceRepository,
  ) { }

  @get('/process-instances/{id}/user-task-instances', {
    responses: {
      '200': {
        description: 'Array of ProcessInstance has many UserTaskInstance',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(UserTaskInstance)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<UserTaskInstance>,
  ): Promise<UserTaskInstance[]> {
    return this.processInstanceRepository.userTaskInstances(id).find(filter);
  }

  @post('/process-instances/{id}/user-task-instances', {
    responses: {
      '200': {
        description: 'ProcessInstance model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserTaskInstance)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof ProcessInstance.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTaskInstance, {
            title: 'NewUserTaskInstanceInProcessInstance',
            exclude: ['id'],
            optional: ['processInstanceId']
          }),
        },
      },
    }) userTaskInstance: Omit<UserTaskInstance, 'id'>,
  ): Promise<UserTaskInstance> {
    return this.processInstanceRepository.userTaskInstances(id).create(userTaskInstance);
  }

  @patch('/process-instances/{id}/user-task-instances', {
    responses: {
      '200': {
        description: 'ProcessInstance.UserTaskInstance PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTaskInstance, {partial: true}),
        },
      },
    })
    userTaskInstance: Partial<UserTaskInstance>,
    @param.query.object('where', getWhereSchemaFor(UserTaskInstance)) where?: Where<UserTaskInstance>,
  ): Promise<Count> {
    return this.processInstanceRepository.userTaskInstances(id).patch(userTaskInstance, where);
  }

  @del('/process-instances/{id}/user-task-instances', {
    responses: {
      '200': {
        description: 'ProcessInstance.UserTaskInstance DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserTaskInstance)) where?: Where<UserTaskInstance>,
  ): Promise<Count> {
    return this.processInstanceRepository.userTaskInstances(id).delete(where);
  }
}
