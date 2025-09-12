"use client"

import {  HandHelping, Menu } from "lucide-react"
import Link from "next/link"
import React from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"  // for active route

function Navbar() {
  const pathname = usePathname()
  const token = localStorage.getItem("auth-storage")
  const isLoggedIn = token && token !== "undefined" && token !== "null"

  
  let navItems:any = []
  if (isLoggedIn) {
    navItems = [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/complaints", label: "Complaints" },
      { href: "/profile", label: "Profile" },
    ]
  }

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 px-6 py-6 bg-white shadow-sm">
      {/* Left Section (Logo + Brand) */}
      <div className="flex items-center gap-3">
        <HandHelping className="size-8 text-purple-500" />
        <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">Naagrik Sahayak</h1>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden sm:flex items-center gap-6 text-md font-medium">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`transition-colors ${
              pathname === item.href
                ? "text-gray-900 font-semibold border-b-2 border-green-500 pb-1"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Right Section (Mobile Menu Trigger) */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="sm:hidden">
            <Menu className="size-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-4">
          <SheetHeader>
            <SheetTitle className="text-lg font-bold text-gray-900">Menu</SheetTitle>
          </SheetHeader>
          <nav className="mt-4 flex flex-col gap-3 text-gray-700">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${
                  pathname === item.href ? "text-green-600 font-semibold" : "hover:text-green-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/profile" className="hover:text-green-600">
              Profile
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}

export default Navbar
