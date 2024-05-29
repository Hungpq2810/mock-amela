import { TokenType } from 'src/enums/index.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('token')
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'token', nullable: false })
  token: string;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @Column({ name: 'type', nullable: false })
  type: TokenType;

  @Column({ name: 'expired_at', nullable: false })
  expiredAt: Date;

  @CreateDateColumn({
    name: 'created_at',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}
