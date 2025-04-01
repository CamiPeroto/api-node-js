
//importar biblioteca express
import express, { Request, Response } from "express";

//criar aplicação express
const router = express.Router();



//criar a rota GET principal
router.get("/", (req: Request, res: Response) => {
  res.send("Bem-vinda, Camila Peroto 11!");
});

//Exportar a instrução que está dentro da constante router
export default router;