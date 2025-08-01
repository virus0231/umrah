import { DataTypes, Model } from "sequelize"
import sequelize from "@/lib/database"
import bcrypt from "bcryptjs"

class User extends Model {
  public id!: number
  public firstName!: string
  public lastName!: string
  public email!: string
  public passwordHash!: string
  public role!: "admin" | "user" | "marketing"
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash)
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user", "marketing"),
      defaultValue: "user",
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
  },
)

export default User
