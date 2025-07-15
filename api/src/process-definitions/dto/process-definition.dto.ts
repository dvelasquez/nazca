import { IsString, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for creating a ProcessDefinition
 */
export class CreateProcessDefinitionDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  bpmnXml?: string;

  @ApiProperty()
  @IsUUID()
  tenantId: string;
}

/**
 * DTO for updating a ProcessDefinition
 */
export class UpdateProcessDefinitionDto {
  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bpmnXml?: string;

  @ApiProperty({ required: true })
  @IsUUID()
  tenantId: string;
}

/**
 * DTO for responding with a ProcessDefinition
 */
export class ResponseProcessDefinitionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  bpmnXml: string;

  @ApiProperty()
  tenantId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
} 