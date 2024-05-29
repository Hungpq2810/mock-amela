import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateJobDto {
  @ApiProperty({
    example: 'Backend Developer',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Develops the backend of the application',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: '1',
  })
  @IsNumber()
  managerId: number;
}
