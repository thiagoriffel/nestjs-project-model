import { DataSourceOptions, DataSource } from "typeorm";
import { config } from "dotenv"

config()

const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['src/**/*.entity.ts'],
    // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    // entities: [__dirname + '/entities/**'],
    migrations: ['src/db/migrations/*.ts'],
    // migrations: [__dirname + '/migrations/*.ts'],
    synchronize: false    
}

export default new DataSource(dataSourceOptions)