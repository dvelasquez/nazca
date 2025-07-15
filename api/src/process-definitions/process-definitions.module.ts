import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessDefinitionsService } from './process-definitions.service';
import { ProcessDefinitionsController } from './process-definitions.controller';
import { ProcessDefinition } from './entities/process-definition.entity';
import { ProcessInstance } from '../process-instances/entities/process-instance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProcessDefinition, ProcessInstance])],
  providers: [ProcessDefinitionsService],
  controllers: [ProcessDefinitionsController],
})
export class ProcessDefinitionsModule {}
