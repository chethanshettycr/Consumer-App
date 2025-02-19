"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/app/lib/auth"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { Moon, Sun } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Product = {
  id: number
  name: string
  price: number
  image: string
  description: string
  category: "material" | "machine" | "worker"
  rating: number
}

export default function ConsumerDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [cartCount, setCartCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [displayedProducts, setDisplayedProducts] = useState<{
    material: Product[]
    machine: Product[]
    worker: Product[]
  }>({
    material: [],
    machine: [],
    worker: [],
  })
  const [cart, setCart] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [priceFilter, setPriceFilter] = useState<"lowToHigh" | "highToLow" | "default">("default")
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all")

  useEffect(() => {
    if (!user) {
      router.push("/consumer/login")
    }
  }, [user, router])

  const loadCart = useCallback(() => {
    try {
      const storedCart = localStorage.getItem("cart")
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart)
        setCart(parsedCart)
        setCartCount(parsedCart.length)
      }
    } catch (error) {
      console.error("Error loading cart:", error)
      setCart([])
      setCartCount(0)
    }
  }, [])

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/products")
      const data = await response.json()
      setAllProducts(data)

      setDisplayedProducts({
        material: data.filter((p: Product) => p.category === "material"),
        machine: data.filter((p: Product) => p.category === "machine"),
        worker: data.filter((p: Product) => p.category === "worker"),
      })
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
    loadCart()

    const isDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(isDarkMode)
    document.documentElement.classList.toggle("dark", isDarkMode)
  }, [fetchProducts, loadCart])

  useEffect(() => {
    const handleProductsUpdated = () => {
      fetchProducts()
    }

    window.addEventListener("productsUpdated", handleProductsUpdated)

    return () => {
      window.removeEventListener("productsUpdated", handleProductsUpdated)
    }
  }, [fetchProducts])

  const filteredProducts = useCallback(
    (category: "material" | "machine" | "worker") => {
      let filtered = displayedProducts[category].filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )

      if (priceFilter === "lowToHigh") {
        filtered.sort((a, b) => a.price - b.price)
      } else if (priceFilter === "highToLow") {
        filtered.sort((a, b) => b.price - a.price)
      }

      if (ratingFilter !== "all") {
        filtered = filtered.filter((product) => product.rating >= ratingFilter)
      }

      return filtered
    },
    [displayedProducts, searchTerm, priceFilter, ratingFilter],
  )

  const addToCart = useCallback((product: Product) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart, product]
      localStorage.setItem("cart", JSON.stringify(updatedCart))
      return updatedCart
    })
    setCartCount((prevCount) => prevCount + 1)
    setSelectedProduct(null)
  }, [])

  const openProductDialog = useCallback((product: Product) => {
    setSelectedProduct(product)
  }, [])

  const isInCart = useCallback(
    (productId: number) => {
      return cart.some((item) => item.id === productId)
    },
    [cart],
  )

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      // Implement search functionality
      console.log("Searching for:", searchTerm)
    },
    [searchTerm],
  )

  const toggleDarkMode = useCallback(() => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem("darkMode", newDarkMode.toString())
    document.documentElement.classList.toggle("dark", newDarkMode)
  }, [darkMode])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      {user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto p-4"
        >
          <div className="flex justify-between items-center mb-6">
            <motion.h1
              className="text-2xl font-bold text-foreground"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {user ? `Welcome, ${user.name || "Guest"}` : "Welcome to CSkit Consumer"}
            </motion.h1>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={toggleDarkMode}>
                {darkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
                <span className="sr-only">Toggle theme</span>
              </Button>
              <Button onClick={logout}>Logout</Button>
            </div>
          </div>

          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2">
              <Input
                type="search"
                placeholder="Search for materials, machines, or professionals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit">Search</Button>
            </div>
          </form>

          <div className="flex gap-4 mb-6">
            <Select onValueChange={(value) => setPriceFilter(value as "lowToHigh" | "highToLow" | "default")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">All Prices</SelectItem>
                <SelectItem value="lowToHigh">Low to High</SelectItem>
                <SelectItem value="highToLow">High to Low</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setRatingFilter(value === "all" ? "all" : Number(value))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Ratings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="3">3+ Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="materials" className="space-y-4">
            <TabsList>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="machines">Machines</TabsTrigger>
              <TabsTrigger value="worker">Professional Workers</TabsTrigger>
            </TabsList>
            {["materials", "machines", "worker"].map((tabValue) => (
              <TabsContent key={tabValue} value={tabValue}>
                <Card>
                  <CardHeader>
                    <CardTitle>{tabValue.charAt(0).toUpperCase() + tabValue.slice(1)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        visible: {
                          transition: {
                            staggerChildren: 0.1,
                          },
                        },
                      }}
                    >
                      {filteredProducts(
                        tabValue === "materials" ? "material" : tabValue === "machines" ? "machine" : "worker",
                      ).map((product) => (
                        <motion.div
                          key={product.id}
                          variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 },
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Card className="cursor-pointer" onClick={() => openProductDialog(product)}>
                            <CardContent className="p-4">
                              <img
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                className="w-full h-40 object-cover mb-2 rounded-md"
                              />
                              <h3 className="font-bold">{product.name}</h3>
                              <p>₹{product.price}</p>
                              <p>Rating: {product.rating.toFixed(1)} stars</p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          {selectedProduct && (
            <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{selectedProduct?.name}</DialogTitle>
                  <DialogDescription>
                    <img
                      src={selectedProduct?.image || "/placeholder.svg"}
                      alt={selectedProduct?.name}
                      className="w-full h-60 object-cover mb-4 rounded-md"
                    />
                    <p className="text-lg font-bold mb-2">₹{selectedProduct?.price}</p>
                    <p className="mb-2">{selectedProduct?.description}</p>
                    <p className="mb-4">Rating: {selectedProduct?.rating.toFixed(1)} stars</p>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    className="w-full"
                    onClick={() => {
                      if (selectedProduct && isInCart(selectedProduct.id)) {
                        router.push("/cart")
                      } else if (selectedProduct) {
                        addToCart(selectedProduct)
                      }
                    }}
                  >
                    {selectedProduct && isInCart(selectedProduct.id) ? "View Cart" : "Add to Cart"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          <footer className="mt-8 text-center text-sm text-gray-500">Created by Chethan Shetty</footer>
        </motion.div>
      )}
    </>
  )
}

