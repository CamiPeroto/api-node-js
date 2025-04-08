import express from "express";
//importar biblioteca variáveis de ambiente

//Importar a biblioteca para permitir requisições externas a api
import cors from "cors";

import dotenv from "dotenv";

//carregar variáveis do arquivo .env
dotenv.config();

//criar aplicação express
const app = express();

//Criar o middleware para receber os dados no corpo da requisição
app.use(express.json());
//Criar o middleware para permitir requisições externas 
app.use(cors());
//incluir as controllers
import AuthController from "./controllers/AuthController";
import SituationsController from "./controllers/SituationsController";
import ProductSituationsController from "./controllers/ProductSituationsController";
import ProductCategoriesController from "./controllers/ProductCategoriesController";

//criar as rotas
app.use("/", AuthController);
app.use("/", SituationsController);
app.use("/", ProductSituationsController);
app.use("/", ProductCategoriesController);

app.listen(process.env.PORT, () => {
  console.log(`Servidor iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`);
});
