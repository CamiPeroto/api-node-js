// Importar a biblioteca Express
import express, { Request, Response } from "express";
// Importar a conexão com banco de dados
import { AppDataSource } from "../data-source";
// Importar a entidade
import { Product } from "../entity/Product";
// Importar o serviço de paginação
import { PaginationService } from "../services/PaginationService";
// Importar a biblioteca para validar os dados para cadastrar e editar.
import * as yup from 'yup';
// Importar a biblioteca para converter o slug automaticamente antes de salvar no banco de dados.
import slugify from "slugify";
// Importar o Not para utilizar como restrição para ignorar o próprio id na consulta
import { Not } from "typeorm";
import { verifyToken } from "../middlewares/authMiddleware";


// Criar a aplicação Express
const router = express.Router();

// Criar a rota para listar os produtos
// Endereço para acessar a api através da aplicação externa com o verbo GET: http://localhost:8080/products?page=1&limit=10
router.get("/products", verifyToken, async (req: Request, res: Response) => {
    try {

        // Obter o repositório da entidade Product
        const productRepository = AppDataSource.getRepository(Product);

        // Receber o número da página e definir página 1 como padrão
        const page = Number(req.query.page) || 1;

        // Definir o limite de registros por página
        const limit = Number(req.query.limit) || 10;

        // Usar o serviço de paginação
        const result = await PaginationService.paginate(productRepository, page, limit, { id: "DESC" });

        // Retornar a resposta com os dados e informações da paginação
        res.status(200).json(result);
        return;
    } catch (error) {
        // Retornar erro em caso de falha
        res.status(500).json({
            message: "Erro ao listar os produtos!",
        });
        return;
    }
});

// Rota para visualizar um produto específico
// Endereço para acessar a api através da aplicação externa com o verbo GET: http://localhost:8080/products/:id
router.get("/products/:id", verifyToken, async (req: Request, res: Response) => {
    try {

        // Obter o ID do produto a partir dos parâmetros da requisição
        const { id } = req.params;

        // Obter o repositório da entidade Product
        const productRepository = AppDataSource.getRepository(Product)

        // Buscar o produto no banco de dados pelo ID
        const product = await productRepository.findOneBy({ id: parseInt(id) });

        // Verificar se o produto foi encontrado
        if (!product) {
            res.status(404).json({
                message: "Produto não encontrada!",
            });
            return;
        }

        // Retornar o produto encontrado
        res.status(200).json(product);
        return;

    } catch (error) {
        // Retornar erro em caso de falha
        res.status(500).json({
            message: "Erro ao visualizar o produto!",
        });
    }
});

// Criar a rota para cadastrar produto
// Endereço para acessar a api através da aplicação externa com o verbo POST: http://localhost:8080/products
// A aplicação externa deve indicar que está enviado os dados em formato de objeto: Content-Type: application/json
// Dados em formato de objeto
/*
{
    "name": "Curso de Node.js",
    "description": "No Curso de Node.js é abordado o desenvolvimento ...",
    "price": 497.15,
    "situation": 1,
    "category": 1
}
*/
router.post("/products", verifyToken, async (req: Request, res: Response) => {
    try {
        // Receber os dados enviados no corpo da requisição
        var data = req.body;
        // Validar os dados utilizando o yup
        const schema = yup.object().shape({
            name: yup
                .string()
                .required("O campo nome é obrigatório!")
                .min(3, "O campo nome deve ter no mínimo 3 caracteres!")
                .max(255, "O campo nome deve ter no máximo 255 caracteres!"), // Limite opcional
            
            slug: yup
                .string()
                .required("O campo slug é obrigatório!")
                .min(3, "O campo slug deve ter no mínimo 3 caracteres!")
                .max(255, "O campo slug deve ter no máximo 255 caracteres!"),
            description: yup
                .string()
                .required("O campo descrição é obrigatório!")
                .min(10, "A descrição deve ter pelo menos 10 caracteres!"), // Ajuste conforme necessário
            price: yup
                .number()
                .typeError("O preço deve ser um número!")
                .required("O campo preço é obrigatório!")
                .positive("O preço deve ser um valor positivo!")
                .test(
                    "is-decimal",
                    "O preço deve ter no máximo duas casas decimais!",
                    (value) => /^\d+(\.\d{1,2})?$/.test(value?.toString() || "")
                ),
            situation: yup
                .number()
                .typeError("A situação deve ser um número!")
                .required("O campo situação é obrigatório!")
                .integer("O campo situação deve ser um número inteiro!")
                .positive("O campo situação deve ser um valor positivo!"),
            category: yup
                .number()
                .typeError("A categoria deve ser um número!")
                .required("O campo categoria é obrigatório!")
                .integer("O campo categoria deve ser um número inteiro!")
                .positive("O campo categoria deve ser um valor positivo!"),
        });

        // Verificar se os dados passaram pela validação
        await schema.validate(data, { abortEarly: false });
        
        // Gerar slug automaticamente com base no nome
        data.slug = slugify(data.slug, { lower: true, strict: true });

        // Criar uma instância do repositório de Product
        const productRepository = AppDataSource.getRepository(Product);
        // Recuperar o registro do banco de dados com o valor da coluna email
        
        const existingProduct = await productRepository.findOne({
            where: { slug: data.slug }
        });

        // Verificar se já existe um produto com o mesmo slug
        if (existingProduct) {
            res.status(400).json({
                message: "Já existe um produto cadastrado com esse slug!",
            });
            return;
        }

        // Criar um novo registro
        const newProduct = productRepository.create(data);
        // Salvar o registro no banco de dados
        const product = await productRepository.save(newProduct);

        // Retornar resposta de sucesso
        res.status(201).json({
            message: "Produto cadastrado com sucesso!",
            product,
        });
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            // Retornar erros de validação
            res.status(400).json({
                message: error.errors
            });
            return;
        }

        // Retornar erro em caso de falha
        res.status(500).json({
            message: "Erro ao cadastrar produto!",
        });
    }
});

