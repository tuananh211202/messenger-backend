import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class ForgotPassword {
  @PrimaryGeneratedColumn()
  code_id: number;

  @Column()
  username: string;

  @Column()
  code: string;

  @CreateDateColumn({ type: 'timestamp' })
  create_at: Date;
}
