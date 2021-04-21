import { ApiProperty } from "@nestjs/swagger";
import { ResponseUserDto } from "@src/resources/user/dto/response-user.dto";

export interface TokenData {
    id: string,
    role: string,
}

export class CreateTokenDto {
    @ApiProperty()
    user: ResponseUserDto;

    @ApiProperty()
    accessToken: string;
}