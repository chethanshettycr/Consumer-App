import { NextResponse } from "next/server"

type Product = {
  id: number
  name: string
  price: number
  image: string
  description: string
  category: "material" | "machine" | "worker"
  sellerId: string
  rating: number
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Cement",
    price: 350,
    image:
      "https://images.unsplash.com/photo-1560435650-7ec2e17ba926?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "High-quality cement for construction",
    category: "material",
    sellerId: "system",
  },
  {
    id: 2,
    name: "Excavator",
    price: 150000,
    image:
      "https://images.unsplash.com/photo-1580901369227-308f6f40bdeb?q=80&w=1772&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Heavy-duty excavator for construction sites",
    category: "machine",
    sellerId: "system",
  },
  {
    id: 3,
    name: "Skilled Mason",
    price: 800,
    image:
      "https://plus.unsplash.com/premium_photo-1683140489519-d5e8d2c7aced?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Experienced mason for brickwork and stonework",
    category: "worker",
    sellerId: "system",
  },
  {
    id: 4,
    name: "Steel",
    price: 500,
    image:
      "https://images.unsplash.com/photo-1582540730843-f4418d96ccbe?q=80&w=1892&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "High-strength steel rebar for reinforced concrete",
    category: "material",
    sellerId: "system",
  },
  {
    id: 5,
    name: "Crane Operator",
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1509390726584-faaa21c8ac95?q=80&w=1776&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Skilled crane operator for heavy lifting tasks",
    category: "worker",
    sellerId: "system",
  },
  {
    id: 6,
    name: "Concrete Mixer Small",
    price: 5000,
    image:
      "https://plus.unsplash.com/premium_photo-1661963687013-36b88a78062e?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Efficient concrete mixer for small-scale projects",
    category: "machine",
    sellerId: "system",
  },
  {
    id: 7,
    name: "Concrete Mixer Large",
    price: 60000,
    image:
      "https://plus.unsplash.com/premium_photo-1661913209349-eca68a68dee2?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Efficient concrete mixer for large-scale projects",
    category: "machine",
    sellerId: "system",
  },
  {
    id: 8,
    name: "Bricks",
    price: 500,
    image:
      "https://plus.unsplash.com/premium_photo-1675103339078-88b54e155e71?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Durable bricks for building sturdy structures.",
    category: "material",
    sellerId: "system",
  },
  {
    id: 9,
    name: "Gravel",
    price: 250,
    image:
      "https://plus.unsplash.com/premium_photo-1675543163354-e4dc1f541330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Assorted gravel for landscaping and construction projects.",
    category: "material",
    sellerId: "system",
  },
  {
    id: 10,
    name: "Wooden Planks",
    price: 400,
    image:
      "https://images.unsplash.com/photo-1591195853095-f1681b00e29c?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Assorted gravel for landscaping and construction projects.",
    category: "material",
    sellerId: "system",
  },
  {
    id: 11,
    name: "Sand",
    price: 200,
    image:
      "https://plus.unsplash.com/premium_photo-1680658496041-f7575066cec2?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Fine-grade sand for various construction applications.",
    category: "material",
    sellerId: "system",
  },
  {
    id: 12,
    name: "Civil Engineer",
    price: 200000,
    image:
      "https://plus.unsplash.com/premium_photo-1681691912442-68c4179c530c?q=80&w=1771&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Every plane has to be Organised",
    category: "worker",
    sellerId: "system",
  },
  {
    id: 13,
    name: "Carpenter",
    price: 200000,
    image:
      "https://plus.unsplash.com/premium_photo-1677151140792-e1b681faffbb?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Shape your Woods, just like your Life",
    category: "worker",
    sellerId: "system",
  },
  {
    id: 14,
    name: "Truck",
    price: 20000,
    image:
      "https://plus.unsplash.com/premium_photo-1661964199430-3e49c575b0b0?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Efficient for large-scale Loads",
    category: "machine",
    sellerId: "system",
  },
  {
    id: 15,
    name: "Pick-Up Truck",
    price: 5000,
    image:
      "https://images.unsplash.com/photo-1605504835488-e8c6d37beb43?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Efficient for small-scale Loads",
    category: "machine",
    sellerId: "system",
  },
  {
    id: 16,
    name: "Frontend Loader",
    price: 115600,
    image:
      "https://images.unsplash.com/photo-1629807473015-41699c4471b5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Efficient for small-scale Loads",
    category: "machine",
    sellerId: "system",
  },
]

// Add random rating to each product
const productsWithRatings = INITIAL_PRODUCTS.map((product) => ({
  ...product,
  rating: Number((Math.random() * (5 - 3.5) + 3.5).toFixed(1)),
}))

function getProducts(): Product[] {
  if (typeof window !== "undefined") {
    const storedProducts = localStorage.getItem("products")
    if (storedProducts) {
      const parsedProducts = JSON.parse(storedProducts)
      // Merge productsWithRatings with stored products, preferring stored products
      return productsWithRatings
        .map((initialProduct) => {
          const storedProduct = parsedProducts.find((p: Product) => p.id === initialProduct.id)
          return storedProduct || initialProduct
        })
        .concat(parsedProducts.filter((p: Product) => !productsWithRatings.some((ip) => ip.id === p.id)))
    }
  }
  return productsWithRatings
}

function saveProducts(products: Product[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("products", JSON.stringify(products))
  }
}

export async function GET() {
  const products = getProducts()
  return NextResponse.json(products)
}

export async function POST(request: Request) {
  const newProduct: Omit<Product, "id"> = await request.json()
  const products = getProducts()
  const product: Product = {
    ...newProduct,
    id: Math.max(...products.map((p) => p.id), 0) + 1,
    rating: Number((Math.random() * (5 - 3.5) + 3.5).toFixed(1)),
  }
  products.push(product)
  saveProducts(products)
  return NextResponse.json(product, { status: 201 })
}

export async function PUT(request: Request) {
  const updatedProduct: Product = await request.json()
  const products = getProducts()
  const updatedProducts = products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
  saveProducts(updatedProducts)
  return NextResponse.json(updatedProduct)
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  const products = getProducts()
  const updatedProducts = products.filter((p) => p.id !== id)
  saveProducts(updatedProducts)
  return NextResponse.json({ success: true })
}

