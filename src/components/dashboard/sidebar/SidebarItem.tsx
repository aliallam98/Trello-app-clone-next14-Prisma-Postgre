import { useRouter, usePathname } from "next/navigation";
import { Layout, Activity, Settings, CreditCard } from "lucide-react";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";

export type OrganizationType = {
  id: string;
  slug: string;
  imageUrl: string;
  name: string;
};
interface IProps {
  isActive: boolean;
  isExpanded: boolean;
  onExpand: (id: string) => void;
  organization: OrganizationType;
}
const SidebarItem = ({
  isActive,
  isExpanded,
  onExpand,
  organization,
}: IProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const routes = [
    {
      label: "Boards",
      icon: <Layout className="h-4 w-4 mr-2" />,
      href: `/organization/${organization.id}`,
    },
    {
      label: "Activity",
      icon: <Activity className="h-4 w-4 mr-2" />,
      href: `/organization/${organization.id}/activity`,
    },
    {
      label: "Settings",
      icon: <Settings className="h-4 w-4 mr-2" />,
      href: `/organization/${organization.id}/settings`,
    },
    {
      label: "Billing",
      icon: <CreditCard className="h-4 w-4 mr-2" />,
      href: `/organization/${organization.id}/billing`,
    },
  ];

  const onClickHandler = (href: string) => {
    router.push(href);
  };

  return (
    <AccordionItem value={organization.id} className="border-none">
      <AccordionTrigger
        onClick={() => onExpand(organization.id)}
        className={cn(
          "hover:no-underline",
          isActive && !isExpanded && "bg-primary/10 p-1.5 hover:bg-neutral-500"
        )}
      >
        <div className="flex items-center gap-x-2 rounded-md  transition no-underline ">
          <Image
            src={organization.imageUrl}
            height={35}
            width={35}
            alt="organization image"
          />
          <span>{organization.name}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {routes.map((route) => (
          <Button
            key={route.href}
            onClick={() => onClickHandler(route.href)}
            size={"sm"}
            variant={"ghost"}
            className={cn(
              "w-full font-medium justify-start pl-10 mb-1",
              pathname === route.href && "bg-primary/10"
            )}
          >
            {route.icon}
            {route.label}
          </Button>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};

export default SidebarItem;

SidebarItem.Skeleton = function SkeletonSidebarItem() {
  return (
    <div className="flex items-center gap-x-2">
      <Skeleton className="w-10 h-10  shrink-0 bg-black/10" />
      <Skeleton className="h-10 w-full bg-black/10" />
    </div>
  );
};
