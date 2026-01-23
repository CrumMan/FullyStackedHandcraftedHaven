"use client"

import { useState } from "react"

export function Navigation(){
    const [isOpen, setIsOpen] = useState(false)

    return(
    <>
    <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu" className="absolute right-4 top-4 w-8 h-8 z-50" > 
      <span className={`absolute left-1/2 -translate-x-1/2 w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? "rotate-45 top-1/2" : "top-2"} `} ></span> 
      <span className={`absolute left-1/2 -translate-x-1/2 w-6 h-0.5 bg-white transition-opacity duration-300 ${isOpen ? "opacity-0 top-1/2" : "top-1/2"} `} ></span> 
      <span className={`absolute left-1/2 -translate-x-1/2 w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? "-rotate-45 top-1/2" : "top-6"} `} ></span> </button>
    {isOpen && (
    <nav
  className={`w-full flex gap-8 mt-2 items-center justify-center bg-secondary overflow-hidden transition-all duration-300
    ${isOpen ? "opacity-100 max-h-20" : "opacity-0 max-h-0"}`}
>
    <a className="text-xl text-white hover:text-gray-300 transition-colors" href="/">Home</a>
    <a className="text-xl text-white hover:text-gray-300 transition-colors" href="/contact_page">Product Page</a>
    <a className="text-xl text-white hover:text-gray-300 transition-colors" itemID="Login" href="/login">Login</a>
    </nav>
    )}
    </>
    )
}
