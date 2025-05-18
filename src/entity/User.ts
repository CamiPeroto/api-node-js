import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate } from "typeorm";
import { Situation } from "./Situation";
import bcrypt from "bcryptjs"

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column({unique:true})
    email!: string;

    @Column()
    password!: string

    @Column({unique:true})
    recoverPassword!: string;

   //relacionamento N -> 1 com a tabela situation
    @ManyToOne(() => Situation, (situation)=> situation.users)
    @JoinColumn({name: "situationId"}) //nome da chave estrangeira
    situation!:Situation

    @Column({type: "timestamp", default: ()=> "CURRENT_TIMESTAMP"})
    createdAt!: Date

    @Column({type: "timestamp", default: ()=> "CURRENT_TIMESTAMP", onUpdate:"CURRENT_TIMESTAMP"})
    updatedAt!: Date

    @BeforeInsert()//executa o método antes de inserir novo usuário ou editar
    @BeforeUpdate()
    async hashPassword(): Promise<void>{
        //verificar se a senha está definida e a criptografada antes de salvar
        if(this.password){
            this.password = await bcrypt.hash(this.password, 10);
        }
    }
    // Método comparar senha informada com senha salva no banco
    async comparePassword(password: string): Promise<boolean>{
        //compara senha enviada com senha do banco
        return bcrypt.compare(password, this.password);
    }

}