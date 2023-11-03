import { Inject, Injectable, NotFoundException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { forgotpasswordProviderName } from './constants';
import { Repository } from 'typeorm';
import { ForgotPassword } from './forgotpassword.entity';
import { UsersService } from 'src/users/users.service';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { userProvideName } from 'src/users/constants';
import { User } from 'src/users/user.entity';

@Injectable()
export class ForgotpasswordService {
  private transporter: nodemailer.Transporter;

  constructor(
    @Inject(forgotpasswordProviderName) private codeRepository: Repository<ForgotPassword>,
    private userService: UsersService,
    private jwtService: JwtService
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'anh.nt211202@gmail.com',
        pass: 'dxkp smhu qqep bxqr'
      },
    });
  };

  async getCode(username: string){
    const user = await this.userService.findOneByUsername(username);
    if(!user) {
      throw new NotFoundException();
    }

    const min = 100000; 
    const max = 999999; 

    const code = Math.floor(Math.random() * (max - min + 1)) + min;

    const mailOptions: nodemailer.SendMailOptions = {
      from: 'anh.nt211202@gmail.com',
      to: username,
      subject: 'Verification code',
      text: `Your verification code is ${code}`,
    }

    try {
        await this.transporter.sendMail(mailOptions);
        return this.codeRepository.save({ username, code: code.toString() });
    } catch (error) {
        throw new InternalServerErrorException();
    }

  }

  async getRole(roleDetails: { username: string, code: string }) {
    const user = await this.userService.findOneByUsername(roleDetails.username);
    const role = await this.codeRepository.find({
        where: {
            username: roleDetails.username,
            code: roleDetails.code
        }
    });

    if(!role.length || !user) {
        throw new UnauthorizedException();
    }
    await this.codeRepository.remove(role);
    const payload = { sub: user.userId, username: user.username };
    delete user.password;
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: user
    };
  }

  async changePassword(userDetails: any, password: string){
    const existUser = await this.userService.findOneByUsername(userDetails.username);

    if(!existUser) {
        throw new UnauthorizedException();
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userService.saveUser({
        ...existUser,
        password: hashedPassword
    });

    return {
        message: "Change password successfully!"
    };
  }
}
