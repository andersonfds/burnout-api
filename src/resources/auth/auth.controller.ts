import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponseDto } from '@src/shared/models/error-response-dto';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ResponseTokenDto } from './dto/response-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('session')
  @ApiOkResponse({ type: ResponseTokenDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  session(@Body() user: CreateAuthDto): ResponseTokenDto {
    return this.authService.authenticate(user);
  }

}
