import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Hung Phi Quoc',
  })
  @IsString()
  @Length(6, 50)
  @IsNotEmpty()
  fullname: string;

  @ApiProperty({
    example: 'hungphiquoc@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '123456',
  })
  @IsString()
  @Length(6, 50)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: '123456',
  })
  @IsString()
  @Length(6, 50)
  @IsNotEmpty()
  passwordConfirm: string;

  @ApiProperty({
    example: '0987654321',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: '1',
  })
  @IsNumber()
  @IsNotEmpty()
  jobId: number;

  @ApiProperty({
    example: '1',
  })
  @IsNumber()
  @IsNotEmpty()
  departmentId: number;
}
