// Importar a biblioteca Express
import express, { Request, Response} from "express";
// Importar a conexão com banco de dados
import { AppDataSource } from "../data-source";
// Importar a entidade
import { ProductSituation } from "../entity/ProductSituation";

// Criar a aplicação Express
const router = express.Router();

//Criar rota para listar as situações
router.get("/product-situations", async(req: Request, res: Response) =>{
  try{
    // Criar uma instância do repositório de ProductSituation
    const productSituationRepository = AppDataSource.getRepository(ProductSituation)
    //recuperar todas as situações do banco de dados
    const productSituations = await productSituationRepository.find() //await indica para esperar recuperar os registros antes de ir pra proxima linha 
    //retornar as situações como resposta
    res.status(200).json(productSituations)
    return

  } catch(error){
    //retornar mensagem de erro
    res.status(500).json({
      message: "Erro ao listar as situações!",
    })
    return
  }
})

// Criar a rota create 
router.post("/product-situations", async (req: Request, res: Response) => {
   
    try{
         //receber os dados enviados no corpo da requisição
        var data = req.body

        // obter o repositório ProductSituation
        const productSituationRepository = AppDataSource.getRepository(ProductSituation)

        // Criar um novo registro de situação (dados simulados)
        const newProductSituation = productSituationRepository.create(data);

        // Salvar o registro no banco de dados
        await productSituationRepository.save(newProductSituation);

        // Retornar resposta de sucesso
        res.status(201).json({
            message: "Situação cadastrada com sucesso!",
            situation: newProductSituation,
        });
    }catch(error){
        // Retornar erro em caso de falha
        console.log(error);
        res.status(500).json({
            message: "Erro ao cadastrar situação!",
        });
    }
});

// Exportar a instrução que está dentro da constante router 
export default router;