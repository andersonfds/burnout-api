import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ErrorResponseDto } from '@src/shared/models/error-response-dto';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateTokenDto } from './dto/create-token.dto';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('session')
  @ApiOkResponse({ type: CreateTokenDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiSecurity('token')
  session(@Body() user: CreateAuthDto): any {
    return this.authService.authenticate(user);
  }

}
