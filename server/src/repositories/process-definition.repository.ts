import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DevelopmentdbDataSource} from '../datasources';
import {ProcessDefinition, ProcessDefinitionRelations, ProcessInstance} from '../models';
import {ProcessInstanceRepository} from './process-instance.repository';

export class ProcessDefinitionRepository extends DefaultCrudRepository<
  ProcessDefinition,
  typeof ProcessDefinition.prototype.id,
  ProcessDefinitionRelations
> {

  public readonly processInstances: HasManyRepositoryFactory<ProcessInstance, typeof ProcessDefinition.prototype.id>;

  constructor(
    @inject('datasources.developmentdb') dataSource: DevelopmentdbDataSource, @repository.getter('ProcessInstanceRepository') protected processInstanceRepositoryGetter: Getter<ProcessInstanceRepository>,
  ) {
    super(ProcessDefinition, dataSource);
    this.processInstances = this.createHasManyRepositoryFactoryFor('processInstances', processInstanceRepositoryGetter,);
    this.registerInclusionResolver('processInstances', this.processInstances.inclusionResolver);
  }
}
