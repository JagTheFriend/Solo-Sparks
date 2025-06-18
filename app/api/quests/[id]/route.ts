import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the quest details
    const quest = await prisma.quest.findUnique({
      where: {
        id: params.id,
        isActive: true,
      },
    });

    if (!quest) {
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }

    // Check if user has already completed or been assigned this quest
    const userQuest = await prisma.userQuest.findUnique({
      where: {
        userId_questId: {
          userId: session.user.id,
          questId: params.id,
        },
      },
    });

    return NextResponse.json({
      quest,
      userQuest,
      isCompleted: userQuest?.status === "COMPLETED",
      isAssigned: !!userQuest,
    });
  } catch (error) {
    console.error("Quest fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
