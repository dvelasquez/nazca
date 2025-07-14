import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// We will create and import these entities in the next step.
// import { Tenant } from './tenants/tenant.entity';
// import { ProcessDefinition } from './process-definitions/process-definition.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // or your database type
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'mysecretpassword',
      database: 'postgres',
      // Tell TypeORM where to find your entity files
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // For development only. Creates schema automatically.
    }),
    // We will add feature modules here later.
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}