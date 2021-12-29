import { AuthService } from '@modules/auth/auth.service';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  // # signup

  // # email forgotten password
}
