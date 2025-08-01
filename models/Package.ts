import { DataTypes, Model } from "sequelize"
import sequelize from "@/lib/database"

class Package extends Model {
  public id!: number
  public title!: string
  public description!: string
  public imageUrl!: string
  public uploadedImage!: string
  public gallery!: string[]
  public starRating!: number
  public nights!: number
  public hotels!: any
  public price!: number
  public category!: string
  public packageIncludes!: string[]
  public hotelMakkahDetails!: string
  public hotelMedinaDetails!: string
  public status!: "active" | "inactive" | "archived"
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Package.init(
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
    imageUrl: {
      type: DataTypes.STRING(500),
    },
    uploadedImage: {
      type: DataTypes.STRING(500),
    },
    gallery: {
      type: DataTypes.JSON,
    },
    starRating: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 5,
      },
    },
    nights: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hotels: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
    },
    packageIncludes: {
      type: DataTypes.JSON,
    },
    hotelMakkahDetails: {
      type: DataTypes.TEXT,
    },
    hotelMedinaDetails: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "archived"),
      defaultValue: "active",
    },
  },
  {
    sequelize,
    modelName: "Package",
    tableName: "packages",
  },
)

export default Package
