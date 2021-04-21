import { Module } from '@nestjs/common';
import { StepService } from './step.service';
import { StepController } from './step.controller';
import { StepEntity } from './entities/step.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityModule } from '../activity/activity.module';

@Module({
  imports: [TypeOrmModule.forFeature([StepEntity]), ActivityModule],
  controllers: [StepController],
  providers: [StepService],
  exports: [StepService]
})
export class StepModule { }
