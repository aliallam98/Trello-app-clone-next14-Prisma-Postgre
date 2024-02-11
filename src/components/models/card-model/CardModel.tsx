"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import useCardModel from "@/hooks/useCardModel";
import React from "react";
import Title from "./Title";
import Description from "./Description";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CardWithList } from "@/typings";
import fetcher from "@/lib/fetcher";
import CardActions from "./CardActions";
import { ActivityLogs } from "@prisma/client";
import Activity from "./Activity";

const CardModel = () => {
  const id = useCardModel((state) => state.id);
  const isOpen = useCardModel((state) => state.isOpen);
  const onClose = useCardModel((state) => state.onClose);

  const { data: CardData, isPending } = useQuery<CardWithList>({
    queryKey: ["card", id],
    queryFn: () => fetcher(`/api/card/${id}`),
  });

  const { data: ActivityLogs } = useQuery<ActivityLogs[]>({
    queryKey: ["activity", id],
    queryFn: () => fetcher(`/api/card/${id}/logs`),
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {/* Title */}
        {!CardData ? <Title.Skeleton /> : <Title data={CardData} />}

        {/* Description */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <div className="w-full grow">
            {!CardData ? (
              <Description.Skeleton />
            ) : (
              <Description data={CardData} />
            )}
          </div>
          {/* Card Actions */}

          <div className="h-full flex items-start md:items-center">
            {!CardData ? (
              <CardActions.Skeleton />
            ) : (
              <CardActions data={CardData!} />
            )}
          </div>
        </div>

        {/* Activity Logs */}
        {!ActivityLogs ? (
          <Activity.Skeleton />
        ) : (
            <Activity data={ActivityLogs}  />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CardModel;
