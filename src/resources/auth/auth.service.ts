import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BusinessException } from '@src/shared/exceptions/business-exception';
import { plainToClass } from 'class-transformer';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { authMessages } from './constants';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateTokenDto, TokenData } from './dto/create-token.dto';

@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    async authenticate(userRequest: CreateAuthDto): Promise<CreateTokenDto> {
        const user: UserEntity = await this.userService.findOneByEmail(userRequest.identifier);

        if (user == null)
            throw new BusinessException('identifier', authMessages.unknown_email);

        if (user?.validate(userRequest.password) != true)
            throw new BusinessException('password', authMessages.unknown_password);

        const payload = <TokenData>{ id: user.id };
        const accessToken = this.jwtService.sign(payload);

        return plainToClass(CreateTokenDto, { user, accessToken });
    }

}
