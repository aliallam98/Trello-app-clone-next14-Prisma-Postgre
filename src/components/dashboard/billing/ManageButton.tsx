"use client";

import { stripeRedirect } from "@/actions/stripe";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { useTransition } from "react";

interface IProps {
  isPro: boolean;
}
const ManageButton = ({ isPro }: IProps) => {
  const [isLoading, startTransition] = useTransition();

  const onCLickHandler = () => {
    try {
      startTransition(async () => {
        const url = await stripeRedirect();
        redirect(url);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button disabled={isLoading} onClick={onCLickHandler} className="mt-4">
      {isPro ? "Manage Subscription" : "Upgrade Your Plan"}
    </Button>
  );
};

export default ManageButton;
