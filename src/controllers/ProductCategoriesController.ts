// Importar a biblioteca Express
import express, { Request, Response} from "express";
// Importar a conexão com banco de dados
import { AppDataSource } from "../data-source";
// Importar a entidade
import { ProductCategory } from "../entity/ProductCategory";
import { error } from "console";

// Criar a aplicação Express
const router = express.Router();

//Criar rota para listar as categorias
router.get("/product-categories", async(req: Request, res: Response) =>{
  try{
    // Criar uma instância do repositório de ProductCategory
    const productCategoryRepository = AppDataSource.getRepository(ProductCategory)
    //recuperar todas as categorias do banco de dados
    const productCategories = await productCategoryRepository.find() //await indica para esperar recuperar os registros antes de ir pra proxima linha 
    //retornar as categorias como resposta
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

// Criar a rota create
router.post("/product-categories", async (req: Request, res: Response) => {
   
    try{
        //receber os dados enviados no corpo da requisição
          var data = req.body
        // Criar uma instância do repositório de ProductCategory
        const productCategoryRepository = AppDataSource.getRepository(ProductCategory)

        // Criar um novo registro de categoria (dados simulados)
        const newProductCategory = productCategoryRepository.create(data);

        // Salvar o registro no banco de dados
        await productCategoryRepository.save(newProductCategory);

        // Retornar resposta de sucesso
        res.status(201).json({
            message: "Categoria cadastrada com sucesso!",
            category: newProductCategory,
        });
    }catch(error){
        // Retornar erro em caso de falha
        console.log(error);
        res.status(500).json({
            message: "Erro ao cadastrar categoria!",
        });
    }
});

//Rota para editar
router.put("/product-categories/:id", async (req: Request, res: Response) => {
  try {
    //obter o id da categoria usando os parametros da requisição
    const { id } = req.params;
    //receber os dados enviados no body da requsição
    const data = req.body;
    //obter o repositório da entidade category
    const productCategoryRepository = AppDataSource.getRepository(ProductCategory);
    //buscar a categoria no banco de dados pelo ID
    const productCategory = await productCategoryRepository.findOneBy({ id: parseInt(id)});
    //verificar se a categoria foi encontrada
    if(!productCategory){
      res.status(404).json({
        message: "Categoria não encontrada!",
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
      productCategory: updateProductCategory
    });
    return;

  } catch (error) {
    //retornar qual o erro em caso de falha
    console.log(error);
    //retornar mensagem de erro
    res.status(500).json({
      message: "Erro ao editar a categoria!",
    });
  }
});

//rota para excluir
router.delete("/product-categories/:id", async (req: Request, res: Response)=>{

  try{
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
        message: "Categoria excluída com sucesso!"
      });
  } catch{
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