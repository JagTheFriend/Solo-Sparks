"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface MoodEntry {
  id: string
  mood: number
  energy: number
  stress: number
  notes?: string
  createdAt: string
}

export default function MoodPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [mood, setMood] = useState([5])
  const [energy, setEnergy] = useState([5])
  const [stress, setStress] = useState([5])
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([])
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchMoodHistory()
  }, [])

  const fetchMoodHistory = async () => {
    try {
      const response = await fetch("/api/mood")
      if (response.ok) {
        const data = await response.json()
        setMoodHistory(data.moodEntries)
      }
    } catch (error) {
      console.error("Mood history fetch error:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: mood[0],
          energy: energy[0],
          stress: stress[0],
          notes: notes.trim() || null,
        }),
      })

      if (response.ok) {
        setSuccess(true)
        fetchMoodHistory()

        // Reset form
        setMood([5])
        setEnergy([5])
        setStress([5])
        setNotes("")

        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (error) {
      console.error("Mood entry error:", error)
    } finally {
      setLoading(false)
    }
  }

  const getMoodEmoji = (value: number) => {
    if (value <= 2) return "😢"
    if (value <= 4) return "😕"
    if (value <= 6) return "😐"
    if (value <= 8) return "🙂"
    return "😊"
  }

  const getEnergyEmoji = (value: number) => {
    if (value <= 2) return "😴"
    if (value <= 4) return "😑"
    if (value <= 6) return "😊"
    if (value <= 8) return "😄"
    return "⚡"
  }

  const getStressEmoji = (value: number) => {
    if (value <= 2) return "😌"
    if (value <= 4) return "😐"
    if (value <= 6) return "😰"
    if (value <= 8) return "😫"
    return "🤯"
  }

  const chartData = moodHistory.slice(-7).map((entry) => ({
    date: new Date(entry.createdAt).toLocaleDateString(),
    mood: entry.mood,
    energy: entry.energy,
    stress: entry.stress,
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.push("/dashboard")} className="mb-4">
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mood Tracker</h1>
          <p className="text-gray-600">Track your emotional state to help us personalize your quest experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mood Entry Form */}
          <Card>
            <CardHeader>
              <CardTitle>How are you feeling today?</CardTitle>
              <CardDescription>Rate your current mood, energy, and stress levels</CardDescription>
            </CardHeader>
            <CardContent>
              {success && (
                <Alert className="mb-4">
                  <AlertDescription>
                    Mood entry saved successfully! This helps us recommend better quests for you.
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base font-medium flex items-center">
                    Mood {getMoodEmoji(mood[0])}
                    <span className="ml-2 text-sm text-gray-500">({mood[0]}/10)</span>
                  </Label>
                  <Slider value={mood} onValueChange={setMood} max={10} min={1} step={1} className="w-full" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Very Low</span>
                    <span>Very High</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium flex items-center">
                    Energy Level {getEnergyEmoji(energy[0])}
                    <span className="ml-2 text-sm text-gray-500">({energy[0]}/10)</span>
                  </Label>
                  <Slider value={energy} onValueChange={setEnergy} max={10} min={1} step={1} className="w-full" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Exhausted</span>
                    <span>Energized</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium flex items-center">
                    Stress Level {getStressEmoji(stress[0])}
                    <span className="ml-2 text-sm text-gray-500">({stress[0]}/10)</span>
                  </Label>
                  <Slider value={stress} onValueChange={setStress} max={10} min={1} step={1} className="w-full" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Very Calm</span>
                    <span>Very Stressed</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-base font-medium">
                    Notes (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="What's on your mind? Any specific thoughts or events affecting your mood today?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Saving..." : "Save Mood Entry"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Mood History Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Your Mood Trends</CardTitle>
              <CardDescription>Track your emotional patterns over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[1, 10]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="mood" stroke="#8b5cf6" strokeWidth={2} name="Mood" />
                      <Line type="monotone" dataKey="energy" stroke="#10b981" strokeWidth={2} name="Energy" />
                      <Line type="monotone" dataKey="stress" stroke="#f59e0b" strokeWidth={2} name="Stress" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <p className="mb-2">No mood data yet</p>
                    <p className="text-sm">Start tracking to see your trends!</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Mood Entries */}
        {moodHistory.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {moodHistory.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-500">{new Date(entry.createdAt).toLocaleDateString()}</div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">
                          Mood: {getMoodEmoji(entry.mood)} {entry.mood}
                        </span>
                        <span className="text-sm">
                          Energy: {getEnergyEmoji(entry.energy)} {entry.energy}
                        </span>
                        <span className="text-sm">
                          Stress: {getStressEmoji(entry.stress)} {entry.stress}
                        </span>
                      </div>
                    </div>
                    {entry.notes && <div className="text-xs text-gray-600 max-w-xs truncate">{entry.notes}</div>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
