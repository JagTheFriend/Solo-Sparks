"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, RefreshCw, Sparkles, Target, TrendingUp } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface QuestRecommendation {
  quest: {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: number;
    points: number;
  };
  score: number;
  reason: string;
}

interface DashboardData {
  recommendations: QuestRecommendation[];
  userQuests: Array<{
    id: string;
    status: string;
    quest: {
      id: string;
      title: string;
      category: string;
    };
  }>;
  totalPoints: number;
  completedQuests: number;
  needsAssessment?: boolean;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      fetchDashboardData();
    }
  }, [status, router]);

  // Refetch data when page becomes visible (user returns from quest)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && status === "authenticated") {
        fetchDashboardData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [status]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/quests");

      if (response.ok) {
        const data = await response.json();
        console.log("Dashboard data received:", data);
        setDashboardData(data);
      } else {
        console.error("Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const assignQuest = async (questId: string) => {
    try {
      const response = await fetch("/api/quests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questId, action: "assign" }),
      });

      if (response.ok) {
        router.push(`/quest/${questId}`);
      }
    } catch (error) {
      console.error("Quest assignment error:", error);
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return "bg-green-500";
    if (difficulty <= 3) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      self_care: "bg-pink-100 text-pink-800",
      creative: "bg-purple-100 text-purple-800",
      mindfulness: "bg-blue-100 text-blue-800",
      social: "bg-green-100 text-green-800",
      adventure: "bg-orange-100 text-orange-800",
      productivity: "bg-gray-100 text-gray-800",
      mood_boost: "bg-yellow-100 text-yellow-800",
      relaxation: "bg-indigo-100 text-indigo-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const inProgressQuests =
    dashboardData?.userQuests?.filter(
      (uq) => uq.status === "IN_PROGRESS" || uq.status === "ASSIGNED"
    ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {session?.user?.name}!
            </h1>
            <p className="text-gray-600">
              Ready to spark some personal growth today?
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={refreshing}
            className="flex items-center space-x-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Sparkles className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Spark Points
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData?.totalPoints || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Available Quests
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData?.recommendations?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData?.completedQuests || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    In Progress
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {inProgressQuests.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Button
            onClick={() => router.push("/mood")}
            className="h-20 text-left justify-start"
            variant="outline"
          >
            <div>
              <p className="font-semibold">Log Your Mood</p>
              <p className="text-sm text-gray-600">
                Track your emotional state
              </p>
            </div>
          </Button>

          <Button
            onClick={() => router.push("/rewards")}
            className="h-20 text-left justify-start"
            variant="outline"
          >
            <div>
              <p className="font-semibold">Rewards Store</p>
              <p className="text-sm text-gray-600">Redeem your Spark Points</p>
            </div>
          </Button>

          <Button
            onClick={() => router.push("/progress")}
            className="h-20 text-left justify-start"
            variant="outline"
          >
            <div>
              <p className="font-semibold">View Progress</p>
              <p className="text-sm text-gray-600">See your growth journey</p>
            </div>
          </Button>
        </div>

        {/* In Progress Quests */}
        {inProgressQuests.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Continue Your Journey</CardTitle>
              <CardDescription>
                Quests you've started but haven't completed yet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {inProgressQuests.map((userQuest) => (
                  <div
                    key={userQuest.id}
                    className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div>
                      <h3 className="font-semibold">{userQuest.quest.title}</h3>
                      <Badge
                        className={getCategoryColor(userQuest.quest.category)}
                      >
                        {userQuest.quest.category.replace("_", " ")}
                      </Badge>
                    </div>
                    <Button
                      onClick={() =>
                        router.push(`/quest/${userQuest.quest.id}`)
                      }
                      size="sm"
                    >
                      Continue Quest
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommended Quests */}
        <Card>
          <CardHeader>
            <CardTitle>Personalized Quests for You</CardTitle>
            <CardDescription>
              Based on your personality profile and recent activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData?.needsAssessment ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Complete your personality assessment to get personalized
                  quests!
                </p>
                <Button onClick={() => router.push("/onboarding")}>
                  Complete Assessment
                </Button>
              </div>
            ) : !dashboardData?.recommendations ||
              dashboardData.recommendations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Great job! You've completed all available quests. Check back
                  later for new ones!
                </p>
                <Button onClick={handleRefresh}>Check for New Quests</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData.recommendations.map((rec) => (
                  <div
                    key={rec.quest.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {rec.quest.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {rec.quest.description}
                        </p>
                        <p className="text-xs text-purple-600 italic">
                          {rec.reason}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={getCategoryColor(rec.quest.category)}>
                          {rec.quest.category.replace("_", " ")}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <div
                              className={`w-2 h-2 rounded-full ${getDifficultyColor(
                                rec.quest.difficulty
                              )} mr-1`}
                            />
                            <span className="text-xs text-gray-500">
                              Level {rec.quest.difficulty}
                            </span>
                          </div>
                          <Badge variant="secondary">
                            {rec.quest.points} pts
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          Match Score:
                        </span>
                        <Progress value={rec.score} className="w-20 h-2" />
                        <span className="text-sm font-medium">
                          {rec.score}%
                        </span>
                      </div>
                      <Button
                        onClick={() => assignQuest(rec.quest.id)}
                        size="sm"
                      >
                        Start Quest
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
