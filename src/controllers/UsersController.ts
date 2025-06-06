//importar biblioteca express
import express, { Request, Response } from "express";
//importar a conexão com o banco de dados
import { AppDataSource } from "../data-source";
//importar a entidade
import { User } from "../entity/User";
import { error } from "console";
//importar o serviço de paginação
import { PaginationService } from "../services/PaginationService";
import * as yup from "yup"; // biblioteca para validar od dados antes de cadastrar e editar
import { Not } from "typeorm";
//importar middleware de autenticação
import { verifyToken } from "../middlewares/authMiddleware";

//criar aplicação express
const router = express.Router();

// rota para listar os usuários 
router.get("/users", verifyToken, async (req: Request, res: Response) => {
  try {
    // //função para aguardar 3 segundos e ver o spinner
    //   const delay = (ms:number)=>new Promise(resolve=> setTimeout(resolve, ms));
    //   await delay(3000);
    //obter o repositório da entidade user
    const userRepository = AppDataSource.getRepository(User);
    //Receber o número da página e definir pagina 1 como padrão
    const page = Number(req.query.page) || 1;
    //definir o limite de 10 resgistros por página
    const limit = Number(req.query.limit) || 10;
    //usar o serviço de paginação
    const result = await PaginationService.paginate(userRepository, page, limit, { id: "ASC" }, ["situation"]);
    //retornar a resposta com os dados e informações da paginação
    res.status(200).json(result);
    return;
  } catch (error) {
    //retornar mensagem de erro
    res.status(500).json({
      message: "Erro ao listar os usuários!",
    });
    return;
  }
});
//rota para visualizar usuário específico
router.get("/users/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    //obter o id da usuário a partir dos parametros da requisição
    const { id } = req.params;
    //obter o repositório da entidade user
    const userRepository = AppDataSource.getRepository(User);
    //buscar a usuário no banco de dados pelo ID
    const user = await userRepository.findOne({
      relations: ["situation"],
      where: { id: parseInt(id)}
      });
    //verificar se a usuário foi encontrada
    if (!user) {
      res.status(404).json({
        message: "Usuário não encontrado!",
      });
      return;
    }
    //retornar usuário encontrado
    res.status(200).json(user);
    return;
  } catch {
    //retornar qual o erro em caso de falha
    console.log(error);
    //retornar mensagem de erro
    res.status(500).json({
      message: "Erro ao visualizar usuário!",
    });
  }
});
//criar usuários
router.post("/users", verifyToken, async (req: Request, res: Response) => {
  try {
    //receber os dados enviados no corpo da requisição
    var data = req.body;
    //validar os dados utilizando yup
    const schema = yup.object().shape({
      name: yup
        .string()
        .required("O campo nome é obrigatório")
        .min(3, "O campo nome deve ter no mínimo 3 caracteres"),
      email:yup
        .string()
        .email("E-mail inválido")
        .required("O campo email é obrigatório!"),
      password: yup
        .string()
        .required("O campo senha é obrigatório")
        .min(6, "O campo senha deve ter no mínimo 6 caracteres"),
      situation:yup
        .number()
        .required("O campo situação é obrigatório!"),
    });
    //verificar se os dados passaram pela validação
    await schema.validate(data, { abortEarly: false });
    //criar uma instancia do repositorio user
    const userRepository = AppDataSource.getRepository(User);
    //recuperar o registro do banco de dados com o valor da coluna email
    const existingUser = await userRepository.findOne({
      where: {email: data.email}
    });
    //Verificar se já existe usuário com esse email
    if(existingUser){
        res.status(400).json({
            message: "Já existe um usuário com esse e-mail. Tente outro."
        });
        return;
    }
    // //criptografar a senha antes de salvar
    //  data.password = await bcrypt.hash(data.password, 10); comentado pois implementei na entidade

    //criar novo registro de usuário(dados simulados)
    const newUser = userRepository.create(data);
    //salvar o registro no banco de dados
    await userRepository.save(newUser);

    //retornar resposta de sucesso
    res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      user: newUser,
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
      message: "Erro ao cadastrar usuário!",
    });
  }
});
//Rota para editar 
router.put("/users/:id", verifyToken, async (req: Request, res: Response) => {
    try {
     //obter o id da situação usando os parametros da requisição
      const { id } = req.params;
      //receber os dados enviados no corpo da requisição
      const data = req.body;
      //validar os dados utilizando yup
      const schema = yup.object().shape({
        name: yup.string()
        .required("O campo nome é obrigatório")
        .min(3, "O campo nome deve ter no mínimo 3 caracteres"),
        email:yup.string().email("E-mail inválido").required("O campo email é obrigatório!"),
        situation:yup.number().required("O campo situação é obrigatório!"),
      });
      //verificar se os dados passaram pela validação
      await schema.validate(data, { abortEarly: false });
      //criar uma instancia do repositorio user
      const userRepository = AppDataSource.getRepository(User);
      //recuperar o registro do banco de dados com o valor da coluna email
      const user = await userRepository.findOneBy({ id: parseInt(id) });
       //verificar se o usuário foi encontrado
    if (!user) {
        res.status(404).json({
          message: "Usuário não encontrado na base de dados!",
        });
        return;
      }
      // Verificar se já existe outra situação com o mesmo nome, mas que não seja o registro atual
    const existingUser = await userRepository.findOne({
        where: {
            email: data.email,
            id: Not(parseInt(id)), // Exclui o próprio registro da busca
        },
    });
    if (existingUser) {
        res.status(400).json({
            message: "Já existe um usuário cadastrado com esse e-mail!",
        });
        return;
    }
    //Atualizar os dados do usuário
    userRepository.merge(user, data);
    //salvar as alterações no banco de dados
    const updateUser = await userRepository.save(user);
    //retornar resposta de sucesso
    res.status(200).json({
      message: "Usuário atualizado com sucesso!",
      user: updateUser,
    });
    return;
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
        message: "Erro ao editar usuário!",
      });
    }
});
//rota para editar senha
router.put("/users-password/:id", verifyToken, async (req: Request, res: Response) => {

  try {
      // Obter o ID da situação a partir dos parâmetros da requisição
      const { id } = req.params;

      // Receber os dados enviados no corpo da requisição
      const data = req.body;

      // Validar os dados utilizando o yup
      const schema = yup.object().shape({
          password: yup.string().required("O campo senha é obrigatório!").min(6, "A senha deve ter no mínimo 6 caracteres!"),
      });

      // Verificar se os dados passaram pela validação
      await schema.validate(data, { abortEarly: false });

      // Obter o repositório da entidade User
      const userRepository = AppDataSource.getRepository(User);

      // Buscar o usuário no banco de dados pelo ID
      const user = await userRepository.findOneBy({ id: parseInt(id) });

      // Verificar se o usuário foi encontrado
      if (!user) {
          res.status(404).json({
              message: "Usuário não encontrado!",
          });
          return;
      }

      // // Criptografar a senha antes de salvar
      // data.password = await bcrypt.hash(data.password, 10);

      // Atualizar os dados do usuário
      userRepository.merge(user, data);

      // Salvar as alterações no banco de dados
      const updateUser = await userRepository.save(user);

      // Retornar resposta de sucesso
      res.status(200).json({
          message: "Senha do usuário atualizado com sucesso!",
          user: updateUser
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
          message: "Erro ao editar a senha do usuário!",
      });
  }
});
//rota para excluir
router.delete("/users/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    //obter o id da usuário usando os parametros da requisição
    const { id } = req.params;
    //obter o repositório da entidade
    const userRepository = AppDataSource.getRepository(User);
    //buscar a usuário no banco pelo ID
    const user = await userRepository.findOneBy({ id: parseInt(id) });
    //verificar se a usuário foi encontrada
    if (!user) {
      res.status(404).json({
        message: "Usuário não encontrado!",
      });
      return;
    }
    //remover a usuário do banco de dados
    await userRepository.remove(user);
    //retornar mensagem de sucesso
    res.status(200).json({
      message: "Usuário excluído com sucesso!",
    });
  } catch {
    //retornar qual o erro em caso de falha
    console.log(error);
    //retornar mensagem de erro
    res.status(500).json({
      message: "Erro ao excluir o usuário!",
    });
  }
});

export default router;
