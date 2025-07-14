import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for creating a Tenant
 */
export class CreateTenantDto {
  @ApiProperty()
  @IsString()
  name: string;
}

/**
 * DTO for updating a Tenant
 */
export class UpdateTenantDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;
}

/**
 * DTO for responding with a Tenant
 */
export class ResponseTenantDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
} 