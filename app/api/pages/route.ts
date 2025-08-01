import { type NextRequest, NextResponse } from "next/server"
import { Page } from "@/models"

export async function GET() {
  try {
    const pages = await Page.findAll({
      order: [["updatedAt", "DESC"]],
    })

    return NextResponse.json(pages)
  } catch (error) {
    console.error("Error fetching pages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, html, css, javascript } = await request.json()

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")

    const page = await Page.create({
      title,
      description,
      htmlContent: html,
      cssContent: css,
      javascriptContent: javascript,
      slug,
      status: "draft",
    })

    return NextResponse.json(page)
  } catch (error) {
    console.error("Error creating page:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
