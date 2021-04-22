import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Transform } from "class-transformer";

@Exclude()
export class ResponseActivityAllDto {
    @Expose()
    @ApiProperty()
    id: string;

    @Expose()
    @ApiProperty()
    title: string;

    @Expose()
    @ApiProperty()
    description: string;

    @Expose()
    price: number;

    @Expose()
    unlockPrice: number;

    @ApiProperty()
    @Transform(({ value }) => value.length > 0)
    @Expose({ name: 'users' })
    unlocked: boolean;

    @Expose()
    @ApiProperty()
    levelName: string;

    @Expose()
    @ApiProperty()
    levelTag: string;

    @Expose()
    @ApiProperty()
    thumbnail: string;
}