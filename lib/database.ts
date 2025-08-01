import { Sequelize } from "sequelize"

// Database configuration - you can modify these values as needed
const DB_NAME = process.env.DB_NAME || "umrah"
const DB_USER = process.env.DB_USER || "root"
const DB_PASSWORD = process.env.DB_PASSWORD || ""
const DB_HOST = process.env.DB_HOST || "localhost"
const DB_PORT = Number.parseInt(process.env.DB_PORT || "3306")

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mysql",
  logging: console.log, // Enable logging to see SQL queries
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    // Global model options
    timestamps: true, // Adds createdAt and updatedAt
    underscored: false, // Use camelCase instead of snake_case
    freezeTableName: true, // Don't pluralize table names
  },
})

export default sequelize
