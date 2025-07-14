import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessDefinition, ProcessInstance } from '../entities';
import { ProcessDefinitionsService } from './process-definitions.service';
import { ProcessDefinitionsController } from './process-definitions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProcessDefinition, ProcessInstance])],
  providers: [ProcessDefinitionsService],
  controllers: [ProcessDefinitionsController],
})
export class ProcessDefinitionsModule {}
