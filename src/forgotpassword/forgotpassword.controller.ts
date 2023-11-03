import { Controller, HttpCode, HttpStatus, Get, Body, Post, UseGuards, Request } from '@nestjs/common';
import { ForgotpasswordService } from './forgotpassword.service';
import { Public } from 'src/auth/constants';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('forgotpassword')
export class ForgotpasswordController {
  constructor(private forgotPasswordSerivce: ForgotpasswordService){}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('code')
  getCode(@Body() userDetails: { username: string }){
    return this.forgotPasswordSerivce.getCode(userDetails.username);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('role')
  getRole(@Body() roleDetails: { username: string, code: string }){
    return this.forgotPasswordSerivce.getRole(roleDetails);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('changepassword')
  changePassword(@Request() req ,@Body() changeDetails: { newPassword: string }){
    return this.forgotPasswordSerivce.changePassword(req.user, changeDetails.newPassword);
  }
}
