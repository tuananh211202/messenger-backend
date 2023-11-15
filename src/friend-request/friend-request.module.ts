import { Module } from '@nestjs/common';
import { FriendRequestController } from './friend-request.controller';
import { FriendRequestService } from './friend-request.service';
import { friendRequestProviders } from './friend-request.providers';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [FriendRequestController],
  providers: [
    ...friendRequestProviders,
    FriendRequestService
  ],
  exports: [FriendRequestService]
})
export class FriendRequestModule {}
