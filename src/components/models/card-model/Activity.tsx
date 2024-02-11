import ActivityItem from "@/components/ActivityItem";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityLogs } from "@prisma/client";
import { ActivityIcon } from "lucide-react";

interface IProps {
  data: ActivityLogs[];
}

const Activity = ({ data }: IProps) => {
  console.log(data);

  return (
    <div className="flex flex-col items-start gap-x-3 w-full">
      <div className="p-2 flex gap-2 items-center">
        <ActivityIcon size={18} />
        <p className="font-semibold">Activity</p>
      </div>
      <div>
        <ol className="mt-2 space-y-4">
          {data.map((item) => (
            <ActivityItem key={item.id} data={item} />
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Activity;

Activity.Skeleton = function activitySkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
        <Skeleton className="w-full h-10 bg-neutral-200" />
      </div>
    </div>
  );
};
