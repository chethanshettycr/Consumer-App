"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/app/lib/auth"

type Complaint = {
  id: string
  userId: string
  vendorId: string
  description: string
  status: "pending" | "resolved"
}

export default function SettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [vendorId, setVendorId] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a complaint.",
        variant: "destructive",
      })
      return
    }

    const newComplaint: Complaint = {
      id: Date.now().toString(),
      userId: user.username,
      vendorId,
      description,
      status: "pending",
    }

    // Store the complaint
    const existingComplaints = JSON.parse(localStorage.getItem("complaints") || "[]")
    const updatedComplaints = [...existingComplaints, newComplaint]
    localStorage.setItem("complaints", JSON.stringify(updatedComplaints))

    // Notify the user
    toast({
      title: "Complaint Submitted",
      description: "Your complaint has been received and will be reviewed shortly.",
    })

    // Clear the form
    setVendorId("")
    setDescription("")

    // Dispatch an event to update the admin page
    window.dispatchEvent(new Event("complaintsUpdated"))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4"
    >
      <motion.h1
        className="text-2xl font-bold mb-6 text-foreground"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Settings
      </motion.h1>
      <Card>
        <CardHeader>
          <CardTitle>Submit a Complaint</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="vendorId">Vendor/Professional ID</Label>
              <Input id="vendorId" value={vendorId} onChange={(e) => setVendorId(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="description">Complaint Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Submit Complaint</Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

