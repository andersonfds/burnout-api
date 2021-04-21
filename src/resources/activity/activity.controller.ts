import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { classToPlain, plainToClass } from 'class-transformer';
import { Roles } from '../auth/decorators/role';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { UserRole } from '../user/enum/user-role.enum';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ResponseActivityDto } from './dto/response-activity.dto';

@ApiTags('Activity')
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) { }

  @Post()
  @ApiBearerAuth('JWT')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth('JWT')
  @ApiOkResponse({ type: ResponseActivityDto })
  async create(@Body() activityDto: CreateActivityDto): Promise<ResponseActivityDto> {
    const activity = await this.activityService.create(activityDto);
    return plainToClass(ResponseActivityDto, classToPlain(activity));
  }

}
