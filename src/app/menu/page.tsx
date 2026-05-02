"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const PRODUCTS = [
  {
    id: "01",
    name: "Classic",
    fullName: "The Signature Classic",
    description: "The foundation of our craft. Soft fermented dough, premium Makara cinnamon, and our secret velvet frosting.",
    price: "$5.00",
    imagePlaceholder: "bg-stone-200",
  },
  {
    id: "02",
    name: "Chocolate",
    fullName: "Double Cocoa Fusion",
    description: "For the dark spirit. Dutch cocoa infused dough with molten Belgian chocolate filling and a sea-salt finish.",
    price: "$6.00",
    imagePlaceholder: "bg-stone-800",
  },
  {
    id: "03",
    name: "Lotus",
    fullName: "Biscoff Speculoos",
    description: "The ultimate indulgence. Crushed Lotus cookies swirled into caramelized dough with a crunch that defies logic.",
    price: "$6.50",
    imagePlaceholder: "bg-orange-100",
  }
];

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-32"
        >
          <span className="text-secondary font-bold text-xs uppercase tracking-[0.5em] mb-4 block">The Collection</span>
          <h1 className="text-7xl md:text-9xl font-serif font-light leading-none">
            CURATED <br />
            <span className="italic">FLAVORS.</span>
          </h1>
        </motion.div>

        <div className="space-y-64">
          {PRODUCTS.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-24 items-center`}
            >
              <div className="flex-1 w-full relative aspect-[4/5] overflow-hidden group">
                <div className={`absolute inset-0 ${product.imagePlaceholder} transition-transform duration-1000 group-hover:scale-110`} />
                <div className="absolute inset-0 flex items-center justify-center">
                   <span className="text-white/20 font-serif text-3xl uppercase tracking-tighter">{product.name}</span>
                </div>
              </div>

              <div className="flex-1 space-y-8">
                <div className="flex items-baseline gap-4">
                  <span className="text-6xl font-serif opacity-10">{product.id}</span>
                  <h2 className="text-4xl md:text-6xl font-serif">{product.fullName}</h2>
                </div>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
                <div className="flex items-center gap-8 pt-8">
                   <span className="text-3xl font-serif">{product.price}</span>
                   <Link 
                      href={`/order?product=${product.id.toLowerCase()}`}
                      className={buttonVariants({ className: "rounded-none h-14 px-10 uppercase tracking-widest font-bold" })}
                    >
                      Order Now <ArrowRight className="ml-2 w-4 h-4" />
                   </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
