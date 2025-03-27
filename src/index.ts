import express from "express";
//importar biblioteca variáveis de ambiente
import dotenv from "dotenv";

//carregar variáveis do arquivo .env
dotenv.config();


//criar aplicação express
const app = express();
//incluir as controllers
import login from "./controllers/login"
//criar as rotas
app.use('/', login)

app.listen(process.env.PORT, () => {
  console.log(`Servidor iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`);
});
