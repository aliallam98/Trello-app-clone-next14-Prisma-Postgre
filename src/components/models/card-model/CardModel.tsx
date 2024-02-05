"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import useCardModel from "@/hooks/useCardModel";
import React from "react";
import Title from "./Title";
import Description from "./Description";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CardWithList } from "@/typings";
import fetcher from "@/lib/fetcher";

const CardModel = () => {
  const id = useCardModel((state) => state.id);
  const isOpen = useCardModel((state) => state.isOpen);
  const onClose = useCardModel((state) => state.onClose);

  const { data: CardData, isPending } = useQuery<CardWithList>({
    queryKey: ["card", id],
    queryFn: () => fetcher(`/api/card/${id}`),
  });

  // console.log(CardData, isPending, id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {/* Title */}
        {!CardData ? <Title.Skeleton /> : <Title data={CardData} />}
        {/* Description */}

        {!CardData ? <Description.Skeleton /> : <Description data={CardData} />}
      </DialogContent>
    </Dialog>
  );
};

export default CardModel;
