"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

function OrderForm() {
  const searchParams = useSearchParams();
  const preselectedProduct = searchParams.get("product") || "classic";

  const [isLoading, setIsLoading] = useState(false);
  const [successCode, setSuccessCode] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customer_name: "",
    phone: "",
    address: "",
    product: preselectedProduct,
    quantity: "1",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (value: string | null) => {
    if (value) {
      setFormData((prev) => ({ ...prev, product: value }));
    }
  };

  const generateOrderCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "JOS-";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const orderCode = generateOrderCode();
      const payload = {
        ...formData,
        quantity: parseInt(formData.quantity, 10),
        order_code: orderCode,
        status: "pending"
      };

      const { error } = await supabase.from("orders").insert([payload]);

      if (error) {
        console.error("Error inserting order:", error);
        alert("Failed to place order. Please try again.");
      } else {
        setSuccessCode(orderCode);
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (successCode) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-4xl font-serif font-bold mb-4 text-foreground">Order Confirmed!</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          Thank you for choosing Jo's Cinnabon. Your order is being prepared with love.
        </p>
        <div className="bg-card p-6 rounded-2xl border border-border inline-block min-w-[300px]">
          <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold mb-2">Your Order Code</p>
          <p className="text-3xl font-mono font-bold text-primary tracking-widest">{successCode}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <Card className="border-none shadow-2xl bg-card rounded-[2rem] overflow-hidden">
      <CardHeader className="bg-primary/5 pb-8 pt-10 px-8 border-b border-border/50">
        <CardTitle className="text-3xl font-serif text-foreground">Complete Your Order</CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          Fill in your details below and we'll deliver happiness right to your door.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="customer_name">Full Name</Label>
              <Input
                id="customer_name"
                name="customer_name"
                required
                value={formData.customer_name}
                onChange={handleChange}
                placeholder="John Doe"
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="h-12 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="address">Delivery Address</Label>
            <Textarea
              id="address"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Sweet Street, Bakery City"
              className="resize-none rounded-xl"
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="product">Select Product</Label>
              <Select value={formData.product} onValueChange={(val, _details) => handleSelectChange(val || "classic")}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select a flavor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">Classic Cinnabon</SelectItem>
                  <SelectItem value="chocolate">Double Chocolate</SelectItem>
                  <SelectItem value="lotus">Lotus Biscoff</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                required
                value={formData.quantity}
                onChange={handleChange}
                className="h-12 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="notes">Special Notes (Optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Extra frosting, allergy info, etc."
              className="resize-none rounded-xl"
              rows={2}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full h-14 rounded-xl text-lg font-bold shadow-lg shadow-primary/20">
            {isLoading ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
            ) : (
              "Place Order"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function OrderPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Suspense fallback={<div className="text-center py-20"><Loader2 className="w-10 h-10 animate-spin mx-auto text-primary" /></div>}>
            <OrderForm />
          </Suspense>
        </motion.div>
      </div>
    </div>
  );
}
