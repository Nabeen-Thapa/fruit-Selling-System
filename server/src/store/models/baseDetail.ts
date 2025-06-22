import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


export class baseDetails{
    @PrimaryGeneratedColumn("uuid")
    id!:string;

    @CreateDateColumn()
    createdAt!:Date;

   @UpdateDateColumn()
   updateAt!:Date;
}