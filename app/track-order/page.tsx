"use client"
import { Suspense } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

type Order = {
  id: string
  trackingId: string
  productName: string
  quantity: number
  status: string
  estimatedDelivery: string
  deliveryPersonnel?: {
    name: string
    phone: string
  }
}

const TrackOrderContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const trackingId = searchParams.get("trackingId")
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (trackingId) {
      // In a real application, you would fetch the order details from your backend
      // For this example, we'll simulate fetching from localStorage
      const orders: Order[] = JSON.parse(localStorage.getItem("orders") || "[]")
      const foundOrder = orders.find((o) => o.trackingId === trackingId)
      if (foundOrder) {
        setOrder(foundOrder)
      } else {
        toast({
          title: "Order Not Found",
          description: "The order with the provided tracking ID could not be found.",
          variant: "destructive",
        })
      }
    }
  }, [trackingId])

  const contactDeliveryPersonnel = () => {
    if (order?.deliveryPersonnel) {
      // In a real application, you would implement the actual calling functionality
      toast({
        title: "Contacting Delivery Personnel",
        description: `Calling ${order.deliveryPersonnel.name} at ${order.deliveryPersonnel.phone}`,
      })
    }
  }

  if (!order) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 text-foreground">Order Not Found</h1>
        <Button onClick={() => router.push("/orders")}>View All Orders</Button>
      </div>
    )
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>Tracking ID:</strong> {order.trackingId}
          </div>
          <div>
            <strong>Product:</strong> {order.productName}
          </div>
          <div>
            <strong>Quantity:</strong> {order.quantity}
          </div>
          <div>
            <strong>Status:</strong> {order.status}
          </div>
          <div>
            <strong>Estimated Delivery:</strong> {order.estimatedDelivery}
          </div>
          {order.deliveryPersonnel && (
            <div>
              <strong>Delivery Personnel:</strong> {order.deliveryPersonnel.name}
              <Button variant="outline" size="sm" className="ml-2" onClick={contactDeliveryPersonnel}>
                <Phone className="mr-2 h-4 w-4" /> Contact
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <Button className="mt-4" variant="outline" onClick={() => router.push("/orders")}>
        Back to Orders
      </Button>
    </div>
  )
}

export default function TrackOrderPage() {
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
        Track Order
      </motion.h1>
      <Suspense fallback={<div>Loading...</div>}>
        <TrackOrderContent />
      </Suspense>
    </motion.div>
  )
}

