//importar biblioteca express
import express, { Request, Response } from "express";
//importar a conexão com o banco de dados
import { AppDataSource } from "../data-source";
//importar a entidade
import { Situation } from "../entity/Situation";

//criar aplicação express
const router = express.Router();

//criar a rota POST principal
router.post("/situations", async (req: Request, res: Response) => {
  
  try{
    //receber os dados enviados no corpo da requisição
    var data = req.body
    //criar uma instancia do repositorio situação
    const situationRepository = AppDataSource.getRepository(Situation)
    //criar novo egistro de situação(dados simulados)
    const newSituation = situationRepository.create(data)
    //salvar o registro no banco de dados 
    await situationRepository.save(newSituation);

    //retornar resposta de sucesso
    res.status(201).json({
      message: "Situação cadastrada com sucesso!",
      situation: newSituation,
    })
  }catch(error){
    //retornar qual o erro em caso de falha
    console.log(error)
    //retornar mensagem de erro
    res.status(500).json({
      message: "Erro ao cadastrar a situação!",
    })

  }
});

//Exportar a instrução que está dentro da constante router
export default router;