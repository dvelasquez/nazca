import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessDefinition } from '../process-definitions/entities/process-definition.entity';
import { ProcessInstance } from '../process-instances/entities/process-instance.entity';
import { UserTaskInstance } from '../user-task-instances/entities/user-task-instance.entity';
import { BpmnService } from './bpmn.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProcessDefinition, ProcessInstance, UserTaskInstance])],
  providers: [BpmnService],
  exports: [BpmnService],
})
export class BpmnModule {}
