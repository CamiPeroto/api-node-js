
//importar biblioteca express
import express, { Request, Response } from "express";
//importar a conexão com o banco de dados
import { AppDataSource } from "../data-source";
//importar a entidade
import { User } from "../entity/User";
import * as yup from "yup";
import crypto from "crypto"
import { AuthService } from "../services/AuthService";
import nodemailer from "nodemailer";
import { verifyToken } from "../middlewares/authMiddleware";

//criar aplicação express
const router = express.Router();

//criar a rota para realizar o login
router.post("/", async (req: Request, res: Response) => {
  try{
      // //função para aguardar 3 segundos e ver o spinner
      // const delay = (ms:number)=>new Promise(resolve=> setTimeout(resolve, ms));
      // await delay(3000);
        //extrair o e-mail e password do corpo da requisição
        const { email, password}  = req.body;
        //verificar se email e senha foram fornecidos
        if(!email || !password){
          res.status(400).json({
            message: "E-mail e senha são obrigatórios",
          });
        }

        //Criar instância do serviço de autenticação
        const authService = new AuthService();
        //Chamar o método "login" para validar as credenciais e obter os dados do usuário
       const userData= await authService.login(email, password);
        //retornar resposta de sucesso com os dados do usuário autenticado
        res.status(200).json({
          message: "Login realizado com sucesso!",
          user: userData
        });

        return;

  }catch(error:any){
     //retornar mensagem de erro
      res.status(401).json({
      message: error.message || "Erro ao realizar login!",
    });
    return;
  }
});

