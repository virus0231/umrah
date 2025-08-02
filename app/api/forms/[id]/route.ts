import { type NextRequest, NextResponse } from "next/server"
import { Form } from "@/models"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, description, fields, customScript } = await request.json()

    await Form.update(
      {
        formName: name,
        fieldsConfig: { fields },
        description: description,
        customScript: customScript || "",
      },
      {
        where: { id: params.id },
      },
    )

    const updatedForm = await Form.findByPk(params.id)
    return NextResponse.json(updatedForm)
  } catch (error) {
    console.error("Error updating form:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await Form.destroy({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting form:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
