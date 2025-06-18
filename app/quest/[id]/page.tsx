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
import { Camera, CheckCircle, ImageIcon, X } from "lucide-react";
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

interface SelectedImage {
  file: File;
  preview: string;
  id: string;
}

interface Reflection {
  type: "TEXT" | "PHOTO";
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
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    fetchQuest();
  }, [id]);

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      selectedImages.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, []);

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

  const handleImageSelection = (files: FileList | null) => {
    if (!files) return;

    const newImages: SelectedImage[] = [];
    const remainingSlots = 5 - selectedImages.length;

    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const file = files[i];

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not an image file`);
        continue;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 10MB`);
        continue;
      }

      const preview = URL.createObjectURL(file);
      newImages.push({
        file,
        preview,
        id: Math.random().toString(36).substr(2, 9),
      });
    }

    setSelectedImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (imageId: string) => {
    setSelectedImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === imageId);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter((img) => img.id !== imageId);
    });
  };

  const uploadImages = async (): Promise<Reflection[]> => {
    if (selectedImages.length === 0) return [];

    setUploadingImages(true);
    const uploadedReflections: Reflection[] = [];

    try {
      for (const image of selectedImages) {
        const formData = new FormData();
        formData.append("file", image.file);
        formData.append("folder", `user_${session?.user?.id}`);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const { url } = await response.json();
          uploadedReflections.push({
            type: "PHOTO",
            content: url,
            metadata: {
              fileName: image.file.name,
              fileSize: image.file.size,
              uploadedAt: new Date().toISOString(),
            },
          });
        } else {
          throw new Error(`Failed to upload ${image.file.name}`);
        }
      }
    } catch (error) {
      console.error("Image upload error:", error);
      throw error;
    } finally {
      setUploadingImages(false);
    }

    return uploadedReflections;
  };

  const handleCompleteQuest = async () => {
    if (!questData?.quest) return;

    setCompleting(true);

    try {
      // Upload images first
      const uploadedReflections = await uploadImages();

      const response = await fetch(
        `/api/quests/${questData.quest.id}/complete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reflection: textReflection,
            reflections: uploadedReflections,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCompleted(true);

        // Clean up preview URLs
        selectedImages.forEach((image) => {
          URL.revokeObjectURL(image.preview);
        });

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
      alert("An error occurred while uploading images. Please try again.");
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
              Congratulations! You've earned{" "}
              {quest.points + selectedImages.length * 5} Spark Points.
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
                    <span className="text-sm">Base Points</span>
                    <span className="font-semibold text-purple-600">
                      {quest.points} SP
                    </span>
                  </div>

                  {selectedImages.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Photo Bonus</span>
                      <span className="font-semibold text-green-600">
                        +{selectedImages.length * 5} SP
                      </span>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2 text-sm">
                      Bonus Opportunities:
                    </h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Each photo: +5 SP (max 5 photos)</li>
                      <li>• Detailed reflection: +5 SP</li>
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

            {/* Photo Upload */}
            <div>
              <Label className="text-base font-medium mb-2 block">
                Photo Reflections (Optional) - {selectedImages.length}/5
              </Label>

              {selectedImages.length < 5 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
                  <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Add up to {5 - selectedImages.length} more photos from your
                    quest
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageSelection(e.target.files)}
                    className="hidden"
                    id="photo-upload"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document.getElementById("photo-upload")?.click()
                    }
                    type="button"
                  >
                    Choose Photos
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    Max 10MB per image. Supported formats: JPG, PNG, GIF, WebP
                  </p>
                </div>
              )}

              {/* Image Previews */}
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {selectedImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={image.preview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(image.id)}
                        type="button"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <div className="absolute bottom-1 left-1 right-1">
                        <div className="bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded truncate">
                          {image.file.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedImages.length > 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <ImageIcon className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800">
                      {selectedImages.length} photo
                      {selectedImages.length !== 1 ? "s" : ""} selected
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      +{selectedImages.length * 5} SP
                    </Badge>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    Photos will be uploaded when you complete the quest
                  </p>
                </div>
              )}
            </div>

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
                  disabled={completing || uploadingImages}
                  className="w-full"
                  size="lg"
                >
                  {completing
                    ? uploadingImages
                      ? "Uploading images..."
                      : "Completing Quest..."
                    : `Complete Quest & Earn ${
                        quest.points + selectedImages.length * 5
                      } Points`}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
