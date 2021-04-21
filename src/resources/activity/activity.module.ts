import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { ActivityEntity } from './entities/activity.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModule } from '../transactions/transaction.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    TransactionModule,
    TypeOrmModule.forFeature([ActivityEntity])
  ],
  controllers: [ActivityController],
  providers: [ActivityService],
  exports: [ActivityService]
})
export class ActivityModule {}
