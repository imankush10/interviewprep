"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Home,
  Brain,
  BarChart3,
  Calendar,
  Bell,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/client";
import { toast } from "sonner";
import LogoutButton from "./Logout";

interface ModernNavbarProps {
  user?: {
    name: string;
    email: string;
    profilePicture?: string;
  };
}

export default function ClientNavigation({ user }: ModernNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
      router.push("/sign-in");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/interview", label: "Interview", icon: Brain },
  ];

  return (
    <>
      {/* Spacer for fixed navbar */}
      <div className="h-20" />

      <motion.nav
        className="fixed top-1 left-1/2 transform -translate-x-1/2 z-50 w-[90%] rounded-md"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Main navbar container */}
        <div className="relative backdrop-blur-md rounded-md">
          <div className="flex h-16 items-center justify-between px-6">
            {/* Left side - Logo */}
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/" className="flex items-center space-x-3">
                <div className="rounded-md p-1.5">
                  <Image src="/logo.png" width={52} height={52} alt="logo" />
                </div>

                <span className="text-xl font-bold text-white">OnLevel</span>
              </Link>
            </motion.div>

            {/* Center - Navigation Links (Desktop) */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link href={item.href}>
                    <Button
                      variant="ghost"
                      className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl px-4 py-2 flex items-center space-x-2"
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Right side - Conditionally render user profile or mobile menu */}
            <div className="flex items-center space-x-3">
              {/* Only show profile section if user exists */}
              {user && (
                <div className="relative">
                  <motion.button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-3 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user.name[0].toUpperCase()}
                    </div>
                    <span className="hidden sm:block text-sm font-medium">
                      {user.name}
                    </span>
                  </motion.button>

                  {/* Profile Dropdown Menu */}
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        className="absolute right-0 top-full mt-2 w-64 bg-black/80 border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-4 border-b border-white/10">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.name[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="text-white font-medium">
                                {user.name}
                              </p>
                              <p className="text-white/60 text-sm">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-2">
                          <LogoutButton />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                className="md:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                className="md:hidden border-t border-white/10"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-4 space-y-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link href={item.href}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 rounded-xl p-3 flex items-center space-x-3"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </Button>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Click outside to close dropdowns */}
      {(isProfileOpen || isMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsProfileOpen(false);
            setIsMenuOpen(false);
          }}
        />
      )}
    </>
  );
}
