import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArgumentException } from '@src/shared/exceptions/argument-excecption';
import { BusinessException } from '@src/shared/exceptions/business-exception';
import { classToPlain } from 'class-transformer';
import { getConnection, getManager, Repository } from 'typeorm';
import { ActivityService } from '../activity/activity.service';
import { ActivityEntity } from '../activity/entities/activity.entity';
import { stepConstants } from './constants';
import { CreateStepDto } from './dto/create-step.dto';
import { StepEntity } from './entities/step.entity';

@Injectable()
export class StepService {
    constructor(
        @InjectRepository(StepEntity)
        private readonly _stepRepository: Repository<StepEntity>,
        private readonly _activityService: ActivityService,
    ) { }

    async create(step: CreateStepDto): Promise<any> {
        const index = await this._activityService.getNewIndex(step.activityId);

        if (index === null)
            throw new ArgumentException('activityId', stepConstants.unknownActivityId);

        const stepEntity = getManager().create(StepEntity, classToPlain(step));

        // populating non-fillable fields
        stepEntity.activity = <ActivityEntity>{ id: step.activityId };
        stepEntity.index = index;

        // creating the instance
        return await stepEntity.save();
    }

    async getByActivityId(activityId: string) : Promise<StepEntity[]> {
        return await this._stepRepository.find({
            where: { activity: { id: activityId } },
            order: { index: 'ASC' }
        });
    }
}
