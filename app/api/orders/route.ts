import { NextResponse } from "next/server"

// Mock database (replace with your actual database logic)
const orders = [
  { id: "1", userId: "1", productId: "1", quantity: 2, status: "pending" },
  { id: "2", userId: "2", productId: "2", quantity: 1, status: "shipped" },
]

export async function GET() {
  return NextResponse.json(orders)
}

// Implement POST, PUT, and DELETE methods similar to the users API

