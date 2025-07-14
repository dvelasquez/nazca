import { IsString, IsOptional, IsUUID, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for creating a ProcessInstance
 */
export class CreateProcessInstanceDto {
  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  variables?: object;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  state?: object;

  @ApiProperty()
  @IsUUID()
  tenantId: string;

  @ApiProperty()
  @IsUUID()
  processDefinitionId: string;
}

/**
 * DTO for updating a ProcessInstance
 */
export class UpdateProcessInstanceDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  variables?: object;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  state?: object;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  tenantId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  processDefinitionId?: string;
}

/**
 * DTO for responding with a ProcessInstance
 */
export class ResponseProcessInstanceDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ required: false })
  variables?: object;

  @ApiProperty({ required: false })
  state?: object;

  @ApiProperty()
  tenantId: string;

  @ApiProperty()
  processDefinitionId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
} 