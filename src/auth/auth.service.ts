import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
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
    const userByUserName = await this.usersService.findOneByUsername(userDetails.username);
    const userByName = await this.usersService.findOneByName(userDetails.name);
    if(userByUserName || userByName) {
      throw new ConflictException();
    }
    const hashedPassword = await bcrypt.hash(userDetails?.password, 10);
    const newUser: UserFull = {
      ...userDetails,
      password: hashedPassword, 
      avatar: ''
    };

    const savedUser = await this.usersService.saveUser(newUser);
    const payload = { sub: savedUser.userId, username: savedUser.username };
    delete savedUser.password;
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: savedUser,
    }
  }

  async signIn(account: Account): Promise<any> {
    const user = await this.usersService.findOneByUsername(account.username);
    if(!user) {
      throw new NotFoundException();
    }
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

  async getUserFromToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded;
    } catch (err) {
      throw new Error('Invalid token');
    }
  }
}
