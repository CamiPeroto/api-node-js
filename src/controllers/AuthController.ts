
//importar biblioteca express
import express, { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

//criar aplicação express
const router = express.Router();



//criar a rota para realizar o login
router.post("/", async (req: Request, res: Response) => {
  try{
        //extrair o e-mail e password do corpo da requisição
        const { email, password}  = req.body;
        //verificar se email e senha foram fornecidos
        if(!email || !password){
          res.status(400).json({
            message: "E-mail e senha são obrigatórios",
          });
        }

        //Criar instância do serviço de autenticação
        const authService = new AuthService();
        //Chamar o método "login" para validar as credenciais e obter os dados do usuário
       const userData= await authService.login(email, password);
        //retornar resposta de sucesso com os dados do usuário autenticado
        res.status(200).json({
          message: "Login realizado com sucesso!",
          user: userData
        });

        return;

  }catch(error:any){
     //retornar mensagem de erro
      res.status(401).json({
      message: error.message || "Erro ao realizar login!",
    });
    return;
  }
});

//Exportar a instrução que está dentro da constante router
export default router;