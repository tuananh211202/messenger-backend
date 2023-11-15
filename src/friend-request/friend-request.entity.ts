import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';

@Entity()
export class FriendRequest {
  @PrimaryGeneratedColumn()
  friendRequestId: number;

  @CreateDateColumn({ type: 'timestamp' })
  create_at: Date;

  @ManyToOne(() => User, user => user.sentFriendRequests)
  sender: User;

  @ManyToOne(() => User, user => user.receivedFriendRequests)
  receiver: User;
}