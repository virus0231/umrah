import { type NextRequest, NextResponse } from "next/server"
import FlyingPartner from "@/models/FlyingPartner"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const flyingPartner = await FlyingPartner.findByPk(params.id)

    if (!flyingPartner) {
      return NextResponse.json({ error: "Flying partner configuration not found" }, { status: 404 })
    }

    return NextResponse.json(flyingPartner)
  } catch (error) {
    console.error("Error fetching flying partner:", error)
    return NextResponse.json({ error: "Failed to fetch flying partner" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { title, images, displaySettings } = body

    const flyingPartner = await FlyingPartner.findByPk(params.id)

    if (!flyingPartner) {
      return NextResponse.json({ error: "Flying partner configuration not found" }, { status: 404 })
    }

    await flyingPartner.update({
      title,
      images,
      displaySettings,
    })

    return NextResponse.json(flyingPartner)
  } catch (error) {
    console.error("Error updating flying partner:", error)
    return NextResponse.json({ error: "Failed to update flying partner" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const flyingPartner = await FlyingPartner.findByPk(params.id)

    if (!flyingPartner) {
      return NextResponse.json({ error: "Flying partner configuration not found" }, { status: 404 })
    }

    await flyingPartner.destroy()

    return NextResponse.json({ message: "Flying partner configuration deleted successfully" })
  } catch (error) {
    console.error("Error deleting flying partner:", error)
    return NextResponse.json({ error: "Failed to delete flying partner" }, { status: 500 })
  }
}