// Criar a rota para editar um produto
// Endereço para acessar a API através da aplicação externa com o verbo PUT: http://localhost:8080/products/:id
// A aplicação externa deve indicar que está enviado os dados em formato de objeto: Content-Type: application/json
// Dados em formato de objeto
/*
{
    "name": "Curso de Node.js",
    "description": "No Curso de Node.js é abordado o desenvolvimento ...",
    "price": 497,
    "situation": 1,
    "category": 1
}
*/
router.put("/products/:id", verifyToken, async (req: Request, res: Response) => {

    try {
        // Obter o ID da situação a partir dos parâmetros da requisição
        const { id } = req.params;

        // Receber os dados enviados no corpo da requisição
        const data = req.body;

        // Validar os dados utilizando o yup
        const schema = yup.object().shape({
            name: yup
                .string()
                .required("O campo nome é obrigatório!")
                .min(3, "O campo nome deve ter no mínimo 3 caracteres!")
                .max(255, "O campo nome deve ter no máximo 255 caracteres!"), // Limite opcional

                slug: yup
                .string()
                .required("O campo slug é obrigatório!")
                .min(3, "O campo slug deve ter no mínimo 3 caracteres!")
                .max(255, "O campo slug deve ter no máximo 255 caracteres!"),

                description: yup
                .string()
                .required("O campo descrição é obrigatório!")
                .min(10, "A descrição deve ter pelo menos 10 caracteres!"), // Ajuste conforme necessário

            price: yup
                .number()
                .typeError("O preço deve ser um número!")
                .required("O campo preço é obrigatório!")
                .positive("O preço deve ser um valor positivo!")
                .test(
                    "is-decimal",
                    "O preço deve ter no máximo duas casas decimais!",
                    (value) => /^\d+(\.\d{1,2})?$/.test(value?.toString() || "")
                ),

            situation: yup
                .number()
                .typeError("A situação deve ser um número!")
                .required("O campo situação é obrigatório!")
                .integer("O campo situação deve ser um número inteiro!")
                .positive("O campo situação deve ser um valor positivo!"),

            category: yup
                .number()
                .typeError("A categoria deve ser um número!")
                .required("O campo categoria é obrigatório!")
                .integer("O campo categoria deve ser um número inteiro!")
                .positive("O campo categoria deve ser um valor positivo!"),

        });

        // Verificar se os dados passaram pela validação
        await schema.validate(data, { abortEarly: false });

        // Obter o repositório da entidade Product
        const productRepository = AppDataSource.getRepository(Product);

        // Buscar o produto no banco de dados pelo ID
        const product = await productRepository.findOneBy({ id: parseInt(id) });

        // Verificar se o produto foi encontrado
        if (!product) {
            res.status(404).json({
                message: "Produto não encontrado!",
            });
            return;
        }

        // Gerar slug automaticamente com base no nome
        data.slug = slugify(data.slug, { lower: true, strict: true });

        // Recuperar o registro do banco de dados com o valor da coluna email
        const existingProduct = await productRepository.findOne({
            where: { 
                slug: data.slug, 
                id: Not(parseInt(id)) // Exclui o próprio registro da busca
            }
        });
        // Verificar se já existe um produto com o mesmo slug
        if (existingProduct) {
            res.status(400).json({
                message: "Já existe um produto cadastrado com esse slug!",
            });
            return;
        }

        // Atualizar os dados do produto
        productRepository.merge(product, data);

        // Salvar as alterações no banco de dados
        const updateProduct = await productRepository.save(product);

        // Retornar resposta de sucesso
        res.status(200).json({
            message: "Produto atualizado com sucesso!",
            product: updateProduct
        });

    } catch (error) {
        if (error instanceof yup.ValidationError) {
            // Retornar erros de validação
            res.status(400).json({
                message: error.errors
            });
            return;
        }

        // Retornar erro em caso de falha
        res.status(500).json({
            message: "Erro ao editar produto!",
        });
    }
});

// Criar a rota para apagar um produto
// Endereço para acessar a API através da aplicação externa com o verbo DELETE: http://localhost:8080/products/:id
router.delete("/products/:id", verifyToken, async (req: Request, res: Response) => {
    try {
        // Obter o ID do produto a partir dos parâmetros da requisição
        const { id } = req.params;

        // Obter o repositório da entidade Product
        const productRepository = AppDataSource.getRepository(Product);

        // Buscar o produto no banco de dados pelo ID
        const product = await productRepository.findOneBy({ id: parseInt(id) });

        // Verificar se o produto foi encontrado
        if (!product) {
            res.status(404).json({
                message: "Produto não encontrado!",
            });
            return;
        }

        // Remover o produto do banco de dados
        await productRepository.remove(product);

        // Retornar resposta de sucesso
        res.status(200).json({
            message: "Produto apagado com sucesso!"
        });

    } catch (error) {
        // Retornar erro em caso de falha
        res.status(500).json({
            message: "Erro ao apagar o produto!",
        });
    }
});

// Exportar a instrução que está dentro da constante router 
export default router;