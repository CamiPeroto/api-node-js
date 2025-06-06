// Importar a biblioteca Express
import express, { Request, Response } from "express";
// Importar a conexão com banco de dados
import { AppDataSource } from "../data-source";
// Importar a entidade
import { ProductSituation } from "../entity/ProductSituation";
import { error } from "console";
import { PaginationService } from "../services/PaginationService";
import * as yup from "yup"; // biblioteca para validar od dados antes de cadastrar e editar
import { Not } from "typeorm";
import { verifyToken } from "../middlewares/authMiddleware";

// Criar a aplicação Express
const router = express.Router();

//Criar rota para listar as situações
router.get("/product-situations", verifyToken, async (req: Request, res: Response) => {
  try {
    // Criar uma instância do repositório de ProductSituation
    const productSituationRepository = AppDataSource.getRepository(ProductSituation);
    //Receber o número da página e definir pagina 1 como padrão
    const page = Number(req.query.page) || 1;
    //definir o limite de 10 resgistros por página
    const limit = Number(req.query.limit) || 10;
    //usar o serviço de paginação
    const result = await PaginationService.paginate(productSituationRepository, page, limit, {id: "ASC"});
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

//Rota para visualizar situação
router.get("/product-situations/:id", verifyToken, async (req: Request, res: Response) => {
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
router.post("/product-situations", verifyToken, async (req: Request, res: Response) => {
  try {
    //receber os dados enviados no corpo da requisição
    var data = req.body;
     //validar os dados utilizando yup
        const schema = yup.object().shape({
          name: yup.string()
          .required("O campo nome é obrigatório")
          .min(3, "O campo nome deve ter no mínimo 3 caracteres"),
        });
        //verificar se os dados passaram pela validação
        await schema.validate(data, { abortEarly: false });

    // obter o repositório ProductSituation
    const productSituationRepository = AppDataSource.getRepository(ProductSituation);
     
    //recuperar o registro do banco de dados com o valor da coluna nameSituation 
     const existingProductSituation = await productSituationRepository.findOne({
      where: {name: data.name}});
    //verificar se já existe uma situação com o mesmo nome 
      if (existingProductSituation){
        res.status(400).json({
          message: "Já existe uma situação cadastrada com esse nome!",
        });
        return;
      }
      

    // Criar um novo registro de situação (dados simulados)
    const newProductSituation = productSituationRepository.create(data);

    // Salvar o registro no banco de dados
    const productSituation = await productSituationRepository.save(newProductSituation);

    // Retornar resposta de sucesso
    res.status(201).json({
      message: "Situação cadastrada com sucesso!",
      productSituation,
    });
  } catch (error) {
     if(error instanceof yup.ValidationError){
          //Retornar erros de validação
          res.status(400).json({
            message: error.errors
          });
          return;
        }
    // Retornar erro em caso de falha
    console.log(error);
    res.status(500).json({
      message: "Erro ao cadastrar situação!",
    });
  }
});
//Rota para editar
router.put("/product-situations/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    //obter o id da situação usando os parametros da requisição
    const { id } = req.params;
    //receber os dados enviados no body da requsição
    const data = req.body;
     // Validar os dados utilizando o yup
            const schema = yup.object().shape({
              name: yup.string()
                  .required("O campo nome é obrigatório!")
                  .min(3, "O campo nome deve ter no mínimo 3 caracteres!"),
          });
       // Verificar se os dados passaram pela validação
      await schema.validate(data, { abortEarly: false });
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
    // Verificar se já existe outra situação com o mesmo nome, mas que não seja o registro atual
    const existingProductSituation = await productSituationRepository.findOne({
      where: {
          name: data.name,
          id: Not(parseInt(id)), // Exclui o próprio registro da busca
      },
  });

  if (existingProductSituation) {
      res.status(400).json({
          message: "Já existe uma situação cadastrada com esse nome!",
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
    if (error instanceof yup.ValidationError) {
         res.status(400).json({
           message: error.errors
         });
         return;
       }
       res.status(500).json({
         message: "Erro ao editar situação!",
    });
  }
});
//rota para excluir
router.delete("/product-situations/:id", verifyToken, async (req: Request, res: Response) => {
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
