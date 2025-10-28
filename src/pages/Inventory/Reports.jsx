"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";
import InventoryTabs from "./InventoryTabs";

export default function Reports() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [type, setType] = useState("delivery");

  return (
    <div className="flex font-poppins bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-64">
        <Topbar />
        <main className="p-6 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Inventory Reports
            </h1>
          </div>
          <InventoryTabs />

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm text-gray-500">
                Report Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-4 items-center">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm"
                >
                  <option value="delivery">Delivery Report</option>
                  <option value="checkout">Checkout Report</option>
                  <option value="current">Current Inventory</option>
                  <option value="summary">Inventory Summary</option>
                </select>

                <div className="flex items-center gap-3">
                  <Input
                    type="date"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                  />
                  <span className="text-gray-500 text-sm">to</span>
                  <Input
                    type="date"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                  />
                </div>

                <Button className="bg-[#800000] hover:bg-[#a10000] text-white flex items-center gap-2">
                  <FileText size={16} />
                  Generate Report
                </Button>
              </div>

              <div className="mt-6">
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-sm text-gray-500">
                      Report Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">No data to display.</p>
                  </CardContent>
                </Card>
              </div>

              <div className="pt-4">
                <Button className="bg-[#800000] hover:bg-[#a10000] text-white flex items-center gap-2">
                  <Download size={16} />
                  Export to PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
