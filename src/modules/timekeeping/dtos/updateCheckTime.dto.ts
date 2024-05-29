import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCheckTimeDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsDate()
  checkIn?: Date;

  @IsDate()
  checkOut?: Date;
}
