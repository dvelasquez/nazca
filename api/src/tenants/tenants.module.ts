import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from '../entities';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  providers: [TenantsService],
  controllers: [TenantsController],
})
export class TenantsModule {}
