"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import useMobSidebar from "@/hooks/useMobNavbar";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

const MobSidebar = () => {
  const isOpen = useMobSidebar((state) => state.isOpen);
  const onOpen = useMobSidebar((state) => state.onOpen);
  const onClose = useMobSidebar((state) => state.onClose);

  const [isMounted, setIsMounted] = useState<boolean>(false);
  const pathname = usePathname();

  // to handle hydration error
  useEffect(() => {
    setIsMounted(true);
  }, []);

  //to handle close sidebar in mob when pathname changes
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // to handle hydration error
  if (!isMounted) return null;

  return (
    <>
      <Button
        onClick={onOpen}
        className="block md:hidden mr-2"
        variant="ghost"
        size="sm"
      >
        <Menu size={16} />
      </Button>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-2 pt-16">
          <Sidebar storageKey="t-sidebar-mobile-state" />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobSidebar;
