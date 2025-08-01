import { type NextRequest, NextResponse } from "next/server"
import { User } from "@/models"
import bcrypt from "bcryptjs"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { firstName, lastName, email, password, role } = await request.json()

    const updateData: any = {
      firstName,
      lastName,
      email,
      role,
    }

    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10)
    }

    await User.update(updateData, {
      where: { id: params.id },
    })

    const updatedUser = await User.findByPk(params.id, {
      attributes: ["id", "firstName", "lastName", "email", "role", "createdAt"],
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await User.destroy({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
