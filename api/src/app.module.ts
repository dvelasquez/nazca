import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantsModule } from './tenants/tenants.module';
import { ActorGroupsModule } from './actor-groups/actor-groups.module';
import { ActorsModule } from './actors/actors.module';
import { ProcessDefinitionsModule } from './process-definitions/process-definitions.module';
import { ProcessInstancesModule } from './process-instances/process-instances.module';
import { UserTaskInstancesModule } from './user-task-instances/user-task-instances.module';
import { BpmnModule } from './bpmn/bpmn.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // or your database type
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: process.env.DB_PASSWORD,
      database: 'postgres',
      // Tell TypeORM where to find your entity files
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // For development only. Creates schema automatically.
    }),
    TenantsModule,
    ActorGroupsModule,
    ActorsModule,
    ProcessDefinitionsModule,
    ProcessInstancesModule,
    UserTaskInstancesModule,
    BpmnModule,
    UsersModule,
    // We will add feature modules here later.
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}