import { NextResponse } from "next/server"

// Mock database (replace with your actual database logic)
const sellers = [
  { id: "1", name: "Acme Corp", email: "acme@example.com", status: "approved" },
  { id: "2", name: "XYZ Inc", email: "xyz@example.com", status: "pending" },
]

export async function GET() {
  return NextResponse.json(sellers)
}

// Implement POST, PUT, and DELETE methods similar to the users API

