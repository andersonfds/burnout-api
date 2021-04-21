import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@src/resources/auth/auth.module';
import { UserModule } from './resources/user/user.module';
import { ActivityModule } from './resources/activity/activity.module';
import { StepModule } from './resources/step/step.module';
import { TransactionModule } from './resources/transactions/transaction.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ssl: true,
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
  ],
  providers: [TypeOrmModule],
  exports: [],
})
export class AppModule { }
