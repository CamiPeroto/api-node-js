// Importar a biblioteca Express
import express, { Request, Response} from "express";
// Importar a conexão com banco de dados
import { AppDataSource } from "../data-source";
// Importar a entidade
import { ProductCategory } from "../entity/ProductCategory";

// Criar a aplicação Express
const router = express.Router();

//Criar rota para listar as situações
router.get("/product-categories", async(req: Request, res: Response) =>{
  try{
    // Criar uma instância do repositório de ProductSituation
    const productCategoryRepository = AppDataSource.getRepository(ProductCategory)
    //recuperar todas as situações do banco de dados
    const productCategories = await productCategoryRepository.find() //await indica para esperar recuperar os registros antes de ir pra proxima linha 
    //retornar as situações como resposta
    res.status(200).json(productCategories)
    return
  } catch(error){
    //retornar mensagem de erro
    res.status(500).json({
      message: "Erro ao listar as categorias!",
    })
    return
  }
})

    //Rota para visualizar a categoria
    router.get("/product-categories/:id", async (req: Request, res: Response) => {
       try {
    //obter o id da situação a partir dos parametros da requisição
    const { id } = req.params;
    //obter o repositório da entidade ProductCategory
    const productCategoryRepository = AppDataSource.getRepository(ProductCategory);
    //buscar a situação no banco de dados pelo ID
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

// Criar a rota create
router.post("/product-categories", async (req: Request, res: Response) => {
   
    try{
        //receber os dados enviados no corpo da requisição
          var data = req.body
        // Criar uma instância do repositório de ProductCategory
        const productCategoryRepository = AppDataSource.getRepository(ProductCategory)

        // Criar um novo registro de situação (dados simulados)
        const newProductCategory = productCategoryRepository.create(data);

        // Salvar o registro no banco de dados
        await productCategoryRepository.save(newProductCategory);

        // Retornar resposta de sucesso
        res.status(201).json({
            message: "Categoria cadastrada com sucesso!",
            situation: newProductCategory,
        });
    }catch(error){
        // Retornar erro em caso de falha
        console.log(error);
        res.status(500).json({
            message: "Erro ao cadastrar categoria!",
        });
    }
});

// Exportar a instrução que está dentro da constante router 
export default router;