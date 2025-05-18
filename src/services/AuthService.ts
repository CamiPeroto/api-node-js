//importar a conexão com o banco de dados
import { AppDataSource } from "../data-source";
//importar a entidade
import { User } from "../entity/User";
import jwt from "jsonwebtoken";
//importar biblioteca variáveis de ambiente
import dotenv from "dotenv";

//carregar variáveis do arquivo .env
dotenv.config();

//Classe responsável pela autenticação do usuáiro
export class AuthService{
    private userRepository = AppDataSource.getRepository(User);

    async login(email: string, password: string): Promise<{
        id:number; 
        name:string; 
        email:string; 
        token: string
    }>{
        //Buscar o usuário do banco de dados pelo email informado
        const user = await this.userRepository.findOne({where: {email}})

        //se o usuário não for localizo, lançar erro
        if(!user){
            throw new Error("Usuário ou senha inválidos!")
        }
        //Verificar se a senha informada corresponde a senha salva no banco
       const isPasswordValid = await user.comparePassword(password);
        if(!isPasswordValid){
            throw new Error("Usuário ou senha inválidos!")
        }
        //gerar token JWT para o usuário autenticado
        //o token inclui id do usuário e expira em 7 dias
       const token = jwt.sign({id: user.id}, process.env.JWT_SECRET as string,
             {expiresIn:"7d"})

       //retornar os dados do usuário autenticado junto do token
       return {id:user.id, name: user.name, email:user.email, token}
        
    }
}