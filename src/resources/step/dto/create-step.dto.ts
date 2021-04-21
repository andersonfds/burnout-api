import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsUUID } from "class-validator";

export class CreateStepDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    activityId: string;

    @IsNotEmpty()
    type: string;

    @IsDefined()
    content: any;
}