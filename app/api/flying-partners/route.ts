import { type NextRequest, NextResponse } from "next/server"
import FlyingPartner from "@/models/FlyingPartner"

export async function GET() {
  try {
    const flyingPartners = await FlyingPartner.findAll({
      order: [["id", "ASC"]],
    })

    // If no config exists, return default config
    if (flyingPartners.length === 0) {
      const defaultConfig = {
        title: "Our Flying partners",
        images: [],
        displaySettings: {
          desktop: 4,
          tablet: 3,
          mobile: 2,
          autoplay: true,
          speed: 3000,
        },
      }
      return NextResponse.json(defaultConfig)
    }

    // Return the first (main) configuration
    return NextResponse.json(flyingPartners[0])
  } catch (error) {
    console.error("Error fetching flying partners:", error)
    return NextResponse.json({ error: "Failed to fetch flying partners" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, images, displaySettings } = body

    // Check if a config already exists
    const existingConfig = await FlyingPartner.findOne()

    if (existingConfig) {
      // Update existing config
      await existingConfig.update({
        title,
        images,
        displaySettings,
      })
      return NextResponse.json(existingConfig)
    } else {
      // Create new config
      const newConfig = await FlyingPartner.create({
        title,
        images,
        displaySettings,
      })
      return NextResponse.json(newConfig)
    }
  } catch (error) {
    console.error("Error creating/updating flying partners:", error)
    return NextResponse.json({ error: "Failed to save flying partners configuration" }, { status: 500 })
  }
}
