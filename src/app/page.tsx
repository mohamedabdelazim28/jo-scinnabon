"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { ArrowDown, ArrowRight, Play } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -200]);
  const textX = useTransform(scrollYProgress, [0, 0.3], [0, 100]);

  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });

  const fadeIn = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const },
  };

  return (
    <div ref={containerRef} className="relative bg-background overflow-hidden">
      {/* Immersive Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ scale: springScale }} className="absolute inset-0 z-0">
          <Image
            src="/hero.png"
            alt="Jo's Premium Cinnabon"
            fill
            className="object-cover brightness-75"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50" />
        </motion.div>

        <div className="container relative z-10 px-6 md:px-12 flex flex-col md:flex-row items-end justify-between h-full pb-24">
          <motion.div
            style={{ x: textX }}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }}
            className="max-w-4xl"
          >
            <h1 className="text-[12vw] md:text-[10vw] font-serif leading-[0.85] text-white mix-blend-difference">
              UNFORGETTABLE <br />
              <span className="italic font-light">CRAVING.</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden md:block"
          >
            <div className="text-vertical text-white/50 text-sm tracking-[0.5em] font-medium py-12 border-l border-white/20 pl-4 uppercase">
              Est. 2024 — Crafted in Cairo
            </div>
          </motion.div>
        </div>

        <motion.div
          style={{ opacity }}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-widest font-bold">Scroll</span>
          <ArrowDown size={16} />
        </motion.div>
      </section>

      {/* Narrative Section - The Art of Dough */}
      <section className="py-32 md:py-64 container px-6 md:px-12 grid lg:grid-cols-2 gap-24 items-center">
        <motion.div {...fadeIn} className="relative aspect-[4/5] bg-card overflow-hidden rounded-sm group">
          <Image src="/baking.png" alt="Baking Process" fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
        </motion.div>

        <div className="space-y-12">
          <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
            <span className="text-secondary font-bold text-xs uppercase tracking-[0.3em] mb-4 block">The Philosophy</span>
            <h2 className="text-5xl md:text-7xl font-serif leading-tight">
              Slow Dough, <br />
              <span className="italic">Fast Joy.</span>
            </h2>
          </motion.div>
          <motion.p {...fadeIn} transition={{ delay: 0.4 }} className="text-xl text-muted-foreground leading-relaxed max-w-lg">
            We believe that time is the most important ingredient. Our dough is rested for 18 hours, allowing the wild yeast to create a texture that is impossibly soft, yet resilient.
          </motion.p>
          <motion.div {...fadeIn} transition={{ delay: 0.6 }}>
            <Link
              href="/menu"
              className={buttonVariants({ variant: "link", className: "text-xl p-0 h-auto group text-foreground font-serif" })}
            >
              Explore our craft <ArrowRight className="ml-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products - Large Horizontal Cards */}
      <section className="bg-primary py-32 md:py-48 text-primary-foreground">
        <div className="container px-6 md:px-12">
          <motion.div {...fadeIn} className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <h2 className="text-6xl md:text-8xl font-serif">OUR <br />SELECTION.</h2>
            <p className="text-primary-foreground/60 max-w-sm mb-4">Three masterpieces, perfected over months of experimentation. No fillers, only flavor.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-1px bg-primary-foreground/10 border border-primary-foreground/10">
            {[
              { id: "01", name: "Classic", desc: "The gold standard of cinnamon rolls.", price: "$5" },
              { id: "02", name: "Chocolate", desc: "Dark Belgian cocoa infusion.", price: "$6" },
              { id: "03", name: "Lotus", desc: "Cookie butter crunch & swirl.", price: "$6.5" },
            ].map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group relative bg-primary p-12 aspect-square flex flex-col items-center justify-between hover:bg-secondary transition-colors duration-500 cursor-pointer"
              >
                <div className="flex justify-between items-start w-full">
                  <span className="text-4xl font-serif opacity-30">{item.id}</span>
                  <span className="text-xl font-bold">{item.price}</span>
                </div>
                <div className="text-center">
                  <h3 className="text-4xl font-serif mb-2">{item.name}</h3>
                  <p className="text-sm opacity-60 group-hover:opacity-100 transition-opacity">{item.desc}</p>
                </div>
                <div className="absolute bottom-12 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                  <Link href={`/order?product=${item.name.toLowerCase()}`} className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                    Order <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Immersive CTA */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <Image src="/promo.png" alt="Cinnabon Promo" fill className="object-cover brightness-50" />
        <div className="absolute inset-0 bg-background/30" />
        <motion.div
          {...fadeIn}
          className="relative text-center z-10 max-w-4xl px-6"
        >
          <h2 className="text-[8vw] md:text-[6vw] font-serif leading-[0.9] mb-12">
            TASTE THE <br />
            <span className="text-secondary italic">DIFFERENCE.</span>
          </h2>
          <Link
            href="/order"
            className={buttonVariants({ size: "lg", className: "rounded-none px-12 h-16 text-lg tracking-widest uppercase bg-foreground text-background hover:bg-secondary transition-colors" })}
          >
            Start your order
          </Link>
        </motion.div>
      </section>

      {/* Unique Minimal Footer */}
      <footer className="py-24 border-t border-border">
        <div className="container px-6 md:px-12 grid md:grid-cols-2 gap-12">
          <div>
            <h4 className="font-serif text-3xl mb-8">Jo's Cinnabon.</h4>
            <div className="flex gap-8 text-xs uppercase tracking-widest font-bold text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Instagram</Link>
              <Link href="/" className="hover:text-foreground">Facebook</Link>
              <Link href="/" className="hover:text-foreground">Email</Link>
            </div>
          </div>
          <div className="md:text-right flex flex-col md:items-end justify-between">
            <p className="text-muted-foreground text-sm max-w-xs">
              Handcrafted daily in our boutique kitchen. Limited batches available.
            </p>
            <p className="text-[10px] text-muted-foreground/50 uppercase mt-12">
              © 2024 — All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
