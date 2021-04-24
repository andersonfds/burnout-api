import { BadRequestException, Body, Controller, createParamDecorator, ExecutionContext, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BusinessException } from '@src/shared/exceptions/business-exception';
import { ValidationException } from '@src/shared/exceptions/validation-exception';
import { classToPlain, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CurrentUser } from '../auth/decorators/current-user';
import { Roles } from '../auth/decorators/role';
import { TokenData } from '../auth/dto/create-token.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { UserRole } from '../user/enum/user-role.enum';
import { stepConstants } from './constants';
import { CreateStepDto } from './dto/create-step.dto';
import { ResponseStepDto } from './dto/response-step.dto';
import { dataTypesMap } from './dto/step-types.dto';
import { StepTypeOptions, StepTypeText } from './dto/steps/create-step-type.dto';
import { StepService } from './step.service';
import { Request } from 'express';

@ApiTags('Step')
@Controller('step')
export class StepController {
  constructor(private readonly stepService: StepService) { }

  @Post(':type/:id')
  @ApiBearerAuth('JWT')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async create(@Param() params: any, @Req() req: Request) {
    // Getting the current type map
    const current = dataTypesMap.find(x => x.name == params.type);
    // If the type is not defined then throw an exception
    if (!current)
      throw new BusinessException('type', stepConstants.unsupportedType);
    // casting to an class
    const item: any = plainToClass(current.type, req.body);
    // validating the items
    const validated = await validate(item);
    // If it didn't pass the validation we should
    // throw an exception
    if (validated.length > 0)
      throw new ValidationException(validated);
    // Creating the step
    const stepDto = <CreateStepDto>{ activityId: params.id, content: item, type: params.type }
    await this.stepService.create(stepDto);
  }

  @Get(':id/steps')
  @ApiBearerAuth('JWT')
  @Roles(UserRole.CLIENT)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: ResponseStepDto })
  async getSteps(@Param('id') id: string, @CurrentUser() user: TokenData): Promise<ResponseStepDto> {
    const steps = await this.stepService.getByActivityId(id);
    return plainToClass(ResponseStepDto, classToPlain(steps));
  }
}
