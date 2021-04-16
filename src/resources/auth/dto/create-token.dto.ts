import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "@src/resources/user/entities/user.entity";

export interface TokenData {
    id: string,
}

export class CreateTokenDto {
    @ApiProperty()
    user: UserEntity;

    @ApiProperty()
    accessToken: string;
}