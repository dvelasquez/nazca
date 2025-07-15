import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actor } from './entities/actor.entity';

@Injectable()
export class ActorsService {
  constructor(
    @InjectRepository(Actor)
    private actorsRepository: Repository<Actor>,
  ) {}

  findAll(): Promise<Actor[]> {
    return this.actorsRepository.find({ relations: ['tenant', 'actorGroup'] });
  }

  findOne(id: string): Promise<Actor | null> {
    return this.actorsRepository.findOne({ where: { id }, relations: ['tenant', 'actorGroup'] });
  }

  create(actor: Partial<Actor>): Promise<Actor> {
    const newActor = this.actorsRepository.create(actor);
    return this.actorsRepository.save(newActor);
  }

  async update(id: string, actor: Partial<Actor>): Promise<Actor | null> {
    await this.actorsRepository.update(id, actor);
    return this.actorsRepository.findOne({ where: { id }, relations: ['tenant', 'actorGroup'] });
  }

  async remove(id: string): Promise<void> {
    await this.actorsRepository.delete(id);
  }
}
