"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
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
import {
  AlertCircle,
  Award,
  Calendar,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ProgressData {
  totalQuests: number;
  completedQuests: number;
  totalPoints: number;
  currentStreak: number;
  categoriesCompleted: Record<string, number>;
  weeklyProgress: Array<{
    week: string;
    completed: number;
    points: number;
  }>;
  recentAchievements: Array<{
    title: string;
    description: string;
    date: string;
    points: number;
  }>;
  completedQuestDetails: Array<{
    id: string;
    status: string;
    completedAt: string;
    quest: {
      title: string;
      category: string;
      difficulty: number;
      points: number;
    };
  }>;
}

const CATEGORY_COLORS: Record<string, string> = {
  mindfulness: "#3b82f6", // blue
  self_care: "#ec4899", // pink
  creative: "#8b5cf6", // purple
  adventure: "#f59e0b", // amber
  mood_boost: "#eab308", // yellow
  relaxation: "#6366f1", // indigo
  productivity: "#6b7280", // gray
  social: "#10b981", // green
  physical: "#ef4444", // red
  intellectual: "#0ea5e9", // sky
  spiritual: "#8b5cf6", // purple
};

export default function ProgressPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      fetchProgressData();
    }
  }, [status, router]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/progress");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch progress data");
      }

      const data = await response.json();
      setProgressData(data);
      setError(null);
    } catch (error) {
      console.error("Progress data fetch error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred while fetching your progress data"
      );
    } finally {
      setLoading(false);
    }
  };

  const getCompletionPercentage = () => {
    if (!progressData) return 0;
    return (
      Math.round(
        (progressData.completedQuests / progressData.totalQuests) * 100
      ) || 0
    );
  };

  const getCategoryChartData = () => {
    if (!progressData) return [];

    return Object.entries(progressData.categoriesCompleted).map(
      ([category, count]) => ({
        name: category.replace("_", " "),
        value: count,
        color: CATEGORY_COLORS[category] || "#6b7280",
      })
    );
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-6xl mx-auto">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>

          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>

          <Button onClick={fetchProgressData} className="ml-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // If no completed quests yet, show empty state
  if (progressData && progressData.completedQuests === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="mb-4"
            >
              ← Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Your Growth Journey
            </h1>
            <p className="text-gray-600">
              Track your personal development progress and celebrate your
              achievements
            </p>
          </div>

          <Card className="text-center p-12">
            <CardContent>
              <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Progress Data Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Complete your first quest to start tracking your growth journey!
              </p>
              <Button onClick={() => router.push("/dashboard")}>
                Find Your First Quest
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Growth Journey
          </h1>
          <p className="text-gray-600">
            Track your personal development progress and celebrate your
            achievements
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Quests Completed
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {progressData?.completedQuests || 0}
                  </p>
                  <p className="text-xs text-gray-500">
                    of {progressData?.totalQuests || 0} assigned
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Sparkles className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Points
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {progressData?.totalPoints || 0}
                  </p>
                  <p className="text-xs text-gray-500">Spark Points earned</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Current Streak
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {progressData?.currentStreak || 0}
                  </p>
                  <p className="text-xs text-gray-500">days in a row</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Completion Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {getCompletionPercentage()}%
                  </p>
                  <p className="text-xs text-gray-500">of assigned quests</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quest Completion Progress</CardTitle>
            <CardDescription>
              Your journey towards personal growth and self-discovery
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-gray-600">
                  {progressData?.completedQuests} / {progressData?.totalQuests}{" "}
                  quests
                </span>
              </div>
              <Progress
                value={getCompletionPercentage()}
                className="w-full h-3"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Just started</span>
                <span>Growth master</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Progress</CardTitle>
              <CardDescription>
                Your quest completion and points earned over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {progressData?.weeklyProgress &&
                progressData.weeklyProgress.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={progressData.weeklyProgress}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="completed"
                        fill="#8b5cf6"
                        name="Quests Completed"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <p>Not enough data to display weekly progress</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Quest Categories</CardTitle>
              <CardDescription>
                Distribution of completed quests by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {getCategoryChartData().length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getCategoryChartData()}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {getCategoryChartData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <p>
                      Complete quests in different categories to see
                      distribution
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Recent Achievements
            </CardTitle>
            <CardDescription>
              Milestones you've unlocked on your growth journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            {progressData?.recentAchievements &&
            progressData.recentAchievements.length > 0 ? (
              <div className="space-y-4">
                {progressData.recentAchievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Award className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {achievement.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(achievement.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">
                      +{achievement.points} SP
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Achievements Yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Complete quests to unlock achievements and track your growth!
                </p>
                <Button onClick={() => router.push("/dashboard")}>
                  Start Your First Quest
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completed Quests History */}
        {progressData?.completedQuestDetails &&
          progressData.completedQuestDetails.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Quest History</CardTitle>
                <CardDescription>
                  Your completed quests and earned points
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {progressData.completedQuestDetails.map((userQuest) => (
                    <div
                      key={userQuest.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold">
                          {userQuest.quest.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge
                            className={`bg-${CATEGORY_COLORS[
                              userQuest.quest.category
                            ]?.replace("#", "")}-100 text-${CATEGORY_COLORS[
                              userQuest.quest.category
                            ]?.replace("#", "")}-800`}
                          >
                            {userQuest.quest.category.replace("_", " ")}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(
                              userQuest.completedAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        +{userQuest.quest.points} points
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  );
}
