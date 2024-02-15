import { checkSubscription } from "@/actions/subscription";
import ManageButton from "@/components/dashboard/billing/ManageButton";
import Info from "@/components/dashboard/organization/Info";
import { Separator } from "@/components/ui/separator";
import React from "react";

const page = async () => {
  const isPro = await checkSubscription();
  return (
    <section className="p-4">
      <Info isPro={isPro} />
      <Separator />
      <ManageButton isPro={isPro} />
    </section>
  );
};

export default page;
