import mysql2 from 'mysql2';
import { Sequelize } from "sequelize";

const DB_NAME = process.env.DB_NAME ?? "umrah";
const DB_USER = process.env.DB_USER ?? "root";
const DB_PASSWORD = process.env.DB_PASSWORD ?? "";
const DB_HOST = process.env.DB_HOST ?? "localhost";
const DB_PORT = Number.parseInt(process.env.DB_PORT ?? "3306");

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mysql",
  dialectModule: mysql2,
  logging: console.log,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: false,
    freezeTableName: true,
  },
});

export default sequelize;
