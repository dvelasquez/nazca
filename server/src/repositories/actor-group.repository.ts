import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DevelopmentdbDataSource} from '../datasources';
import {ActorGroup, ActorGroupRelations, Actor} from '../models';
import {ActorRepository} from './actor.repository';

export class ActorGroupRepository extends DefaultCrudRepository<
  ActorGroup,
  typeof ActorGroup.prototype.id,
  ActorGroupRelations
> {

  public readonly actors: HasManyRepositoryFactory<Actor, typeof ActorGroup.prototype.id>;

  constructor(
    @inject('datasources.developmentdb') dataSource: DevelopmentdbDataSource, @repository.getter('ActorRepository') protected actorRepositoryGetter: Getter<ActorRepository>,
  ) {
    super(ActorGroup, dataSource);
    this.actors = this.createHasManyRepositoryFactoryFor('actors', actorRepositoryGetter,);
    this.registerInclusionResolver('actors', this.actors.inclusionResolver);
  }
}
