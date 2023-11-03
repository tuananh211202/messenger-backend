import { Injectable, Inject } from '@nestjs/common';
import { userProvideName } from './constants';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserFull } from './dto/UserFull.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject(userProvideName) private userRepository: Repository<User>
  ) {}

  async findOneByUsername(username: string): Promise<User | undefined>{
    return this.userRepository.findOne({
      where: { username }
    });
  }

  async findOneByName(name: string): Promise<User | undefined>{
    return this.userRepository.findOne({
      where: { name }
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async createNewUser(user: UserFull){
    return this.userRepository.save(user);
  }
}
