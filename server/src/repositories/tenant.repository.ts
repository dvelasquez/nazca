import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {DevelopmentdbDataSource} from '../datasources';
import {Tenant, TenantRelations, ProcessDefinition, Actor, ActorGroup} from '../models'; // Import models
import {ProcessDefinitionRepository} from './process-definition.repository'; // Import repos
import {ActorRepository} from './actor.repository';
import { ActorGroupRepository } from './actor-group.repository';

export class TenantRepository extends DefaultCrudRepository<
  Tenant,
  typeof Tenant.prototype.id,
  TenantRelations
> {
  public readonly processDefinitions: HasManyRepositoryFactory<
    ProcessDefinition,
    typeof Tenant.prototype.id
  >;

  public readonly actors: HasManyRepositoryFactory<
    Actor,
    typeof Tenant.prototype.id
  >;

  public readonly actorGroups: HasManyRepositoryFactory<
    ActorGroup,
    typeof Tenant.prototype.id
  >;

  constructor(
    @inject('datasources.developmentdb') dataSource: DevelopmentdbDataSource,
    @repository.getter('ProcessDefinitionRepository')
    protected processDefinitionRepositoryGetter: Getter<ProcessDefinitionRepository>,
    @repository.getter('ActorRepository')
    protected actorRepositoryGetter: Getter<ActorRepository>,
    @repository.getter('ActorGroupRepository')
    protected actorGroupRepositoryGetter: Getter<ActorGroupRepository>,
  ) {
    super(Tenant, dataSource);

    // Link the ProcessDefinition relationship
    this.processDefinitions = this.createHasManyRepositoryFactoryFor(
      'processDefinitions',
      processDefinitionRepositoryGetter,
    );
    this.registerInclusionResolver(
      'processDefinitions',
      this.processDefinitions.inclusionResolver,
    );


    // Link the Actor relationship
    this.actors = this.createHasManyRepositoryFactoryFor(
      'actors',
      actorRepositoryGetter,
    );
    this.registerInclusionResolver('actors', this.actors.inclusionResolver);

    // Link the ActorGroup relationship
    this.actorGroups = this.createHasManyRepositoryFactoryFor(
      'actorGroups',
      actorGroupRepositoryGetter,
    );
    this.registerInclusionResolver('actorGroups', this.actorGroups.inclusionResolver);
  }
}
