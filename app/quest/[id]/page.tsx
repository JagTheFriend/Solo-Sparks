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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, CheckCircle, Mic } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

interface Quest {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: number;
  points: number;
  requirements: any;
  isActive: boolean;
}

interface Reflection {
  type: "TEXT" | "PHOTO" | "AUDIO";
  content: string;
  metadata?: any;
}

interface QuestPageData {
  quest: Quest;
  userQuest?: any;
  isCompleted: boolean;
  isAssigned: boolean;
}

export default function QuestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const [questData, setQuestData] = useState<QuestPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [textReflection, setTextReflection] = useState("");
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    fetchQuest();
  }, [id]);

  const fetchQuest = async () => {
    try {
      const response = await fetch(`/api/quests/${id}`);
      if (response.ok) {
        const data = await response.json();
        setQuestData(data);

        // If already completed, show completion state
        if (data.isCompleted) {
          setCompleted(true);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Quest not found");
      }
    } catch (error) {
      console.error("Quest fetch error:", error);
      setError("Failed to load quest");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, type: "PHOTO" | "AUDIO") => {
    setUploadingFile(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "quest-reflections");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const { url } = await response.json();

        const newReflection: Reflection = {
          type,
          content: url,
          metadata: {
            fileName: file.name,
            fileSize: file.size,
            uploadedAt: new Date().toISOString(),
          },
        };

        setReflections((prev) => [...prev, newReflection]);
      }
    } catch (error) {
      console.error("File upload error:", error);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleCompleteQuest = async () => {
    if (!questData?.quest) return;

    setCompleting(true);

    try {
      const response = await fetch(
        `/api/quests/${questData.quest.id}/complete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reflection: textReflection,
            reflections,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCompleted(true);

        // Show success message with points earned
        setTimeout(() => {
          // Force a page refresh to ensure dashboard updates
          window.location.href = "/dashboard";
        }, 3000);
      } else {
        const errorData = await response.json();
        console.error("Quest completion failed:", errorData);
        alert(errorData.error || "Failed to complete quest. Please try again.");
      }
    } catch (error) {
      console.error("Quest completion error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setCompleting(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !questData?.quest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">{error || "Quest not found"}</p>
            <Button onClick={() => router.push("/dashboard")} className="mt-4">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const quest = questData.quest;

  if (completed || questData.isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Quest Completed!
            </h2>
            <p className="text-gray-600 mb-4">
              Congratulations! You've earned {quest.points} Spark Points.
            </p>
            {!questData.isCompleted && (
              <p className="text-sm text-gray-500">
                Redirecting to dashboard...
              </p>
            )}
            {questData.isCompleted && (
              <Button
                onClick={() => router.push("/dashboard")}
                className="mt-4"
              >
                Back to Dashboard
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quest Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      {quest.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {quest.description}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getCategoryColor(quest.category)}>
                      {quest.category.replace("_", " ")}
                    </Badge>
                    <Badge variant="secondary">{quest.points} points</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Quest Requirements:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Duration: {quest.requirements.duration}</li>
                      <li>• Best time: {quest.requirements.timeOfDay}</li>
                      <li>• Location: {quest.requirements.location}</li>
                    </ul>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Tips for Success:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Find a quiet, comfortable space</li>
                      <li>• Turn off distractions (phone, notifications)</li>
                      <li>• Be honest and open in your reflections</li>
                      <li>• Take your time - there's no rush</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quest Progress */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quest Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Difficulty Level</span>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full ${
                            i < quest.difficulty
                              ? "bg-purple-500"
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Reward Points</span>
                    <span className="font-semibold text-purple-600">
                      {quest.points} SP
                    </span>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2 text-sm">
                      Bonus Opportunities:
                    </h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Photo reflection: +5 SP</li>
                      <li>• Audio reflection: +5 SP</li>
                      <li>• Detailed text: +5 SP</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reflection Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quest Reflection</CardTitle>
            <CardDescription>
              Share your experience and insights from this quest
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Text Reflection */}
            <div>
              <Label htmlFor="reflection" className="text-base font-medium">
                Written Reflection
              </Label>
              <Textarea
                id="reflection"
                placeholder="Describe your experience, what you learned, how you felt, and any insights you gained..."
                value={textReflection}
                onChange={(e) => setTextReflection(e.target.value)}
                className="mt-2 min-h-[120px]"
              />
            </div>

            {/* Media Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-base font-medium mb-2 block">
                  Photo Reflection (Optional)
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Capture a moment from your quest
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, "PHOTO");
                    }}
                    className="hidden"
                    id="photo-upload"
                  />
                  <Label htmlFor="photo-upload" className="cursor-pointer">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={uploadingFile}
                    >
                      {uploadingFile ? "Uploading..." : "Choose Photo"}
                    </Button>
                  </Label>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium mb-2 block">
                  Audio Reflection (Optional)
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Mic className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Record your thoughts and feelings
                  </p>
                  <Input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, "AUDIO");
                    }}
                    className="hidden"
                    id="audio-upload"
                  />
                  <Label htmlFor="audio-upload" className="cursor-pointer">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={uploadingFile}
                    >
                      {uploadingFile ? "Uploading..." : "Choose Audio"}
                    </Button>
                  </Label>
                </div>
              </div>
            </div>

            {/* Uploaded Reflections */}
            {reflections.length > 0 && (
              <div>
                <Label className="text-base font-medium mb-2 block">
                  Uploaded Reflections
                </Label>
                <div className="space-y-2">
                  {reflections.map((reflection, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-2 bg-gray-50 rounded"
                    >
                      {reflection.type === "PHOTO" ? (
                        <Camera className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Mic className="h-4 w-4 text-green-500" />
                      )}
                      <span className="text-sm">
                        {reflection.type === "PHOTO" ? "Photo" : "Audio"}{" "}
                        reflection uploaded
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        +5 SP
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Complete Quest Button */}
            <div className="pt-4 border-t">
              {textReflection.trim().length === 0 ? (
                <Alert>
                  <AlertDescription>
                    Please write a reflection to complete this quest.
                  </AlertDescription>
                </Alert>
              ) : (
                <Button
                  onClick={handleCompleteQuest}
                  disabled={completing}
                  className="w-full"
                  size="lg"
                >
                  {completing
                    ? "Completing Quest..."
                    : "Complete Quest & Earn Points"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
