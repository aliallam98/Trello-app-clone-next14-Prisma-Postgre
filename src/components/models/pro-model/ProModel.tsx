"use client";
import { stripeRedirect } from "@/actions/stripe";
import { Button } from "@/components/ui/button";
import { DialogContent } from "@/components/ui/dialog";
import useProCardModel from "@/hooks/useProCardModel";
import { Dialog } from "@radix-ui/react-dialog";
import Image from "next/image";
import { redirect } from "next/navigation";
import React, { useTransition } from "react";

const ProModel = () => {
  const [isLoading, startTransition] = useTransition();

  const proCard = useProCardModel();

  const onCLickHandler = () => {
    try {
      startTransition(async () => {
        const url =  await stripeRedirect();
        redirect(url)
      });
      
    } catch (error) {
      console.log(error);
      
    }
  };


  return (
    <Dialog onOpenChange={proCard.onClose} open={proCard.isOpen}>
      <DialogContent className="overflow-hidden max-w-md">
        <div className="relative  flex justify-center items-center aspect-video">
          <Image
            src={"/hero.svg"}
            fill
            alt="hero image"
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="font-semibold text-xl">
            Upgrade to Taskify Pro Today!
          </h2>
          <p className="text-xs font-semibold text-neutral-600 my-2">
            Explore the best of Taskify
          </p>
          <div className="pl-3">
            <ul className="text-sm list-disc">
              <li>Unlimited boards</li>
              <li>Advanced checklists</li>
              <li>Admin and security features</li>
              <li>And more!</li>
            </ul>
          </div>
          <Button disabled={isLoading} onClick={onCLickHandler} className="w-full mt-4">
            Upgrade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProModel;
