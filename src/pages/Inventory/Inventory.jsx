"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ClipboardCheck, Wrench } from "lucide-react";
import InventoryTabs from "@/pages/inventory/InventoryTabs";

export default function Inventory() {
  const [items] = useState([
    {
      id: 1,
      name: "Dell Laptop",
      tag: "INV-001",
      location: "Admin Office",
      status: "Active",
    },
    {
      id: 2,
      name: "Epson Printer",
      tag: "INV-002",
      location: "ICT Room",
      status: "Maintenance",
    },
    {
      id: 3,
      name: "Projector",
      tag: "INV-003",
      location: "Room 33",
      status: "Active",
    },
  ]);

  const totalItems = items.length;
  const activeItems = items.filter((i) => i.status === "Active").length;
  const maintenanceItems = items.filter(
    (i) => i.status === "Maintenance"
  ).length;

  return (
    <div className="flex font-poppins bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-64 transition-all duration-300">
        <Topbar />

        <main className="p-6 space-y-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold text-gray-800">Inventory</h1>
          </div>

          {/* Tabs Navigation */}
          <InventoryTabs />

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex items-center justify-between"
            >
              <div>
                <p className="text-sm text-gray-500">Total Items</p>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {totalItems}
                </h2>
              </div>
              <Package className="w-10 h-10 text-[#800000]" />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex items-center justify-between"
            >
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <h2 className="text-2xl font-semibold text-green-600">
                  {activeItems}
                </h2>
              </div>
              <ClipboardCheck className="w-10 h-10 text-green-600" />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex items-center justify-between"
            >
              <div>
                <p className="text-sm text-gray-500">Maintenance</p>
                <h2 className="text-2xl font-semibold text-yellow-600">
                  {maintenanceItems}
                </h2>
              </div>
              <Wrench className="w-10 h-10 text-yellow-600" />
            </motion.div>
          </div>

          {/* Table */}
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
