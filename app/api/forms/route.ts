import { type NextRequest, NextResponse } from "next/server"
import { Form } from "@/models"

export async function GET() {
  try {
    const forms = await Form.findAll({
      order: [["updatedAt", "DESC"]],
    })

    return NextResponse.json(forms)
  } catch (error) {
    console.error("Error fetching forms:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, fields, customScript } = await request.json()

    const form = await Form.create({
      formName: name,
      formType: "custom",
      fieldsConfig: { fields, description },
      customScript: customScript || "",
    })

    return NextResponse.json(form)
  } catch (error) {
    console.error("Error creating form:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
