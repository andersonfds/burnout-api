import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@src/resources/auth/auth.module';
import { UserModule } from './resources/user/user.module';
import { ActivityModule } from './resources/activity/activity.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: config.get<any>('DB_TYPE'),
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        name: 'default',
        database: config.get<string>('DB_NAME'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    UserModule,
    AuthModule,
    ActivityModule,
  ],
  providers: [TypeOrmModule],
  exports: [],
})
export class AppModule { }
