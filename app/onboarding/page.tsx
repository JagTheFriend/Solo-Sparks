"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PERSONALITY_TRAITS = [
  {
    key: "introversion",
    label: "Introversion vs Extraversion",
    low: "Extravert",
    high: "Introvert",
  },
  {
    key: "openness",
    label: "Openness to Experience",
    low: "Traditional",
    high: "Creative",
  },
  {
    key: "conscientiousness",
    label: "Conscientiousness",
    low: "Flexible",
    high: "Organized",
  },
  {
    key: "agreeableness",
    label: "Agreeableness",
    low: "Competitive",
    high: "Cooperative",
  },
  {
    key: "neuroticism",
    label: "Emotional Stability",
    low: "Calm",
    high: "Sensitive",
  },
];

const EMOTIONAL_NEEDS = [
  { key: "selfCompassion", label: "Self-compassion and kindness" },
  { key: "creativity", label: "Creative expression" },
  { key: "adventure", label: "Adventure and new experiences" },
  { key: "connection", label: "Deeper self-connection" },
  { key: "mindfulness", label: "Mindfulness and presence" },
  { key: "growth", label: "Personal growth and learning" },
  { key: "relaxation", label: "Stress relief and relaxation" },
  { key: "confidence", label: "Building self-confidence" },
];

const PREFERENCES = [
  { key: "morningPerson", label: "I prefer morning activities" },
  { key: "outdoorActivities", label: "I enjoy outdoor activities" },
  { key: "socialActivities", label: "I like activities involving others" },
  { key: "physicalActivities", label: "I enjoy physical challenges" },
  { key: "creativeActivities", label: "I love creative pursuits" },
  { key: "intellectualActivities", label: "I prefer intellectual challenges" },
];

export default function Onboarding() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [traits, setTraits] = useState<Record<string, number>>({
    introversion: 5,
    openness: 5,
    conscientiousness: 5,
    agreeableness: 5,
    neuroticism: 5,
  });

  const [emotionalNeeds, setEmotionalNeeds] = useState<Record<string, boolean>>(
    {}
  );
  const [preferences, setPreferences] = useState<Record<string, boolean>>({});

  const handleTraitChange = (key: string, value: number[]) => {
    setTraits((prev) => ({ ...prev, [key]: value[0] }));
  };

  const handleEmotionalNeedChange = (key: string, checked: boolean) => {
    setEmotionalNeeds((prev) => ({ ...prev, [key]: checked }));
  };

  const handlePreferenceChange = (key: string, checked: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: checked }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          traits,
          emotionalNeeds,
          preferences,
        }),
      });

      if (response.ok) {
        // Small delay to ensure database transaction is complete
        setTimeout(() => {
          // Force a hard refresh to ensure dashboard gets updated data
          window.location.href = "/dashboard";
        }, 500);
      }
    } catch (error) {
      console.error("Profile creation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const progress = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Progress value={progress} className="w-full" />
          <p className="text-center mt-2 text-sm text-gray-600">
            Step {step} of 3
          </p>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Personality Assessment</CardTitle>
              <CardDescription>
                Help us understand your personality traits to personalize your
                quest experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {PERSONALITY_TRAITS.map((trait) => (
                <div key={trait.key} className="space-y-3">
                  <Label className="text-base font-medium">{trait.label}</Label>
                  <div className="px-3">
                    <Slider
                      value={[traits[trait.key]]}
                      onValueChange={(value) =>
                        handleTraitChange(trait.key, value)
                      }
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{trait.low}</span>
                      <span>{trait.high}</span>
                    </div>
                  </div>
                </div>
              ))}
              <Button onClick={() => setStep(2)} className="w-full">
                Next: Emotional Needs
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Emotional Needs</CardTitle>
              <CardDescription>
                Select the areas where you'd like to focus your personal growth
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {EMOTIONAL_NEEDS.map((need) => (
                <div key={need.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={need.key}
                    checked={emotionalNeeds[need.key] || false}
                    onCheckedChange={(checked) =>
                      handleEmotionalNeedChange(need.key, checked as boolean)
                    }
                  />
                  <Label htmlFor={need.key} className="text-sm font-normal">
                    {need.label}
                  </Label>
                </div>
              ))}
              <div className="flex space-x-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1">
                  Next: Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Activity Preferences</CardTitle>
              <CardDescription>
                Tell us about your activity preferences to better match you with
                quests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {PREFERENCES.map((pref) => (
                <div key={pref.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={pref.key}
                    checked={preferences[pref.key] || false}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange(pref.key, checked as boolean)
                    }
                  />
                  <Label htmlFor={pref.key} className="text-sm font-normal">
                    {pref.label}
                  </Label>
                </div>
              ))}
              <div className="flex space-x-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? "Creating Profile..." : "Complete Setup"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
