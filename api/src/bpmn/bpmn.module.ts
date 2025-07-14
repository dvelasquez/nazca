import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessDefinition, ProcessInstance, UserTaskInstance } from '../entities';
import { BpmnService } from './bpmn.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProcessDefinition, ProcessInstance, UserTaskInstance])],
  providers: [BpmnService],
  exports: [BpmnService],
})
export class BpmnModule {}
