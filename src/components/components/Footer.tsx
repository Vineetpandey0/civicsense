"use client"

import React from "react"
import Link from "next/link"

function Footer() {
  return (
    <footer className=" bg-gray-50 text-gray-600">
      <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* About Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Civicsense</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Civicsense helps citizens easily file complaints related to civic issues 
            and ensures they are automatically assigned to the right officials based on location. 
            Our goal is to make governance more transparent and responsive.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-green-600">Home</Link></li>
            <li><Link href="/complaints" className="hover:text-green-600">File Complaint</Link></li>
            <li><Link href="/officials" className="hover:text-green-600">For Officials</Link></li>
            <li><Link href="/about" className="hover:text-green-600">About Us</Link></li>
          </ul>
        </div>

        {/* Help & Support */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Help & Support</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/faq" className="hover:text-green-600">FAQs</Link></li>
            <li><Link href="/support" className="hover:text-green-600">Contact Support</Link></li>
            <li><Link href="/privacy" className="hover:text-green-600">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-green-600">Terms & Conditions</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-gray-100 py-4">
        <p className="text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Civicsense. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
