import { DataTypes, Model } from "sequelize"
import sequelize from "@/lib/database"

class Snippet extends Model {
  public id!: number
  public title!: string
  public description!: string
  public snippetCode!: string
  public htmlContent!: string
  public cssContent!: string
  public javascriptContent!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Snippet.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    snippetCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    htmlContent: {
      type: DataTypes.TEXT,
    },
    cssContent: {
      type: DataTypes.TEXT,
    },
    javascriptContent: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "Snippet",
    tableName: "snippets",
  },
)

export default Snippet
