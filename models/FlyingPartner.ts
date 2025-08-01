import { DataTypes, Model } from "sequelize"
import sequelize from "@/lib/database"

class FlyingPartner extends Model {
  public id!: number
  public title!: string
  public images!: any
  public displaySettings!: any
  public readonly updatedAt!: Date
}

FlyingPartner.init(
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
    images: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    displaySettings: {
      type: DataTypes.JSON,
    },
  },
  {
    sequelize,
    modelName: "FlyingPartner",
    tableName: "flying_partners",
    createdAt: false,
  },
)

export default FlyingPartner
