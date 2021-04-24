import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDefined, IsNotEmpty, IsString, ValidateNested } from "class-validator";

export class StepTypeText {
    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsDefined()
    onDeny: string;

    @ApiProperty()
    @IsDefined()
    onAccept: string;
}

export class StepTypeOptions {
    @ApiProperty()
    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    options: string[];
}