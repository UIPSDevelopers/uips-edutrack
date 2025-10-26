"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Users() {
  const [users, setUsers] = useState([
    { id: 1, name: "Juan Maquera", email: "jcmaquera@uips.ae", role: "Admin" },
    { id: 2, name: "Daryle Resano", email: "dresano@uips.ae", role: "Staff" },
  ]);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Staff",
  });

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;
    setUsers([
      ...users,
      { id: users.length + 1, ...newUser },
    ]);
    setNewUser({ name: "", email: "", role: "Staff" });
    document.getElementById("closeDialogBtn").click(); // close dialog
  };

  return (
    <div className="flex font-poppins bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-0 md:ml-64">
        <Topbar />

        <main className="p-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-semibold text-gray-800">Users</h1>

              {/* Add User Modal */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-[#800000] hover:bg-[#a10000] text-white">
                    <Plus className="mr-2 h-4 w-4" /> Add User
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                  </DialogHeader>

                  <form onSubmit={handleAddUser} className="space-y-4 mt-2">
                    <div className="space-y-1">
                      <Label>Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter full name"
                        value={newUser.name}
                        onChange={(e) =>
                          setNewUser({ ...newUser, name: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        placeholder="Enter email address"
                        value={newUser.email}
                        onChange={(e) =>
                          setNewUser({ ...newUser, email: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <Label>Role</Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value) =>
                          setNewUser({ ...newUser, role: value })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Staff">Staff</SelectItem>
                          <SelectItem value="Security">Security</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        type="button"
                        id="closeDialogBtn"
                        className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-[#800000] hover:bg-[#a10000] text-white"
                      >
                        Add User
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* User List */}
            <Card className="shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-sm text-gray-500">
                  User Accounts
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700 text-left">
                        <th className="p-3 font-medium">#</th>
                        <th className="p-3 font-medium">Name</th>
                        <th className="p-3 font-medium">Email</th>
                        <th className="p-3 font-medium">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, i) => (
                        <tr
                          key={user.id}
                          className="border-b hover:bg-gray-50 transition"
                        >
                          <td className="p-3">{i + 1}</td>
                          <td className="p-3 font-medium">{user.name}</td>
                          <td className="p-3">{user.email}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                user.role === "Admin"
                                  ? "bg-red-100 text-red-700"
                                  : user.role === "Staff"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
