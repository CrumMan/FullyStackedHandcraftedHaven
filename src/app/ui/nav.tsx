"use client";

import { useState } from "react";
import Link from "next/link";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/login", label: "Login" },
    { href: "/register", label: "Register" },
  ];

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-6 ml-auto">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-white/95 hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        className="md:hidden ml-auto h-10 w-10 grid place-items-center"
      >
        {isOpen ? (
          <span className="text-2xl leading-none">×</span>
        ) : (
          <div className="flex flex-col gap-1">
            <span className="block w-6 h-0.5 bg-white" />
            <span className="block w-6 h-0.5 bg-white" />
            <span className="block w-6 h-0.5 bg-white" />
          </div>
        )}
      </button>

      {/* Mobile expanded menu (extends header) */}
      {isOpen && (
        <nav className="md:hidden w-full border-t border-white/15 pt-3">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-white/95 hover:text-white text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </>
  );
}
