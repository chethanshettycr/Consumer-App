"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, ShoppingCart, ClipboardList, MessageSquare, User } from "lucide-react"
import { useAuth } from "@/app/lib/auth"

export default function ConsumerMenu() {
  const router = useRouter()
  const { user, logout } = useAuth()

  if (!user) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" size="icon">
            <Menu className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/cart")}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            My Cart
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/orders")}>
            <ClipboardList className="mr-2 h-4 w-4" />
            Orders
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/complaints")}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Complaint
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

