import type { MoodEntry, PersonalityProfile, Quest } from "@prisma/client";
import { prisma } from "./prisma";

interface QuestRecommendation {
  quest: Quest;
  score: number;
  reason: string;
}

export class QuestEngine {
  static async generatePersonalizedQuests(
    userId: string
  ): Promise<QuestRecommendation[]> {
    try {
      // Get user's personality profile and recent mood entries
      const profile = await prisma.personalityProfile.findUnique({
        where: { userId },
      });

      // If no profile exists, return empty recommendations
      if (!profile) {
        console.log("No personality profile found for user:", userId);
        return [];
      }

      const recentMoods = await prisma.moodEntry.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 7, // Last 7 mood entries
      });

      const userQuests = await prisma.userQuest.findMany({
        where: { userId },
        include: { quest: true },
      });

      // Get all available quests
      const availableQuests = await prisma.quest.findMany({
        where: { isActive: true },
      });

      console.log("Available quests:", availableQuests.length);
      console.log("User quests:", userQuests.length);

      // Filter out completed and assigned quests
      const completedOrAssignedQuestIds = userQuests.map((uq) => uq.questId);
      const uncompletedQuests = availableQuests.filter(
        (quest) => !completedOrAssignedQuestIds.includes(quest.id)
      );

      console.log("Uncompleted quests:", uncompletedQuests.length);

      // If no uncompleted quests, return empty array
      if (uncompletedQuests.length === 0) {
        return [];
      }

      // Score each quest based on user profile
      const recommendations: QuestRecommendation[] = [];
      const completedQuests = userQuests.filter(
        (uq) => uq.status === "COMPLETED"
      );

      for (const quest of uncompletedQuests) {
        const score = this.calculateQuestScore(
          quest,
          profile,
          recentMoods,
          completedQuests
        );
        const reason = this.generateRecommendationReason(
          quest,
          profile,
          recentMoods
        );

        recommendations.push({
          quest,
          score,
          reason,
        });
      }

