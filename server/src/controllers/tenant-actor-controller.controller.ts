import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Actor} from '../models';
import {TenantRepository} from '../repositories';

export class TenantActorController {
  constructor(
    @repository(TenantRepository)
    protected tenantRepository: TenantRepository,
  ) {}

  /**
   * This method creates the nested endpoint to find all actors
   * belonging to a specific tenant.
   */
  @get('/tenants/{id}/actors', {
    responses: {
      '200': {
        description: 'Array of Actor instances belonging to Tenant',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Actor)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string, // This captures the tenant's ID from the URL
  ): Promise<Actor[]> {
    // We use the tenantRepository's built-in relation finder for 'actors'
    return this.tenantRepository.actors(id).find();
  }
}
