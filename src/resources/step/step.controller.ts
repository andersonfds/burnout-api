import { Body, Controller, Param, Post } from '@nestjs/common';
import { BusinessException } from '@src/shared/exceptions/business-exception';
import { ValidationException } from '@src/shared/exceptions/validation-exception';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { stepConstants } from './constants';
import { CreateStepDto } from './dto/create-step.dto';
import { dataTypesMap } from './dto/step-types.dto';
import { StepTypeText } from './dto/steps/create-step-type.dto';
import { StepService } from './step.service';

@Controller('step')
export class StepController {
  constructor(private readonly stepService: StepService) { }

  @Post(':type/:id')
  async create(@Param() params: any, @Body() step: StepTypeText) {
    // Getting the current type map
    const current = dataTypesMap.find(x => x.name == params.type);
    // If the type is not defined then throw an exception
    if (!current)
      throw new BusinessException('type', stepConstants.unsupportedType);
    // casting to an class
    const item: any = plainToClass(current.type, step);
    // validating the items
    const validated = await validate(item);
    // If it didn't pass the validation we should
    // throw an exception
    if (validated.length > 0)
      throw new ValidationException(validated);
    // Creating the step
    const stepDto = <CreateStepDto>{ activityId: params.id, content: item, type: params.type }
    return this.stepService.create(stepDto);
  }
}
