import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DevelopmentdbDataSource} from '../datasources';
import {ProcessDefinition, ProcessDefinitionRelations} from '../models';

export class ProcessDefinitionRepository extends DefaultCrudRepository<
  ProcessDefinition,
  typeof ProcessDefinition.prototype.id,
  ProcessDefinitionRelations
> {
  constructor(
    @inject('datasources.developmentdb') dataSource: DevelopmentdbDataSource,
  ) {
    super(ProcessDefinition, dataSource);
  }
}
