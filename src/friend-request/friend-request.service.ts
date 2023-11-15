import { Inject, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { FriendRelation, friendRequestProvideName } from './constants';
import { FriendRequest } from './friend-request.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FriendRequestService {
  constructor(
    @Inject(friendRequestProvideName) private friendRequestRepository: Repository<FriendRequest>,
    private userService: UsersService
  ) {}

  async createFriendRequest(senderUserName: string, receiverUserName: string) {
    const senderUser = await this.userService.findOneByName(senderUserName);
    const receiverUser = await this.userService.findOneByName(receiverUserName);
    if(!senderUser || !receiverUser) {
      throw new NotFoundException();
    }

    return this.friendRequestRepository.save({
      sender: senderUser,
      receiver: receiverUser
    });
  }

  async deleteFriendRequest(senderUserName: string, receiverUserName: string) {
    const senderUser = await this.userService.findOneByName(senderUserName);
    const receiverUser = await this.userService.findOneByName(receiverUserName);
    if(!senderUser || !receiverUser) {
      throw new NotFoundException();
    }

    const senderRel = await this.friendRequestRepository.findOne({
      where: { sender: senderUser, receiver: receiverUser }
    });

    if(!senderRel) {
      throw new ConflictException();
    }

    return this.friendRequestRepository.delete(senderRel.friendRequestId);
  }

  async getRelation(senderUserName: string, receiverUserName: string) {
    const senderUser = await this.userService.findOneByName(senderUserName);
    const receiverUser = await this.userService.findOneByName(receiverUserName);
    if(!senderUser || !receiverUser) {
      throw new NotFoundException();
    }

    const senderRel = await this.friendRequestRepository.findOne({
      where: { sender: senderUser, receiver: receiverUser }
    });

    const receiverRel = await this.friendRequestRepository.findOne({
      where: { sender: receiverUser, receiver: senderUser }
    });

    if(senderRel && !receiverRel) return { relation: FriendRelation.Sender };
    if(!senderRel && receiverRel) return { relation: FriendRelation.Receiver };
    if(senderRel && receiverRel) return { relation: FriendRelation.Friend };
    return { relation: FriendRelation.None };
  }
}
