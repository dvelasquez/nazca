import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessInstance, UserTaskInstance } from '../entities';
import { ProcessInstancesService } from './process-instances.service';
import { ProcessInstancesController } from './process-instances.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProcessInstance, UserTaskInstance])],
  providers: [ProcessInstancesService],
  controllers: [ProcessInstancesController],
})
export class ProcessInstancesModule {}
