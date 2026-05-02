"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data: isValid, error: rpcError } = await supabase.rpc("verify_admin", {
        admin_email: email,
        admin_password: password,
      });

      if (rpcError) {
        console.error("RPC Error:", rpcError);
        throw rpcError;
      }

      if (isValid) {
        localStorage.setItem("admin_session", "authenticated");
        router.push("/admin");
      } else {
        setError("Invalid email or password.");
      }
    } catch (err: any) {
      console.error("Login catch error:", err);
      setError(err.message || "An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-10 rounded-3xl border border-[#E6E0D8] shadow-2xl shadow-[#3E2723]/5"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-[#FAF8F5] rounded-full flex items-center justify-center border border-[#E6E0D8]">
            <Lock className="text-[#3E2723] w-6 h-6" />
          </div>
        </div>
        
        <h1 className="text-3xl font-serif font-bold text-center text-[#3E2723] mb-2">Welcome Back</h1>
        <p className="text-center text-[#8C7A6B] mb-8 text-sm">Sign in to your account.</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
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

          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-14 rounded-xl bg-[#3E2723] hover:bg-[#D98A4B] text-white font-bold tracking-widest uppercase transition-colors"
          >
            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Sign In"}
          </Button>

          <div className="text-center mt-6">
             <p className="text-sm text-[#8C7A6B]">
               Don't have an account? <a href="/register" className="text-[#D98A4B] font-bold hover:underline">Register</a>
             </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
