import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing data
  console.log("🧹 Clearing existing quests and rewards...");
  await prisma.quest.deleteMany();
  await prisma.reward.deleteMany();

  // Seed Quests
  console.log("📝 Seeding quests...");

  // MINDFULNESS & MEDITATION QUESTS
  const mindfulnessQuests = [
    {
      id: "quest_mindful_001",
      title: "Morning Mindfulness Ritual",
      description:
        "Start your day with 10 minutes of mindful breathing. Sit quietly, focus on your breath, and set an intention for the day ahead.",
      category: "mindfulness",
      difficulty: 1,
      points: 15,
      requirements: {
        timeOfDay: "morning",
        duration: "10 minutes",
        location: "quiet space",
      },
      isActive: true,
    },
    {
      id: "quest_mindful_002",
      title: "Sunset Reflection Journey",
      description:
        "Find a peaceful spot to watch the sunset. As you watch, reflect on three things you're grateful for today and one thing you learned about yourself this week.",
      category: "mindfulness",
      difficulty: 2,
      points: 25,
      requirements: {
        timeOfDay: "evening",
        duration: "30 minutes",
        location: "outdoor preferred",
      },
      isActive: true,
    },
    {
      id: "quest_mindful_003",
      title: "Mindful Walking Meditation",
      description:
        "Take a 15-minute walk focusing only on your breath and surroundings. Notice five things you see, four things you hear, three things you feel, two things you smell, and one thing you taste.",
      category: "mindfulness",
      difficulty: 2,
      points: 20,
      requirements: {
        timeOfDay: "any",
        duration: "15 minutes",
        location: "outdoor",
      },
      isActive: true,
    },
    {
      id: "quest_mindful_004",
      title: "Body Scan Meditation",
      description:
        "Lie down comfortably and slowly scan your body from head to toe, noticing any sensations without judgment. Practice accepting your body as it is today.",
      category: "mindfulness",
      difficulty: 2,
      points: 20,
      requirements: {
        timeOfDay: "any",
        duration: "20 minutes",
        location: "private space",
      },
      isActive: true,
    },
    {
      id: "quest_mindful_005",
      title: "Mindful Eating Experience",
      description:
        "Choose one meal today to eat in complete silence and mindfulness. Notice the colors, textures, flavors, and how the food makes you feel.",
      category: "mindfulness",
      difficulty: 1,
      points: 15,
      requirements: {
        timeOfDay: "any",
        duration: "30 minutes",
        location: "anywhere",
      },
      isActive: true,
    },
    {
      id: "quest_mindful_006",
      title: "Digital Detox Hour",
      description:
        "Spend one hour completely disconnected from all digital devices. Use this time for reading, stretching, or simply sitting in silence.",
      category: "mindfulness",
      difficulty: 2,
      points: 25,
      requirements: {
        timeOfDay: "any",
        duration: "60 minutes",
        location: "anywhere",
      },
      isActive: true,
    },
    {
      id: "quest_mindful_007",
      title: "Gratitude Meditation",
      description:
        "Spend 15 minutes in meditation focusing solely on things you're grateful for. Start with your breath, then expand to people, experiences, and simple pleasures.",
      category: "mindfulness",
      difficulty: 1,
      points: 15,
      requirements: {
        timeOfDay: "any",
        duration: "15 minutes",
        location: "quiet space",
      },
      isActive: true,
    },
    {
      id: "quest_mindful_008",
      title: "Loving-Kindness Practice",
      description:
        "Practice sending loving thoughts to yourself, then to loved ones, neutral people, difficult people, and finally all beings. Notice how this affects your heart.",
      category: "mindfulness",
      difficulty: 3,
      points: 30,
      requirements: {
        timeOfDay: "any",
        duration: "25 minutes",
        location: "quiet space",
      },
      isActive: true,
    },
  ];

  // SELF-CARE & SELF-COMPASSION QUESTS
  const selfCareQuests = [
    {
      id: "quest_selfcare_001",
      title: "Solo Coffee Date",
      description:
        "Take yourself on a coffee date. Sit in a café, order your favorite drink, and spend 20 minutes journaling about your dreams and aspirations.",
      category: "self_care",
      difficulty: 1,
      points: 20,
      requirements: {
        timeOfDay: "any",
        duration: "30 minutes",
        location: "café or home",
      },
      isActive: true,
    },
    {
      id: "quest_selfcare_002",
      title: "Self-Compassion Letter",
      description:
        "Write a kind, understanding letter to yourself as if you were writing to a dear friend going through the same challenges you face.",
      category: "self_care",
      difficulty: 2,
      points: 25,
      requirements: {
        timeOfDay: "any",
        duration: "30 minutes",
        location: "private space",
      },
      isActive: true,
    },
    {
      id: "quest_selfcare_003",
      title: "Pamper Yourself Evening",
      description:
        "Create a spa experience at home. Take a warm bath, do a face mask, light candles, and play soothing music. Focus on nurturing yourself.",
      category: "self_care",
      difficulty: 1,
      points: 20,
      requirements: {
        timeOfDay: "evening",
        duration: "60 minutes",
        location: "home",
      },
      isActive: true,
    },
    {
      id: "quest_selfcare_004",
      title: "Solo Movie Night",
      description:
        "Choose a movie that makes you feel good, prepare your favorite snacks, and enjoy a cozy night in celebrating your own company.",
      category: "self_care",
      difficulty: 1,
      points: 15,
      requirements: {
        timeOfDay: "evening",
        duration: "2 hours",
        location: "home",
      },
      isActive: true,
    },
    {
      id: "quest_selfcare_005",
      title: "Boundary Setting Practice",
      description:
        "Identify one area where you need better boundaries. Write down what you need and practice saying no to something that doesn't serve you.",
      category: "self_care",
      difficulty: 3,
      points: 35,
      requirements: {
        timeOfDay: "any",
        duration: "45 minutes",
        location: "private space",
      },
      isActive: true,
    },
    {
      id: "quest_selfcare_006",
      title: "Solo Restaurant Adventure",
      description:
        "Take yourself out to a nice restaurant. Practice enjoying your own company, savoring the food, and people-watching without judgment.",
      category: "self_care",
      difficulty: 2,
      points: 30,
      requirements: {
        timeOfDay: "any",
        duration: "90 minutes",
        location: "restaurant",
      },
      isActive: true,
    },
    {
      id: "quest_selfcare_007",
      title: "Morning Self-Appreciation",
      description:
        "Start your day by looking in the mirror and giving yourself three genuine compliments. Focus on both inner and outer qualities.",
      category: "self_care",
      difficulty: 1,
      points: 15,
      requirements: {
        timeOfDay: "morning",
        duration: "10 minutes",
        location: "home",
      },
      isActive: true,
    },
    {
      id: "quest_selfcare_008",
      title: "Energy Audit",
      description:
        "List all your current commitments and rate how much energy each gives or takes. Identify what you want to add or remove from your life.",
      category: "self_care",
      difficulty: 2,
      points: 25,
      requirements: {
        timeOfDay: "any",
        duration: "45 minutes",
        location: "quiet space",
      },
      isActive: true,
    },
    {
      id: "quest_selfcare_009",
      title: "Solo Shopping Trip",
      description:
        "Go shopping alone and buy yourself something special - whether it's clothes, books, or a small treat. Practice enjoying your own decision-making.",
      category: "self_care",
      difficulty: 1,
      points: 20,
      requirements: {
        timeOfDay: "any",
        duration: "60 minutes",
        location: "shopping area",
      },
      isActive: true,
    },
    {
      id: "quest_selfcare_010",
      title: "Forgiveness Practice",
      description:
        "Write a letter forgiving yourself for a past mistake. Focus on learning, growth, and self-compassion rather than self-criticism.",
      category: "self_care",
      difficulty: 3,
      points: 30,
      requirements: {
        timeOfDay: "any",
        duration: "40 minutes",
        location: "private space",
      },
      isActive: true,
    },
  ];

  // CREATIVE EXPRESSION QUESTS
  const creativeQuests = [
    {
      id: "quest_creative_001",
      title: "Creative Expression Hour",
      description:
        "Spend an hour creating something with your hands - draw, paint, write poetry, or craft. Focus on the process, not the outcome.",
      category: "creative",
      difficulty: 2,
      points: 25,
      requirements: {
        timeOfDay: "any",
        duration: "60 minutes",
        location: "quiet space",
      },
      isActive: true,
    },
    {
      id: "quest_creative_002",
      title: "Photography Walk",
      description:
        "Take a walk with the goal of capturing beauty in ordinary things. Take at least 20 photos of things that catch your eye or make you feel something.",
      category: "creative",
      difficulty: 1,
      points: 20,
      requirements: {
        timeOfDay: "any",
        duration: "45 minutes",
        location: "outdoor",
      },
      isActive: true,
    },
    {
      id: "quest_creative_003",
      title: "Stream of Consciousness Writing",
      description:
        "Set a timer for 20 minutes and write continuously without stopping or editing. Let your thoughts flow freely onto paper.",
      category: "creative",
      difficulty: 1,
      points: 15,
      requirements: {
        timeOfDay: "any",
        duration: "20 minutes",
        location: "quiet space",
      },
      isActive: true,
    },
    {
      id: "quest_creative_004",
      title: "Music and Movement",
      description:
        "Put on your favorite music and dance or move your body for 15 minutes. Focus on how the music makes you feel and express it through movement.",
      category: "creative",
      difficulty: 1,
      points: 15,
      requirements: {
        timeOfDay: "any",
        duration: "15 minutes",
        location: "private space",
      },
      isActive: true,
    },
    {
      id: "quest_creative_005",
      title: "Vision Board Creation",
      description:
        "Create a visual representation of your dreams and goals using magazines, photos, or drawings. Focus on what truly excites you.",
      category: "creative",
      difficulty: 2,
      points: 30,
      requirements: {
        timeOfDay: "any",
        duration: "90 minutes",
        location: "home",
      },
      isActive: true,
    },
    {
      id: "quest_creative_006",
      title: "Poetry from the Heart",
      description:
        "Write a poem about your current emotional state or a recent experience. Don't worry about rhyming or structure - focus on authentic expression.",
      category: "creative",
      difficulty: 2,
      points: 20,
      requirements: {
        timeOfDay: "any",
        duration: "30 minutes",
        location: "quiet space",
      },
      isActive: true,
    },
    {
      id: "quest_creative_007",
      title: "Cooking Experiment",
      description:
        "Try cooking a new recipe or create your own dish using ingredients you love. Focus on the creative process and enjoy the sensory experience.",
      category: "creative",
      difficulty: 2,
      points: 25,
      requirements: {
        timeOfDay: "any",
        duration: "60 minutes",
        location: "kitchen",
      },
      isActive: true,
    },
    {
      id: "quest_creative_008",
      title: "Storytelling Practice",
      description:
        "Write a short story about a character who represents a part of yourself you'd like to explore or develop further.",
      category: "creative",
      difficulty: 3,
      points: 30,
      requirements: {
        timeOfDay: "any",
        duration: "60 minutes",
        location: "quiet space",
      },
      isActive: true,
    },
    {
      id: "quest_creative_009",
      title: "Collage of Emotions",
      description:
        "Create a collage that represents your current emotional landscape using colors, textures, and images that resonate with how you feel.",
      category: "creative",
      difficulty: 2,
      points: 25,
      requirements: {
        timeOfDay: "any",
        duration: "45 minutes",
        location: "home",
      },
      isActive: true,
    },
    {
      id: "quest_creative_010",
      title: "Singing Your Truth",
      description:
        "Spend 15 minutes singing - whether it's your favorite songs, humming, or making up melodies. Focus on how it feels to use your voice.",
      category: "creative",
      difficulty: 1,
      points: 15,
      requirements: {
        timeOfDay: "any",
        duration: "15 minutes",
        location: "private space",
      },
      isActive: true,
    },
  ];

  // ADVENTURE & EXPLORATION QUESTS
  const adventureQuests = [
    {
      id: "quest_adventure_001",
      title: "Solo Exploration Walk",
      description:
        "Explore a neighborhood or area you've never been to before. Walk without a destination and see what you discover about the place and yourself.",
      category: "adventure",
      difficulty: 2,
      points: 25,
      requirements: {
        timeOfDay: "any",
        duration: "60 minutes",
        location: "new area",
      },
      isActive: true,
    },
    {
      id: "quest_adventure_002",
      title: "Comfort Zone Challenge",
      description:
        "Do one small thing that makes you slightly uncomfortable but isn't harmful - try a new food, start a conversation with a stranger, or take a different route home.",
      category: "adventure",
      difficulty: 3,
      points: 35,
      requirements: {
        timeOfDay: "any",
        duration: "varies",
        location: "anywhere",
      },
      isActive: true,
    },
    {
      id: "quest_adventure_003",
      title: "Solo Museum Visit",
      description:
        "Visit a museum, gallery, or cultural site alone. Take your time, read everything that interests you, and reflect on what moves you.",
      category: "adventure",
      difficulty: 2,
      points: 30,
      requirements: {
        timeOfDay: "any",
        duration: "2 hours",
        location: "museum/gallery",
      },
      isActive: true,
    },
    {
      id: "quest_adventure_004",
      title: "Nature Adventure",
      description:
        "Spend at least an hour in nature - hiking, sitting by water, or exploring a park. Focus on connecting with the natural world around you.",
      category: "adventure",
      difficulty: 2,
      points: 25,
      requirements: {
        timeOfDay: "any",
        duration: "60 minutes",
        location: "outdoor/nature",
      },
      isActive: true,
    },
    {
      id: "quest_adventure_005",
      title: "Solo Concert or Event",
      description:
        "Attend a live music event, lecture, or performance alone. Practice enjoying the experience and meeting new people if you feel comfortable.",
      category: "adventure",
      difficulty: 3,
      points: 40,
      requirements: {
        timeOfDay: "evening",
        duration: "2-3 hours",
        location: "venue",
      },
      isActive: true,
    },
    {
      id: "quest_adventure_006",
      title: "Adventure Planning Session",
      description:
        "Plan a solo adventure for the next month. Research a place you've never been, an activity you've never tried, or a skill you'd like to learn.",
      category: "adventure",
      difficulty: 2,
      points: 20,
      requirements: {
        timeOfDay: "any",
        duration: "45 minutes",
        location: "anywhere",
      },
      isActive: true,
    },
    {
      id: "quest_adventure_007",
      title: "Solo Road Trip",
      description:
        "Take a short solo drive to somewhere you've never been. Stop when something catches your interest and explore with curiosity.",
      category: "adventure",
      difficulty: 3,
      points: 35,
      requirements: {
        timeOfDay: "any",
        duration: "3 hours",
        location: "road trip",
      },
      isActive: true,
    },
    {
      id: "quest_adventure_008",
      title: "New Skill Attempt",
      description:
        "Try learning something completely new for 30 minutes - a language, instrument, dance move, or craft. Focus on the joy of being a beginner.",
      category: "adventure",
      difficulty: 2,
      points: 25,
      requirements: {
        timeOfDay: "any",
        duration: "30 minutes",
        location: "anywhere",
      },
      isActive: true,
    },
    {
      id: "quest_adventure_009",
      title: "Solo Sunrise or Sunset",
      description:
        "Wake up early to watch the sunrise or find a good spot for sunset. Spend this time in quiet contemplation about new beginnings.",
      category: "adventure",
      difficulty: 2,
      points: 25,
      requirements: {
        timeOfDay: "sunrise/sunset",
        duration: "45 minutes",
        location: "outdoor",
      },
      isActive: true,
    },
    {
      id: "quest_adventure_010",
      title: "Random Acts of Kindness",
      description:
        "Perform three small acts of kindness for strangers today. Notice how giving to others makes you feel about yourself.",
      category: "adventure",
      difficulty: 2,
      points: 30,
      requirements: {
        timeOfDay: "any",
        duration: "throughout day",
        location: "anywhere",
      },
      isActive: true,
    },
  ];

  // MOOD BOOST & JOY QUESTS
  const moodBoostQuests = [
    {
      id: "quest_mood_001",
      title: "Gratitude Photo Walk",
      description:
        "Take a walk and photograph five things that make you feel grateful. Write a short reflection about why each one matters to you.",
      category: "mood_boost",
      difficulty: 2,
      points: 30,
      requirements: {
        timeOfDay: "any",
        duration: "30 minutes",
        location: "outdoor",
      },
      isActive: true,
    },
    {
      id: "quest_mood_002",
      title: "Inner Child Play Time",
      description:
        "Spend 30 minutes doing something that brought you joy as a child - coloring, playing with toys, dancing to music, or building something.",
      category: "mood_boost",
      difficulty: 1,
      points: 25,
      requirements: {
        timeOfDay: "any",
        duration: "30 minutes",
        location: "private space",
      },
      isActive: true,
    },
    {
      id: "quest_mood_003",
      title: "Laughter Therapy",
      description:
        "Watch funny videos, read jokes, or do something silly for 20 minutes. Focus on letting yourself laugh freely and notice how it affects your mood.",
      category: "mood_boost",
      difficulty: 1,
      points: 20,
      requirements: {
        timeOfDay: "any",
        duration: "20 minutes",
        location: "anywhere",
      },
      isActive: true,
    },
    {
      id: "quest_mood_004",
      title: "Compliment Collection",
      description:
        "Give genuine compliments to five different people today (in person, text, or online). Notice how making others feel good affects your own mood.",
      category: "mood_boost",
      difficulty: 2,
      points: 25,
      requirements: {
        timeOfDay: "any",
        duration: "throughout day",
        location: "anywhere",
      },
      isActive: true,
    },
    {
      id: "quest_mood_005",
      title: "Favorite Things List",
      description:
        "Make a list of 50 things that make you happy, from big life events to tiny daily pleasures. Keep this list for future mood boosts.",
      category: "mood_boost",
      difficulty: 1,
      points: 20,
      requirements: {
        timeOfDay: "any",
        duration: "30 minutes",
        location: "anywhere",
      },
      isActive: true,
    },
    {
      id: "quest_mood_006",
      title: "Solo Dance Party",
      description:
        "Put on your favorite upbeat music and dance alone for 15 minutes. Let yourself move however feels good without worrying about how you look.",
      category: "mood_boost",
      difficulty: 1,
      points: 20,
      requirements: {
        timeOfDay: "any",
        duration: "15 minutes",
        location: "private space",
      },
      isActive: true,
    },
    {
      id: "quest_mood_007",
      title: "Sunshine Vitamin",
      description:
        "Spend 20 minutes outside in natural sunlight. If it's sunny, sit or walk in the sun. If cloudy, still spend time outdoors breathing fresh air.",
      category: "mood_boost",
      difficulty: 1,
      points: 15,
      requirements: {
        timeOfDay: "any",
        duration: "20 minutes",
        location: "outdoor",
      },
      isActive: true,
    },
    {
      id: "quest_mood_008",
      title: "Memory Lane Journey",
      description:
        "Look through old photos or mementos that bring back happy memories. Spend time reliving positive moments and appreciating your journey.",
      category: "mood_boost",
      difficulty: 1,
      points: 20,
      requirements: {
        timeOfDay: "any",
        duration: "30 minutes",
        location: "home",
      },
      isActive: true,
    },
    {
      id: "quest_mood_009",
      title: "Treat Yourself",
      description:
        "Buy or make yourself a small treat that brings you joy - your favorite coffee, a piece of chocolate, or a small item you've been wanting.",
      category: "mood_boost",
      difficulty: 1,
      points: 15,
      requirements: {
        timeOfDay: "any",
        duration: "30 minutes",
        location: "anywhere",
      },
      isActive: true,
    },
    {
      id: "quest_mood_010",
      title: "Positive Affirmations",
      description:
        "Stand in front of a mirror and say 10 positive affirmations about yourself. Focus on your strengths, growth, and potential.",
      category: "mood_boost",
      difficulty: 2,
      points: 20,
      requirements: {
        timeOfDay: "any",
        duration: "15 minutes",
        location: "private space",
      },
      isActive: true,
    },
  ];

  // RELAXATION & STRESS RELIEF QUESTS
  const relaxationQuests = [
    {
      id: "quest_relax_001",
      title: "Progressive Muscle Relaxation",
      description:
        "Lie down and systematically tense and release each muscle group in your body, starting from your toes and working up to your head.",
      category: "relaxation",
      difficulty: 2,
      points: 20,
      requirements: {
        timeOfDay: "any",
        duration: "25 minutes",
        location: "quiet space",
      },
      isActive: true,
    },
    {
      id: "quest_relax_002",
      title: "Aromatherapy Session",
      description:
        "Create a calming environment with essential oils, candles, or incense. Spend 20 minutes breathing deeply and focusing on the soothing scents.",
      category: "relaxation",
      difficulty: 1,
      points: 15,
      requirements: {
        timeOfDay: "any",
        duration: "20 minutes",
        location: "home",
      },
      isActive: true,
    },
    {
      id: "quest_relax_003",
      title: "Gentle Yoga Flow",
      description:
        "Do 20 minutes of gentle, restorative yoga focusing on stretches that feel good to your body. Listen to what your body needs today.",
      category: "relaxation",
      difficulty: 2,
      points: 25,
      requirements: {
        timeOfDay: "any",
        duration: "20 minutes",
        location: "quiet space",
      },
      isActive: true,
    },
    {
      id: "quest_relax_004",
      title: "Tea Meditation",
      description:
        "Prepare and drink a cup of herbal tea mindfully. Focus on the warmth, aroma, and taste while letting your mind settle.",
      category: "relaxation",
      difficulty: 1,
      points: 15,
      requirements: {
        timeOfDay: "any",
        duration: "20 minutes",
        location: "quiet space",
      },
      isActive: true,
    },
    {
      id: "quest_relax_005",
      title: "Breathing Exercise",
      description:
        "Practice the 4-7-8 breathing technique: inhale for 4, hold for 7, exhale for 8. Repeat for 10 cycles and notice how your body feels.",
      category: "relaxation",
      difficulty: 1,
      points: 10,
      requirements: {
        timeOfDay: "any",
        duration: "10 minutes",
        location: "anywhere",
      },
      isActive: true,
    },
    {
      id: "quest_relax_006",
      title: "Nature Sounds Meditation",
      description:
        "Find a peaceful outdoor spot or play nature sounds. Sit quietly for 15 minutes focusing only on the natural sounds around you.",
      category: "relaxation",
      difficulty: 1,
      points: 15,
      requirements: {
        timeOfDay: "any",
        duration: "15 minutes",
        location: "quiet space",
      },
      isActive: true,
    },
    {
      id: "quest_relax_007",
      title: "Warm Bath Ritual",
      description:
        "Take a warm bath with Epsom salts or bath oils. Use this time to let go of the day's stress and practice self-care.",
      category: "relaxation",
      difficulty: 1,
      points: 20,
      requirements: {
        timeOfDay: "evening",
        duration: "30 minutes",
        location: "home",
      },
      isActive: true,
    },
    {
      id: "quest_relax_008",
      title: "Gentle Stretching",
      description:
        "Spend 15 minutes doing gentle stretches, focusing on areas where you hold tension. Move slowly and breathe deeply.",
      category: "relaxation",
      difficulty: 1,
      points: 15,
      requirements: {
        timeOfDay: "any",
        duration: "15 minutes",
        location: "quiet space",
      },
      isActive: true,
    },
    {
      id: "quest_relax_009",
      title: "Worry Time",
      description:
        "Set aside 15 minutes to write down all your worries, then consciously choose to let them go for the rest of the day.",
      category: "relaxation",
      difficulty: 2,
      points: 20,
      requirements: {
        timeOfDay: "any",
        duration: "15 minutes",
        location: "private space",
      },
      isActive: true,
    },
    {
      id: "quest_relax_010",
      title: "Guided Meditation",
      description:
        "Use a meditation app or video to do a 20-minute guided relaxation or body scan meditation.",
      category: "relaxation",
      difficulty: 1,
      points: 20,
      requirements: {
        timeOfDay: "any",
        duration: "20 minutes",
        location: "quiet space",
      },
      isActive: true,
    },
  ];

  // PRODUCTIVITY & ORGANIZATION QUESTS
  const productivityQuests = [
    {
      id: "quest_productivity_001",
      title: "Life Declutter",
      description:
        "Choose one area of your living space and spend 30 minutes decluttering. Keep only items that serve you or bring you joy.",
      category: "productivity",
      difficulty: 2,
      points: 25,
      requirements: {
        timeOfDay: "any",
        duration: "30 minutes",
        location: "home",
      },
      isActive: true,
    },
    {
      id: "quest_productivity_002",
      title: "Goal Setting Session",
      description:
        "Write down three goals for the next month and break each one into specific, actionable steps you can take this week.",
      category: "productivity",
      difficulty: 2,
      points: 25,
      requirements: {
        timeOfDay: "any",
        duration: "45 minutes",
        location: "quiet space",
      },
      isActive: true,
    },
    {
      id: "quest_productivity_003",
      title: "Digital Declutter",
      description:
        "Organize your phone or computer - delete unnecessary files, organize photos, unsubscribe from emails you don't read.",
      category: "productivity",
      difficulty: 2,
      points: 20,
      requirements: {
        timeOfDay: "any",
        duration: "45 minutes",
        location: "anywhere",
      },
      isActive: true,
    },
    {
      id: "quest_productivity_004",
      title: "Morning Routine Design",
      description:
        "Create an ideal morning routine that would set you up for success. Try implementing one new element tomorrow.",
      category: "productivity",
      difficulty: 2,
      points: 20,
      requirements: {
        timeOfDay: "any",
        duration: "30 minutes",
        location: "anywhere",
      },
      isActive: true,
    },
    {
      id: "quest_productivity_005",
      title: "Time Audit",
      description:
        "Track how you spend your time for one day, then identify what activities energize you vs. drain you.",
      category: "productivity",
      difficulty: 3,
      points: 30,
      requirements: {
        timeOfDay: "any",
        duration: "full day",
        location: "anywhere",
      },
      isActive: true,
    },
    {
      id: "quest_productivity_006",
      title: "Skill Development Plan",
      description:
        "Choose one skill you'd like to develop and create a 30-day learning plan with specific daily actions.",
      category: "productivity",
      difficulty: 3,
      points: 35,
      requirements: {
        timeOfDay: "any",
        duration: "60 minutes",
        location: "quiet space",
      },
      isActive: true,
    },
    {
      id: "quest_productivity_007",
      title: "Financial Check-in",
      description:
        "Review your finances and create one specific action to improve your financial well-being this month.",
      category: "productivity",
      difficulty: 3,
      points: 30,
      requirements: {
        timeOfDay: "any",
        duration: "45 minutes",
        location: "private space",
      },
      isActive: true,
    },
    {
      id: "quest_productivity_008",
      title: "Habit Tracker Setup",
      description:
        "Identify three small habits you want to build and create a system to track them for the next week.",
      category: "productivity",
      difficulty: 2,
      points: 25,
      requirements: {
        timeOfDay: "any",
        duration: "30 minutes",
        location: "anywhere",
      },
      isActive: true,
    },
    {
      id: "quest_productivity_009",
      title: "Weekly Planning",
      description:
        "Plan your upcoming week with intention, scheduling time for work, self-care, relationships, and personal growth.",
      category: "productivity",
      difficulty: 2,
      points: 20,
      requirements: {
        timeOfDay: "any",
        duration: "30 minutes",
        location: "quiet space",
      },
      isActive: true,
    },
    {
      id: "quest_productivity_010",
      title: "Learning Session",
      description:
        "Spend 45 minutes learning something new through a book, podcast, online course, or tutorial that interests you.",
      category: "productivity",
      difficulty: 2,
      points: 25,
      requirements: {
        timeOfDay: "any",
        duration: "45 minutes",
        location: "quiet space",
      },
      isActive: true,
    },
  ];

  // SOCIAL CONNECTION & COMMUNICATION QUESTS
  const socialQuests = [
    {
      id: "quest_social_001",
      title: "Reach Out to Someone",
      description:
        "Contact someone you haven't spoken to in a while. Send a thoughtful message asking how they're doing and sharing something positive.",
      category: "social",
      difficulty: 2,
      points: 25,
      requirements: {
        timeOfDay: "any",
        duration: "15 minutes",
        location: "anywhere",
      },
      isActive: true,
    },
    {
      id: "quest_social_002",
      title: "Deep Conversation",
      description:
        "Have a meaningful conversation with someone about something that matters to you. Practice being vulnerable and authentic.",
      category: "social",
      difficulty: 3,
      points: 30,
      requirements: {
        timeOfDay: "any",
        duration: "45 minutes",
        location: "anywhere",
      },
      isActive: true,
    },
    {
      id: "quest_social_003",
      title: "Gratitude Expression",
      description:
        "Write a heartfelt thank you note or message to someone who has positively impacted your life.",
      category: "social",
      difficulty: 2,
      points: 20,
      requirements: {
        timeOfDay: "any",
        duration: "20 minutes",
        location: "anywhere",
      },
      isActive: true,
    },
    {
      id: "quest_social_004",
      title: "Active Listening Practice",
      description:
        "In your next conversation, focus entirely on listening without planning what to say next. Notice how this changes the interaction.",
      category: "social",
      difficulty: 2,
      points: 20,
      requirements: {
        timeOfDay: "any",
        duration: "varies",
        location: "anywhere",
      },
      isActive: true,
    },
    {
      id: "quest_social_005",
      title: "Community Involvement",
      description:
        "Research and reach out to one local organization or group that aligns with your values or interests.",
      category: "social",
      difficulty: 3,
      points: 35,
      requirements: {
        timeOfDay: "any",
        duration: "60 minutes",
        location: "anywhere",
      },
      isActive: true,
    },
    {
      id: "quest_social_006",
      title: "Conflict Resolution",
      description:
        "If you have any unresolved tension with someone, take a step toward resolution by reaching out with empathy and openness.",
      category: "social",
      difficulty: 4,
      points: 40,
      requirements: {
        timeOfDay: "any",
        duration: "varies",
        location: "anywhere",
      },
      isActive: true,
    },
    {
      id: "quest_social_007",
      title: "Compliment Someone",
      description:
        "Give three genuine, specific compliments to different people today. Notice how it affects both you and them.",
      category: "social",
      difficulty: 1,
      points: 15,
      requirements: {
        timeOfDay: "any",
        duration: "throughout day",
        location: "anywhere",
      },
      isActive: true,
    },
    {
      id: "quest_social_008",
      title: "Share Your Story",
      description:
        "Share something meaningful about your personal growth journey with someone you trust. Practice being open about your experiences.",
      category: "social",
      difficulty: 3,
      points: 30,
      requirements: {
        timeOfDay: "any",
        duration: "30 minutes",
        location: "anywhere",
      },
      isActive: true,
    },
    {
      id: "quest_social_009",
      title: "Ask for Help",
      description:
        "Identify something you've been struggling with and ask someone for help or advice. Practice being vulnerable and accepting support.",
      category: "social",
      difficulty: 3,
      points: 30,
      requirements: {
        timeOfDay: "any",
        duration: "varies",
        location: "anywhere",
      },
      isActive: true,
    },
    {
      id: "quest_social_010",
      title: "Social Media Positivity",
      description:
        "Use social media intentionally today to spread positivity - share encouragement, celebrate others, or post something uplifting.",
      category: "social",
      difficulty: 1,
      points: 15,
      requirements: {
        timeOfDay: "any",
        duration: "15 minutes",
        location: "anywhere",
      },
      isActive: true,
    },
  ];

  // PHYSICAL WELLNESS QUESTS
  const physicalQuests = [
    {
      id: "quest_physical_001",
      title: "Movement Exploration",
      description:
        "Try a new form of physical activity for 20 minutes - yoga, dancing, walking, stretching, or any movement that feels good.",
      category: "physical",
      difficulty: 2,
      points: 20,
      requirements: {
        timeOfDay: "any",
        duration: "20 minutes",
        location: "anywhere",
      },
      isActive: true,
    },
    {
      id: "quest_physical_002",
      title: "Hydration Focus",
      description:
        "Drink water mindfully throughout the day, aiming for 8 glasses. Notice how proper hydration affects your energy and mood.",
      category: "physical",
      difficulty: 1,
      points: 15,
      requirements: {
        timeOfDay: "all day",
        duration: "full day",
        location: "anywhere",
      },
      isActive: true,
    },
    {
      id: "quest_physical_003",
      title: "Posture Awareness",
      description:
        "Set reminders to check and improve your posture every hour today. Notice how your posture affects how you feel.",
      category: "physical",
      difficulty: 1,
      points: 10,
      requirements: {
        timeOfDay: "all day",
        duration: "full day",
        location: "anywhere",
      },
      isActive: true,
    },
    {
      id: "quest_physical_004",
      title: "Nutritious Meal Prep",
      description:
        "Prepare a colorful, nutritious meal with intention. Focus on nourishing your body and appreciating the food.",
      category: "physical",
      difficulty: 2,
      points: 20,
      requirements: {
        timeOfDay: "any",
        duration: "45 minutes",
        location: "kitchen",
      },
      isActive: true,
    },
    {
      id: "quest_physical_005",
      title: "Sleep Hygiene",
      description:
        "Create an ideal bedtime routine and environment. Implement one change to improve your sleep quality tonight.",
      category: "physical",
      difficulty: 2,
      points: 20,
      requirements: {
        timeOfDay: "evening",
        duration: "30 minutes",
        location: "home",
      },
      isActive: true,
    },
    {
      id: "quest_physical_006",
      title: "Outdoor Exercise",
      description:
        "Do any form of exercise outside for at least 20 minutes. Combine the benefits of movement with fresh air and nature.",
      category: "physical",
      difficulty: 2,
      points: 25,
      requirements: {
        timeOfDay: "any",
        duration: "20 minutes",
        location: "outdoor",
      },
      isActive: true,
    },
    {
      id: "quest_physical_007",
      title: "Body Appreciation",
      description:
        "Write down five things you appreciate about your body and what it does for you. Focus on function over appearance.",
      category: "physical",
      difficulty: 2,
      points: 20,
      requirements: {
        timeOfDay: "any",
        duration: "15 minutes",
        location: "private space",
      },
      isActive: true,
    },
    {
      id: "quest_physical_008",
      title: "Breathing Exercise",
      description:
        "Practice deep breathing exercises for 10 minutes. Try different techniques and notice which ones make you feel most centered.",
      category: "physical",
      difficulty: 1,
      points: 15,
      requirements: {
        timeOfDay: "any",
        duration: "10 minutes",
        location: "anywhere",
      },
      isActive: true,
    },
    {
      id: "quest_physical_009",
      title: "Energy Assessment",
      description:
        "Track your energy levels throughout the day and identify what activities, foods, or habits boost or drain your energy.",
      category: "physical",
      difficulty: 2,
      points: 20,
      requirements: {
        timeOfDay: "all day",
        duration: "full day",
        location: "anywhere",
      },
      isActive: true,
    },
    {
      id: "quest_physical_010",
      title: "Gentle Movement",
      description:
        "Do 15 minutes of gentle movement like stretching, tai chi, or slow walking, focusing on how your body feels.",
      category: "physical",
      difficulty: 1,
      points: 15,
      requirements: {
        timeOfDay: "any",
        duration: "15 minutes",
        location: "quiet space",
      },
      isActive: true,
    },
  ];

  // INTELLECTUAL GROWTH QUESTS
  const intellectualQuests = [
    {
      id: "quest_intellectual_001",
      title: "Deep Reading Session",
      description:
        "Read for 45 minutes without distractions. Choose something that challenges your thinking or teaches you something new.",
      category: "intellectual",
      difficulty: 2,
      points: 25,
      requirements: {
        timeOfDay: "any",
        duration: "45 minutes",
        location: "quiet space",
      },
      isActive: true,
    },
    {
      id: "quest_intellectual_002",
      title: "Podcast Learning",
      description:
        "Listen to a podcast episode about a topic you know little about. Take notes and reflect on what you learned.",
      category: "intellectual",
      difficulty: 1,
      points: 20,
      requirements: {
        timeOfDay: "any",
        duration: "30-60 minutes",
        location: "anywhere",
      },
      isActive: true,
    },
    {
      id: "quest_intellectual_003",
      title: "Question Everything",
      description:
        "Choose one belief or assumption you hold and examine it critically. Research different perspectives on this topic.",
      category: "intellectual",
      difficulty: 3,
      points: 30,
      requirements: {
        timeOfDay: "any",
        duration: "60 minutes",
        location: "quiet space",
      },
      isActive: true,
    },
    {
      id: "quest_intellectual_004",
      title: "Documentary Deep Dive",
      description:
        "Watch a documentary about a subject that interests you. Take notes and research one aspect further afterward.",
      category: "intellectual",
      difficulty: 2,
      points: 25,
      requirements: {
        timeOfDay: "any",
        duration: "90 minutes",
        location: "home",
      },
      isActive: true,
    },
    {
      id: "quest_intellectual_005",
      title: "Write to Learn",
      description:
        "Choose a topic you want to understand better and write a 500-word explanation of it. Research as needed to fill knowledge gaps.",
      category: "intellectual",
      difficulty: 3,
      points: 30,
      requirements: {
        timeOfDay: "any",
        duration: "60 minutes",
        location: "quiet space",
      },
      isActive: true,
    },
    {
      id: "quest_intellectual_006",
      title: "Debate Yourself",
      description:
        "Choose a controversial topic and write arguments for both sides. Practice seeing multiple perspectives on complex issues.",
      category: "intellectual",
      difficulty: 3,
      points: 35,
      requirements: {
        timeOfDay: "any",
        duration: "45 minutes",
        location: "quiet space",
      },
      isActive: true,
    },
    {
      id: "quest_intellectual_007",
      title: "Memory Palace",
      description:
        "Learn about and practice the memory palace technique. Use it to memorize something meaningful to you.",
      category: "intellectual",
      difficulty: 3,
      points: 30,
      requirements: {
        timeOfDay: "any",
        duration: "45 minutes",
        location: "quiet space",
      },
      isActive: true,
    },
    {
      id: "quest_intellectual_008",
      title: "Philosophy Exploration",
      description:
        "Read about a philosophical concept or thinker you've never explored. Reflect on how their ideas relate to your life.",
      category: "intellectual",
      difficulty: 3,
      points: 30,
      requirements: {
        timeOfDay: "any",
        duration: "60 minutes",
        location: "quiet space",
      },
      isActive: true,
    },
    {
      id: "quest_intellectual_009",
      title: "Language Learning",
      description:
        "Spend 30 minutes learning a new language or improving one you're studying. Focus on practical phrases or concepts.",
      category: "intellectual",
      difficulty: 2,
      points: 25,
      requirements: {
        timeOfDay: "any",
        duration: "30 minutes",
        location: "anywhere",
      },
      isActive: true,
    },
    {
      id: "quest_intellectual_010",
      title: "Critical Thinking Exercise",
      description:
        "Analyze a news article or opinion piece critically. Identify assumptions, biases, and logical fallacies.",
      category: "intellectual",
      difficulty: 3,
      points: 30,
      requirements: {
        timeOfDay: "any",
        duration: "30 minutes",
        location: "quiet space",
      },
      isActive: true,
    },
  ];

  // SPIRITUAL & MEANING QUESTS
  const spiritualQuests = [
    {
      id: "quest_spiritual_001",
      title: "Values Clarification",
      description:
        "Identify your top 5 core values and write about how you can better align your daily actions with these values.",
      category: "spiritual",
      difficulty: 3,
      points: 35,
      requirements: {
        timeOfDay: "any",
        duration: "60 minutes",
        location: "quiet space",
      },
      isActive: true,
    },
    {
      id: "quest_spiritual_002",
      title: "Purpose Reflection",
      description:
        "Spend time reflecting on what gives your life meaning. Write about how you can incorporate more of this into your daily life.",
      category: "spiritual",
      difficulty: 3,
      points: 30,
      requirements: {
        timeOfDay: "any",
        duration: "45 minutes",
        location: "quiet space",
      },
      isActive: true,
    },
    {
      id: "quest_spiritual_003",
      title: "Gratitude Practice",
      description:
        "Write down 20 things you're grateful for, ranging from big life events to small daily pleasures.",
      category: "spiritual",
      difficulty: 1,
      points: 20,
      requirements: {
        timeOfDay: "any",
        duration: "20 minutes",
        location: "anywhere",
      },
      isActive: true,
    },
    {
      id: "quest_spiritual_004",
      title: "Nature Connection",
      description:
        "Spend time in nature with the intention of feeling connected to something larger than yourself. Practice presence and wonder.",
      category: "spiritual",
      difficulty: 2,
      points: 25,
      requirements: {
        timeOfDay: "any",
        duration: "45 minutes",
        location: "outdoor/nature",
      },
      isActive: true,
    },
    {
      id: "quest_spiritual_005",
      title: "Service to Others",
      description:
        "Do something kind for someone else without expecting anything in return. Reflect on how giving affects your sense of purpose.",
      category: "spiritual",
      difficulty: 2,
      points: 30,
      requirements: {
        timeOfDay: "any",
        duration: "varies",
        location: "anywhere",
      },
      isActive: true,
    },
    {
      id: "quest_spiritual_006",
      title: "Meditation on Impermanence",
      description:
        "Reflect on the temporary nature of all things. Consider how this perspective might change how you approach your current challenges.",
      category: "spiritual",
      difficulty: 3,
      points: 30,
      requirements: {
        timeOfDay: "any",
        duration: "30 minutes",
        location: "quiet space",
      },
      isActive: true,
    },
    {
      id: "quest_spiritual_007",
      title: "Legacy Letter",
      description:
        "Write a letter to future generations about what you've learned about life and what you hope for them.",
      category: "spiritual",
      difficulty: 3,
      points: 35,
      requirements: {
        timeOfDay: "any",
        duration: "60 minutes",
        location: "private space",
      },
      isActive: true,
    },
    {
      id: "quest_spiritual_008",
      title: "Forgiveness Practice",
      description:
        "Practice forgiving someone (including yourself) who has hurt you. Focus on releasing resentment for your own peace.",
      category: "spiritual",
      difficulty: 4,
      points: 40,
      requirements: {
        timeOfDay: "any",
        duration: "45 minutes",
        location: "private space",
      },
      isActive: true,
    },
    {
      id: "quest_spiritual_009",
      title: "Sacred Space Creation",
      description:
        "Create a small sacred or meaningful space in your home where you can go for reflection and peace.",
      category: "spiritual",
      difficulty: 2,
      points: 25,
      requirements: {
        timeOfDay: "any",
        duration: "45 minutes",
        location: "home",
      },
      isActive: true,
    },
    {
      id: "quest_spiritual_010",
      title: "Life Story Reflection",
      description:
        "Write about the major chapters of your life story so far. Look for patterns, growth, and lessons learned.",
      category: "spiritual",
      difficulty: 3,
      points: 35,
      requirements: {
        timeOfDay: "any",
        duration: "90 minutes",
        location: "private space",
      },
      isActive: true,
    },
  ];

  // Combine all quest arrays
  const allQuests = [
    ...mindfulnessQuests,
    ...selfCareQuests,
    ...creativeQuests,
    ...adventureQuests,
    ...moodBoostQuests,
    ...relaxationQuests,
    ...productivityQuests,
    ...socialQuests,
    ...physicalQuests,
    ...intellectualQuests,
    ...spiritualQuests,
  ];

  // Create quests in batches
  console.log(`📝 Creating ${allQuests.length} quests...`);
  for (const quest of allQuests) {
    await prisma.quest.create({
      data: quest,
    });
  }

  // Seed Rewards
  console.log("🎁 Seeding rewards...");
  const rewards = [
    {
      id: "reward_001",
      name: "Profile Spotlight",
      description:
        "Get featured on the Solo Sparks community spotlight for a week",
      cost: 100,
      type: "profile_boost",
      metadata: { duration: "7 days", feature: "community_spotlight" },
      isActive: true,
    },
    {
      id: "reward_002",
      name: "Exclusive Quest Pack",
      description:
        "Unlock 5 premium quests designed by personal growth experts",
      cost: 150,
      type: "hidden_content",
      metadata: { questCount: 5, category: "premium" },
      isActive: true,
    },
    {
      id: "reward_003",
      name: "Personalized Growth Prompt",
      description:
        "Receive a custom reflection prompt based on your unique growth journey",
      cost: 75,
      type: "exclusive_prompt",
      metadata: { customization: "high", delivery: "instant" },
      isActive: true,
    },
    {
      id: "reward_004",
      name: "Mindfulness Master Badge",
      description:
        "Earn a special badge that shows your dedication to mindful living",
      cost: 200,
      type: "profile_boost",
      metadata: { badge: "mindfulness_master", rarity: "rare" },
      isActive: true,
    },
    {
      id: "reward_005",
      name: "Creative Expression Toolkit",
      description:
        "Access to exclusive creative prompts and inspiration resources",
      cost: 125,
      type: "hidden_content",
      metadata: { resourceType: "creative", accessDuration: "permanent" },
      isActive: true,
    },
    {
      id: "reward_006",
      name: "Adventure Seeker Title",
      description: 'Display the "Adventure Seeker" title on your profile',
      cost: 80,
      type: "profile_boost",
      metadata: { title: "Adventure Seeker", displayLocation: "profile" },
      isActive: true,
    },
    {
      id: "reward_007",
      name: "Wellness Wisdom Collection",
      description:
        "Unlock a curated collection of wellness and self-care resources",
      cost: 175,
      type: "hidden_content",
      metadata: { category: "wellness", itemCount: 10 },
      isActive: true,
    },
    {
      id: "reward_008",
      name: "Daily Inspiration Boost",
      description:
        "Receive personalized daily inspiration messages for 30 days",
      cost: 90,
      type: "exclusive_prompt",
      metadata: { duration: "30 days", frequency: "daily" },
      isActive: true,
    },
    {
      id: "reward_009",
      name: "Growth Champion Badge",
      description: "Exclusive badge for completing 50+ quests",
      cost: 300,
      type: "profile_boost",
      metadata: { badge: "growth_champion", requirement: "50_quests" },
      isActive: true,
    },
    {
      id: "reward_010",
      name: "Reflection Journal Template",
      description:
        "Beautiful, customizable journal template for deeper self-reflection",
      cost: 60,
      type: "hidden_content",
      metadata: { format: "digital_template", customizable: true },
      isActive: true,
    },
    {
      id: "reward_011",
      name: "Zen Master Profile Theme",
      description: "Unlock a peaceful, zen-inspired profile theme",
      cost: 120,
      type: "profile_boost",
      metadata: { theme: "zen_master", colors: "earth_tones" },
      isActive: true,
    },
    {
      id: "reward_012",
      name: "Social Butterfly Wings",
      description:
        "Special animated profile decoration for social quest completers",
      cost: 110,
      type: "profile_boost",
      metadata: { decoration: "butterfly_wings", animation: true },
      isActive: true,
    },
    {
      id: "reward_013",
      name: "Productivity Power Pack",
      description: "Access to advanced productivity tools and templates",
      cost: 140,
      type: "hidden_content",
      metadata: { toolCount: 8, category: "productivity" },
      isActive: true,
    },
    {
      id: "reward_014",
      name: "Spiritual Seeker Aura",
      description: "Mystical aura effect for your profile avatar",
      cost: 160,
      type: "profile_boost",
      metadata: { effect: "spiritual_aura", visibility: "high" },
      isActive: true,
    },
    {
      id: "reward_015",
      name: "Custom Quest Creator",
      description:
        "Create and share your own personal growth quests with the community",
      cost: 250,
      type: "exclusive_prompt",
      metadata: { feature: "quest_creation", sharing: "community" },
      isActive: true,
    },
  ];

  for (const reward of rewards) {
    await prisma.reward.create({
      data: reward,
    });
  }

  console.log("✅ Database seeding completed successfully!");
  console.log(`📊 Created ${allQuests.length} quests across 11 categories`);
  console.log(`🎁 Created ${rewards.length} rewards`);

  // Log quest counts by category
  const questCounts = allQuests.reduce((acc, quest) => {
    acc[quest.category] = (acc[quest.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log("\n📈 Quest distribution by category:");
  Object.entries(questCounts).forEach(([category, count]) => {
    console.log(`  ${category}: ${count} quests`);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
