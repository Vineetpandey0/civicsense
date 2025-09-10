"use client"

import { Bell } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

function Navbar() {
  return (
    <div className='sm:p-6 p-4 flex w-full justify-between'>
        <div className='flex items-center justify-center gap-2'>
            <Bell className='sm:size-8 '/>
            <h1 className='sm:text-3xl text-xl font-bold '>CIVICSENSE</h1>
        </div>
        <nav>
            <ul className='sm:flex hidden space-x-4 text-gray-500'>
                <li>
                    <Link href="#" className='text-lg hover:text-black transition:transform duration-300'>Dashboard</Link>
                </li>
                <li>
                    <Link href="#" className='text-lg hover:text-black transition:transform duration-300'>Complaints</Link>
                </li>
                <li>
                    <Link href="#" className='text-lg hover:text-black transition:transform duration-300'>Reports</Link>
                </li>
                <li>
                    <Link href="#" className='text-lg hover:text-black transition:transform duration-300'>Profile</Link>
                </li>
            </ul>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" className="sm:hidden ">
                    <Menu className='size-6'/>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-4">
                    <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-bold">Menu</h2>
                    <nav className="flex flex-col gap-2">
                        <Link href="/dashboard" className="hover:text-green-600">Dashboard</Link>
                        <Link href="/complaints" className="hover:text-green-600">Complaints</Link>
                        <Link href="/analytics" className="hover:text-green-600">Analytics</Link>
                        <Link href="/profile" className="hover:text-green-600">Profile</Link>
                        <Link href="/settings" className="hover:text-green-600">Settings</Link>
                    </nav>
                    </div>
                </SheetContent>
            </Sheet>
        </nav>
    </div>
  )
}

export default Navbar