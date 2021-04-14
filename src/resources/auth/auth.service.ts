import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BusinessException } from '@src/shared/exceptions/business-exception';
import { authMessages } from './constants';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ResponseTokenDto } from './dto/response-token.dto';

@Injectable()
export class AuthService {

    authenticate(userRequest: CreateAuthDto): ResponseTokenDto {
        throw new InternalServerErrorException();
    }

}
