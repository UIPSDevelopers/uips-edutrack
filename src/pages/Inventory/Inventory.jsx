"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ClipboardCheck, Wrench, Search } from "lucide-react";
import InventoryTabs from "@/pages/inventory/InventoryTabs";
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

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    itemName: "",
    itemType: "",
    sizeOrSource: "",
    barcode: "",
    quantity: 0,
  });
  const [showDialog, setShowDialog] = useState(false);

  // ✅ Fetch items from backend
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/inventory");
        const data = await res.json();
        setItems(data);
        setFiltered(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

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

  // ✅ Save changes
  const handleUpdate = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/inventory/${editingItem.itemId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
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

  // 🗑️ Delete item
  const handleDelete = async (itemId) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/inventory/${itemId}`, {
        method: "DELETE",
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

  return (
    <div className="flex font-poppins bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-64 transition-all duration-300">
        <Topbar />

        <main className="p-6 space-y-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold text-gray-800">Inventory</h1>
          </div>

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
                <p className="text-sm text-gray-500">Total Quantity</p>
                <h2 className="text-2xl font-semibold text-[#800000]">
                  {totalQuantity}
                </h2>
              </div>
              <ClipboardCheck className="w-10 h-10 text-[#800000]" />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex items-center justify-between"
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
              <Wrench className="w-10 h-10 text-yellow-600" />
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
                        <th className="p-3 font-medium text-right">Actions</th>
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
                            <button
                              onClick={() => handleEdit(item)}
                              className="hover:text-blue-600 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item.itemId)}
                              className="hover:text-red-600 transition"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
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
        </main>
      </div>
    </div>
  );
}
