import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reflection, reflections } = await request.json();

    // First, check if the quest exists and is active
    const quest = await prisma.quest.findUnique({
      where: {
        id: params.id,
        isActive: true,
      },
    });

    if (!quest) {
      return NextResponse.json(
        { error: "Quest not found or inactive" },
        { status: 404 }
      );
    }

    // Check if user has already completed this quest
    const existingUserQuest = await prisma.userQuest.findUnique({
      where: {
        userId_questId: {
          userId: session.user.id,
          questId: params.id,
        },
      },
    });

    if (existingUserQuest?.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Quest already completed" },
        { status: 400 }
      );
    }

    // Create or update user quest
    const userQuest = await prisma.userQuest.upsert({
      where: {
        userId_questId: {
          userId: session.user.id,
          questId: params.id,
        },
      },
      update: {
        status: "COMPLETED",
        completedAt: new Date(),
        reflection,
      },
      create: {
        userId: session.user.id,
        questId: params.id,
        status: "COMPLETED",
        completedAt: new Date(),
        reflection,
      },
      include: { quest: true },
    });

    // Add reflections if provided
    if (reflections && reflections.length > 0) {
      await prisma.reflection.createMany({
        data: reflections.map((refl: any) => ({
          userQuestId: userQuest.id,
          type: refl.type,
          content: refl.content,
          metadata: refl.metadata || {},
        })),
      });
    }

    // Award spark points for quest completion
    await prisma.sparkPoints.create({
      data: {
        userId: session.user.id,
        points: quest.points,
        source: "quest_completion",
        questId: params.id,
      },
    });

    // Bonus points for reflections
    const bonusPoints = reflections?.length * 5 || 0;
    if (bonusPoints > 0) {
      await prisma.sparkPoints.create({
        data: {
          userId: session.user.id,
          points: bonusPoints,
          source: "reflection_bonus",
          questId: params.id,
        },
      });
    }

    const totalPointsEarned = quest.points + bonusPoints;

    return NextResponse.json({
      message: "Quest completed successfully",
      pointsEarned: totalPointsEarned,
      userQuest,
      quest,
    });
  } catch (error) {
    console.error("Quest completion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
