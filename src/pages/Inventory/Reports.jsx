"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";
import InventoryTabs from "@/pages/Inventory/InventoryTabs";
import { generatePDFTemplate } from "@/utils/generatePDFTemplate";
import axiosInstance from "@/lib/axios"; // ✅ use axiosInstance

export default function Reports() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [type, setType] = useState("delivery");
  const [data, setData] = useState([]);
  const [totals, setTotals] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Sidebar state (for mobile)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleToggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      let url = "";

      if (type === "delivery") url = "/reports/delivery";
      if (type === "checkout") url = "/reports/checkout";
      if (type === "returns") url = "/reports/returns";
      if (type === "summary") url = "/reports/summary";

      // ✅ Build date range params
      let params = {};
      if (from && to) {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);

        params.from = fromDate.toISOString();
        params.to = toDate.toISOString();
      }

      console.log("📡 Fetching:", url, "params:", params);

      // ✅ axiosInstance handles baseURL + token
      const res = await axiosInstance.get(url, { params });
      const result = res.data;

      console.log("✅ Data received:", result);

      // ✅ handle summary format or normal array
      if (result.summary && Array.isArray(result.summary)) {
        setData(result.summary);
        setTotals(result.totals || null);
      } else if (Array.isArray(result)) {
        setData(result);
        setTotals(null);
      } else {
        setData([]);
        setTotals(null);
      }
    } catch (error) {
      console.error("❌ Error generating report:", error);
      const msg =
        error.response?.data?.message ||
        "⚠️ Server error while generating report.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleExportToPDF = async () => {
    if (!data || data.length === 0) {
      alert("⚠️ No data to export.");
      return;
    }

    const tableHeaders = Object.keys(data[0]);
    const tableData = data.map((item) =>
      tableHeaders.map((col) =>
        typeof item[col] === "object"
          ? JSON.stringify(item[col])
          : item[col]?.toString() || ""
      )
    );

    const doc = await generatePDFTemplate({
      title: "UIPS EduTrack Report",
      subtitle: `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
      tableHeaders,
      tableData,
      totals,
      from,
      to,
    });

    doc.save(`${type}_report_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
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
          {/* 🔹 Filter Section */}
          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="delivery">Delivery Report</option>
              <option value="checkout">Checkout Report</option>
              <option value="returns">Returns Report</option>
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

            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-[#800000] hover:bg-[#a10000] text-white flex items-center gap-2"
            >
              <FileText size={16} />
              {loading ? "Generating..." : "Generate Report"}
            </Button>
          </div>

          {/* 🔹 Summary Header */}
          {data.length > 0 && (
            <div className="border rounded-md bg-gray-50 p-4 mt-2 shadow-sm">
              <h2 className="font-semibold text-gray-800 text-sm mb-1">
                {type.charAt(0).toUpperCase() + type.slice(1)} Report
              </h2>
              {from || to ? (
                <p className="text-gray-600 text-xs">
                  Showing results from{" "}
                  <span className="font-medium text-gray-800">
                    {from
                      ? new Date(from).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "the beginning"}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-gray-800">
                    {to
                      ? new Date(to).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "today"}
                  </span>
                </p>
              ) : (
                <p className="text-gray-600 text-xs">
                  Showing all available data
                </p>
              )}
            </div>
          )}

          {/* 🔹 Results Table */}
          <div className="mt-6">
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-sm text-gray-500">
                  Report Results ({data.length})
                </CardTitle>
              </CardHeader>

              <CardContent className="overflow-x-auto">
                {data.length === 0 ? (
                  <p className="text-gray-600 text-sm">No data to display.</p>
                ) : (
                  <table className="w-full text-sm border-collapse">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        {(data.length > 0 ? Object.keys(data[0]) : []).map(
                          (key) => (
                            <th
                              key={key}
                              className="p-2 text-left capitalize border-b"
                            >
                              {key.replace(/([A-Z])/g, " $1")}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          {Object.values(row).map((val, j) => (
                            <td key={j} className="p-2 border-b text-gray-700">
                              {typeof val === "object"
                                ? JSON.stringify(val)
                                : val?.toString()}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* ✅ Totals for summary */}
                {type === "summary" && totals && (
                  <div className="mt-6 border-t pt-4 text-sm text-gray-700 space-y-1">
                    <p>
                      <span className="font-semibold">Total Delivered:</span>{" "}
                      {totals.totalDelivered}
                    </p>
                    <p>
                      <span className="font-semibold">Total Returned:</span>{" "}
                      {totals.totalReturned ?? 0}
                    </p>
                    <p>
                      <span className="font-semibold">Total Checked Out:</span>{" "}
                      {totals.totalCheckedOut}
                    </p>
                    <p>
                      <span className="font-semibold">
                        Total Stock (as of date):
                      </span>{" "}
                      {totals.totalStockAsOfDate}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 🔹 Export Button */}
          {data.length > 0 && (
            <div className="pt-4">
              <Button
                onClick={handleExportToPDF}
                className="bg-[#800000] hover:bg-[#a10000] text-white flex items-center gap-2"
              >
                <Download size={16} />
                Export to PDF
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
