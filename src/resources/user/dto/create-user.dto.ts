import { ApiProperty } from "@nestjs/swagger";
import { serverConstants } from "@src/shared/constants/serverConstants";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { userConstants } from "../constants";

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty({ message: userConstants.name.invalid })
    @Transform((fn) => fn.value?.trim())
    firstName: string;

    @ApiProperty()
    @IsNotEmpty({ message: serverConstants.validation.invalid })
    @Transform((fn) => fn.value?.trim())
    lastName: string;

    @ApiProperty()
    @IsEmail({}, { message: userConstants.email.invalid })
    @IsNotEmpty({ message: serverConstants.validation.required })
    @Transform((fn) => fn.value?.trim())
    email: string;

    @ApiProperty()
    @MinLength(8, { message: userConstants.password.short })
    @MaxLength(32, { message: userConstants.password.long })
    @IsNotEmpty({ message: serverConstants.validation.required })
    password: string;
}