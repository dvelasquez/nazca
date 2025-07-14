import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActorGroup, Actor } from '../entities';
import { ActorGroupsService } from './actor-groups.service';
import { ActorGroupsController } from './actor-groups.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ActorGroup, Actor])],
  providers: [ActorGroupsService],
  controllers: [ActorGroupsController],
})
export class ActorGroupsModule {}
