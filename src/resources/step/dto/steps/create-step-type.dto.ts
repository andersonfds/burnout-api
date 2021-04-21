import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, ValidateNested } from "class-validator";

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
    @ValidateNested()
    options: string[];
}