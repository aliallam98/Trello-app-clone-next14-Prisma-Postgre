"use client";
import React from "react";
import { useOrganization } from "@clerk/nextjs";
import Image from "next/image";
import { CreditCard } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface IProps {
  isPro: boolean;
}
const Info = ({ isPro }: IProps) => {
  const { organization, isLoaded } = useOrganization();

  if (!isLoaded) return <Info.Skeleton />;

  return (
    <div className="p-2">
      <div className="flex items-center gap-2">
        <Image
          width={60}
          height={60}
          alt="organization icon"
          src={organization?.imageUrl as string}
        />
        <div>
          <p className="font-semibold">{organization?.name}</p>
          <div className="flex items-center gap-x-2">
            <CreditCard size={12} />
            <span className="text-sm">{isPro ? "Pro" : "Free"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;

Info.Skeleton = function InfoSkeleton() {
  return (
    <div className="flex items-center gap-x-2">
      <Skeleton className="h-[60px] w-[60px] bg-black/10" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-52  bg-black/10" />
        <Skeleton className="h-5 w-20 bg-black/10 " />
      </div>
    </div>
  );
};
