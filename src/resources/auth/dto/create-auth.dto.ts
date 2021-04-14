import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";
import { authMessages } from "../constants";

export class CreateAuthDto {
    @ApiProperty()
    @IsEmail({}, { message: authMessages.invalid_email })
    identifier: string;

    @ApiProperty()
    @IsNotEmpty({ message: authMessages.invalid_password })
    password: string;
}