//rota para validar token
router.get("/validate-token", verifyToken, async (req: Request, res: Response) => {
  // //função para aguardar 3 segundos e ver o spinner
  //     const delay = (ms:number)=>new Promise(resolve=> setTimeout(resolve, ms));
  //     await delay(3000);
  res.status(200).json({
    message: "Token válido!",
    userId: (req as any).user.id, //id do usuário autenticado
  })
});
//criar rota publica para cadastrar usuário
router.post("/new-users", async (req: Request, res: Response) => {
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
    
    // Forçar a situação como 1 (ativo)
    const newUser = userRepository.create({
      ...data,
      situation: 1
    });
  
    //salvar o registro no banco de dados
    const user = await userRepository.save(newUser);

    //retornar resposta de sucesso
    res.status(201).json({
      message: "Conta cadastrada com sucesso!",
      user,
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
//rota para recuperar a senha
router.post("/recover-password", async (req: Request, res: Response) => {
  try {
    //receber os dados enviados no corpo da requisição
    var data = req.body;
    //validar os dados utilizando yup
        const schema = yup.object().shape({
          urlRecoverPassword: yup
            .string()
            .required("A url é obrigatória!"),
          email:yup
            .string()
            .email("E-mail inválido")
            .required("O campo email é obrigatório!"),
        });

        //verificar se os dados passaram pela validação
         await schema.validate(data, { abortEarly: false });

         //criar uma instancia do repositorio user
          const userRepository = AppDataSource.getRepository(User);

          //recuperar o registro do banco de dados com o valor da coluna email
           const user = await userRepository.findOneBy({ email: data.email });
          //verificar se o usuário foi encontrado
            if (!user) {
                res.status(404).json({
                  message: "Usuário não encontrado na base de dados!",
                });
                return;
              }
              //Gerar token seguro de 64 caracteres
              user.recoverPassword = crypto.randomBytes(32).toString("hex");
               //salvar as alterações no banco de dados
                await userRepository.save(user);

                //criar a variável com as credenciais do servidor de email
                const transporter = nodemailer.createTransport({
                  host: process.env.EMAIL_HOST,
                  port: Number(process.env.EMAIL_PORT),
                  secure: false, // true for port 465, false for other ports
                  auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                  },
                });
                //variável com o conteúdo do e-mail
                var message_content = {
                  from: process.env.EMAIL_FROM, 
                  to: data.email,
                  subject: "Recuperação de senha", 

                  text: `Prezado(a) ${user.name}/n/nInformamos que a sua solicitação para recuperação de senha foi recebida com sucesso./n/nClique ou copie o link para criar uma nova senha em nosso sistema: ${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}/n/nEsta mensagem foi enviada a você pela empresa ${process.env.APP}./n/nVocê está recebendo pois está cadastrado no banco de dados da empresa ${process.env.APP}. Nenhum e-mail enviado pela empresa ${process.env.APP} tem arquivos anexados ou solicita o preenchimento de senhas e informações cadastrais./n/n`,

                  html: `Prezado(a) ${user.name} <br><br>Informamos que a sua solicitação de alteração de senha foi recebida com sucesso.<br><br>Clique no link para criar uma nova senha em nosso sistema: <a href='${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}'>${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}</a><br><br>Esta mensagem foi enviada a você pela empresa ${process.env.APP}.<br><br>Você está recebendo porque está cadastrado no banco de dados da empresa ${process.env.APP}./n/nNenhum e-mail enviado pela empresa ${process.env.APP} tem arquivos anexados ou solicita o preenchimento de senhas e informações cadastrais.<br><br>`, // html body
                }
                //enviar e-mail
                transporter.sendMail(message_content, function(error){
                  if(error){
                    console.log("Erro ao enviar e-mail de recuperação de senha: ", error);
                    res.status(400).json({
                      message: `E-mail não enviado, tente novamente ou contate ${process.env.EMAIL_ADM}.`,
                    
                      });
                      return;
                  }else{
                    res.status(200).json({
                      message: "E-mail enviado, verifique sua caixa de entrada.",
                      urlRecoverPassword: `${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}`,
                      });
                      return;
                  }
                });

            }catch (error) {
                if(error instanceof yup.ValidationError){
                  //Retornar erros de validação
                  res.status(400).json({
                    message: error.errors
                  });
                  return;
                }
                //retornar mensagem de erro
                res.status(500).json({
                  message: "Erro ao recuperar senha!",
                });
              }
});
//rota para validar a chave recuperar senha
router.post("/validate-recover-password", async (req: Request, res: Response) => {
  try{
    //receber os dados enviados no corpo da requisição
        var data = req.body;
        //validar os dados utilizando yup
        const schema = yup.object().shape({
          recoverPassword: yup
            .string()
            .required("A chave é obrigatória!"),
          email:yup
            .string()
            .email("E-mail inválido")
            .required("O campo email é obrigatório!"),
        });
        //verificar se os dados passaram pela validação
      await schema.validate(data, { abortEarly: false });
      //criar uma instancia do repositorio user
      const userRepository = AppDataSource.getRepository(User);
      //recuperar o registro do banco de dados com o valor da coluna email e recoverPwd
      const user = await userRepository.findOneBy({ email: data.email, recoverPassword:data.recoverPassword });
      //verificar se o usuário foi encontrado
      if (!user) {
        res.status(404).json({
          message: "Chave recuperar senha é inválida",
        });
        return;
    }
         //retornar resposta de sucesso
         res.status(200).json({
          message: "Chave recuperar senha é válida!",    
        });
        return;
  }catch (error) {
        if(error instanceof yup.ValidationError){
          //Retornar erros de validação
          res.status(400).json({
            message: error.errors
          });
          return;
        }
        //retornar mensagem de erro
        res.status(500).json({
          message: "Chave de recuperação de senha inválida!",
        });
      }
});
//rota para atualizar a senha 
router.put("/update-password", async (req: Request, res: Response) => {
    try{
          //receber os dados enviados no corpo da requisição
          var data = req.body;
          //validar os dados utilizando yup
          const schema = yup.object().shape({
            recoverPassword: yup
            .string()
            .required("A chave é obrigatória!"),
            email:yup
              .string()
              .email("E-mail inválido")
              .required("O campo email é obrigatório!"),
            password: yup
              .string()
              .required("O campo senha é obrigatório")
              .min(6, "O campo senha deve ter no mínimo 6 caracteres"),
          });
          //verificar se os dados passaram pela validação
          await schema.validate(data, { abortEarly: false });
          //criar uma instancia do repositorio user
          const userRepository = AppDataSource.getRepository(User);
           //recuperar o registro do banco de dados com o valor da coluna email e recoverPwd
          const user = await userRepository.findOneBy({ email: data.email, recoverPassword:data.recoverPassword });
          //verificar se o usuário foi encontrado
          if (!user) {
            res.status(404).json({
              message: "Chave recuperar senha é inválida",
            });
            return;
           }
           //Atribuir valor nulo para a coluna recoverPassword
           data.recoverPassword = null;
           //Atualizar os dados do usuário
           userRepository.merge(user, data);
           //salvar as alterações no banco de dados
           await userRepository.save(user);
           
           //retornar resposta de sucesso
           res.status(200).json({
           message: "Senha atualizada com sucesso!",    
           });
          return;


    }catch (error) {
      if(error instanceof yup.ValidationError){
        //Retornar erros de validação
        res.status(400).json({
          message: error.errors
        });
        return;
      }
      //retornar mensagem de erro
      res.status(500).json({
        message: "Erro ao editar senha!",
      });
    }

});


//Exportar a instrução que está dentro da constante router
 export default router;