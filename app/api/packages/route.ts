import { type NextRequest, NextResponse } from "next/server"
import { Package } from "@/models"

export async function GET() {
  try {
    const packages = await Package.findAll({
      order: [["updatedAt", "DESC"]],
    })

    return NextResponse.json(packages)
  } catch (error) {
    console.error("Error fetching packages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const packageData = await request.json()

    console.log("Creating package with data:", packageData)

    const newPackage = await Package.create({
      title: packageData.title,
      description: packageData.description || "",
      imageUrl: packageData.image,
      uploadedImage: packageData.uploadedImage,
      gallery: packageData.gallery || [],
      starRating: packageData.stars,
      nights: packageData.nights,
      hotels: packageData.hotels,
      price: packageData.price,
      category: packageData.category,
      packageIncludes: packageData.packageIncludes || [],
      hotelMakkahDetails: packageData.hotelMakkahDetails || "",
      hotelMedinaDetails: packageData.hotelMedinaDetails || "",
      status: "active",
    })

    return NextResponse.json(newPackage)
  } catch (error) {
    console.error("Error creating package:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
