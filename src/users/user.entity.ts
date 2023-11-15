import { FriendRequest } from "src/friend-request/friend-request.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ length: 20 })
  name: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  description: string;

  @Column()
  avatar: string;

  @OneToMany(() => FriendRequest, friendRequest => friendRequest.sender)
  sentFriendRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, friendRequest => friendRequest.receiver)
  receivedFriendRequests: FriendRequest[];
}
