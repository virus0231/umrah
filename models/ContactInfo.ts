import { DataTypes, Model } from "sequelize"
import sequelize from "@/lib/database"

class ContactInfo extends Model {
  public id!: number
  public address!: string
  public phone!: string
  public emails!: string[]
  public activeEmail!: string
  public mapLocation!: string
  public formFields!: any
  public readonly updatedAt!: Date
}

ContactInfo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    emails: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    activeEmail: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    mapLocation: {
      type: DataTypes.TEXT,
    },
    formFields: {
      type: DataTypes.JSON,
    },
  },
  {
    sequelize,
    modelName: "ContactInfo",
    tableName: "contact_info",
    createdAt: false,
  },
)

export default ContactInfo
