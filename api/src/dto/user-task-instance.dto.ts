import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for creating a UserTaskInstance
 */
export class CreateUserTaskInstanceDto {
  @ApiProperty()
  @IsString()
  taskId: string;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsUUID()
  tenantId: string;

  @ApiProperty()
  @IsUUID()
  processInstanceId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  assigneeId?: string;
}

/**
 * DTO for updating a UserTaskInstance
 */
export class UpdateUserTaskInstanceDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  taskId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  tenantId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  processInstanceId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  assigneeId?: string;
}

/**
 * DTO for responding with a UserTaskInstance
 */
export class ResponseUserTaskInstanceDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  taskId: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  tenantId: string;

  @ApiProperty()
  processInstanceId: string;

  @ApiProperty({ required: false })
  assigneeId?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
} 