import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { mood, energy, stress, notes } = await request.json()

    const moodEntry = await prisma.moodEntry.create({
      data: {
        userId: session.user.id,
        mood,
        energy,
        stress,
        notes,
      },
    })

    return NextResponse.json({ moodEntry })
  } catch (error) {
    console.error("Mood entry error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const moodEntries = await prisma.moodEntry.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 30, // Last 30 entries
    })

    return NextResponse.json({ moodEntries })
  } catch (error) {
    console.error("Mood fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
