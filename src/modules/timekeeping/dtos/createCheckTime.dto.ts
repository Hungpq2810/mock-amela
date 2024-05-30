import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCheckTimeDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsDate()
  checkTime: Date = new Date();
}
