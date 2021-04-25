import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessException } from '@src/shared/exceptions/business-exception';
import { FcmService } from '@src/shared/modules/fcm/fcm.service';
import { createQueryBuilder, getConnection, getManager, Repository } from 'typeorm';
import { StepEntity } from '../step/entities/step.entity';
import { StepService } from '../step/step.service';
import { TransactionService } from '../transactions/transaction.service';
import { UserService } from '../user/user.service';
import { activityConstants } from './constants';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ActivityEntity } from './entities/activity.entity';

@Injectable()
export class ActivityService {

    constructor(
        @InjectRepository(ActivityEntity)
        private readonly _activityRepository: Repository<ActivityEntity>,
        private readonly _transactionService: TransactionService,
        private readonly _userService: UserService,
        private readonly _fcmService: FcmService,
    ) { }

    async create(activityDto: CreateActivityDto): Promise<ActivityEntity> {
        const createdActivity = getManager().create(ActivityEntity, activityDto);
        return await createdActivity.save();
    }

    async find(): Promise<ActivityEntity[]> {
        return await this._activityRepository.find();
    }

    async findUnlockedForUser(userId: string) {
        return getConnection()
            .createQueryBuilder(ActivityEntity, 'activity')
            .leftJoinAndSelect('activity.users', 'users', 'users.id = :userId', { userId })
            .getMany();
    }

    async unlock(activityId: string, userId: string): Promise<boolean> {
        const activity = await this._activityRepository.findOne(activityId);
        const user = await this._userService.findById(userId);
        const activityUser = getConnection().createQueryBuilder()
            .relation(ActivityEntity, 'users')
            .of(activity);
        try {
            await activityUser.add(user);

            const unlockPrice = -activity.unlockPrice;
            const unlockMessage = activityConstants.unlockingLevel;

            // taking the money from the user's account
            const success = await this._transactionService.transact(unlockPrice, unlockMessage, user);

            // the money could not be relocated
            if (!success)
                // removing in background
                activityUser.remove(user);
            else
                this._fcmService.notifyChannel(user, {
                    action: 'MONEY_VALUE_CHANGED',
                    data: user.balance,
                });
            // returning wether it saved or not 
            return success;
        } catch (error) {
            return false;
        }
    }

    /**
     * Gets the activity's step new index value
     * @param id the id of the activity
     * @returns the next index or null if there's no activity with this id
     */
    async getNewIndex(id: string): Promise<number> {
        const q = this._activityRepository.createQueryBuilder('activity')
            .leftJoinAndSelect('activity.steps', 'step')
            .where('activity.id = :id', { id })
            .groupBy('activity.id')
            .select('count(*)', 'index');

        let result = await q.getRawOne();
        if (!result) return null;
        return parseInt(result.index);
    }

}
