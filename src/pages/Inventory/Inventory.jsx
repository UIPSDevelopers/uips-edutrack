"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  ClipboardCheck,
  Wrench,
  AlertTriangle,
  Ban,
  Clock,
  Search,
} from "lucide-react";
import InventoryTabs from "@/pages/Inventory/InventoryTabs";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    itemName: "",
    itemType: "",
    sizeOrSource: "",
    barcode: "",
    quantity: 0,
  });
  const [showDialog, setShowDialog] = useState(false);

  // 🔹 Sidebar control
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleToggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  // 👤 Get current user + role
  const storedUser =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = storedUser ? JSON.parse(storedUser) : null;
  const role = user?.role;

  // 🎛 Role-based permissions
  const canViewInventory = [
    "IT",
    "InventoryStaff",
    "Accounts",
    "InventoryAdmin",
  ].includes(role);
  const canAddInventory = [
    "IT",
    "InventoryStaff",
    "Accounts",
    "InventoryAdmin",
  ].includes(role);
  const canEditInventory = ["IT", "Accounts", "InventoryAdmin"].includes(role);
  const canDeleteInventory = ["IT", "InventoryAdmin"].includes(role);

  // ✅ Fetch items (only if allowed)
  useEffect(() => {
    if (!canViewInventory) {
      setLoading(false);
      setItems([]);
      setFiltered([]);
      return;
    }

    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/inventory`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
        setFiltered(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [API_BASE_URL, canViewInventory]);

  // ✅ Search & Filter logic
  useEffect(() => {
    let filteredData = [...items];

    if (selectedType !== "All") {
      filteredData = filteredData.filter(
        (item) => item.itemType === selectedType
      );
    }

    if (searchTerm.trim() !== "") {
      filteredData = filteredData.filter((item) =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFiltered(filteredData);
  }, [searchTerm, selectedType, items]);

  const totalItems = items.length;
  const totalQuantity = items.reduce((acc, i) => acc + (i.quantity || 0), 0);

  const handleEdit = (item) => {
    if (!canEditInventory) return; // defensive
    setEditingItem(item);
    setEditForm({
      itemName: item.itemName,
      itemType: item.itemType,
      sizeOrSource: item.sizeOrSource || "",
      barcode: item.barcode,
      quantity: item.quantity || 0,
    });
    setShowDialog(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!canEditInventory) return; // defensive
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE_URL}/inventory/${editingItem.itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          body: JSON.stringify(editForm),
        }
      );
      const data = await res.json();

      if (res.ok) {
        alert("✅ Item updated successfully!");
        setShowDialog(false);
        setItems((prev) =>
          prev.map((it) => (it.itemId === editingItem.itemId ? data.item : it))
        );
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating:", error);
    }
  };

  const handleDelete = async (itemId) => {
    if (!canDeleteInventory) return; // defensive
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/inventory/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      const data = await res.json();
      if (res.ok) {
        alert("🗑️ Item deleted successfully!");
        setItems((prev) => prev.filter((it) => it.itemId !== itemId));
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  // ✅ Export PDF (all inventory roles allowed)
  const handleExportPDF = async () => {
    if (filtered.length === 0) {
      alert("⚠️ No data to export.");
      return;
    }

    try {
      const doc = new jsPDF("l", "pt", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFillColor(128, 0, 0);
      doc.rect(0, 0, pageWidth, 80, "F");

      const logoUrl = "https://i.postimg.cc/DWkx44nh/uips-logo.png";
      try {
        const logoResponse = await fetch(logoUrl);
        const logoBlob = await logoResponse.blob();
        const reader = new FileReader();

        const logoBase64 = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(logoBlob);
        });

        doc.addImage(logoBase64, "PNG", 25, -2, 80, 80);
      } catch {
        console.warn("⚠️ Logo not loaded, continuing without image.");
      }

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("United International Private School", pageWidth / 2, 38, {
        align: "center",
      });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text("EduTrack Inventory Overview", pageWidth / 2, 58, {
        align: "center",
      });

      const currentDate = new Date().toLocaleString();
      doc.setFontSize(9);
      doc.text(`Generated on: ${currentDate}`, pageWidth - 160, 72);

      const headers = [
        [
          "#",
          "Item ID",
          "Item Name",
          "Type",
          "Size / Source",
          "Barcode / Serial",
          "Qty",
          "Added By",
        ],
      ];

      const body = filtered.map((item, index) => [
        index + 1,
        item.itemId,
        item.itemName,
        item.itemType,
        item.sizeOrSource || "-",
        item.barcode || "-",
        item.quantity || 0,
        item.addedBy || "-",
      ]);

      autoTable(doc, {
        startY: 100,
        head: headers,
        body,
        styles: { fontSize: 8, halign: "center", cellPadding: 4 },
        headStyles: {
          fillColor: [128, 0, 0],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });

      const totalItems = filtered.length;
      const totalQuantity = filtered.reduce(
        (acc, i) => acc + (i.quantity || 0),
        0
      );
      const finalY = doc.lastAutoTable.finalY + 30;

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(`Total Items: ${totalItems}`, 40, finalY);
      doc.text(`Total Quantity: ${totalQuantity}`, 180, finalY);

      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text(
        "UIPS EduTrack — Inventory Management System",
        pageWidth / 2,
        doc.internal.pageSize.height - 20,
        { align: "center" }
      );

      doc.save(`UIPS_Inventory_${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (err) {
      console.error("❌ PDF generation failed:", err);
      alert("⚠️ Failed to generate PDF.");
    }
  };

  return (
    <div className="flex font-poppins bg-gray-50 min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
      <div className="flex-1 ml-0 md:ml-64 transition-all duration-300">
        <Topbar onToggleSidebar={handleToggleSidebar} />

        <main className="p-6 space-y-8 relative">
          {/* 🔹 Everything inside this wrapper will blur if unauthorized */}
          <div
            className={
              canViewInventory
                ? "space-y-8"
                : "space-y-8 pointer-events-none blur-sm opacity-60 select-none"
            }
          >
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-semibold text-gray-800">
                Inventory
              </h1>
            </div>

            <InventoryTabs />

            {role === "InventoryStaff" && (
              <Card className="border border-amber-200 bg-amber-50">
                <CardContent className="py-3 text-xs text-amber-800">
                  You have <span className="font-semibold">limited access</span>{" "}
                  to Inventory. You can view records but you{" "}
                  <span className="font-semibold">cannot edit or delete</span>{" "}
                  existing data.
                </CardContent>
              </Card>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {/* Total Items */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex items-center justify-between relative overflow-hidden"
              >
                <div>
                  <p className="text-sm text-gray-500">Total Items</p>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {totalItems}
                  </h2>
                </div>
                <div className="relative">
                  <div className="absolute -right-2 -bottom-2 w-14 h-14 bg-[#800000]/10 rounded-full" />
                  <Package className="w-10 h-10 text-[#800000] relative z-10" />
                </div>
              </motion.div>

              {/* Total Quantity */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex items-center justify-between relative overflow-hidden"
              >
                <div>
                  <p className="text-sm text-gray-500">Total Quantity</p>
                  <h2 className="text-2xl font-semibold text-[#800000]">
                    {totalQuantity}
                  </h2>
                </div>
                <div className="relative">
                  <div className="absolute -right-2 -bottom-2 w-14 h-14 bg-[#800000]/10 rounded-full" />
                  <ClipboardCheck className="w-10 h-10 text-[#800000] relative z-10" />
                </div>
              </motion.div>

              {/* Categories */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex items-center justify-between relative overflow-hidden"
              >
                <div>
                  <p className="text-sm text-gray-500">Categories</p>
                  <h2 className="text-2xl font-semibold text-yellow-600">
                    {
                      new Set(
                        items.map((item) => item.itemType || "Uncategorized")
                      ).size
                    }
                  </h2>
                </div>
                <div className="relative">
                  <div className="absolute -right-2 -bottom-2 w-14 h-14 bg-yellow-400/20 rounded-full" />
                  <Wrench className="w-10 h-10 text-yellow-600 relative z-10" />
                </div>
              </motion.div>

              {/* Low Stock */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex items-center justify-between relative overflow-hidden"
              >
                <div>
                  <p className="text-sm text-gray-500">Low Stock</p>
                  <h2 className="text-2xl font-semibold text-orange-600">
                    {
                      items.filter((i) => i.quantity > 0 && i.quantity < 10)
                        .length
                    }
                  </h2>
                </div>
                <div className="relative">
                  <div className="absolute -right-2 -bottom-2 w-14 h-14 bg-orange-400/20 rounded-full" />
                  <AlertTriangle className="w-10 h-10 text-orange-600 relative z-10" />
                </div>
              </motion.div>

              {/* Out of Stock */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex items-center justify-between relative overflow-hidden"
              >
                <div>
                  <p className="text-sm text-gray-500">Out of Stock</p>
                  <h2 className="text-2xl font-semibold text-red-600">
                    {items.filter((i) => i.quantity === 0).length}
                  </h2>
                </div>
                <div className="relative">
                  <div className="absolute -right-2 -bottom-2 w-14 h-14 bg-red-400/20 rounded-full" />
                  <Ban className="w-10 h-10 text-red-600 relative z-10" />
                </div>
              </motion.div>

              {/* Recently Added */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex items-center justify-between relative overflow-hidden"
              >
                <div>
                  <p className="text-sm text-gray-500">Recently Added</p>
                  <h2 className="text-2xl font-semibold text-green-700">
                    {
                      items.filter(
                        (i) =>
                          new Date(i.createdAt) >=
                          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                      ).length
                    }
                  </h2>
                </div>
                <div className="relative">
                  <div className="absolute -right-2 -bottom-2 w-14 h-14 bg-green-400/20 rounded-full" />
                  <Clock className="w-10 h-10 text-green-700 relative z-10" />
                </div>
              </motion.div>
            </div>

            {/* Filter + Search */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-2 w-full md:w-1/3">
                <Search className="w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search item name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10 w-full border-gray-300 focus:ring-2 focus:ring-[#800000]"
                />
              </div>

              <div className="w-full md:w-1/4">
                <Select
                  onValueChange={(val) => setSelectedType(val)}
                  value={selectedType}
                >
                  <SelectTrigger className="h-10 border border-gray-300 focus:ring-2 focus:ring-[#800000]">
                    <SelectValue placeholder="Filter by Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Types</SelectItem>
                    <SelectItem value="P.E. Uniform">P.E. Uniform</SelectItem>
                    <SelectItem value="Regular Uniform">
                      Regular Uniform
                    </SelectItem>
                    <SelectItem value="Scouting">Scouting</SelectItem>
                    <SelectItem value="School Supplies">
                      School Supplies
                    </SelectItem>
                    <SelectItem value="Office Supplies">
                      Office Supplies
                    </SelectItem>
                    <SelectItem value="Books">Books</SelectItem>
                    <SelectItem value="Graduation">Graduation</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table */}
            <Card className="shadow-sm border border-gray-200 mt-4">
              <CardHeader>
                <CardTitle className="text-sm text-gray-500">
                  List of Inventory Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  {loading ? (
                    <p className="text-center text-gray-500 py-6">
                      Loading items...
                    </p>
                  ) : filtered.length === 0 ? (
                    <p className="text-center text-gray-500 py-6">
                      No matching items found.
                    </p>
                  ) : (
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-gray-100 text-gray-700 text-left">
                          <th className="p-3 font-medium">#</th>
                          <th className="p-3 font-medium">Item ID</th>
                          <th className="p-3 font-medium">Item Name</th>
                          <th className="p-3 font-medium">Type</th>
                          <th className="p-3 font-medium">Size / Source</th>
                          <th className="p-3 font-medium">Barcode / Serial</th>
                          <th className="p-3 font-medium text-center">
                            Quantity
                          </th>
                          <th className="p-3 font-medium">Added By</th>
                          <th className="p-3 font-medium text-right">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((item, i) => (
                          <tr
                            key={item.itemId}
                            className="border-b hover:bg-gray-50 transition"
                          >
                            <td className="p-3">{i + 1}</td>
                            <td className="p-3 font-medium text-[#800000]">
                              {item.itemId}
                            </td>
                            <td className="p-3">{item.itemName}</td>
                            <td className="p-3">{item.itemType}</td>
                            <td className="p-3">{item.sizeOrSource || "-"}</td>
                            <td className="p-3">{item.barcode}</td>
                            <td className="p-3 text-center font-semibold">
                              {item.quantity ?? 0}
                            </td>
                            <td className="p-3">{item.addedBy}</td>
                            <td className="p-3 text-right text-gray-500 space-x-3">
                              {canEditInventory && (
                                <button
                                  onClick={() => handleEdit(item)}
                                  className="hover:text-blue-600 transition"
                                >
                                  Edit
                                </button>
                              )}
                              {canDeleteInventory && (
                                <button
                                  onClick={() => handleDelete(item.itemId)}
                                  className="hover:text-red-600 transition"
                                >
                                  Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                <div className="pt-4">
                  <div className="md:col-span-2">
                    <Button
                      onClick={handleExportPDF}
                      className="bg-[#800000] hover:bg-[#a10000] text-white flex items-center gap-2"
                    >
                      <Package className="w-4 h-4" />
                      Export as PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ✏️ Edit Item Modal */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Item</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 mt-2">
                  <label className="text-sm font-medium text-gray-700">
                    Item Name
                  </label>
                  <Input
                    name="itemName"
                    placeholder="Item Name"
                    value={editForm.itemName}
                    onChange={handleEditChange}
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <Input
                    name="quantity"
                    type="number"
                    value={editForm.quantity}
                    onChange={handleEditChange}
                  />
                  <Button
                    onClick={handleUpdate}
                    className="w-full bg-[#800000] hover:bg-[#a10000] text-white"
                  >
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* 🚫 Unauthorized Overlay */}
          {!canViewInventory && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/30">
              <div className="bg-white/90 backdrop-blur-xl border border-red-200 rounded-2xl shadow-xl px-8 py-6 max-w-md text-center">
                <Ban className="w-10 h-10 text-red-500 mx-auto mb-3" />
                <h2 className="text-lg font-semibold text-gray-800 mb-1">
                  Unauthorized Access
                </h2>
                <p className="text-sm text-gray-600">
                  Your role does not have permission to access the Inventory
                  module. Please contact IT or the system administrator if you
                  believe this is a mistake.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
