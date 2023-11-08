import { Injectable, Inject, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { userProvideName } from './constants';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserFull } from './dto/UserFull.interface';
import * as nodemailer from "nodemailer";
import * as bcrypt from "bcrypt";
import { generateRandomPassword } from 'src/utils/generateCode';

@Injectable()
export class UsersService {
  private transporter: nodemailer.Transporter;

  constructor(
    @Inject(userProvideName) private userRepository: Repository<User>
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'anh.nt211202@gmail.com',
        pass: 'dxkp smhu qqep bxqr'
      },
    });
  }

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

  async saveUser(user: UserFull){
    return this.userRepository.save(user);
  }

  async updateUser(currentUser, userDetails: UserFull){
    const user = await this.userRepository.findOne({
      where: { name: currentUser.name }
    });
    if(!user) {
      throw new NotFoundException();
    }

    if(userDetails.name) {
      const existUser = await this.userRepository.findOne({
        where: { name: userDetails.name }
      });
      if(existUser) {
        throw new ConflictException();
      }
    }

    if(userDetails.username) {
      const existUser = await this.userRepository.findOne({
        where: { username: userDetails.username }
      });
      if(existUser) {
        throw new ConflictException();
      }
    }

    const savedUser = await this.userRepository.save({
      ...user,
      ...userDetails
    });
    delete savedUser.password;

    return savedUser;
  }

  async resetPassword(currentUser) {
    const user = await this.userRepository.findOne({
      where: { name: currentUser.name }
    });
    if(!user) {
      throw new NotFoundException();
    }

    const newRandomPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(newRandomPassword, 10);

    const mailOptions: nodemailer.SendMailOptions = {
      from: 'anh.nt211202@gmail.com',
      to: user.username,
      subject: 'Reset password',
      text: `Your new random password is ${newRandomPassword}`,
    }

    try {
      await this.transporter.sendMail(mailOptions);
      const savedUser = await this.userRepository.save({
        ...user, 
        password: hashedPassword
      });
      delete savedUser.password;
      return savedUser;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

}
