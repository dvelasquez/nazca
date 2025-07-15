import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {}

/**
 * DTO for responding with a User
 */
export class ResponseUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
