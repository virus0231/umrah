import { DataTypes, Model } from "sequelize"
import sequelize from "@/lib/database"

class Form extends Model {
  public id!: number
  public formName!: string
  public formType!: string
  public fieldsConfig!: any
  public customScript!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Form.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    formName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    formType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    fieldsConfig: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    customScript: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "Form",
    tableName: "forms",
  },
)

export default Form
