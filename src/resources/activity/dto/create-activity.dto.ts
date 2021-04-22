import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty } from "class-validator";

export class CreateActivityDto {
    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsNotEmpty()
    levelName: string;

    @ApiProperty()
    @IsNotEmpty()
    levelTag: string;

    @ApiProperty()
    @IsDefined()
    unlockPrice: number;

    @ApiProperty()
    @IsDefined()
    price: number;
}