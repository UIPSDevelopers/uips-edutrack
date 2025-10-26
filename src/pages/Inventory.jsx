"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function Inventory() {
  const [items] = useState([
    { id: 1, name: "Dell Laptop", tag: "INV-001", location: "Admin Office", status: "Active" },
    { id: 2, name: "Epson Printer", tag: "INV-002", location: "ICT Room", status: "Maintenance" },
    { id: 3, name: "Projector", tag: "INV-003", location: "Room 33", status: "Active" },
  ]);

  return (
    <div className="flex font-poppins bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-0 md:ml-64">
        <Topbar />

        <main className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold text-gray-800">Inventory</h1>
            <Button className="bg-[#800000] hover:bg-[#a10000] text-white flex items-center gap-2">
              <PlusCircle size={16} />
              Add Item
            </Button>
          </div>

          {/* Inventory Table */}
          <Card className="shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-sm text-gray-500">
                List of Inventory Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 text-left">
                      <th className="p-3 font-medium">#</th>
                      <th className="p-3 font-medium">Item Name</th>
                      <th className="p-3 font-medium">Tag</th>
                      <th className="p-3 font-medium">Location</th>
                      <th className="p-3 font-medium">Status</th>
                      <th className="p-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, i) => (
                      <tr
                        key={item.id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="p-3">{i + 1}</td>
                        <td className="p-3 font-medium">{item.name}</td>
                        <td className="p-3">{item.tag}</td>
                        <td className="p-3">{item.location}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              item.status === "Active"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3 text-right text-gray-500">
                          <button className="hover:text-[#800000] transition">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
