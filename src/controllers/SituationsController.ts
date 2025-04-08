//importar biblioteca express
import express, { Request, Response } from "express";
//importar a conexão com o banco de dados
import { AppDataSource } from "../data-source";
//importar a entidade
import { Situation } from "../entity/Situation";
import { error } from "console";
//importar o serviço de paginação
import { PaginationService } from "../services/PaginationService";
import * as yup from "yup"; // biblioteca para validar od dados antes de cadastrar e editar

//criar aplicação express
const router = express.Router();

//Criar rota para listar as situações /situatiions?page=1&limit=10
router.get("/situations", async (req: Request, res: Response) => {
  try {
    //obter o repositório da entidade situation
    const situationRepository = AppDataSource.getRepository(Situation);
    //Receber o número da página e definir pagina 1 como padrão
    const page = Number(req.query.page) || 1;
    //definir o limite de 10 resgistros por página
    const limit = Number(req.query.limit) || 10;
    //usar o serviço de paginação
    const result = await PaginationService.paginate(situationRepository, page, limit, { id: "ASC" });
    //retornar a resposta com os dados e informações da paginação
    res.status(200).json(result);
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
    //validar os dados utilizando yup
    const schema = yup.object().shape({
      nameSituation: yup.string()
      .required("O campo nome é obrigatório")
      .min(3, "O campo nome deve ter no mínimo 3 caracteres"),
    });
    //verificar se os dados passaram pela validação
    await schema.validate(data, { abortEarly: false });
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
    if(error instanceof yup.ValidationError){
      //Retornar erros de validação
      res.status(400).json({
        message: error.errors
      });
      return;
    }
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
router.delete("/situations/:id", async (req: Request, res: Response) => {
  try {
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
      message: "Situação excluída com sucesso!",
    });
  } catch {
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
