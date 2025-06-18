import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { traits, emotionalNeeds, preferences } = await request.json();

    const profile = await prisma.personalityProfile.upsert({
      where: { userId: session.user.id },
      update: {
        traits,
        emotionalNeeds,
        preferences,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        traits,
        emotionalNeeds,
        preferences,
      },
    });

    // Award points for completing the assessment
    await prisma.sparkPoints.create({
      data: {
        userId: session.user.id,
        points: 50,
        source: "assessment_completion",
      },
    });

    return NextResponse.json({
      profile,
      message: "Profile created successfully",
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.personalityProfile.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
