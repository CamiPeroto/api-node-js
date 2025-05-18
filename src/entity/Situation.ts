import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
//importando a entidade user 
import { User } from "./User";

@Entity("situations")
export class Situation {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    nameSituation!: string

    @Column({type: "timestamp", default: ()=> "CURRENT_TIMESTAMP"})
    createdAt!: Date

    @Column({type: "timestamp", default: ()=> "CURRENT_TIMESTAMP", onUpdate:"CURRENT_TIMESTAMP"})
    updatedAt!: Date

    //Relacionamento 1 para N com a tabela Users
    @OneToMany(() => User, (user) => user.situation)
    users!: User[]
}