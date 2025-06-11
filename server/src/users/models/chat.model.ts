import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("user_chat")
export  class userChat{
    @PrimaryGeneratedColumn("uuid")
    id!:string;

    @Column()
    senderId!:string;

    @Column()
    receiverId!: string;

    @Column()
    message!:string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date; 
}