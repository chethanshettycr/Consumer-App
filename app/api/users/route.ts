import { NextResponse } from "next/server"

// Mock database (replace with your actual database logic)
const users = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
]

export async function GET() {
  return NextResponse.json(users)
}

export async function POST(request: Request) {
  const newUser = await request.json()
  newUser.id = String(users.length + 1)
  users.push(newUser)
  return NextResponse.json(newUser, { status: 201 })
}

export async function PUT(request: Request) {
  const { id } = await request.json()
  const index = users.findIndex((user) => user.id === id)
  if (index !== -1) {
    const updatedUser = await request.json()
    users[index] = { ...users[index], ...updatedUser }
    return NextResponse.json(users[index])
  }
  return NextResponse.json({ error: "User not found" }, { status: 404 })
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  const index = users.findIndex((user) => user.id === id)
  if (index !== -1) {
    const deletedUser = users.splice(index, 1)[0]
    return NextResponse.json(deletedUser)
  }
  return NextResponse.json({ error: "User not found" }, { status: 404 })
}

