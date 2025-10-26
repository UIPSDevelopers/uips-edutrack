"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted:", formData);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-gray-50 to-slate-100 font-poppins overflow-hidden">
      {/* Background Glow Shapes */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#800000]/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-[#800000]/5 rounded-full blur-3xl animate-float-slow"></div>
      </div>

      {/* Animated Card */}
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-sm bg-white/70 backdrop-blur-2xl border border-gray-200 rounded-3xl shadow-xl p-8 space-y-6"
        >
          {/* Animated Logo + Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="h-14 w-14 rounded-2xl bg-[#800000] flex items-center justify-center text-white font-semibold text-lg shadow-md tracking-tight">
                U
              </div>
            </div>
            <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
              UIPS EduTrack
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Academic Monitoring System
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-gray-50 border-gray-200 focus:border-[#800000] focus:ring-[#800000]/30 rounded-xl transition-all duration-300 focus:shadow-lg focus:shadow-[#800000]/10"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-gray-50 border-gray-200 focus:border-[#800000] focus:ring-[#800000]/30 rounded-xl transition-all duration-300 focus:shadow-lg focus:shadow-[#800000]/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-500 hover:text-[#800000] transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full mt-3 bg-[#800000] hover:bg-[#9a1c1c] text-white font-medium py-2.5 rounded-xl shadow-md transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
            >
              <LogIn className="mr-2 h-4 w-4" /> Sign In
            </Button>
          </motion.form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-center text-sm text-gray-500"
          >
            <a
              href="#"
              className="hover:text-[#800000] font-medium transition"
            >
              Forgot password?
            </a>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
