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
  subject: string
  description: string
  status: "pending" | "in_progress" | "resolved"
}

export default function ComplaintsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [vendorId, setVendorId] = useState("")
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
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
      userId: user.id,
      vendorId,
      subject,
      description,
      status: "pending",
    }

    try {
      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComplaint),
      })

      if (response.ok) {
        toast({
          title: "Complaint Submitted",
          description: "Your complaint has been received and will be reviewed shortly.",
        })
        setVendorId("")
        setSubject("")
        setDescription("")
      } else {
        throw new Error("Failed to submit complaint")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit complaint. Please try again.",
        variant: "destructive",
      })
    }
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
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
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
    </motion.div>
  )
}

