import "reflect-metadata"
import { DataSource } from "typeorm"
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
    entities: [],
    subscribers: [],
    migrations: [__dirname + "/migration/*.js"],
})