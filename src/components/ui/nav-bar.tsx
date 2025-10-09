"use client";

import React, { useEffect, useRef, useState } from "react";
import { Blocks, Menu, X } from "lucide-react";
import Link from "next/link";
import AuthModal from "@/components/ui/auth-modal";
import { Button } from "./button";

interface NavLink {
  name: string;
  href: string;
}

interface NavbarProps {
  domainName?: string;
  logo?: React.ReactNode;
  navLinks?: NavLink[];
  className?: string;
}

export default function Navbar({
  domainName = "Zeeflix",
  logo = <Blocks size={30} />,
  navLinks = [
    { name: "Home", href: "/home" },
    { name: "Top List", href: "/top-list" },
    { name: "Popular", href: "/popular" },
  ],
  className = "",
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (open && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  const toggleMenu = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setOpen((v) => !v);
  };

  const onMobileLinkClick = () => setOpen(false);

  return (
    <nav className={`fixed top-4 left-0 right-0 z-50 px-4 ${className}`} aria-label="Main navigation">
      <div className="max-w-7xl mx-auto">
        {/* Inner bar */}
        <div className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md py-2 px-4 shadow-lg">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-md bg-gradient-to-br from-pink-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                Z
              </div>
              <span className="text-lg sm:text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-indigo-400">
                {domainName}
              </span>
            </Link>
          </div>

          {/* Center: Desktop nav links */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-200 hover:text-white font-medium transition-colors px-4 py-2 rounded-md text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Desktop AuthModal */}
          <div className="hidden sm:flex items-center">
            <AuthModal buttonClassName="h-9 px-3 flex items-center gap-2" />
          </div>

          {/* Mobile hamburger */}
          <button
            className="inline-flex md:hidden items-center justify-center p-2 rounded-md hover:bg-white/6 transition"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={toggleMenu}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        <div
          ref={menuRef}
          className={`md:hidden absolute top-full inset-x-4 mt-3 z-50 transform transition-all origin-top duration-150 ${
            open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
          }`}
          aria-hidden={!open}
        >
          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-4 shadow-lg">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={onMobileLinkClick}
                  className="block px-4 py-3 rounded-md text-gray-200 hover:bg-white/6 transition font-medium"
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile AuthModal */}
              <div className="pt-2">
                <AuthModal buttonClassName="w-full h-10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}