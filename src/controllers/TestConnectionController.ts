//importar biblioteca express
import express, { Request, Response } from "express";

//criar aplicação express
const router = express.Router();

//criar a rota GET principal
router.get("/test-connection", (req: Request, res: Response) => {
  res.status(200).json({message: "Conexão realizada com sucesso!" });
});

//Exportar a instrução que está dentro da constante router
export default router;