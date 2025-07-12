import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {ProcessDefinition} from '../models';
import {TenantRepository} from '../repositories';

// No direct controller decorator needed here, we define the full path in the method.

export class TenantProcessDefinitionController {
  constructor(
    @repository(TenantRepository)
    protected tenantRepository: TenantRepository,
  ) {}

  /**
   * This method creates the nested endpoint to find all process definitions
   * belonging to a specific tenant.
   */
  @get('/tenants/{id}/process-definitions', {
    responses: {
      '200': {
        description: 'Array of ProcessDefinition instances belonging to Tenant',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ProcessDefinition)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string, // This captures the tenant's ID from the URL
  ): Promise<ProcessDefinition[]> {
    // We use the tenantRepository's built-in relation finder to get
    // all processDefinitions associated with the given tenant ID.
    return this.tenantRepository.processDefinitions(id).find();
  }
}
