import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
  })
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '234567',
  })
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '234567',
  })
  confirmPassword: string;
}
