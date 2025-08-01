import { DataTypes, Model } from "sequelize"
import sequelize from "@/lib/database"

class HeaderConfig extends Model {
  public id!: number
  public logoUrl!: string
  public logoText!: string
  public navigationItems!: any
  public mobileConfig!: any
  public contactInfo!: any
  public readonly updatedAt!: Date
}

HeaderConfig.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    logoUrl: {
      type: DataTypes.STRING(500),
    },
    logoText: {
      type: DataTypes.STRING(255),
    },
    navigationItems: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    mobileConfig: {
      type: DataTypes.JSON,
    },
    contactInfo: {
      type: DataTypes.JSON,
    },
  },
  {
    sequelize,
    modelName: "HeaderConfig",
    tableName: "header_config",
    createdAt: false,
  },
)

export default HeaderConfig
