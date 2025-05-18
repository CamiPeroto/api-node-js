import "reflect-metadata"
import { DataSource } from "typeorm"
import { Situation } from "./entity/Situation"
import { User } from "./entity/User"
import { Product } from "./entity/Product"
import { ProductCategory } from "./entity/ProductCategory"
import { ProductSituation } from "./entity/ProductSituation"
//importar biblioteca com as variáveis de ambiente
import dotenv from "dotenv"


//carregar as variáveis do arquivo.env
dotenv.config()


const dialect = process.env.DB_DIALECT ?? "mysql"

export const AppDataSource = new DataSource({
    type: dialect as "mysql",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: true,
    entities: [Situation, User, Product, ProductCategory, ProductSituation ],
    subscribers: [],
    migrations: [__dirname + "/migration/*.js"],
})

//inicializar a conexão com o banco de dados
AppDataSource.initialize()
.then(()=> {
    console.log("Conexão com o Banco realizada com sucesso!")
})
.catch((error)=> {
    console.log("Erro na conexão com o banco!", error) 
})