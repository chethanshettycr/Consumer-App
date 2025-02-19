"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/app/lib/auth"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

type PurchaseHistory = {
  id: string
  date: string
  items: string[]
  total: number
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const router = useRouter()
  const [name, setName] = useState(user?.name || "")
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistory[]>([])

  useEffect(() => {
    if (!user) {
      router.push("/consumer/login")
    } else {
      // Fetch purchase history
      // This is a mock implementation. Replace with actual API call.
      setPurchaseHistory([
        { id: "1", date: "2023-05-01", items: ["Cement", "Sand"], total: 1000 },
        { id: "2", date: "2023-05-15", items: ["Bricks", "Steel"], total: 2000 },
      ])
    }
  }, [user, router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (user) {
      try {
        await updateUser({ ...user, name })
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        })
      } catch (error) {
        toast({
          title: "Update Failed",
          description: "Failed to update your profile. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  if (!user) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 space-y-6"
    >
      <motion.h1
        className="text-2xl font-bold text-foreground"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Profile
      </motion.h1>

      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} disabled />
            </div>
            <Button type="submit">Update Profile</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
        </CardHeader>
        <CardContent>
          {purchaseHistory.map((purchase) => (
            <div key={purchase.id} className="mb-4 p-4 border rounded">
              <p>
                <strong>Date:</strong> {purchase.date}
              </p>
              <p>
                <strong>Items:</strong> {purchase.items.join(", ")}
              </p>
              <p>
                <strong>Total:</strong> ₹{purchase.total}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button variant="outline" onClick={() => router.push("/consumer")}>
        Back to Dashboard
      </Button>
    </motion.div>
  )
}

