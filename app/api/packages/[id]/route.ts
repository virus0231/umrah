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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const packageData = await request.json()

    const updatedPackage = await Package.update(
      {
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
      },
      {
        where: { id: params.id },
        returning: true,
      }
    )

    return NextResponse.json(updatedPackage)
  } catch (error) {
    console.error("Error updating package:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
