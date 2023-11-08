import { Controller, Get, Post, UseGuards, Body, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from 'src/auth/constants';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserProfile } from './dto/UserProfile.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Post()
  updateProfile(@Request() req, @Body() userProfile: UserProfile) {
    return this.usersService.updateUser(req.user, userProfile);
  }

  @UseGuards(AuthGuard)
  @Get('/resetpassword')
  resetPassword(@Request() req) {
    return this.usersService.resetPassword(req.user);
  }
  
}
