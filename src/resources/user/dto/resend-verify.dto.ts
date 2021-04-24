import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ResendVerifyDto {
    @ApiProperty()
    @IsNotEmpty()
    email: string;
}