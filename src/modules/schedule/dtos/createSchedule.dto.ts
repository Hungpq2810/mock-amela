import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsDateString } from "class-validator";

export class CreateScheduleDto {
    @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  receiverId: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  content: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  sendDate: string;
}