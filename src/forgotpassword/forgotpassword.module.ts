import { Module } from '@nestjs/common';
import { ForgotpasswordController } from './forgotpassword.controller';
import { ForgotpasswordService } from './forgotpassword.service';
import { forgotpasswordProvider } from './forgotpassword.providers';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [ForgotpasswordController],
  providers: [
    ...forgotpasswordProvider,
    ForgotpasswordService
  ]
})
export class ForgotpasswordModule {}
