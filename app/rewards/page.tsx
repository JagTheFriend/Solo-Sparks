"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sparkles, Gift, Crown, Star, Zap } from "lucide-react"

interface Reward {
  id: string
  name: string
  description: string
  cost: number
  type: string
  metadata?: any
  isActive: boolean
}

interface UserReward {
  id: string
  rewardId: string
  redeemedAt: string
  isUsed: boolean
  reward: Reward
}

interface RewardsData {
  rewards: Reward[]
  userRewards: UserReward[]
}

interface PointsData {
  totalPoints: number
}

export default function RewardsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [rewardsData, setRewardsData] = useState<RewardsData | null>(null)
  const [pointsData, setPointsData] = useState<PointsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [redeeming, setRedeeming] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    fetchRewardsData()
    fetchPointsData()
  }, [])

  const fetchRewardsData = async () => {
    try {
      const response = await fetch("/api/rewards")
      if (response.ok) {
        const data = await response.json()
        setRewardsData(data)
      }
    } catch (error) {
      console.error("Rewards fetch error:", error)
    }
  }

  const fetchPointsData = async () => {
    try {
      const response = await fetch("/api/points")
      if (response.ok) {
        const data = await response.json()
        setPointsData(data)
      }
    } catch (error) {
      console.error("Points fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRedeem = async (rewardId: string, cost: number) => {
    if (!pointsData || pointsData.totalPoints < cost) {
      setMessage({ type: "error", text: "Insufficient Spark Points!" })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    setRedeeming(rewardId)

    try {
      const response = await fetch("/api/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewardId }),
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Reward redeemed successfully!" })
        fetchRewardsData()
        fetchPointsData()
      } else {
        const data = await response.json()
        setMessage({ type: "error", text: data.error || "Redemption failed" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" })
    } finally {
      setRedeeming(null)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const getRewardIcon = (type: string) => {
    switch (type) {
      case "profile_boost":
        return <Crown className="h-6 w-6 text-yellow-500" />
      case "hidden_content":
        return <Star className="h-6 w-6 text-purple-500" />
      case "exclusive_prompt":
        return <Zap className="h-6 w-6 text-blue-500" />
      default:
        return <Gift className="h-6 w-6 text-gray-500" />
    }
  }

  const getRewardTypeColor = (type: string) => {
    switch (type) {
      case "profile_boost":
        return "bg-yellow-100 text-yellow-800"
      case "hidden_content":
        return "bg-purple-100 text-purple-800"
      case "exclusive_prompt":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const isRewardRedeemed = (rewardId: string) => {
    return rewardsData?.userRewards.some((ur) => ur.rewardId === rewardId) || false
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.push("/dashboard")} className="mb-4">
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rewards Store</h1>
          <p className="text-gray-600">Redeem your Spark Points for exclusive rewards and profile enhancements</p>
        </div>

        {/* Points Balance */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Sparkles className="h-8 w-8 text-purple-600" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{pointsData?.totalPoints || 0} Spark Points</h2>
                  <p className="text-gray-600">Available to spend</p>
                </div>
              </div>
              <Button onClick={() => router.push("/dashboard")} variant="outline">
                Earn More Points
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        {message && (
          <Alert className={`mb-6 ${message.type === "error" ? "border-red-200" : "border-green-200"}`}>
            <AlertDescription className={message.type === "error" ? "text-red-800" : "text-green-800"}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {/* Available Rewards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {rewardsData?.rewards.map((reward) => {
            const isRedeemed = isRewardRedeemed(reward.id)
            const canAfford = (pointsData?.totalPoints || 0) >= reward.cost

            return (
              <Card key={reward.id} className={`${isRedeemed ? "opacity-60" : ""}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {getRewardIcon(reward.type)}
                      <div>
                        <CardTitle className="text-lg">{reward.name}</CardTitle>
                        <Badge className={getRewardTypeColor(reward.type)}>{reward.type.replace("_", " ")}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">{reward.cost}</div>
                      <div className="text-xs text-gray-500">SP</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{reward.description}</CardDescription>

                  {isRedeemed ? (
                    <Button disabled className="w-full">
                      Already Redeemed
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleRedeem(reward.id, reward.cost)}
                      disabled={!canAfford || redeeming === reward.id}
                      className="w-full"
                      variant={canAfford ? "default" : "outline"}
                    >
                      {redeeming === reward.id ? "Redeeming..." : canAfford ? "Redeem" : "Insufficient Points"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Redeemed Rewards */}
        {rewardsData?.userRewards && rewardsData.userRewards.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Your Redeemed Rewards</CardTitle>
              <CardDescription>Rewards you've unlocked with your Spark Points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rewardsData.userRewards.map((userReward) => (
                  <div key={userReward.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getRewardIcon(userReward.reward.type)}
                      <div>
                        <h3 className="font-semibold">{userReward.reward.name}</h3>
                        <p className="text-sm text-gray-600">
                          Redeemed on {new Date(userReward.redeemedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getRewardTypeColor(userReward.reward.type)}>
                        {userReward.reward.type.replace("_", " ")}
                      </Badge>
                      {!userReward.isUsed && <Badge variant="secondary">Available</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {(!rewardsData?.rewards || rewardsData.rewards.length === 0) && (
          <Card>
            <CardContent className="p-12 text-center">
              <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Rewards Available</h3>
              <p className="text-gray-600 mb-4">Check back later for new rewards to redeem with your Spark Points!</p>
              <Button onClick={() => router.push("/dashboard")}>Complete Quests to Earn Points</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
