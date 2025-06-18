import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's completed quests with category information
    const completedQuests = await prisma.userQuest.findMany({
      where: {
        userId,
        status: "COMPLETED",
      },
      include: {
        quest: {
          select: {
            title: true,
            category: true,
            difficulty: true,
            points: true,
            createdAt: true,
          },
        },
      },
      orderBy: { completedAt: "desc" },
    });

    // Get total quests assigned to user
    const totalQuestsAssigned = await prisma.userQuest.count({
      where: { userId },
    });

    // Get user's total points
    const sparkPoints = await prisma.sparkPoints.findMany({
      where: { userId },
    });
    const totalPoints = sparkPoints.reduce(
      (sum, entry) => sum + entry.points,
      0
    );

    // Calculate current streak (consecutive days with completed quests)
    const currentStreak = await calculateStreak(userId);

    // Get categories completed
    const categoriesCompleted = completedQuests.reduce((acc, userQuest) => {
      const category = userQuest.quest.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get weekly progress
    const weeklyProgress = await getWeeklyProgress(userId);

    // Get recent achievements
    const recentAchievements = await getRecentAchievements(
      userId,
      completedQuests
    );

    return NextResponse.json({
      totalQuests: totalQuestsAssigned,
      completedQuests: completedQuests.length,
      totalPoints,
      currentStreak,
      categoriesCompleted,
      weeklyProgress,
      recentAchievements,
      completedQuestDetails: completedQuests,
    });
  } catch (error) {
    console.error("Progress data fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to calculate streak
async function calculateStreak(userId: string): Promise<number> {
  const completedQuests = await prisma.userQuest.findMany({
    where: {
      userId,
      status: "COMPLETED",
    },
    orderBy: { completedAt: "desc" },
    select: { completedAt: true },
  });

  if (completedQuests.length === 0) return 0;

  let streak = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if there's a completion today
  const mostRecentDate = new Date(completedQuests[0].completedAt!);
  mostRecentDate.setHours(0, 0, 0, 0);

  // If no completion today, check if there was one yesterday
  if (mostRecentDate.getTime() !== today.getTime()) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (mostRecentDate.getTime() !== yesterday.getTime()) {
      return 0; // Streak broken
    }
  }

  // Count consecutive days with completions
  const dateMap = new Map<string, boolean>();

  for (const quest of completedQuests) {
    const date = new Date(quest.completedAt!);
    date.setHours(0, 0, 0, 0);
    dateMap.set(date.toISOString().split("T")[0], true);
  }

  const checkDate = new Date(today);

  while (true) {
    const dateStr = checkDate.toISOString().split("T")[0];
    if (dateMap.has(dateStr)) {
      if (checkDate.getTime() !== today.getTime()) {
        streak++;
      }
    } else {
      break;
    }

    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
}

// Helper function to get weekly progress
async function getWeeklyProgress(userId: string) {
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

  const completedQuests = await prisma.userQuest.findMany({
    where: {
      userId,
      status: "COMPLETED",
      completedAt: { gte: fourWeeksAgo },
    },
    include: {
      quest: {
        select: { points: true },
      },
    },
    orderBy: { completedAt: "asc" },
  });

  // Group by week
  const weeklyData: Record<string, { completed: number; points: number }> = {};

  for (const quest of completedQuests) {
    if (!quest.completedAt) continue;

    const date = new Date(quest.completedAt);
    // Get week number (0-3 for the last 4 weeks)
    const weekDiff = Math.floor(
      (Date.now() - date.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );
    if (weekDiff > 3) continue; // Only consider last 4 weeks

    const weekKey = `Week ${4 - weekDiff}`;

    if (!weeklyData[weekKey]) {
      weeklyData[weekKey] = { completed: 0, points: 0 };
    }

    weeklyData[weekKey].completed += 1;
    weeklyData[weekKey].points += quest.quest.points;
  }

  // Ensure all 4 weeks are represented
  for (let i = 1; i <= 4; i++) {
    const weekKey = `Week ${i}`;
    if (!weeklyData[weekKey]) {
      weeklyData[weekKey] = { completed: 0, points: 0 };
    }
  }

  return Object.entries(weeklyData)
    .map(([week, data]) => ({
      week,
      completed: data.completed,
      points: data.points,
    }))
    .sort((a, b) => {
      // Sort by week number
      const aNum = Number.parseInt(a.week.split(" ")[1]);
      const bNum = Number.parseInt(b.week.split(" ")[1]);
      return aNum - bNum;
    });
}

// Helper function to generate achievements based on user's progress
async function getRecentAchievements(userId: string, completedQuests: any[]) {
  const achievements = [];

  // First quest achievement
  if (completedQuests.length > 0) {
    const firstQuest = completedQuests[completedQuests.length - 1]; // Last in the array is the first completed
    achievements.push({
      title: "First Quest Complete",
      description: "Completed your very first Solo Sparks quest",
      date: firstQuest.completedAt,
      points: 25,
    });
  }

  // Category achievements
  const categoryCount: Record<string, number> = {};
  for (const quest of completedQuests) {
    const category = quest.quest.category;
    categoryCount[category] = (categoryCount[category] || 0) + 1;

    // Check for category milestones (3 quests in a category)
    if (categoryCount[category] === 3) {
      const categoryNames: Record<string, string> = {
        mindfulness: "Mindful Explorer",
        self_care: "Self-Care Master",
        creative: "Creative Genius",
        adventure: "Adventure Seeker",
        mood_boost: "Mood Enhancer",
        relaxation: "Relaxation Expert",
        productivity: "Productivity Pro",
        social: "Social Butterfly",
        physical: "Physical Wellness Champion",
        intellectual: "Intellectual Growth Master",
        spiritual: "Spiritual Seeker",
      };

      achievements.push({
        title:
          categoryNames[category] ||
          `${category.charAt(0).toUpperCase() + category.slice(1)} Expert`,
        description: `Completed 3 ${category.replace("_", " ")} quests`,
        date: quest.completedAt,
        points: 50,
      });
    }
  }

  // Reflection achievements
  const reflections = await prisma.reflection.findMany({
    where: {
      userQuest: {
        userId,
      },
    },
    distinct: ["type"],
  });

  if (reflections.length >= 2) {
    achievements.push({
      title: "Reflection Master",
      description: "Added different types of reflections to your quests",
      date: new Date().toISOString(), // Current date as this is a calculated achievement
      points: 30,
    });
  }

  // Sort by date (most recent first) and limit to 5
  return achievements
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
}
