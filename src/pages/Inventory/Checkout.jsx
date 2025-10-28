"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, ReceiptText, ScanLine } from "lucide-react";
import InventoryTabs from "./InventoryTabs";

export default function Checkout() {
  const [barcode, setBarcode] = useState("");
  const [items, setItems] = useState([]);
  const transactionNo = "TXN-" + new Date().getTime().toString().slice(-6);

  const handleAdd = () => {
    if (!barcode) return;
    setItems([...items, { id: items.length + 1, barcode, qty: 1 }]);
    setBarcode("");
  };

  return (
    <div className="flex font-poppins bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-64">
        <Topbar />
        <main className="p-6 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Checkout / POS
            </h1>
          </div>
          <InventoryTabs />

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm text-gray-500">
                Transaction Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                readOnly
                value={`Transaction #: ${transactionNo}`}
                className="max-w-md"
              />

              <div className="flex gap-3 max-w-md">
                <Input
                  placeholder="Scan barcode"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                />
                <Button
                  onClick={handleAdd}
                  className="bg-[#800000] hover:bg-[#a10000] text-white flex items-center gap-2"
                >
                  <ScanLine size={16} />
                  Add
                </Button>
              </div>

              {items.length > 0 && (
                <table className="w-full text-sm mt-4 border-collapse">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="p-3 text-left">#</th>
                      <th className="p-3 text-left">Barcode</th>
                      <th className="p-3 text-left">Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{item.id}</td>
                        <td className="p-3">{item.barcode}</td>
                        <td className="p-3">{item.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div className="pt-4">
                <Button className="bg-[#800000] hover:bg-[#a10000] text-white flex items-center gap-2">
                  <ReceiptText size={16} />
                  Finalize Checkout
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
