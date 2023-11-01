import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


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
}
