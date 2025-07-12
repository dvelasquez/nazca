import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DevelopmentdbDataSource} from '../datasources';
import {ProcessInstance, ProcessInstanceRelations} from '../models';

export class ProcessInstanceRepository extends DefaultCrudRepository<
  ProcessInstance,
  typeof ProcessInstance.prototype.id,
  ProcessInstanceRelations
> {
  constructor(
    @inject('datasources.developmentdb') dataSource: DevelopmentdbDataSource,
  ) {
    super(ProcessInstance, dataSource);
  }
}
