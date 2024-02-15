import { checkSubscription } from "@/actions/subscription";
import BoardList from "@/components/dashboard/organization/BoardList";
import Info from "@/components/dashboard/organization/Info";
import { Separator } from "@/components/ui/separator";
import React from "react";

const organizationPage = async () => {
  const isPro = await checkSubscription()
  return (
    <div>
      <Info  isPro={isPro}/>
      <Separator className="my-4" />
      <BoardList />
    </div>
  );
};

export default organizationPage;
