"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "/", label: "Story" },
    { href: "/menu", label: "Collection" },
  ];

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${isScrolled ? "bg-background/80 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-8"
        }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 md:px-12">
        <Link href="/" className="font-serif text-3xl font-light tracking-tighter text-foreground group">
          Jo's <span className="italic font-bold text-secondary group-hover:text-primary transition-colors">C.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-12">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[10px] uppercase tracking-[0.3em] font-bold transition-all hover:text-secondary ${pathname === link.href ? "text-secondary" : "text-foreground/80"
                }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="flex items-center gap-6 border-l border-foreground/20 pl-6">
            <Link
              href="/login"
              className="text-[10px] uppercase tracking-[0.3em] font-bold transition-all hover:text-secondary text-foreground/80"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-[10px] uppercase tracking-[0.3em] font-bold transition-all hover:text-secondary text-foreground/80"
            >
              Register
            </Link>
          </div>

          <Link
            href="/order"
            className={buttonVariants({ variant: "outline", className: "rounded-none border-foreground/20 px-8 text-[10px] uppercase tracking-widest font-bold hover:bg-foreground hover:text-background transition-all" })}
          >
            Pre-Order
          </Link>
        </nav>

        {/* Minimal Mobile Menu Toggle (Simplified for Editorial feel) */}
        <button aria-label="Toggle Menu" className="md:hidden text-foreground flex flex-col gap-1.5 items-end group">
          <div className="w-8 h-[2px] bg-foreground" />
          <div className="w-5 h-[2px] bg-foreground group-hover:w-8 transition-all" />
        </button>
      </div>
    </header>
  );
}
