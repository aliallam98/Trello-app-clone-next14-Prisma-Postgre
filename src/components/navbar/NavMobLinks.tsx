import { SignInButton, SignOutButton } from "@clerk/nextjs";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Menu } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { links } from "./NavLinks";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

const NavMobLinks = () => {
  const user = useUser();
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger className="block hover:bg-black/5 md:hidden p-2">
        <Menu size={18} />
      </SheetTrigger>
      <SheetContent className="">
        <SheetHeader>
          {user.isSignedIn ? (
            <SheetTitle className="mt-6 text-center">{`Welcome ${user.user?.fullName}`}</SheetTitle>
          ) : (
            <SheetTitle className="mt-6 text-center">Welcome</SheetTitle>
          )}

          <ul className="flex flex-col items-center gap-y-4 mt-10">
            {links.map((link, i) => {
              const isActive = pathname === link.path;
              return (
                <Link key={i} href={`${link.path}`}>
                  <li className={cn(isActive && "text-red-600")}>
                    {link.label}
                  </li>
                </Link>
              );
            })}
          </ul>
        </SheetHeader>
        <SheetFooter className="mt-20">
          {user.isSignedIn ? (
            <SignOutButton >
              <Button className="border w-full ">Log Out</Button>
            </SignOutButton>
          ) : (
            <SignInButton>
              <Button className="border w-full ">Log In</Button>
            </SignInButton>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default NavMobLinks;
