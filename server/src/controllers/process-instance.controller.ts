import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {post, param, requestBody, getModelSchemaRef} from '@loopback/rest';
import {ProcessDefinitionRepository} from '../repositories';
import {BpmnService} from '../services';
import {ProcessInstance} from '../models';

export class ProcessInstanceController {
  constructor(
    // Inject the BpmnService to access the engine logic
    @inject('services.BpmnService')
    protected bpmnService: BpmnService,
    // Inject the repository to find the definition to start
    @repository(ProcessDefinitionRepository)
    protected processDefinitionRepository: ProcessDefinitionRepository,
  ) {}

  /**
   * This endpoint starts a new instance of a specific process definition.
   * @param id The ID of the ProcessDefinition to start.
   * @param variables Initial variables to pass to the process instance.
   */
  @post('/process-definitions/{id}/start', {
    responses: {
      '200': {
        description: 'The newly created ProcessInstance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(ProcessInstance),
          },
        },
      },
    },
  })
  async start(
    @param.path.string('id') definitionId: string,
    @requestBody({
      description: 'Initial variables for the process instance',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              variables: {type: 'object'},
            },
          },
        },
      },
    })
    body: {variables: object},
  ): Promise<{instanceId: string}> {
    // 1. Find the definition by its ID to get the BPMN XML and other details.
    const definition = await this.processDefinitionRepository.findById(
      definitionId,
    );

    // 2. Call the service method to start the process.
    const instanceId = await this.bpmnService.startProcess(
      definition,
      body.variables,
    );

    // 3. Return the ID of the new process instance.
    return {instanceId};
  }
}
