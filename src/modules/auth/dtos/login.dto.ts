import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'hungphiquoc@gmail.com',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
  })
  password: string;
}
