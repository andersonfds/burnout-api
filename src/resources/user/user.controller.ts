import { Body, ClassSerializerInterceptor, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { classToPlain, plainToClass } from 'class-transformer';
import { CurrentUser } from '../auth/decorators/current-user';
import { TokenData } from '../auth/dto/create-token.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { ResendVerifyDto } from './dto/resend-verify.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserService } from './user.service';


@ApiTags('User')
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @ApiOkResponse({ type: ResponseUserDto })
  async create(@Body() userDto: CreateUserDto): Promise<ResponseUserDto> {
    const user = await this.userService.create(userDto);
    return plainToClass(ResponseUserDto, classToPlain(user));
  }

  @Get()
  @ApiBearerAuth('JWT')
  @ApiOkResponse({ type: ResponseUserDto })
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() req: TokenData): Promise<ResponseUserDto> {
    const user = await this.userService.findById(req.id);
    return plainToClass(ResponseUserDto, classToPlain(user));
  }

  @Get('balance')
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: Number })
  async getBalance(@CurrentUser() data: TokenData): Promise<number> {
    return await this.userService.getBalance(data.id);
  }

  @Post('verify')
  async verifyEmail(@Body() verify: VerifyEmailDto) {
    return await this.userService.verify(verify.email, verify.code);
  }

  @Post('resend')
  async resend(@Body() user: ResendVerifyDto) {
    return await this.userService.resendVerificationCode(user.email);
  }
}
