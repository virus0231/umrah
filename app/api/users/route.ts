import { type NextRequest, NextResponse } from "next/server"
import { User } from "@/models"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const users = await User.findAll({
      attributes: ["id", "firstName", "lastName", "email", "role", "createdAt"],
      order: [["createdAt", "DESC"]],
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password, role } = await request.json()

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      firstName,
      lastName,
      email,
      passwordHash: hashedPassword,
      role,
    })

    return NextResponse.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
