"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export const links = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Link 2",
    path: "/",
  },
  {
    label: "Link 3",
    path: "/",
  },
];

const NavLinks = () => {
  const pathname = usePathname();
  return (
    <ul className="hidden md:flex items-center gap-x-2">
      {links.map((link, i) => {
        const isActive = pathname === link.path;
        return (
          <Link key={i} href={`${link.path}`}>
            <li className={cn(
                isActive && "text-red-600"
            )}>{link.label}</li>
          </Link>
        );
      })}
    </ul>
  );
};

export default NavLinks;
