import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { classToPlain, plainToClass } from 'class-transformer';
import { CurrentUser } from '../auth/decorators/current-user';
import { Roles } from '../auth/decorators/role';
import { TokenData } from '../auth/dto/create-token.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { UserRole } from '../user/enum/user-role.enum';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ResponseActivityAllDto } from './dto/response-activity-all.dto';
import { ResponseActivityDto } from './dto/response-activity.dto';

@ApiTags('Activity')
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) { }

  @Post()
  @ApiBearerAuth('JWT')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: ResponseActivityDto })
  async create(@Body() activityDto: CreateActivityDto): Promise<ResponseActivityDto> {
    const activity = await this.activityService.create(activityDto);
    return plainToClass(ResponseActivityDto, classToPlain(activity));
  }

  @Get()
  @ApiBearerAuth('JWT')
  @Roles(UserRole.CLIENT)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async find(@CurrentUser() user: TokenData): Promise<any> {
    const activity = await this.activityService.findUnlockedForUser(user.id);
    return plainToClass(ResponseActivityAllDto, classToPlain(activity));
  }

  @Post(':id/unlock')
  @ApiBearerAuth('JWT')
  @Roles(UserRole.CLIENT)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async unlock(@Param('id') id: string, @CurrentUser() user: TokenData): Promise<any> {
    const unlockStatus = await this.activityService.unlock(id, user.id);
    return { unlockStatus };
  }

}
