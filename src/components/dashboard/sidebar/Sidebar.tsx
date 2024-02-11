"use client";
import { Button } from "../../ui/button";
import { Plus } from "lucide-react";

import { useLocalStorage } from "usehooks-ts";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Accordion } from "@/components/ui/accordion";
import SidebarItem, { OrganizationType } from "./SidebarItem";

interface IProps {
  storageKey?: string;
}

const Sidebar = ({ storageKey = "t-sidebar-state" }: IProps) => {
  const { isLoaded: isOrganizationLoaded, organization: activeOrganization } =
    useOrganization();

  const { isLoaded: isOrganizationListLoaded, userMemberships } =
    useOrganizationList({
      userMemberships: {
        infinite: true,
      },
    });
  // const organizations = userMemberships?.data?.map(({ organization }) => [organization])

  const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
    storageKey,
    {}
  );
  const onExpandedHandler = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !expanded[id],
    }));
  };

  const defaultAccordionValue: string[] = Object.keys(expanded).reduce(
    (acc: string[], key: string) => {
      if (expanded[key]) {
        acc.push(key);
      }

      return acc;
    },
    []
  );

  //Handle Loading by using Skeleton
  if (
    !isOrganizationLoaded ||
    !isOrganizationListLoaded ||
    userMemberships.isLoading
  ) {
    return (
      <>
        <div className="flex items-center justify-between mb-2 p-2">
          <Skeleton className="h-10 w-[50%] bg-black/10" />
          <Skeleton className="h-10 w-10 bg-black/10" />
        </div>
        <div className="space-y-2 p-2">
          <SidebarItem.Skeleton />
          <SidebarItem.Skeleton />
          <SidebarItem.Skeleton />
          <SidebarItem.Skeleton />
        </div>
      </>
    );
  }

  return (
    <aside className="shadow-lg p-2 h-full">
      <div className="flex items-center justify-between">
        <span>Workspace</span>
        <Button
          variant={"ghost"}
          size={"icon"}
          className="hover:bg-neutral-100"
          asChild
        >
          <Link href={"/select-org"}>
            <Plus size={16} />
          </Link>
        </Button>
      </div>
      {/* Accordion */}
      <Accordion
        type={"multiple"}
        className="space-y-2"
        defaultValue={defaultAccordionValue}
      >
        {userMemberships.data.map(({ organization }) => (
          <SidebarItem
            key={organization.id}
            isActive={activeOrganization?.id === organization.id}
            isExpanded={expanded[organization.id]}
            onExpand={onExpandedHandler}
            organization={organization as OrganizationType}
          />
        ))}
      </Accordion>
    </aside>
  );
};

export default Sidebar;
