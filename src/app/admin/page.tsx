"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Loader2, MoreVertical, ChevronLeft, ChevronRight, LogOut, Trash2, Pencil, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Order = {
  id: string;
  order_code: string;
  customer_name: string;
  phone: string;
  address: string;
  product: string;
  quantity: number;
  notes: string;
  status: string;
  created_at: string;
};

const STATUS_CONFIG: Record<string, { label: string; colors: string }> = {
  pending: { label: "Pending", colors: "bg-[#F3D9B1] text-[#8C5A2B] border-transparent" },
  preparing: { label: "Baking", colors: "bg-[#D9C4B8] text-[#5A3A2B] border-transparent" },
  out_for_delivery: { label: "Out", colors: "bg-[#E6E0D8] text-[#2A1D18] border-transparent" },
  delivered: { label: "Ready", colors: "bg-[#C4D9B8] text-[#3A5A2B] border-transparent" },
  cancelled: { label: "Cancelled", colors: "bg-[#D9B8B8] text-[#5A2B2B] border-transparent" },
};

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    if (session !== "authenticated") {
      router.push("/login");
      return;
    }
    setIsAuthenticated(true);
    fetchOrders();

    const subscription = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/login");
  };

  if (!isAuthenticated) return null;

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", id);
        
      if (error) throw error;
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (error) throw error;
      setOrders(orders.filter(o => o.id !== id));
    } catch (err) {
      console.error("Failed to delete order", err);
    }
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    try {
      const { error } = await supabase
        .from("orders")
        .update({
          customer_name: editingOrder.customer_name,
          phone: editingOrder.phone,
          address: editingOrder.address,
          quantity: editingOrder.quantity,
          notes: editingOrder.notes
        })
        .eq("id", editingOrder.id);

      if (error) throw error;
      
      setOrders(orders.map(o => o.id === editingOrder.id ? editingOrder : o));
      setIsUpdateOpen(false);
      setEditingOrder(null);
    } catch (err) {
      console.error("Failed to update order", err);
    }
  };

  const filteredOrders = orders.filter((order) => {
    return order.order_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
           order.phone.includes(searchQuery) ||
           order.customer_name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const dailyOrders = orders.filter(o => {
    const today = new Date().toISOString().split('T')[0];
    return o.created_at.startsWith(today);
  }).length;

  const pendingCount = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex justify-between items-start w-full md:w-auto">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#3E2723] mb-2">Order Dashboard</h1>
              <p className="text-[#8C7A6B]">Manage incoming orders and track baking progress.</p>
            </div>
            <button 
              onClick={handleLogout}
              className="md:hidden p-2 text-[#8C7A6B] hover:text-[#3E2723]"
            >
              <LogOut size={24} />
            </button>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-[350px]">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-[#8C7A6B]" />
              <Input
                placeholder="Search by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-xl border-[#E6E0D8] bg-white shadow-sm"
              />
            </div>
            <button 
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 h-12 px-4 rounded-xl border border-[#E6E0D8] bg-white text-[#8C7A6B] hover:text-[#3E2723] transition-colors"
            >
              <LogOut size={18} />
              <span className="text-sm font-bold">Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-2xl border-[#E6E0D8] bg-[#FAF8F5] shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-[#8C7A6B] mb-2">Total Orders</p>
              <p className="text-4xl font-bold text-[#3E2723]">{orders.length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-[#E6E0D8] bg-[#FAF8F5] shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-[#8C7A6B] mb-2">Orders Today</p>
              <p className="text-4xl font-bold text-[#3E2723]">{dailyOrders}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-[#E6E0D8] bg-[#FAF8F5] shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-[#8C7A6B] mb-2">Pending Orders</p>
              <p className="text-4xl font-bold text-[#D98A4B]">{pendingCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-[#E6E0D8] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#FAF8F5]">
                <TableRow className="border-[#E6E0D8] hover:bg-[#FAF8F5]">
                  <TableHead className="font-bold text-[#8C7A6B] h-14 pl-6 uppercase text-xs tracking-widest">Order ID</TableHead>
                  <TableHead className="font-bold text-[#8C7A6B] h-14 uppercase text-xs tracking-widest">Customer</TableHead>
                  <TableHead className="font-bold text-[#8C7A6B] h-14 uppercase text-xs tracking-widest">Phone</TableHead>
                  <TableHead className="font-bold text-[#8C7A6B] h-14 uppercase text-xs tracking-widest">Items</TableHead>
                  <TableHead className="font-bold text-[#8C7A6B] h-14 uppercase text-xs tracking-widest text-center">Status</TableHead>
                  <TableHead className="font-bold text-[#8C7A6B] h-14 pr-6 uppercase text-xs tracking-widest text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-16">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#D98A4B]" />
                    </TableCell>
                  </TableRow>
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-16 text-[#8C7A6B]">
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} className="border-[#E6E0D8] hover:bg-[#FAF8F5]/50 transition-colors">
                      <TableCell className="pl-6 font-bold text-[#3E2723]">#{order.order_code.replace("JOS-", "")}</TableCell>
                      <TableCell className="font-bold text-[#3E2723]">{order.customer_name}</TableCell>
                      <TableCell className="text-[#8C7A6B]">{order.phone}</TableCell>
                      <TableCell className="text-[#5A3A2B]">{order.quantity}x {order.product.charAt(0).toUpperCase() + order.product.slice(1)}</TableCell>
                      <TableCell className="text-center">
                         <Select 
                            value={order.status} 
                            onValueChange={(val, _details) => handleStatusChange(order.id, val || order.status)}
                          >
                            <SelectTrigger className={`w-[120px] mx-auto h-8 text-xs font-bold rounded-full border-none ${STATUS_CONFIG[order.status]?.colors || "bg-gray-100"}`}>
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="preparing">Baking</SelectItem>
                              <SelectItem value="out_for_delivery">Out</SelectItem>
                              <SelectItem value="delivered">Ready</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog open={isUpdateOpen && editingOrder?.id === order.id} onOpenChange={(open) => {
                            if (!open) {
                              setIsUpdateOpen(false);
                              setEditingOrder(null);
                            }
                          }}>
                            <DialogTrigger 
                              render={
                                <button 
                                  className="text-[#8C7A6B] hover:text-[#D98A4B] transition-colors p-2 outline-none"
                                />
                              }
                              onClick={() => {
                                setEditingOrder(order);
                                setIsUpdateOpen(true);
                              }}
                            >
                              <Pencil size={18} />
                            </DialogTrigger>
                            <DialogContent className="max-w-md rounded-3xl">
                              <DialogHeader>
                                <DialogTitle className="font-serif text-2xl">Edit Order #{order.order_code.replace("JOS-", "")}</DialogTitle>
                              </DialogHeader>
                              <form onSubmit={handleUpdateOrder} className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>Customer Name</Label>
                                  <Input 
                                    value={editingOrder?.customer_name || ""} 
                                    onChange={e => setEditingOrder(prev => prev ? {...prev, customer_name: e.target.value} : null)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Phone</Label>
                                  <Input 
                                    value={editingOrder?.phone || ""} 
                                    onChange={e => setEditingOrder(prev => prev ? {...prev, phone: e.target.value} : null)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Quantity</Label>
                                  <Input 
                                    type="number"
                                    value={editingOrder?.quantity || 0} 
                                    onChange={e => setEditingOrder(prev => prev ? {...prev, quantity: parseInt(e.target.value)} : null)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Address</Label>
                                  <Textarea 
                                    value={editingOrder?.address || ""} 
                                    onChange={e => setEditingOrder(prev => prev ? {...prev, address: e.target.value} : null)}
                                  />
                                </div>
                                <DialogFooter className="pt-4">
                                  <Button type="submit" className="w-full bg-[#3E2723] rounded-xl h-12">
                                    <Save className="mr-2 w-4 h-4" /> Save Changes
                                  </Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>

                          <button 
                            onClick={() => handleDelete(order.id)}
                            className="text-[#8C7A6B] hover:text-red-500 transition-colors p-2"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination/Footer */}
          <div className="bg-[#FAF8F5] border-t border-[#E6E0D8] p-4 px-6 flex items-center justify-between">
            <span className="text-sm text-[#8C7A6B]">
              Showing {filteredOrders.length > 0 ? 1 : 0} to {filteredOrders.length} of {orders.length} orders
            </span>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-xl bg-white border border-[#E6E0D8] flex items-center justify-center text-[#8C7A6B] hover:text-[#3E2723] shadow-sm"><ChevronLeft size={18}/></button>
              <button className="w-10 h-10 rounded-xl bg-white border border-[#E6E0D8] flex items-center justify-center text-[#8C7A6B] hover:text-[#3E2723] shadow-sm"><ChevronRight size={18}/></button>
            </div>
          </div>
        </div>

        {/* Promo Cards Section */}
        <div className="grid md:grid-cols-2 gap-6 pt-6">
          <div className="relative rounded-3xl overflow-hidden h-[300px] shadow-sm">
            <Image src="/promo.png" alt="Our Menu" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/10" />
          </div>
          <div className="relative rounded-3xl overflow-hidden h-[300px] shadow-sm bg-[#3E2723] p-10 flex flex-col justify-end">
            <div className="absolute inset-0 opacity-20">
              <Image src="/baking.png" alt="Special" fill className="object-cover" />
            </div>
            <div className="relative z-10">
               <h3 className="text-white text-3xl font-serif font-bold mb-3">Today's Special</h3>
               <p className="text-white/80 max-w-md">Caramel Pecan Sticky Buns - 20% off for the next hour.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
