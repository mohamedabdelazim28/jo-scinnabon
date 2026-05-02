"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Here you would typically integrate with Supabase Auth or your custom user table
    // For now, we simulate a small delay
    setTimeout(() => {
      setIsLoading(false);
      // Redirect or show success
      router.push("/login");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-6 pt-24 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-10 rounded-3xl border border-[#E6E0D8] shadow-2xl shadow-[#3E2723]/5"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-[#FAF8F5] rounded-full flex items-center justify-center border border-[#E6E0D8]">
            <UserPlus className="text-[#3E2723] w-6 h-6" />
          </div>
        </div>
        
        <h1 className="text-3xl font-serif font-bold text-center text-[#3E2723] mb-2">Join Us</h1>
        <p className="text-center text-[#8C7A6B] mb-8 text-sm">Create an account to track your sweet orders.</p>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-14 rounded-xl border-[#E6E0D8] bg-[#FAF8F5] px-4"
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 rounded-xl border-[#E6E0D8] bg-[#FAF8F5] px-4"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 rounded-xl border-[#E6E0D8] bg-[#FAF8F5] px-4"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-14 rounded-xl bg-[#3E2723] hover:bg-[#D98A4B] text-white font-bold tracking-widest uppercase transition-colors"
          >
            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Create Account"}
          </Button>

          <div className="text-center mt-6">
             <p className="text-sm text-[#8C7A6B]">
               Already have an account? <Link href="/login" className="text-[#D98A4B] font-bold hover:underline">Sign in</Link>
             </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
