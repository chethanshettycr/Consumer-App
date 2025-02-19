"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/app/lib/auth"
import { CheckCircle } from "lucide-react"

type Complaint = {
  id: string
  userId: string
  vendorId: string
  description: string
  status: "pending" | "resolved"
}

export default function ComplaintsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [vendorId, setVendorId] = useState("")
  const [description, setDescription] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

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

    // Show success animation
    setShowSuccess(true)

    // Clear the form
    setVendorId("")
    setDescription("")

    // Hide success animation after 3 seconds
    setTimeout(() => {
      setShowSuccess(false)
    }, 3000)

    // Simulate notifying the admin and vendor
    console.log("Admin notified about new complaint:", newComplaint)
    console.log("Vendor notified about new complaint:", newComplaint)
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
        Submit a Complaint
      </motion.h1>
      <Card>
        <CardHeader>
          <CardTitle>Complaint Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="vendorId">Vendor ID</Label>
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
      <Button className="mt-4" variant="outline" onClick={() => router.back()}>
        Back
      </Button>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <motion.div
              className="bg-white rounded-full p-8"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <CheckCircle className="w-16 h-16 text-green-500" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

