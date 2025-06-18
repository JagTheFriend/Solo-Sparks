import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sparkPoints = await prisma.sparkPoints.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })

    const totalPoints = sparkPoints.reduce((sum, entry) => sum + entry.points, 0)

    return NextResponse.json({
      sparkPoints,
      totalPoints,
    })
  } catch (error) {
    console.error("Points fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
