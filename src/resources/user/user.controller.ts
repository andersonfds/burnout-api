import { Body, ClassSerializerInterceptor, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { classToPlain, plainToClass } from 'class-transformer';
import { CurrentUser } from '../auth/decorators/current-user';
import { TokenData } from '../auth/dto/create-token.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { UserService } from './user.service';


@ApiTags('User')
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async create(@Body() userDto: CreateUserDto): Promise<ResponseUserDto> {
    const user = await this.userService.create(userDto);
    return plainToClass(ResponseUserDto, classToPlain(user));
  }

  @Get()
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() req: TokenData): Promise<ResponseUserDto> {
    const user = await this.userService.findById(req.id);
    return plainToClass(ResponseUserDto, classToPlain(user));
  }

}
