import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QuestEngine } from "@/lib/quest-engine";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has completed personality assessment
    const profile = await prisma.personalityProfile.findUnique({
      where: { userId: session.user.id },
    });

    // Get user's completed and assigned quests
    const userQuests = await prisma.userQuest.findMany({
      where: { userId: session.user.id },
      include: { quest: true },
    });

    // Get user's total points
    const sparkPoints = await prisma.sparkPoints.findMany({
      where: { userId: session.user.id },
    });
    const totalPoints = sparkPoints.reduce(
      (sum, entry) => sum + entry.points,
      0
    );

    // Get completed quests count
    const completedQuests = userQuests.filter(
      (uq) => uq.status === "COMPLETED"
    ).length;

    // If no profile, return data indicating assessment needed
    if (!profile) {
      return NextResponse.json({
        recommendations: [],
        userQuests,
        totalPoints,
        completedQuests,
        needsAssessment: true,
      });
    }

    // Generate recommendations using the quest engine
    try {
      const recommendations = await QuestEngine.generatePersonalizedQuests(
        session.user.id
      );

      return NextResponse.json({
        recommendations,
        userQuests,
        totalPoints,
        completedQuests,
        needsAssessment: false,
      });
    } catch (questEngineError) {
      console.error("Quest engine error:", questEngineError);

      // Fallback: return some basic quests if quest engine fails
      const fallbackQuests = await prisma.quest.findMany({
        where: {
          isActive: true,
          id: {
            notIn: userQuests.map((uq) => uq.questId),
          },
        },
        take: 5,
        orderBy: { createdAt: "desc" },
      });

      const fallbackRecommendations = fallbackQuests.map((quest) => ({
        quest,
        score: 75,
        reason: "Recommended for your personal growth journey",
      }));

      return NextResponse.json({
        recommendations: fallbackRecommendations,
        userQuests,
        totalPoints,
        completedQuests,
        needsAssessment: false,
      });
    }
  } catch (error) {
    console.error("Quest fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questId, action } = await request.json();

    if (action === "assign") {
      const userQuest = await prisma.userQuest.create({
        data: {
          userId: session.user.id,
          questId,
          status: "ASSIGNED",
        },
      });
      return NextResponse.json({ userQuest });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Quest action error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
