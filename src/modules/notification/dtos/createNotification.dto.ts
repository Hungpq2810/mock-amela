import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNotEmpty } from "class-validator";

export class CreateNotificationDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    scheduleId: number;
}