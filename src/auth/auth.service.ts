import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { Account } from './dto/Account.interface';
import { UserInterface } from './dto/User.interface';
import * as bcrypt from 'bcrypt';
import { UserFull } from 'src/users/dto/UserFull.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signUp(userDetails: UserInterface): Promise<any> {
    const user = await this.usersService.findOneByUsername(userDetails.username);
    if(user) {
      throw new ConflictException();
    }
    const hashedPassword = await bcrypt.hash(userDetails?.password, 10);
    const newUser: UserFull = {
      ...userDetails,
      password: hashedPassword, 
      avatar: ''
    };

    const savedUser = await this.usersService.createNewUser(newUser);
    const payload = { sub: savedUser.userId, username: savedUser.username };
    delete savedUser.password;
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: savedUser,
    }
  }

  async signIn(account: Account): Promise<any> {
    const user = await this.usersService.findOneByUsername(account.username);
    const passwordMatch = await bcrypt.compare(account.password, user?.password);
    if(!passwordMatch) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.userId, username: user.username };
    delete user.password;
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: user
    };
  }
}
