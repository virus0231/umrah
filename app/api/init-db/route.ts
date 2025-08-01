import { NextResponse } from "next/server"
import { initDatabase } from "@/models"

export async function POST() {
  try {
    await initDatabase()
    return NextResponse.json({ message: "Database initialized successfully" })
  } catch (error) {
    console.error("Database initialization error:", error)
    return NextResponse.json({ error: "Database initialization failed" }, { status: 500 })
  }
}
