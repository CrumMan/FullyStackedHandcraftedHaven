"use client";

import { useState } from "react";
import Link from "next/link";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        className="absolute right-4 top-4 w-8 h-8 z-50"
      >
        <span className={`absolute left-1/2 -translate-x-1/2 w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? "rotate-45 top-1/2" : "top-2"}`} />
        <span className={`absolute left-1/2 -translate-x-1/2 w-6 h-0.5 bg-white transition-opacity duration-300 ${isOpen ? "opacity-0 top-1/2" : "top-1/2"}`} />
        <span className={`absolute left-1/2 -translate-x-1/2 w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? "-rotate-45 top-1/2" : "top-6"}`} />
      </button>

      {/* Menu */}
      {isOpen && (
        <nav className="w-full flex gap-8 mt-2 items-center justify-center bg-secondary overflow-hidden transition-all duration-300 opacity-100 max-h-20">

          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="text-xl text-white hover:text-gray-300 transition-colors"
          >
            Home
          </Link>

          <Link
            href="/products"
            onClick={() => setIsOpen(false)}
            className="text-xl text-white hover:text-gray-300 transition-colors"
          >
            Products
          </Link>

          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="text-xl text-white hover:text-gray-300 transition-colors"
          >
            Login
          </Link>

        </nav>
      )}
    </>
  );
}
