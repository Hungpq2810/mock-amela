import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'vanlvqw924.99024',
  })
  token: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
  })
  password: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
  })
  confirmPassword: string;
}
