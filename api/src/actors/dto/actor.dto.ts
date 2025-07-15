import { IsString, IsOptional, IsUUID, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for creating an Actor
 */
export class CreateActorDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsUUID()
  tenantId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  actorGroupId?: string;
}

/**
 * DTO for updating an Actor
 */
export class UpdateActorDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  tenantId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  actorGroupId?: string;
}

/**
 * DTO for responding with an Actor
 */
export class ResponseActorDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  tenantId: string;

  @ApiProperty({ required: false })
  actorGroupId?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
} 