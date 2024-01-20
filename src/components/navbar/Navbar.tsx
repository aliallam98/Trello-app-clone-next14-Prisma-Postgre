"use client";
import { cn } from "@/lib/utils";
import React from "react";
import Logo from "../Logo";
import NavLinks from "./NavLinks";
import UserButtons from "./UserButtons";


const Navbar = () => {
  
  return (
    <header
      className={cn(
        "fixed top-0 w-full py-5 z-50 shadow-sm border-b ", //backdrop-blur-sm 
      )}
    >
      <nav className="container max-w-[1140px] flex items-center justify-between">
        <Logo />
        <NavLinks />
        <UserButtons/>
      </nav>
    </header>
  );
};

export default Navbar;
