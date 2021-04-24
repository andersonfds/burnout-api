import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@src/resources/auth/auth.module';
import { UserModule } from './resources/user/user.module';
import { ActivityModule } from './resources/activity/activity.module';
import { StepModule } from './resources/step/step.module';
import { TransactionModule } from './resources/transactions/transaction.module';
import { FcmModule } from './shared/modules/fcm/fcm.module';
import { MailModule } from './shared/modules/mail/mail.module';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SendGridModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        apiKey: config.get<string>('SENDGRID_KEY'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ssl: true,
        useUTC: true,
        name: 'default',
        synchronize: true,
        type: config.get<any>('DB_TYPE'),
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        schema: config.get<string>('DB_SCHEMA'),
        database: config.get<string>('DB_NAME'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      }),
    }),
    UserModule,
    AuthModule,
    ActivityModule,
    StepModule,
    TransactionModule,
    FcmModule,
    MailModule,
  ],
  providers: [TypeOrmModule],
  exports: [],
})
export class AppModule { }
