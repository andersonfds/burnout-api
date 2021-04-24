import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";

export class StepTypeText {
    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsNotEmpty()
    description: string;
}

export class StepTypeOptions {
    @ApiProperty()
    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    options: string[];
}