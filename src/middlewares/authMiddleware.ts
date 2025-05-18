import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
//importar biblioteca variáveis de ambiente
import dotenv from "dotenv";
//carregar variáveis do arquivo .env
dotenv.config();

//criar interface Request para receber o id do usuário
interface AuthRequest extends Request{
    user?: {id: number};
}

//middleware para validar o token de autenticação jwt
//param next função para passar o controle para o próximo middleware
export function verifyToken(req: AuthRequest, res: Response, next: NextFunction): void{
    //obter o token do cabeçalho da requisição
    const authHeader = req.headers. authorization;
    //verificar se o cabeçalho contem um token
    if(!authHeader){
        res.status(401).json({
            message: "Necessário realizar o login para acessar essa página!",
          });
          return;
    }
    //separar o token do prefixo "bearer"
    const [bearer, token] = authHeader.split(" ");
    //verificar se o token foi fornecido corretamente
    if(!token || bearer.toLowerCase() !=="bearer"){
        res.status(401).json({
            message: "Token inválido!",
          });
          return;
    }
    try{
        //verificar e decodificar o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {id: number}
        //atribuir o id do usuário autenticado à requisição para uso posterior
        req.user = {id: decoded.id}
          //passar o controle para a próxima função na rota 
           next();

    }catch(error){
        res.status(401).json({
            message: "Token inválido ou expirado!",
          });
          return;
    }
  
}