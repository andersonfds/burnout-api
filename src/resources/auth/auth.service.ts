import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BusinessException } from '@src/shared/exceptions/business-exception';
import { FcmService } from '@src/shared/modules/fcm/fcm.service';
import { plainToClass } from 'class-transformer';
import { ResponseUserDto } from '../user/dto/response-user.dto';
import { UserService } from '../user/user.service';
import { authMessages } from './constants';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateTokenDto, TokenData } from './dto/create-token.dto';

@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private fcmService: FcmService,
    ) { }

    async authenticate(userRequest: CreateAuthDto): Promise<CreateTokenDto> {
        const userData = await this.userService.findOneByEmail(userRequest.identifier);

        if (userData == null)
            throw new BusinessException('identifier', authMessages.unknown_email);

        if (userData?.validate(userRequest.password) != true)
            throw new BusinessException('password', authMessages.unknown_password);

        const payload = <TokenData>{ id: userData.id, role: userData.role };
        const accessToken = this.jwtService.sign(payload);
        const user = plainToClass(ResponseUserDto, userData);

        console.log('chegou aqui: ', userRequest);
        if (userRequest.deviceId) {
            console.log('inserindo no firebase');
            this.fcmService.register(userData, userRequest.deviceId);
        }

        return plainToClass(CreateTokenDto, { user, accessToken });
    }

}
