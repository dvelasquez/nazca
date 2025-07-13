import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DevelopmentdbDataSource} from '../datasources';
import {UserTaskInstance, UserTaskInstanceRelations, Actor} from '../models';
import {ActorRepository} from './actor.repository';

export class UserTaskInstanceRepository extends DefaultCrudRepository<
  UserTaskInstance,
  typeof UserTaskInstance.prototype.id,
  UserTaskInstanceRelations
> {

  public readonly assignee: BelongsToAccessor<Actor, typeof UserTaskInstance.prototype.id>;

  constructor(
    @inject('datasources.developmentdb') dataSource: DevelopmentdbDataSource, @repository.getter('ActorRepository') protected actorRepositoryGetter: Getter<ActorRepository>,
  ) {
    super(UserTaskInstance, dataSource);
    this.assignee = this.createBelongsToAccessorFor('assignee', actorRepositoryGetter,);
    this.registerInclusionResolver('assignee', this.assignee.inclusionResolver);
  }
}
