"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";
import InventoryTabs from "./InventoryTabs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Reports() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [type, setType] = useState("delivery");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      let url = "";

      if (type === "delivery")
        url = "http://localhost:5000/api/reports/delivery";
      if (type === "checkout")
        url = "http://localhost:5000/api/reports/checkout";
      if (type === "current")
        url = "http://localhost:5000/api/reports/inventory";
      if (type === "summary") url = "http://localhost:5000/api/reports/summary";

      // ✅ Convert to full ISO string to include time
      let query = "";
      if (from && to) {
        const fromDate = new Date(from);
        const toDate = new Date(to);

        // Extend 'to' date to end of the day to include all records
        toDate.setHours(23, 59, 59, 999);

        query = `?from=${fromDate.toISOString()}&to=${toDate.toISOString()}`;
      }

      const finalUrl = `${url}${query}`;
      console.log("📡 Fetching:", finalUrl);

      const res = await fetch(finalUrl);
      const result = await res.json();

      console.log("✅ Data received:", result);

      if (!res.ok) {
        alert(`❌ ${result.message || "Failed to load report."}`);
        return;
      }

      setData(result);
    } catch (error) {
      console.error("❌ Error generating report:", error);
      alert("⚠️ Server error while generating report.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportToPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(14);
    doc.text("UIPS EduTrack - Inventory Report", 14, 15);
    doc.setFontSize(11);
    doc.text(`${type.charAt(0).toUpperCase() + type.slice(1)} Report`, 14, 23);

    if (from || to) {
      doc.setFontSize(10);
      doc.text(`Date range: ${from || "Start"} to ${to || "Today"}`, 14, 30);
    }

    // Prepare data for the table
    const tableColumn = Object.keys(data[0]);
    const tableRows = data.map((item) =>
      tableColumn.map((col) =>
        typeof item[col] === "object"
          ? JSON.stringify(item[col])
          : item[col]?.toString() || ""
      )
    );

    // ✅ Use plugin directly
    autoTable(doc, {
      startY: 35,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 8 },
    });

    // Footer
    const currentDate = new Date().toLocaleString();
    doc.setFontSize(9);
    doc.text(
      `Generated on ${currentDate}`,
      14,
      doc.internal.pageSize.height - 10
    );

    // Save file
    doc.save(`${type}_report_${new Date().toISOString().split("T")[0]}.pdf`);
  };

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
              {/* 🔹 Filter Section */}
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
                      <p className="text-gray-600 text-sm">
                        No data to display.
                      </p>
                    ) : (
                      <table className="w-full text-sm border-collapse">
                        <thead className="bg-gray-100 text-gray-700">
                          <tr>
                            {Object.keys(data[0]).map((key) => (
                              <th
                                key={key}
                                className="p-2 text-left capitalize border-b"
                              >
                                {key.replace(/([A-Z])/g, " $1")}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((row, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                              {Object.values(row).map((val, j) => (
                                <td
                                  key={j}
                                  className="p-2 border-b text-gray-700"
                                >
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
                  </CardContent>
                </Card>
              </div>

              {/* 🔹 Export Button */}
              {data.length > 0 && (
                <div className="pt-4">
                  <Button
                    onClick={() => handleExportToPDF()}
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
      </div>
    </div>
  );
}
