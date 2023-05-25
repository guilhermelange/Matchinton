import { Controller, Post, Body } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateAuthenticationDto } from './dto/create-authentication.dto';
import { Public } from 'src/common/decorator/public.decorator';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post()
  @Public()
  create(@Body() createAuthenticationDto: CreateAuthenticationDto) {
    return this.authenticationService.create(createAuthenticationDto);
  }
}
