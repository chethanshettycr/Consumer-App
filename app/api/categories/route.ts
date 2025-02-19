import { NextResponse } from "next/server"

export async function GET() {
  const categories = ["material", "machine", "worker"]
  return NextResponse.json(categories)
}

