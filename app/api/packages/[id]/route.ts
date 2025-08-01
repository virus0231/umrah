import { type NextRequest, NextResponse } from "next/server"
import { Package } from "@/models"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await Package.destroy({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting package:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
