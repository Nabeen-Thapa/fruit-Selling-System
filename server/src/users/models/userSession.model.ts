import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { UserType } from '../types/auth.types';

@Entity()
export class UserSession {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  @Index()
  userId!: string; 

  @Column({ type: 'enum', enum: UserType })
  userType!: UserType; 

  @Column()
  token!: string;

  @Column({ default: true })
  isValid!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp' })
  expiresAt!: Date;
}