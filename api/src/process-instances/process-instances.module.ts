import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessInstance } from './entities/process-instance.entity';
import { UserTaskInstance } from '../user-task-instances/entities/user-task-instance.entity';
import { ProcessInstancesService } from './process-instances.service';
import { ProcessInstancesController } from './process-instances.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProcessInstance, UserTaskInstance])],
  providers: [ProcessInstancesService],
  controllers: [ProcessInstancesController],
})
export class ProcessInstancesModule {}
