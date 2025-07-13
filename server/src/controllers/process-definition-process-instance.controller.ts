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
  ProcessDefinition,
  ProcessInstance,
} from '../models';
import {ProcessDefinitionRepository} from '../repositories';

export class ProcessDefinitionProcessInstanceController {
  constructor(
    @repository(ProcessDefinitionRepository) protected processDefinitionRepository: ProcessDefinitionRepository,
  ) { }

  @get('/process-definitions/{id}/process-instances', {
    responses: {
      '200': {
        description: 'Array of ProcessDefinition has many ProcessInstance',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ProcessInstance)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<ProcessInstance>,
  ): Promise<ProcessInstance[]> {
    return this.processDefinitionRepository.processInstances(id).find(filter);
  }

  @post('/process-definitions/{id}/process-instances', {
    responses: {
      '200': {
        description: 'ProcessDefinition model instance',
        content: {'application/json': {schema: getModelSchemaRef(ProcessInstance)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof ProcessDefinition.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcessInstance, {
            title: 'NewProcessInstanceInProcessDefinition',
            exclude: ['id'],
            optional: ['processDefinitionId']
          }),
        },
      },
    }) processInstance: Omit<ProcessInstance, 'id'>,
  ): Promise<ProcessInstance> {
    return this.processDefinitionRepository.processInstances(id).create(processInstance);
  }

  @patch('/process-definitions/{id}/process-instances', {
    responses: {
      '200': {
        description: 'ProcessDefinition.ProcessInstance PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcessInstance, {partial: true}),
        },
      },
    })
    processInstance: Partial<ProcessInstance>,
    @param.query.object('where', getWhereSchemaFor(ProcessInstance)) where?: Where<ProcessInstance>,
  ): Promise<Count> {
    return this.processDefinitionRepository.processInstances(id).patch(processInstance, where);
  }

  @del('/process-definitions/{id}/process-instances', {
    responses: {
      '200': {
        description: 'ProcessDefinition.ProcessInstance DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(ProcessInstance)) where?: Where<ProcessInstance>,
  ): Promise<Count> {
    return this.processDefinitionRepository.processInstances(id).delete(where);
  }
}
