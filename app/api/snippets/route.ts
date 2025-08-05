import { type NextRequest, NextResponse } from "next/server"
import Snippet from "@/models/Snippet"

export async function GET() {
  try {
    const snippets = await Snippet.findAll({
      order: [["updatedAt", "DESC"]],
    })
    return NextResponse.json(snippets)
  } catch (error) {
    console.error("Error fetching snippets:", error)
    return NextResponse.json({ error: "Failed to fetch snippets" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, snippetCode, htmlContent, cssContent, javascriptContent } = body

    // Validate required fields
    if (!title || !snippetCode) {
      return NextResponse.json({ error: "Title and snippet code are required" }, { status: 400 })
    }

    // Check if snippet code already exists
    const existingSnippet = await Snippet.findOne({
      where: { snippetCode },
    })

    if (existingSnippet) {
      return NextResponse.json({ error: "Snippet code already exists" }, { status: 400 })
    }

    const snippet = await Snippet.create({
      title,
      description: description || "",
      snippetCode,
      htmlContent: htmlContent || "",
      cssContent: cssContent || "",
      javascriptContent: javascriptContent || "",
    })

    return NextResponse.json(snippet, { status: 201 })
  } catch (error) {
    console.error("Error creating snippet:", error)
    return NextResponse.json({ error: "Failed to create snippet" }, { status: 500 })
  }
}
