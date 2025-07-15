import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActorGroup } from './entities/actor-group.entity';
import { Actor } from '../actors/entities/actor.entity';
import { ActorGroupsService } from './actor-groups.service';
import { ActorGroupsController } from './actor-groups.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ActorGroup, Actor])],
  providers: [ActorGroupsService],
  controllers: [ActorGroupsController],
})
export class ActorGroupsModule {}
