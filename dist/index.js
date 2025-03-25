"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//criar aplicação express
const app = (0, express_1.default)();
//criar a rota get principal
app.get("/", (req, res) => {
    res.send("Bem-vinda, Camila Peroto 1!");
});
app.listen(8080, () => {
    console.log("Servidor iniciado na porta 8080: http://localhost:8080");
});
