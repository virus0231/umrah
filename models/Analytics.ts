import { DataTypes, Model } from "sequelize"
import sequelize from "@/lib/database"

class Analytics extends Model {
  public id!: number
  public eventType!: string
  public eventData!: any
  public readonly createdAt!: Date
}

Analytics.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    eventType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    eventData: {
      type: DataTypes.JSON,
    },
  },
  {
    sequelize,
    modelName: "Analytics",
    tableName: "analytics",
    updatedAt: false, // Only track creation time for analytics
  },
)

export default Analytics
