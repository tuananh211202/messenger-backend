import { Controller, UseGuards, Request, Param, Post, Get, Delete } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('friend-request')
export class FriendRequestController {
  constructor(private friendRequestService: FriendRequestService) {}

  @UseGuards(AuthGuard)
  @Post(':name')
  createFriendRequest(@Request() req, @Param('name') name: string) {
    return this.friendRequestService.createFriendRequest(req.user.name, name);
  }

  @UseGuards(AuthGuard)
  @Delete(':name')
  deleteFriendRequest(@Request() req, @Param('name') name: string) {
    return this.friendRequestService.deleteFriendRequest(req.user.name, name);
  }

  @UseGuards(AuthGuard)
  @Get(':name')
  getRelation(@Request() req, @Param('name') name: string) {
    return this.friendRequestService.getRelation(req.user.name, name);
  }
}
