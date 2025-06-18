import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rewards = await prisma.reward.findMany({
      where: { isActive: true },
      orderBy: { cost: "asc" },
    })

    const userRewards = await prisma.userReward.findMany({
      where: { userId: session.user.id },
      include: { reward: true },
    })

    return NextResponse.json({ rewards, userRewards })
  } catch (error) {
    console.error("Rewards fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { rewardId } = await request.json()

    // Check if user has enough points
    const sparkPoints = await prisma.sparkPoints.findMany({
      where: { userId: session.user.id },
    })
    const totalPoints = sparkPoints.reduce((sum, entry) => sum + entry.points, 0)

    const reward = await prisma.reward.findUnique({
      where: { id: rewardId },
    })

    if (!reward) {
      return NextResponse.json({ error: "Reward not found" }, { status: 404 })
    }

    if (totalPoints < reward.cost) {
      return NextResponse.json({ error: "Insufficient points" }, { status: 400 })
    }

    // Deduct points
    await prisma.sparkPoints.create({
      data: {
        userId: session.user.id,
        points: -reward.cost,
        source: "reward_redemption",
      },
    })

    // Create user reward
    const userReward = await prisma.userReward.create({
      data: {
        userId: session.user.id,
        rewardId,
      },
      include: { reward: true },
    })

    return NextResponse.json({ userReward })
  } catch (error) {
    console.error("Reward redemption error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
