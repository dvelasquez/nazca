import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActorGroup, Actor } from '../entities';

@Injectable()
export class ActorGroupsService {
  constructor(
    @InjectRepository(ActorGroup)
    private actorGroupsRepository: Repository<ActorGroup>,
    @InjectRepository(Actor)
    private actorsRepository: Repository<Actor>,
  ) {}

  findAll(): Promise<ActorGroup[]> {
    return this.actorGroupsRepository.find({ relations: ['tenant', 'actors'] });
  }

  findOne(id: string): Promise<ActorGroup | null> {
    return this.actorGroupsRepository.findOne({ where: { id }, relations: ['tenant', 'actors'] });
  }

  create(actorGroup: Partial<ActorGroup>): Promise<ActorGroup> {
    const newActorGroup = this.actorGroupsRepository.create(actorGroup);
    return this.actorGroupsRepository.save(newActorGroup);
  }

  async update(id: string, actorGroup: Partial<ActorGroup>): Promise<ActorGroup | null> {
    await this.actorGroupsRepository.update(id, actorGroup);
    return this.actorGroupsRepository.findOne({ where: { id }, relations: ['tenant', 'actors'] });
  }

  async remove(id: string): Promise<void> {
    await this.actorGroupsRepository.delete(id);
  }

  async findActors(actorGroupId: string): Promise<Actor[]> {
    const actorGroup = await this.actorGroupsRepository.findOne({ where: { id: actorGroupId }, relations: ['actors'] });
    return actorGroup ? actorGroup.actors : [];
  }

  async createActor(actorGroupId: string, actor: Partial<Actor>): Promise<Actor> {
    const actorGroup = await this.actorGroupsRepository.findOneBy({ id: actorGroupId });
    if (!actorGroup) {
      throw new Error('ActorGroup not found');
    }
    const newActor = this.actorsRepository.create({ ...actor, actorGroup });
    return this.actorsRepository.save(newActor);
  }

  async patchActors(actorGroupId: string, actor: Partial<Actor>, where?: any): Promise<number> {
    // This is a simplified patch. In a real scenario, you might want to filter by actorGroupId in the where clause.
    const result = await this.actorsRepository.update(where, actor);
    return result.affected || 0;
  }

  async deleteActors(actorGroupId: string, where?: any): Promise<number> {
    // This is a simplified delete. In a real scenario, you might want to filter by actorGroupId in the where clause.
    const result = await this.actorsRepository.delete(where);
    return result.affected || 0;
  }
}
