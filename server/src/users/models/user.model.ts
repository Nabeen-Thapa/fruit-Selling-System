import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!:string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  phone!: string;

  @Column()
  address!:string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ nullable: true })
  lastLogin!: Date;

  @Column()
  role!:string
}