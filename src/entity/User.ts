import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Situation } from "./Situation";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column({unique:true})
    email!: string
   //relacionamento N -> 1 com a tabela situation
    @ManyToOne(() => Situation, (situation)=> situation.users)
    @JoinColumn({name: "situationId"}) //nome da chave estrangeira
    situation!:Situation

    @Column({type: "timestamp", default: ()=> "CURRENT_TIMESTAMP"})
    createdAt!: Date

    @Column({type: "timestamp", default: ()=> "CURRENT_TIMESTAMP", onUpdate:"CURRENT_TIMESTAMP"})
    updatedAt!: Date
}