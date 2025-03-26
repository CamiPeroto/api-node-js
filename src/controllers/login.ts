
//importar biblioteca express
import express, { Request, Response } from "express";
//importar o arquivo com as credenciais do banco
import { AppDataSource } from "../data-source";
//criar aplicação express
const router = express.Router();

//inicializar a conexão com o banco de dados
AppDataSource.initialize()
.then(()=> {
    console.log("Conexão com o Banco realizada com sucesso!")
})
.catch((error)=> {
    console.log("Erro na conexão com o banco!", error) 
})

//criar a rota GET principal
router.get("/", (req: Request, res: Response) => {
  res.send("Bem-vinda, Camila Peroto 1!");
});

//Exportar a instrução que está dentro da constante router
export default router;