import "reflect-metadata"
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "Abudhabi1@",
    database: "node_api",
    synchronize: false,
    logging: true,
    entities: [],
    subscribers: [],
    migrations: [],
})