      // Sort by score and return top recommendations
      const sortedRecommendations = recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, 8);
      console.log("Generated recommendations:", sortedRecommendations.length);

      return sortedRecommendations;
    } catch (error) {
      console.error("Error generating personalized quests:", error);
      return [];
    }
  }

  private static calculateQuestScore(
    quest: Quest,
    profile: PersonalityProfile,
    recentMoods: MoodEntry[],
    completedQuests: any[]
  ): number {
    let score = 50; // Base score

    try {
      const traits = profile.traits as any;
      const emotionalNeeds = profile.emotionalNeeds as any;
      const preferences = profile.preferences as any;

      // PERSONALITY TRAITS SCORING

      // Introversion/Extraversion scoring
      if (traits.introversion > 7) {
        // High introversion - prefer solo, reflective activities
        if (
          [
            "mindfulness",
            "self_care",
            "creative",
            "relaxation",
            "intellectual",
            "spiritual",
          ].includes(quest.category)
        ) {
          score += 25;
        }
        if (quest.category === "social") {
          score -= 20;
        }
      } else if (traits.introversion < 4) {
        // High extraversion - prefer social, active activities
        if (["social", "adventure", "physical"].includes(quest.category)) {
          score += 25;
        }
        if (["mindfulness", "relaxation"].includes(quest.category)) {
          score -= 10;
        }
      }

      // Openness to experience
      if (traits.openness > 7) {
        if (
          ["creative", "adventure", "intellectual", "spiritual"].includes(
            quest.category
          )
        ) {
          score += 30;
        }
        if (quest.difficulty >= 3) {
          score += 15; // High openness likes challenges
        }
      } else if (traits.openness < 4) {
        if (
          ["productivity", "self_care", "physical"].includes(quest.category)
        ) {
          score += 15;
        }
        if (quest.difficulty <= 2) {
          score += 10; // Low openness prefers familiar activities
        }
      }

      // Conscientiousness
      if (traits.conscientiousness > 7) {
        if (
          ["productivity", "intellectual", "physical"].includes(quest.category)
        ) {
          score += 25;
        }
        if (
          quest.requirements &&
          quest.requirements.duration &&
          quest.requirements.duration.includes("60")
        ) {
          score += 10; // Likes longer, structured activities
        }
      } else if (traits.conscientiousness < 4) {
        if (["creative", "mood_boost", "relaxation"].includes(quest.category)) {
          score += 15;
        }
        if (quest.difficulty <= 2) {
          score += 10; // Prefers easier, less structured activities
        }
      }

      // Agreeableness
      if (traits.agreeableness > 7) {
        if (["social", "spiritual", "self_care"].includes(quest.category)) {
          score += 20;
        }
      } else if (traits.agreeableness < 4) {
        if (
          ["intellectual", "adventure", "productivity"].includes(quest.category)
        ) {
          score += 15;
        }
      }

      // Neuroticism (emotional stability)
      if (traits.neuroticism > 7) {
        // High neuroticism - needs stress relief and mood support
        if (
          ["relaxation", "self_care", "mood_boost", "mindfulness"].includes(
            quest.category
          )
        ) {
          score += 30;
        }
        if (quest.difficulty >= 4) {
          score -= 15; // Avoid high-stress activities
        }
      } else if (traits.neuroticism < 4) {
        // Low neuroticism - can handle challenges
        if (["adventure", "social", "intellectual"].includes(quest.category)) {
          score += 15;
        }
        if (quest.difficulty >= 3) {
          score += 10; // Can handle challenging activities
        }
      }

      // EMOTIONAL NEEDS SCORING
      if (
        emotionalNeeds.selfCompassion &&
        ["self_care", "relaxation", "spiritual"].includes(quest.category)
      ) {
        score += 35;
      }

      if (
        emotionalNeeds.creativity &&
        ["creative", "adventure"].includes(quest.category)
      ) {
        score += 35;
      }

      if (
        emotionalNeeds.adventure &&
        ["adventure", "physical", "social"].includes(quest.category)
      ) {
        score += 35;
      }

      if (
        emotionalNeeds.connection &&
        ["social", "spiritual", "self_care"].includes(quest.category)
      ) {
        score += 30;
      }

      if (
        emotionalNeeds.mindfulness &&
        ["mindfulness", "relaxation", "spiritual"].includes(quest.category)
      ) {
        score += 35;
      }

      if (
        emotionalNeeds.growth &&
        ["intellectual", "productivity", "spiritual"].includes(quest.category)
      ) {
        score += 30;
      }

      if (
        emotionalNeeds.relaxation &&
        ["relaxation", "self_care", "mindfulness"].includes(quest.category)
      ) {
        score += 35;
      }

      if (
        emotionalNeeds.confidence &&
        ["adventure", "social", "productivity"].includes(quest.category)
      ) {
        score += 30;
      }

      // PREFERENCES SCORING
      if (
        preferences.morningPerson &&
        quest.requirements?.timeOfDay === "morning"
      ) {
        score += 20;
      }

      if (
        preferences.outdoorActivities &&
        quest.requirements?.location?.includes("outdoor")
      ) {
        score += 25;
      }

      if (preferences.socialActivities && quest.category === "social") {
        score += 25;
      } else if (!preferences.socialActivities && quest.category === "social") {
        score -= 15;
      }

      if (preferences.physicalActivities && quest.category === "physical") {
        score += 25;
      }

      if (preferences.creativeActivities && quest.category === "creative") {
        score += 25;
      }

      if (
        preferences.intellectualActivities &&
        quest.category === "intellectual"
      ) {
        score += 25;
      }

      // MOOD-BASED ADJUSTMENTS
      if (recentMoods.length > 0) {
        const avgMood =
          recentMoods.reduce((sum, entry) => sum + entry.mood, 0) /
          recentMoods.length;
        const avgEnergy =
          recentMoods.reduce((sum, entry) => sum + entry.energy, 0) /
          recentMoods.length;
        const avgStress =
          recentMoods.reduce((sum, entry) => sum + entry.stress, 0) /
          recentMoods.length;

        // Low mood - boost with mood-boosting activities
        if (avgMood < 5) {
          if (
            ["mood_boost", "self_care", "creative", "physical"].includes(
              quest.category
            )
          ) {
            score += 40;
          }
        }

        // Low energy - suggest gentler activities
        if (avgEnergy < 4) {
          if (
            ["relaxation", "mindfulness", "self_care"].includes(quest.category)
          ) {
            score += 30;
          }
          if (quest.difficulty > 3) {
            score -= 20;
          }
        }

        // High stress - prioritize stress relief
        if (avgStress > 7) {
          if (
            ["relaxation", "mindfulness", "self_care", "physical"].includes(
              quest.category
            )
          ) {
            score += 40;
          }
          if (["productivity", "intellectual"].includes(quest.category)) {
            score -= 15;
          }
        }

        // High energy - suggest more active quests
        if (avgEnergy > 7) {
          if (
            ["adventure", "physical", "social", "creative"].includes(
              quest.category
            )
          ) {
            score += 25;
          }
        }
      }

      // VARIETY AND ANTI-REPETITION
      if (completedQuests.length > 0) {
        const recentCompletedCategories = completedQuests
          .slice(-5)
          .map((uq) => uq.quest.category);
        const categoryCount = recentCompletedCategories.filter(
          (cat) => cat === quest.category
        ).length;

        // Reduce score for recently completed categories
        if (categoryCount > 0) {
          score -= 15 * categoryCount;
        }

        // Boost score for categories not recently completed
        const allCategories = [
          "mindfulness",
          "self_care",
          "creative",
          "adventure",
          "mood_boost",
          "relaxation",
          "productivity",
          "social",
          "physical",
          "intellectual",
          "spiritual",
        ];
        const untriedCategories = allCategories.filter(
          (cat) => !recentCompletedCategories.includes(cat)
        );

        if (untriedCategories.includes(quest.category)) {
          score += 20;
        }
      }

      // DIFFICULTY BALANCING
      const completedDifficulties = completedQuests.map(
        (uq) => uq.quest.difficulty
      );
      const avgCompletedDifficulty =
        completedDifficulties.length > 0
          ? completedDifficulties.reduce((sum, diff) => sum + diff, 0) /
            completedDifficulties.length
          : 2;

      // Gradually increase difficulty as user progresses
      if (
        completedQuests.length > 3 &&
        quest.difficulty <= avgCompletedDifficulty
      ) {
        score -= 10; // Encourage progression
      }

      if (
        completedQuests.length > 5 &&
        quest.difficulty > avgCompletedDifficulty + 1
      ) {
        score += 15; // Reward taking on challenges
      }

      return Math.max(15, Math.min(100, score)); // Ensure score is between 15-100
    } catch (error) {
      console.error("Error calculating quest score:", error);
      return 50; // Return base score on error
    }
  }

  private static generateRecommendationReason(
    quest: Quest,
    profile: PersonalityProfile,
    recentMoods: MoodEntry[]
  ): string {
    try {
      const traits = profile.traits as any;
      const emotionalNeeds = profile.emotionalNeeds as any;
      const preferences = profile.preferences as any;

      // Priority order: Mood -> Emotional Needs -> Personality -> Preferences

      // Check mood patterns first (most immediate need)
      if (recentMoods.length > 0) {
        const avgMood =
          recentMoods.reduce((sum, entry) => sum + entry.mood, 0) /
          recentMoods.length;
        const avgEnergy =
          recentMoods.reduce((sum, entry) => sum + entry.energy, 0) /
          recentMoods.length;
        const avgStress =
          recentMoods.reduce((sum, entry) => sum + entry.stress, 0) /
          recentMoods.length;

        if (
          avgMood < 5 &&
          ["mood_boost", "self_care", "creative"].includes(quest.category)
        ) {
          return "Your recent mood patterns suggest this uplifting quest could help brighten your day.";
        }

        if (
          avgStress > 7 &&
          ["relaxation", "mindfulness", "self_care"].includes(quest.category)
        ) {
          return "Based on your stress levels, this calming quest can help you find peace and balance.";
        }

        if (
          avgEnergy < 4 &&
          ["relaxation", "mindfulness"].includes(quest.category)
        ) {
          return "Your energy levels suggest this gentle quest would be perfect for recharging.";
        }

        if (
          avgEnergy > 7 &&
          ["adventure", "physical", "social"].includes(quest.category)
        ) {
          return "Your high energy makes this active quest an ideal match for you right now.";
        }
      }

      // Check emotional needs (core motivations)
      if (
        emotionalNeeds.selfCompassion &&
        ["self_care", "relaxation", "spiritual"].includes(quest.category)
      ) {
        return "This quest aligns with your desire for self-compassion and will help you practice kindness toward yourself.";
      }

      if (
        emotionalNeeds.creativity &&
        ["creative", "adventure"].includes(quest.category)
      ) {
        return "Your creative spirit will flourish with this quest that encourages artistic expression and innovation.";
      }

      if (
        emotionalNeeds.adventure &&
        ["adventure", "physical"].includes(quest.category)
      ) {
        return "This quest satisfies your adventurous nature and desire for new experiences.";
      }

      if (
        emotionalNeeds.connection &&
        ["social", "spiritual"].includes(quest.category)
      ) {
        return "This quest supports your need for deeper connection, whether with others or your inner self.";
      }

      if (
        emotionalNeeds.mindfulness &&
        ["mindfulness", "relaxation", "spiritual"].includes(quest.category)
      ) {
        return "Perfect for your mindfulness journey - this quest will help you cultivate presence and awareness.";
      }

      if (
        emotionalNeeds.growth &&
        ["intellectual", "productivity", "spiritual"].includes(quest.category)
      ) {
        return "This quest supports your personal growth goals and desire for continuous learning.";
      }

      if (
        emotionalNeeds.relaxation &&
        ["relaxation", "self_care", "mindfulness"].includes(quest.category)
      ) {
        return "Ideal for your need to unwind and release stress - this quest promotes deep relaxation.";
      }

      if (
        emotionalNeeds.confidence &&
        ["adventure", "social", "productivity"].includes(quest.category)
      ) {
        return "This quest will help build your confidence through meaningful challenges and achievements.";
      }

      // Check personality traits
      if (
        traits.introversion > 7 &&
        ["mindfulness", "self_care", "creative"].includes(quest.category)
      ) {
        return "This reflective quest aligns perfectly with your introverted nature and need for solitude.";
      }

      if (
        traits.introversion < 4 &&
        ["social", "adventure"].includes(quest.category)
      ) {
        return "Your extraverted energy will thrive with this engaging, outward-focused quest.";
      }

      if (
        traits.openness > 7 &&
        ["creative", "adventure", "intellectual"].includes(quest.category)
      ) {
        return "Your high openness to experience makes this innovative quest an exciting opportunity for growth.";
      }

      if (
        traits.conscientiousness > 7 &&
        ["productivity", "intellectual"].includes(quest.category)
      ) {
        return "This structured quest appeals to your organized nature and desire for achievement.";
      }

      if (
        traits.agreeableness > 7 &&
        ["social", "spiritual"].includes(quest.category)
      ) {
        return "This quest resonates with your cooperative spirit and care for others' wellbeing.";
      }

      if (
        traits.neuroticism > 7 &&
        ["relaxation", "self_care", "mindfulness"].includes(quest.category)
      ) {
        return "This soothing quest is designed to support emotional stability and inner peace.";
      }

      // Check preferences
      if (
        preferences.outdoorActivities &&
        quest.requirements?.location?.includes("outdoor")
      ) {
        return "Perfect for your love of outdoor activities - this quest combines growth with nature.";
      }

      if (preferences.creativeActivities && quest.category === "creative") {
        return "This creative quest is tailored for your artistic interests and expressive nature.";
      }

      if (
        preferences.intellectualActivities &&
        quest.category === "intellectual"
      ) {
        return "This intellectually stimulating quest will engage your curious mind and love of learning.";
      }

      if (preferences.physicalActivities && quest.category === "physical") {
        return "This quest combines personal growth with physical activity, perfect for your active lifestyle.";
      }

      if (preferences.socialActivities && quest.category === "social") {
        return "This social quest aligns with your preference for connecting and engaging with others.";
      }

      // Default reasons based on quest category
      const categoryReasons: Record<string, string> = {
        mindfulness:
          "This mindfulness quest will help you develop greater self-awareness and presence.",
        self_care:
          "This self-care quest encourages you to prioritize your wellbeing and practice self-love.",
        creative:
          "This creative quest offers a wonderful outlet for self-expression and artistic exploration.",
        adventure:
          "This adventure quest will push your boundaries and create memorable growth experiences.",
        mood_boost:
          "This uplifting quest is designed to enhance your mood and bring more joy into your day.",
        relaxation:
          "This relaxing quest provides a peaceful break and helps restore your inner balance.",
        productivity:
          "This productivity quest will help you organize your life and achieve your goals more effectively.",
        social:
          "This social quest encourages meaningful connections and community engagement.",
        physical:
          "This physical quest supports your body's health while nurturing your overall wellbeing.",
        intellectual:
          "This intellectual quest will challenge your mind and expand your knowledge base.",
        spiritual:
          "This spiritual quest invites deeper reflection on meaning, purpose, and connection.",
      };

      return (
        categoryReasons[quest.category] ||
        "This quest offers a valuable opportunity for personal growth and self-discovery."
      );
    } catch (error) {
      console.error("Error generating recommendation reason:", error);
      return "This quest will support your personal growth journey in meaningful ways.";
    }
  }
}
