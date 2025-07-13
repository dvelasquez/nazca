import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  ActorGroup,
  Actor,
} from '../models';
import {ActorGroupRepository} from '../repositories';

export class ActorGroupActorController {
  constructor(
    @repository(ActorGroupRepository) protected actorGroupRepository: ActorGroupRepository,
  ) { }

  @get('/actor-groups/{id}/actors', {
    responses: {
      '200': {
        description: 'Array of ActorGroup has many Actor',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Actor)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Actor>,
  ): Promise<Actor[]> {
    return this.actorGroupRepository.actors(id).find(filter);
  }

  @post('/actor-groups/{id}/actors', {
    responses: {
      '200': {
        description: 'ActorGroup model instance',
        content: {'application/json': {schema: getModelSchemaRef(Actor)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof ActorGroup.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Actor, {
            title: 'NewActorInActorGroup',
            exclude: ['id'],
            optional: ['actorGroupId']
          }),
        },
      },
    }) actor: Omit<Actor, 'id'>,
  ): Promise<Actor> {
    return this.actorGroupRepository.actors(id).create(actor);
  }

  @patch('/actor-groups/{id}/actors', {
    responses: {
      '200': {
        description: 'ActorGroup.Actor PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Actor, {partial: true}),
        },
      },
    })
    actor: Partial<Actor>,
    @param.query.object('where', getWhereSchemaFor(Actor)) where?: Where<Actor>,
  ): Promise<Count> {
    return this.actorGroupRepository.actors(id).patch(actor, where);
  }

  @del('/actor-groups/{id}/actors', {
    responses: {
      '200': {
        description: 'ActorGroup.Actor DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Actor)) where?: Where<Actor>,
  ): Promise<Count> {
    return this.actorGroupRepository.actors(id).delete(where);
  }
}
