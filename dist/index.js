"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//criar aplicação express
const app = (0, express_1.default)();
//incluir as controllers
const login_1 = __importDefault(require("./controllers/login"));
//criar as rotas
app.use('/', login_1.default);
app.listen(8080, () => {
    console.log("Servidor iniciado na porta 8080: http://localhost:8080");
});
