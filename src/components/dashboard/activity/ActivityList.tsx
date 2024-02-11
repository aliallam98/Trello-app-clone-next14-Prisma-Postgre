import { getAllOrgActivities } from "@/actions/activity.actions";
import ActivityItem from "@/components/ActivityItem";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const ActivityList = async () => {
  const activityList = await getAllOrgActivities();


  return (
    <ol className="space-y-4 mt-2">
      <p className="hidden last:block text-xs text-center text-muted-foreground">
        No activity found inside this organization
      </p>
      {activityList.map((activityItem) => (
        <ActivityItem key={activityItem.id} data={activityItem} />
      ))}
    </ol>
  );
};

export default ActivityList;

ActivityList.Skeleton = function activityListSkeleton() {
  return (
    <ol className="space-y-4 mt-2">
      {[...Array(4)].map((_,i)=>(
        <div className="flex items-center gap-x-4" key={i}>
        <Skeleton className="w-8 h-8 rounded-full bg-black/10 " />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-[50%] h-5 bg-black/10 " />
          <Skeleton className="w-[30%] h-5  bg-black/10" />
        </div>
      </div>
      ))}
    </ol>
  );
};
