import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({
    example: 'Phoenix',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  managerId: number;

  @ApiProperty({
    example: 'Handle Global Projects',
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}
