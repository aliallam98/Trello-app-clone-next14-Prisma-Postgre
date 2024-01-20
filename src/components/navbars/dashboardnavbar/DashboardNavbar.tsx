import React from "react";
import Logo from "../../Logo";
import { Plus } from "lucide-react";
import { Button } from "../../ui/button";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

const DashboardNavbar = () => {
  return (
    <header className="p-2 border-b shadow-md">
      <nav className="container max-w-[1140px] flex justify-between items-center ">
        <div className="flex items-center  gap-x-4">
          <div className="hidden md:flex">
            <Logo />
          </div>
          <div>
            <Button className="block md:hidden" size={"sm"}>
              <Plus size={16} />
            </Button>
            <Button className="hidden md:block">Create</Button>
          </div>
        </div>

        <div className="flex items-center gap-x-4 ml-auto">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: {
                  height: 30,
                  width: 30,
                },
              },
            }}
          />
          <OrganizationSwitcher
            hidePersonal
            afterCreateOrganizationUrl="/organization/:id"
            afterLeaveOrganizationUrl="/select-org"
            afterSelectOrganizationUrl="/organization/:id"
            appearance={{
              elements: {
                rootBox: {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                },
              },
            }}
          />
        </div>
      </nav>
    </header>
  );
};

export default DashboardNavbar;