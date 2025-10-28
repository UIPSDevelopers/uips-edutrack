"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Save, Barcode } from "lucide-react";
import InventoryTabs from "./InventoryTabs";

export default function AddItem() {
  const [barcode, setBarcode] = useState("");
  const [form, setForm] = useState({ name: "", category: "", quantity: "", price: "" });

  const handleGenerate = () => {
    const randomCode = "INV-" + Math.floor(100000 + Math.random() * 900000);
    setBarcode(randomCode);
  };

  return (
    <div className="flex font-poppins bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-64">
        <Topbar />
        <main className="p-6 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold text-gray-800">Add New Item</h1>
          </div>
          <InventoryTabs />

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm text-gray-500">Item Information</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium">Item Name</label>
                <Input placeholder="Enter item name" value={form.name} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Input placeholder="Enter category" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Quantity</label>
                <Input type="number" placeholder="0" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Unit Price</label>
                <Input type="number" placeholder="0.00" className="mt-1" />
              </div>
              <div className="md:col-span-2 flex items-center gap-3 mt-3">
                <Button
                  onClick={handleGenerate}
                  className="bg-[#800000] hover:bg-[#a10000] text-white flex items-center gap-2"
                >
                  <Barcode size={16} />
                  Generate Barcode
                </Button>
                {barcode && (
                  <div className="p-3 border rounded-md bg-white text-gray-700 font-medium tracking-widest">
                    {barcode}
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <Button className="bg-[#800000] hover:bg-[#a10000] text-white flex items-center gap-2">
                  <Save size={16} />
                  Save Item
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
