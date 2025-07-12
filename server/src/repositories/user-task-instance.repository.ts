import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DevelopmentdbDataSource} from '../datasources';
import {UserTaskInstance, UserTaskInstanceRelations} from '../models';

export class UserTaskInstanceRepository extends DefaultCrudRepository<
  UserTaskInstance,
  typeof UserTaskInstance.prototype.id,
  UserTaskInstanceRelations
> {
  constructor(
    @inject('datasources.developmentdb') dataSource: DevelopmentdbDataSource,
  ) {
    super(UserTaskInstance, dataSource);
  }
}
