import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: config.get<boolean>('APP_IGNORE_JWT_EXPIRATION') || true,
            secretOrKey: config.get<string>('APP_SECRET'),
        });
    }

    async validate(payload: any) {
        return payload;
    }
}