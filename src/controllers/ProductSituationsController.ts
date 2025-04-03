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
    //Receber o número da página e definir pagina 1 como padrão
    const page = Number(req.query.page) || 1;
    //definir o limite de 10 resgistros por página
    const limit = 10;
    //contar o total de registros no banco de dados
    const totalProductSituations = await productSituationRepository.count();
    //verificar se existem registros
    if (totalProductSituations === 0) {
      res.status(400).json({
        message: "Nenhuma situação encontrada!",
      });
      return;
    }
    //calcular a ultima página
    const lastPage = Math.ceil(totalProductSituations / limit);
    //verificar se a página solicitada é valida
    if (page > lastPage) {
      res.status(400).json({
        message: `Página inválida. O total de páginas é ${lastPage}`,
      });
      return;
    }
    //calcular offset (a partir de qual registro começar a busca)
    const offset = (page - 1) * limit;
    // recuperar as situações do banco de dados com paginação
    const productSituations = await productSituationRepository.find({
      take: limit,
      skip: offset,
      order: { id: "DESC" },
    });
    //retornar a resposta com os dados e informações da paginação
    res.status(200).json({ currentPage: page, lastPage, totalProductSituations, productSituations });
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
// Rota para criar
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
