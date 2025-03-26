import express from "express";
//criar aplicação express
const app = express();
//incluir as controllers
import login from "./controllers/login"
//criar as rotas
app.use('/', login)

app.listen(8080, () => {
  console.log("Servidor iniciado na porta 8080: http://localhost:8080");
});
