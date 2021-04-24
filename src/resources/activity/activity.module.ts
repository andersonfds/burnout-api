import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModule } from '../transactions/transaction.module';
import { UserModule } from '../user/user.module';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { ActivityEntity } from './entities/activity.entity';

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
