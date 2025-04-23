// Importar a biblioteca Express
import express, { Request, Response } from "express";
// Importar a conexão com banco de dados
import { AppDataSource } from "../data-source";
// Importar a entidade
import { ProductCategory } from "../entity/ProductCategory";
import { error } from "console";
import { PaginationService } from "../services/PaginationService";
import * as yup from "yup"; // biblioteca para validar od dados antes de cadastrar e editar
import { Not } from "typeorm";
import { verifyToken } from "../middlewares/authMiddleware";

// Criar a aplicação Express
const router = express.Router();

//Criar rota para listar as categorias
router.get("/product-categories", verifyToken, async (req: Request, res: Response) => {
  try {
    // Criar uma instância do repositório de ProductCategory
    const productCategoryRepository = AppDataSource.getRepository(ProductCategory);
    //recuperar todas as categorias do banco de dados
      //Receber o número da página e definir pagina 1 como padrão
      const page = Number(req.query.page) || 1;
      //definir o limite de 10 resgistros por página
      const limit = Number(req.query.limit) || 10;
      //usar o serviço de paginação
    const result = await PaginationService.paginate(productCategoryRepository, page, limit, {id: "ASC"});
    //retornar a resposta com os dados e informações da paginação
    res.status(200).json(result);
    return;
  } catch (error) {
    //retornar mensagem de erro
    res.status(500).json({
      message: "Erro ao listar as categorias!",
    });
    return;
  }
});

//Rota para visualizar a categoria
router.get("/product-categories/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    //obter o id da categoria a partir dos parametros da requisição
    const { id } = req.params;
    //obter o repositório da entidade ProductCategory
    const productCategoryRepository = AppDataSource.getRepository(ProductCategory);
    //buscar a categoria no banco de dados pelo ID
    const productCategory = await productCategoryRepository.findOneBy({ id: parseInt(id) });
    //verificar se a categoria foi encontrada
    if (!productCategory) {
      res.status(404).json({
        message: "Categoria não encontrada!",
      });
      return;
    }
    //retornar a categoria encontrada
    res.status(200).json(productCategory);
    return;
  } catch {
    //retornar mensagem de erro
    res.status(500).json({
      message: "Erro ao visualizar a categoria!",
    });
  }
});
// Rota create
router.post("/product-categories", verifyToken, async (req: Request, res: Response) => {
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
    // Criar uma instância do repositório de ProductCategory
    const productCategoryRepository = AppDataSource.getRepository(ProductCategory);
  
    //recuperar o registro do banco de dados com o valor da coluna nameSituation 
    const existingCategory = await productCategoryRepository.findOne({
      where: {name: data.name}});
    //verificar se já existe uma situação com o mesmo nome 
      if (existingCategory){
        res.status(400).json({
          message: "Já existe uma situação cadastrada com esse nome!",
        });
        return;
      }

    // Criar um novo registro de categoria (dados simulados)
    const newProductCategory = productCategoryRepository.create(data);

    // Salvar o registro no banco de dados
    await productCategoryRepository.save(newProductCategory);

    // Retornar resposta de sucesso
    res.status(201).json({
      message: "Categoria cadastrada com sucesso!",
      category: newProductCategory,
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
      message: "Erro ao cadastrar categoria!",
    });
  }
});
//Rota para editar
router.put("/product-categories/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    //obter o id da categoria usando os parametros da requisição
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
    //obter o repositório da entidade category
    const productCategoryRepository = AppDataSource.getRepository(ProductCategory);
    //buscar a categoria no banco de dados pelo ID
    const productCategory = await productCategoryRepository.findOneBy({ id: parseInt(id) });
    //verificar se a categoria foi encontrada
    if (!productCategory) {
      res.status(404).json({
        message: "Categoria não encontrada!",
      });
      return;
    }
       // Verificar se já existe outra situação com o mesmo nome, mas que não seja o registro atual
       const existingProductCategory = await productCategoryRepository.findOne({
        where: {
            name: data.name,
            id: Not(parseInt(id)), // Exclui o próprio registro da busca
        },
    });
  
    if (existingProductCategory) {
        res.status(400).json({
            message: "Já existe uma categoria cadastrada com esse nome!",
        });
        return;
    }
    //Atualizar os dados da categoria
    productCategoryRepository.merge(productCategory, data);
    //salvar as alterações no banco de dados
    const updateProductCategory = await productCategoryRepository.save(productCategory);
    //retornar resposta de sucesso
    res.status(200).json({
      message: "Categoria atualizada com sucesso!",
      productCategory: updateProductCategory,
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
router.delete("/product-categories/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    //obter o id da categoria usando os parametros da requisição
    const { id } = req.params;
    //obter o repositório da entidade
    const productCategoryRepository = AppDataSource.getRepository(ProductCategory);
    //buscar a categoria no banco pelo ID
    const productCategory = await productCategoryRepository.findOneBy({ id: parseInt(id) });
    //verificar se a categoria foi encontrada
    if (!productCategory) {
      res.status(404).json({
        message: "Categoria não encontrada!",
      });
      return;
    }
    //remover a categoria do banco de dados
    await productCategoryRepository.remove(productCategory);
    //retornar mensagem de sucesso
    res.status(200).json({
      message: "Categoria excluída com sucesso!",
    });
  } catch {
    //retornar qual o erro em caso de falha
    console.log(error);
    //retornar mensagem de erro
    res.status(500).json({
      message: "Erro ao excluir a categoria!",
    });
  }
});

// Exportar a instrução que está dentro da constante router
export default router;
