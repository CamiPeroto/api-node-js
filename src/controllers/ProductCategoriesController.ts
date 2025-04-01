// Importar a biblioteca Express
import express, { Request, Response} from "express";
// Importar a conexão com banco de dados
import { AppDataSource } from "../data-source";
// Importar a entidade
import { ProductCategory } from "../entity/ProductCategory";

// Criar a aplicação Express
const router = express.Router();

// Criar a rota GET principal
router.get("/product-categories", async (req: Request, res: Response) => {
   
    try{
        // Criar uma instância do repositório de ProductCategory
        const productCategoryRepository = AppDataSource.getRepository(ProductCategory)

        // Criar um novo registro de situação (dados simulados)
        const newProductCategory = productCategoryRepository.create({
            name: "Apartamento", // Valor fixo para simular o cadastro
        });

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