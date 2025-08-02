import { DataTypes, Model } from "sequelize"
import sequelize from "@/lib/database"

class FormSubmission extends Model {
  public id!: number
  public formId!: number
  public submissionData!: any
  public submittedAt!: Date
  public ipAddress!: string
  public userAgent!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

FormSubmission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    formId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
    },
    submissionData: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    submittedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    ipAddress: {
      type: DataTypes.STRING(45), // Supports both IPv4 and IPv6
    },
    userAgent: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "FormSubmission",
    tableName: "form_submissions",
  },
)

export default FormSubmission
