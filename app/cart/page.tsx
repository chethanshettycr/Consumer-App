"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { X, CheckCircle } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

type Product = {
  id: number
  name: string
  price: number
  image: string
}

type Order = {
  id: string
  productName: string
  quantity: number
  status: string
}

type PaymentMethod = "COD" | "UPI" | "NEFT" | "BankTransfer"

export default function CartPage() {
  const [cart, setCart] = useState<Product[]>([])
  const [orderStatus, setOrderStatus] = useState<string | null>(null)
  const [latestOrder, setLatestOrder] = useState<Order | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD")
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      setCart(JSON.parse(storedCart))
    }

    const storedOrders = localStorage.getItem("orders")
    if (storedOrders) {
      const orders = JSON.parse(storedOrders)
      if (orders.length > 0) {
        setLatestOrder(orders[orders.length - 1])
      }
    }
  }, [])

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== productId)
      localStorage.setItem("cart", JSON.stringify(updatedCart))
      return updatedCart
    })
  }

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0)

  const checkout = () => {
    if (paymentMethod === "COD" && totalAmount > 100000) {
      toast({
        title: "COD Limit Exceeded",
        description:
          "Cash on Delivery is not available for orders above ₹1 Lakh. Please choose another payment method.",
        variant: "destructive",
      })
      return
    }

    // Create orders from cart items
    const newOrders = cart.map((item) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      productName: item.name,
      quantity: 1,
      status: "Placed",
    }))

    // Add new orders to existing orders
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    const updatedOrders = [...existingOrders, ...newOrders]
    localStorage.setItem("orders", JSON.stringify(updatedOrders))

    // Set the latest order
    setLatestOrder(newOrders[newOrders.length - 1])

    // Show payment success animation
    setShowPaymentSuccess(true)

    // Simulate order placement
    setOrderStatus(`Order placed successfully! Payment method: ${paymentMethod}`)
    setCart([])
    localStorage.removeItem("cart")

    // Hide payment success animation after 3 seconds
    setTimeout(() => {
      setShowPaymentSuccess(false)
    }, 3000)

    // Simulate order status updates
    setTimeout(() => {
      setOrderStatus("Your order is being prepared.")
      setLatestOrder((prev) => (prev ? { ...prev, status: "Preparing" } : null))
    }, 4000)

    setTimeout(() => {
      setOrderStatus("Your order is out for delivery.")
      setLatestOrder((prev) => (prev ? { ...prev, status: "Out for Delivery" } : null))
    }, 6000)

    setTimeout(() => {
      setOrderStatus("Your order has been delivered.")
      setLatestOrder((prev) => (prev ? { ...prev, status: "Delivered" } : null))
      // Update order status to "Delivered"
      const deliveredOrders = updatedOrders.map((order) => ({ ...order, status: "Delivered" }))
      localStorage.setItem("orders", JSON.stringify(deliveredOrders))
    }, 8000)
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
        Your Cart
      </motion.h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <Card key={item.id} className="flex justify-between items-center p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <p>₹{item.price}</p>
                </div>
              </div>
              <Button variant="ghost" onClick={() => removeFromCart(item.id)}>
                <X className="h-4 w-4" />
              </Button>
            </Card>
          ))}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold">Total: ₹{totalAmount}</p>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
                <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="COD" id="COD" />
                    <Label htmlFor="COD">Cash on Delivery</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="UPI" id="UPI" />
                    <Label htmlFor="UPI">UPI</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="NEFT" id="NEFT" />
                    <Label htmlFor="NEFT">NEFT</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="BankTransfer" id="BankTransfer" />
                    <Label htmlFor="BankTransfer">Bank Transfer</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={checkout}>
                Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      <AnimatePresence>
        {showPaymentSuccess && (
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
      {orderStatus && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Track Order</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg text-primary">{orderStatus}</div>
              {latestOrder && (
                <div className="mt-2">
                  Order Status: <span className="font-bold">{latestOrder.status}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
      <Button className="mt-4" variant="outline" onClick={() => router.push("/consumer")}>
        Continue Shopping
      </Button>
    </motion.div>
  )
}

