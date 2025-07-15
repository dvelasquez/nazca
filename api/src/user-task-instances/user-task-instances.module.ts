import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTaskInstancesService } from './user-task-instances.service';
import { UserTaskInstancesController } from './user-task-instances.controller';
import { UserTaskInstance } from './entities/user-task-instance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserTaskInstance])],
  providers: [UserTaskInstancesService],
  controllers: [UserTaskInstancesController],
})
export class UserTaskInstancesModule {}
