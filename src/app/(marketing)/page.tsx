import { Medal } from "lucide-react";
import Link from "next/link";
import { Poppins } from "next/font/google";


import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
const textFont = Poppins({
  subsets:["latin"],
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900"
  ],
})



export default function MarketingPage() {
  return (
    <section className="bg-slate-100">
      <div className="container max-w-[1140px] flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <div className="flex items-center text-amber-600 bg-amber-100 py-2 px-4 rounded-3xl gap-x-2">
            <Medal />
            No 1 task managment
          </div>
          <h1 className="text-2xl md:text-6xl font-bold mt-4">Taskify helps team move</h1>
          <h3 className="bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white py-2 px-4 rounded-md my-4">work forward.</h3>
          <p className={cn("max-w-sm  md:max-w-2xl  text-center",
          textFont.className
          )}>
            Collaborate, manage projects, and reach new productivity peaks. From
            high rises to the home office, the way your team works is unique -
            accomplish it all with Taskify.
          </p>
        </div>
        <Button className="mt-6" size="lg" asChild>
          <Link href="/sign-up">Get Taskify for free</Link>
        </Button>
      </div>
    </section>
  );
}

