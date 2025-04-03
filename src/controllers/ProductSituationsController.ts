// Importar a biblioteca Express
import express, { Request, Response } from "express";
// Importar a conexão com banco de dados
import { AppDataSource } from "../data-source";
// Importar a entidade
import { ProductSituation } from "../entity/ProductSituation";
import { error } from "console";

// Criar a aplicação Express
const router = express.Router();

//Criar rota para listar as situações
router.get("/product-situations", async (req: Request, res: Response) => {
  try {
    // Criar uma instância do repositório de ProductSituation
    const productSituationRepository = AppDataSource.getRepository(ProductSituation);
    //recuperar todas as situações do banco de dados
    const productSituations = await productSituationRepository.find(); //await indica para esperar recuperar os registros antes de ir pra proxima linha
    //retornar as situações como resposta
    res.status(200).json(productSituations);
    return;
  } catch (error) {
    //retornar mensagem de erro
    res.status(500).json({
      message: "Erro ao listar as situações!",
    });
    return;
  }
});

//Rota para visualizar situação
router.get("/product-situations/:id", async (req: Request, res: Response) => {
  try {
    //obter o id da situação a partir dos parametros da requisição
    const { id } = req.params;
    //obter o repositório da entidade situation
    const productSituationRepository = AppDataSource.getRepository(ProductSituation);
    //buscar a situação no banco de dados pelo ID
    const productSituation = await productSituationRepository.findOneBy({ id: parseInt(id) });
    //verificar se a situação foi encontrada
    if (!productSituation) {
      res.status(404).json({
        message: "Situação não encontrada!",
      });
      return;
    }
    //retornar a situação encontrada
    res.status(200).json(productSituation);
    return;
  } catch {
    //retornar mensagem de erro
    res.status(500).json({
      message: "Erro ao visualizar a situação!",
    });
  }
});

// Criar a rota create
router.post("/product-situations", async (req: Request, res: Response) => {
  try {
    //receber os dados enviados no corpo da requisição
    var data = req.body;

    // obter o repositório ProductSituation
    const productSituationRepository = AppDataSource.getRepository(ProductSituation);

    // Criar um novo registro de situação (dados simulados)
    const newProductSituation = productSituationRepository.create(data);

    // Salvar o registro no banco de dados
    await productSituationRepository.save(newProductSituation);

    // Retornar resposta de sucesso
    res.status(201).json({
      message: "Situação cadastrada com sucesso!",
      situation: newProductSituation,
    });
  } catch (error) {
    // Retornar erro em caso de falha
    console.log(error);
    res.status(500).json({
      message: "Erro ao cadastrar situação!",
    });
  }
});

//Rota para editar
router.put("/product-situations/:id", async (req: Request, res: Response) => {
  try {
    //obter o id da situação usando os parametros da requisição
    const { id } = req.params;
    //receber os dados enviados no body da requsição
    const data = req.body;
    //obter o repositório da entidade situation
    const productSituationRepository = AppDataSource.getRepository(ProductSituation);
    //buscar a situação no banco de dados pelo ID
    const productSituation = await productSituationRepository.findOneBy({ id: parseInt(id) });
    //verificar se a situação foi encontrada
    if (!productSituation) {
      res.status(404).json({
        message: "Situação não encontrada!",
      });
      return;
    }
    //Atualizar os dados da situação
    productSituationRepository.merge(productSituation, data);
    //salvar as alterações no banco de dados
    const updateProductSituation = await productSituationRepository.save(productSituation);
    //retornar resposta de sucesso
    res.status(200).json({
      message: "Situação atualizada com sucesso!",
      productSituation: updateProductSituation,
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
router.delete("/product-situations/:id", async (req: Request, res: Response) => {
  try {
    //obter o id da situação usando os parametros da requisição
    const { id } = req.params;
    //obter o repositório da entidade
    const productSituationRepository = AppDataSource.getRepository(ProductSituation);
    //buscar a situação no banco pelo ID
    const productSituation = await productSituationRepository.findOneBy({ id: parseInt(id) });
    //verificar se a situação foi encontrada
    if (!productSituation) {
      res.status(404).json({
        message: "Situação não encontrada!",
      });
      return;
    }
    //remover a situação do banco de dados
    await productSituationRepository.remove(productSituation);
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

// Exportar a instrução que está dentro da constante router
export default router;
