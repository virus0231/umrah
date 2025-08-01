import { DataTypes, Model } from "sequelize"
import sequelize from "@/lib/database"

class Page extends Model {
  public id!: number
  public title!: string
  public description!: string
  public htmlContent!: string
  public cssContent!: string
  public javascriptContent!: string
  public slug!: string
  public status!: "draft" | "published" | "archived"
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Page.init(
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
    htmlContent: {
      type: DataTypes.TEXT,
    },
    cssContent: {
      type: DataTypes.TEXT,
    },
    javascriptContent: {
      type: DataTypes.TEXT,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("draft", "published", "archived"),
      defaultValue: "draft",
    },
  },
  {
    sequelize,
    modelName: "Page",
    tableName: "pages",
  },
)

export default Page
