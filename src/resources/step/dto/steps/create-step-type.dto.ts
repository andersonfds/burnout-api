import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDefined, IsNotEmpty, ValidateNested } from "class-validator";

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

export class OptionItem {
    @ApiProperty()
    value: string;

    @ApiProperty()
    content: string;
}

export class StepTypeOptions {
    @ApiProperty()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => OptionItem)
    options: OptionItem[];
}