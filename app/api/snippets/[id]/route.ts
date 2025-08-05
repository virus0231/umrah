import { type NextRequest, NextResponse } from "next/server"
import Snippet from "@/models/Snippet"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const snippet = await Snippet.findByPk(params.id)

    if (!snippet) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 })
    }

    return NextResponse.json(snippet)
  } catch (error) {
    console.error("Error fetching snippet:", error)
    return NextResponse.json({ error: "Failed to fetch snippet" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { title, description, snippetCode, htmlContent, cssContent, javascriptContent } = body

    const snippet = await Snippet.findByPk(params.id)

    if (!snippet) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 })
    }

    // Check if snippet code already exists (excluding current snippet)
    if (snippetCode && snippetCode !== snippet.snippetCode) {
      const existingSnippet = await Snippet.findOne({
        where: { snippetCode },
      })

      if (existingSnippet) {
        return NextResponse.json({ error: "Snippet code already exists" }, { status: 400 })
      }
    }

    await snippet.update({
      title: title || snippet.title,
      description: description !== undefined ? description : snippet.description,
      snippetCode: snippetCode || snippet.snippetCode,
      htmlContent: htmlContent !== undefined ? htmlContent : snippet.htmlContent,
      cssContent: cssContent !== undefined ? cssContent : snippet.cssContent,
      javascriptContent: javascriptContent !== undefined ? javascriptContent : snippet.javascriptContent,
    })

    return NextResponse.json(snippet)
  } catch (error) {
    console.error("Error updating snippet:", error)
    return NextResponse.json({ error: "Failed to update snippet" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const snippet = await Snippet.findByPk(params.id)

    if (!snippet) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 })
    }

    await snippet.destroy()

    return NextResponse.json({ message: "Snippet deleted successfully" })
  } catch (error) {
    console.error("Error deleting snippet:", error)
    return NextResponse.json({ error: "Failed to delete snippet" }, { status: 500 })
  }
}
