import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DevelopmentdbDataSource} from '../datasources';
import {ActorGroup, ActorGroupRelations} from '../models';

export class ActorGroupRepository extends DefaultCrudRepository<
  ActorGroup,
  typeof ActorGroup.prototype.id,
  ActorGroupRelations
> {
  constructor(
    @inject('datasources.developmentdb') dataSource: DevelopmentdbDataSource,
  ) {
    super(ActorGroup, dataSource);
  }
}
