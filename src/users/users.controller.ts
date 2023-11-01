import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from 'src/auth/constants';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Get()
  findAll(){
    return [];
  }
}
