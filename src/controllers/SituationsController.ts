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
router.get("/situations", async (req: Request, res: Response) => {
  try {
    //obter o repositório da entidade situation
    const situationRepository = AppDataSource.getRepository(Situation);
    //recuperar todas as situações do banco de dados
    const situations = await situationRepository.find(); //await indica para esperar recuperar os registros antes de ir pra proxima linha
    //retornar as situações como resposta
    res.status(200).json(situations);
    return;
  } catch (error) {
    //retornar mensagem de erro
    res.status(500).json({
      message: "Erro ao listar as situações!",
    });
    return;
  }
});
//rota para visualizar situação
router.get("/situations/:id", async (req: Request, res: Response) => {
  try {
    //obter o id da situação a partir dos parametros da requisição
    const { id } = req.params;
    //obter o repositório da entidade situation
    const situationRepository = AppDataSource.getRepository(Situation);
    //buscar a situação no banco de dados pelo ID
    const situation = await situationRepository.findOneBy({ id: parseInt(id) });
    //verificar se a situação foi encontrada
    if (!situation) {
      res.status(404).json({
        message: "Situação não encontrada!",
      });
      return;
    }
    //retornar a situação encontrada
    res.status(200).json(situation);
    return;
  } catch {
    //retornar qual o erro em caso de falha
    console.log(error);
    //retornar mensagem de erro
    res.status(500).json({
      message: "Erro ao visualizar a situação!",
    });
  }
});
//criar a rota POST  Create
router.post("/situations", async (req: Request, res: Response) => {
  try {
    //receber os dados enviados no corpo da requisição
    var data = req.body;
    //criar uma instancia do repositorio situação
    const situationRepository = AppDataSource.getRepository(Situation);
    //criar novo egistro de situação(dados simulados)
    const newSituation = situationRepository.create(data);
    //salvar o registro no banco de dados
    await situationRepository.save(newSituation);

    //retornar resposta de sucesso
    res.status(201).json({
      message: "Situação cadastrada com sucesso!",
      situation: newSituation,
    });
  } catch (error) {
    //retornar qual o erro em caso de falha
    console.log(error);
    //retornar mensagem de erro
    res.status(500).json({
      message: "Erro ao cadastrar a situação!",
    });
  }
});

//Rota para editar
router.put("/situations/:id", async (req: Request, res: Response) => {
  try {
    //obter o id da situação usando os parametros da requisição
    const { id } = req.params;
    //receber os dados enviados no body da requsição
    const data = req.body;
    //obter o repositório da entidade situation
    const situationRepository = AppDataSource.getRepository(Situation);
    //buscar a situação no banco de dados pelo ID
    const situation = await situationRepository.findOneBy({ id: parseInt(id) });
    //verificar se a situação foi encontrada
    if (!situation) {
      res.status(404).json({
        message: "Situação não encontrada!",
      });
      return;
    }
    //Atualizar os dados da situação
    situationRepository.merge(situation, data);
    //salvar as alterações no banco de dados
    const updateSituation = await situationRepository.save(situation);
    //retornar resposta de sucesso
    res.status(200).json({
      message: "Situação atualizada com sucesso!",
      situation: updateSituation,
    });
    return;
  } catch (error) {
    //retornar qual o erro em caso de falha
    console.log(error);
    //retornar mensagem de erro
    res.status(500).json({
      message: "Erro ao editar a situação!",
    });
  }
});

//rota para excluir
router.delete("/situations/:id", async (req: Request, res: Response)=>{

try{
   //obter o id da situação usando os parametros da requisição
   const { id } = req.params;
    //obter o repositório da entidade 
    const situationRepository = AppDataSource.getRepository(Situation);
    //buscar a situação no banco pelo ID
    const situation = await situationRepository.findOneBy({ id: parseInt(id) });
    //verificar se a situação foi encontrada
    if (!situation) {
      res.status(404).json({
        message: "Situação não encontrada!",
      });
      return;
    }
    //remover a situação do banco de dados 
    await situationRepository.remove(situation);
    //retornar mensagem de sucesso
    res.status(200).json({
      message: "Situação excluída com sucesso!"
    });
} catch{
  //retornar qual o erro em caso de falha
  console.log(error);
  //retornar mensagem de erro
  res.status(500).json({
    message: "Erro ao excluir a situação!",
  });
}
});
//Exportar a instrução que está dentro da constante router
export default router;
