"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Target, Heart, TrendingUp, Users, Award } from "lucide-react"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-12 w-12 text-purple-600 mr-3" />
            <h1 className="text-5xl font-bold text-gray-900">Solo Sparks</h1>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover yourself through personalized growth quests. Build emotional intelligence, self-awareness, and fall
            in love with your own company through meaningful solo activities.
          </p>
          <div className="space-x-4">
            <Link href="/auth/signup">
              <Button size="lg" className="px-8 py-3">
                Start Your Journey
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg" className="px-8 py-3">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Personalized Quests</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                AI-powered quest recommendations based on your personality, mood, and growth goals. Every quest is
                tailored specifically for you.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Heart className="h-12 w-12 text-pink-600 mx-auto mb-4" />
              <CardTitle>Self-Discovery</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Explore meaningful solo activities like watching sunsets, treating yourself, and practicing mindfulness
                to build deeper self-connection.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Track Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitor your emotional intelligence development with detailed analytics, mood tracking, and progress
                visualization.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Sparkles className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Spark Points</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Earn points for completing quests and reflections. Redeem them for profile boosts, exclusive content,
                and special rewards.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>Multi-Media Reflections</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Capture your journey through text, photos, and audio reflections. Create a rich record of your personal
                growth experience.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Award className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Unlock achievements and milestones as you progress. Celebrate your growth and build momentum for
                continued self-improvement.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How Solo Sparks Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Complete Assessment</h3>
              <p className="text-sm text-gray-600">
                Take our personality and mood assessment to build your unique profile
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">Get Personalized Quests</h3>
              <p className="text-sm text-gray-600">
                Receive daily quests tailored to your personality and emotional needs
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">Complete & Reflect</h3>
              <p className="text-sm text-gray-600">Engage in meaningful activities and share your reflections</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-pink-600">4</span>
              </div>
              <h3 className="font-semibold mb-2">Grow & Earn</h3>
              <p className="text-sm text-gray-600">Track your progress, earn points, and unlock exclusive rewards</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Fall in Love with Yourself?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of people discovering their authentic selves through Solo Sparks
            </p>
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="px-8 py-3">
                Start Your Free Journey Today
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
