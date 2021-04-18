import { Body, ClassSerializerInterceptor, Controller, HttpCode, Post, UseInterceptors } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponseDto } from '@src/shared/models/error-response-dto';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateTokenDto } from './dto/create-token.dto';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(200)
  @Post('session')
  @ApiOkResponse({ type: CreateTokenDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  async session(@Body() user: CreateAuthDto): Promise<CreateTokenDto> {
    return await this.authService.authenticate(user);
  }

}
