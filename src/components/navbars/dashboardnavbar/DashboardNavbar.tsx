import React from "react";
import Logo from "../../Logo";
import { Plus } from "lucide-react";
import { Button } from "../../ui/button";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import MobSidebar from "@/components/dashboard/sidebar/MobSidebar";
import CreateBoardForm from "@/components/dashboard/organization/CreateBoardForm";

const DashboardNavbar = () => {
  return (
    <header className="p-2 border-b shadow-md">
      <nav className="md:container max-w-[1140px] flex justify-between items-center ">
        <div className="flex items-center  gap-x-4">
          <div className="hidden md:flex">
            <Logo />
          </div>
          <div className="flex items-center">
            <MobSidebar />
            <CreateBoardForm>
              <Button className="block md:hidden" size={"sm"}>
                <Plus size={16} />
              </Button>
            </CreateBoardForm>
            <CreateBoardForm>
              <Button className="hidden md:block">Create</Button>
            </CreateBoardForm>
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
