import express, { Request, Response } from "express";
//criar aplicação express
const app = express();
//criar a rota get principal
app.get("/", (req: Request, res: Response) => {
  res.send("Bem-vinda, Camila Peroto 1!");
});

app.listen(8080, () => {
  console.log("Servidor iniciado na porta 8080: http://localhost:8080");
});
