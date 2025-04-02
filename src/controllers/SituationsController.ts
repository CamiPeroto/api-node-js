//importar biblioteca express
import express, { Request, Response } from "express";
//importar a conexão com o banco de dados
import { AppDataSource } from "../data-source";
//importar a entidade
import { Situation } from "../entity/Situation";
import { error } from "console";

//criar aplicação express
const router = express.Router();

//Criar rota para listar as situações
router.get("/situations", async(req: Request, res: Response) =>{
  try{
    //obter o repositório da entidade situation
    const situationRepository = AppDataSource.getRepository(Situation)
    //recuperar todas as situações do banco de dados
    const situations = await situationRepository.find() //await indica para esperar recuperar os registros antes de ir pra proxima linha 
    //retornar as situações como resposta
    res.status(200).json(situations)
    return

  } catch(error){
    //retornar mensagem de erro
    res.status(500).json({
      message: "Erro ao listar as situações!",
    })
    return
  }
})
//criar a rota POST  Create 
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