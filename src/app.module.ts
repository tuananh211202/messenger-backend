import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ForgotpasswordModule } from './forgotpassword/forgotpassword.module';
import { JwtMiddleware } from './auth/Jwt.middleware';
import { ImageModule } from './image/image.module';
import { FriendRequestModule } from './friend-request/friend-request.module';

@Module({
  imports: [AuthModule, UsersModule, DatabaseModule, ForgotpasswordModule, ImageModule, FriendRequestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
