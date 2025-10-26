"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex font-poppins bg-gray-50 min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 ml-0 md:ml-64 transition-all">
        <Topbar onToggleSidebar={() => setSidebarOpen(true)} />

        <main className="p-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">
              Dashboard Overview
            </h1>

            {/* Quick Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-sm border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-sm text-gray-500">
                    Inventory Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold text-[#800000]">1,254</p>
                </CardContent>
              </Card>

              <Card className="shadow-sm border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-sm text-gray-500">
                    Tagged Assets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold text-[#800000]">987</p>
                </CardContent>
              </Card>

              <Card className="shadow-sm border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-sm text-gray-500">
                    Visitors Logged
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold text-[#800000]">314</p>
                </CardContent>
              </Card>

              <Card className="shadow-sm border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-sm text-gray-500">
                    Registered Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold text-[#800000]">12</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
