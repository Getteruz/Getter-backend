import {
  Req,
  Controller,
  Post,
  UseGuards,
  Body,
  Res,
  HttpCode,
} from '@nestjs/common';
import { Response, CookieOptions } from 'express';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { Public } from './decorators/public.decorator';
import { User } from '../user/user.entity';
import { LocalAuthGuard } from './passport-stratagies/local/local-auth.guard';
import { ACCESS_TOKEN_USER } from './passport-stratagies/access-token-user/access-token-user.strategy';
import { RefreshTokenUserGuard } from './passport-stratagies/refresh-token-user/refresh-token-user.guard';
import { REFRESH_TOKEN_USER } from './passport-stratagies/refresh-token-user/refresh-token-user.strategy';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { userRoles } from '../../infra/shared/enum';

const accessTokenOptions: CookieOptions = {
  secure: false,
  sameSite: 'none',
  maxAge: 31536000000,
};
const refreshTokenOptions: CookieOptions = {
  ...accessTokenOptions,
  httpOnly: true,
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(200)
  @ApiNoContentResponse({
    description: 'New access, refresh tokens have been saved.',
  })
  @ApiBadRequestResponse({ description: 'Something went wrong from FE' })
  async login(
    @Req() { user }: { user: User },
    @Res({ passthrough: true }) response: Response,
    @Body() _: LoginDto,
  ) {
    const accessToken = this.authService.getJWT('access', user.id);
    const refreshToken = this.authService.getJWT('refresh', user.id);
    response.cookie(ACCESS_TOKEN_USER, accessToken, accessTokenOptions);
    response.cookie(REFRESH_TOKEN_USER, refreshToken, refreshTokenOptions);
    response.cookie('user_id', user.id, accessTokenOptions);
    return {
      accessToken,
      refreshToken,
      userId: user.id,
    };
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/admin/login')
  @HttpCode(200)
  @ApiNoContentResponse({
    description: 'New access, refresh tokens have been saved.',
  })
  @ApiBadRequestResponse({ description: 'Something went wrong from FE' })
  async loginAdmin(
    @Req() { user }: { user: User },
    @Res({ passthrough: true }) response: Response,
    @Body() _: LoginDto,
  ) {
    try {
      if (user.role != userRoles.ADMIN) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      const accessToken = this.authService.getJWT('access', user.id);
      const refreshToken = this.authService.getJWT('refresh', user.id);
      response.cookie(ACCESS_TOKEN_USER, accessToken, accessTokenOptions);
      response.cookie(REFRESH_TOKEN_USER, refreshToken, refreshTokenOptions);
      response.cookie('user_id', user.id, accessTokenOptions);
      return {
        accessToken,
        refreshToken,
        userId: user.id,
      };
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  @Public()
  @Post('/logout')
  @HttpCode(200)
  @ApiNoContentResponse({
    description: 'The user was logged out successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(ACCESS_TOKEN_USER, accessTokenOptions);
    response.clearCookie(REFRESH_TOKEN_USER, refreshTokenOptions);
  }

  @Public()
  @UseGuards(RefreshTokenUserGuard)
  @Post('/refresh')
  @HttpCode(200)
  @ApiNoContentResponse({
    description: 'New access, refresh tokens have been saved.',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  async refresh(
    @Req() { user }: { user: User },
    @Res({ passthrough: true }) response: Response,
  ) {
    const accessToken = this.authService.getJWT('access', user.id);
    const refreshToken = this.authService.getJWT('refresh', user.id);
    response.cookie(ACCESS_TOKEN_USER, accessToken, accessTokenOptions);
    response.cookie(REFRESH_TOKEN_USER, refreshToken, refreshTokenOptions);
    response.cookie('user_id', user.id, accessTokenOptions);
    return {
      accessToken,
      refreshToken,
      userId: user.id,
    };
  }
}
