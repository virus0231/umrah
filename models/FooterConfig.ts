import { DataTypes, Model } from "sequelize"
import sequelize from "@/lib/database"

class FooterConfig extends Model {
  public id!: number
  public logoUrl!: string
  public logoText!: string
  public description!: string
  public socialMediaLinks!: any
  public footerLinks!: any
  public contactInfo!: any
  public newsletter!: any
  public copyrightText!: string
  public paymentMethods!: string[]
  public readonly updatedAt!: Date
}

FooterConfig.init(
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
    description: {
      type: DataTypes.TEXT,
    },
    socialMediaLinks: {
      type: DataTypes.JSON,
    },
    footerLinks: {
      type: DataTypes.JSON,
    },
    contactInfo: {
      type: DataTypes.JSON,
    },
    newsletter: {
      type: DataTypes.JSON,
    },
    copyrightText: {
      type: DataTypes.TEXT,
    },
    paymentMethods: {
      type: DataTypes.JSON,
    },
  },
  {
    sequelize,
    modelName: "FooterConfig",
    tableName: "footer_config",
    createdAt: false,
  },
)

export default FooterConfig
