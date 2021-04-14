import { ApiProperty } from "@nestjs/swagger";

export class ResponseTokenDto {
    @ApiProperty()
    accessToken: string;
}