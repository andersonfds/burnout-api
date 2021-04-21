import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ActivityEntity } from './entities/activity.entity';

@Injectable()
export class ActivityService {

    constructor(
        @InjectRepository(ActivityEntity)
        private _activityRepository: Repository<ActivityEntity>
    ) { }

    async create(activityDto: CreateActivityDto): Promise<ActivityEntity> {
        const createdActivity = getManager().create(ActivityEntity, activityDto);
        return await createdActivity.save();
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
