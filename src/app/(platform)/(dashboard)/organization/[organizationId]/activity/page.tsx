import ActivityList from "@/components/dashboard/activity/ActivityList";
import Info from "@/components/dashboard/organization/Info";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";

const page = () => {
  return (
    <section className="w-full">
      <Info />
      <Separator className="my-2" />
      <Suspense fallback={<ActivityList.Skeleton/>}>
        <ActivityList />
        </Suspense>
    </section>
  );
};

export default page;
