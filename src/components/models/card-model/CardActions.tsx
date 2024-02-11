"use client";
import { copyCard, deleteCard } from "@/actions/card.actions";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useCardModel from "@/hooks/useCardModel";
import { CardWithList } from "@/typings";
import { useAuth } from "@clerk/nextjs";
import { Copy, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useTransition } from "react";
import { toast } from "sonner";

const CardActions = ({ data }: { data: CardWithList }) => {
  const CardModel = useCardModel();
  const [isPending, startTransaction] = useTransition();
  const params = useParams();
  const boardId = params.boardId as string;
  const { orgId } = useAuth();

  const onCopyHandler = async () => {
    try {
      if (!orgId) {
        return;
      }
      startTransaction(async () => {
        await copyCard({ id: data.id, orgId, boardId });
        toast.success(`Card ${data.title} copied `);
        CardModel.onClose();
      });
    } catch (error) {
      console.log(error);
    }
  };
  const onDeleteHandler = async () => {
    try {
      if (!orgId) {
        return;
      }
      startTransaction(async () => {
        await deleteCard({ boardId, orgId, id: data.id });
        toast.success(`Card ${data.title} Deleted `);
        CardModel.onClose();
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <p className="px-2">Actions</p>
      <div className="flex items-center">
        <Button
          className="flex items-center gap-2 h-auto"
          variant={"ghost"}
          onClick={onCopyHandler}
          disabled={isPending}
        >
          <Copy size={16} />
          Copy
        </Button>
        <Button
          className="flex items-center gap-2 h-auto"
          variant={"ghost"}
          onClick={onDeleteHandler}
          disabled={isPending}
        >
          <Trash size={16} />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default CardActions;

CardActions.Skeleton = function cardActionsSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-6 w-20 bg-neutral-200" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-20 bg-neutral-200" />
        <Skeleton className="h-6 w-20 bg-neutral-200" />
      </div>
    </div>
  );
};
