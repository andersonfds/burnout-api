import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { classToPlain, plainToClass } from 'class-transformer';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ResponseActivityDto } from './dto/response-activity.dto';

@ApiTags('Activity')
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) { }

  @Post()
  @ApiOkResponse({ type: ResponseActivityDto })
  async create(@Body() activityDto: CreateActivityDto): Promise<ResponseActivityDto> {
    const activity = await this.activityService.create(activityDto);
    return plainToClass(ResponseActivityDto, classToPlain(activity));
  }

}
