import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {ActorGroup} from '../models';
import {TenantRepository} from '../repositories';

export class TenantActorGroupController {
  constructor(
    @repository(TenantRepository)
    protected tenantRepository: TenantRepository,
  ) {}

  /**
   * This method creates the nested endpoint to find all actor groups
   * belonging to a specific tenant.
   */
  @get('/tenants/{id}/actor-groups', {
    responses: {
      '200': {
        description: 'Array of ActorGroup instances belonging to Tenant',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ActorGroup)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string, // This captures the tenant's ID from the URL
  ): Promise<ActorGroup[]> {
    // We use the tenantRepository's built-in relation finder for 'actorGroups'
    return this.tenantRepository.actorGroups(id).find();
  }
}
