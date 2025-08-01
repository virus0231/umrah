import { type NextRequest, NextResponse } from "next/server"
import { Page } from "@/models"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { title, description, html, css, javascript } = await request.json()

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")

    await Page.update(
      {
        title,
        description,
        htmlContent: html,
        cssContent: css,
        javascriptContent: javascript,
        slug,
      },
      {
        where: { id: params.id },
      },
    )

    const updatedPage = await Page.findByPk(params.id)
    return NextResponse.json(updatedPage)
  } catch (error) {
    console.error("Error updating page:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await Page.destroy({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting page:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
