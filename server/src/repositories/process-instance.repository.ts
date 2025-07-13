import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DevelopmentdbDataSource} from '../datasources';
import {ProcessInstance, ProcessInstanceRelations, UserTaskInstance} from '../models';
import {UserTaskInstanceRepository} from './user-task-instance.repository';

export class ProcessInstanceRepository extends DefaultCrudRepository<
  ProcessInstance,
  typeof ProcessInstance.prototype.id,
  ProcessInstanceRelations
> {

  public readonly userTaskInstances: HasManyRepositoryFactory<UserTaskInstance, typeof ProcessInstance.prototype.id>;

  constructor(
    @inject('datasources.developmentdb') dataSource: DevelopmentdbDataSource, @repository.getter('UserTaskInstanceRepository') protected userTaskInstanceRepositoryGetter: Getter<UserTaskInstanceRepository>,
  ) {
    super(ProcessInstance, dataSource);
    this.userTaskInstances = this.createHasManyRepositoryFactoryFor('userTaskInstances', userTaskInstanceRepositoryGetter,);
    this.registerInclusionResolver('userTaskInstances', this.userTaskInstances.inclusionResolver);
  }
}
