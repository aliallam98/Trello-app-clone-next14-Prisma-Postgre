"use client";

import { Button } from "@/components/ui/button";
import { MoreHorizontal, X } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { copyList, deleteList } from "@/actions/list.actions";
import { ListWithCards } from "@/typings";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ElementRef, useRef, useTransition } from "react";
import { toast } from "sonner";

interface IProps {
  data: ListWithCards;
}
const ListActions = ({ data }: IProps) => {
  const { orgId } = useAuth();
  const [isPending, startTransition] = useTransition();
  const closeBtnRef = useRef<ElementRef<"button">>(null);

  const onDeleteHandler = async () => {
    if (!orgId) {
      return redirect("/select-org");
    }
    try {
        startTransition(async()=>{
        const list = await deleteList({ boardId: data.boardId, listId: data.id, orgId });
        toast.success(list.message)
        closeBtnRef.current?.click()
        })
    } catch (error:any) {
        toast.error(error.message)
    }
  };
  const onCopyHandler = async () => {
    if (!orgId) {
        return redirect("/select-org");
      }
    try {
        startTransition(async()=>{
            const listToCopy = await copyList({ boardId: data.boardId, listId: data.id, orgId })
            toast.success(listToCopy.message)
            closeBtnRef.current?.click()
        })
        
    } catch (error:any) {
        toast.error(error.message)
    }
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={isPending}
          variant={"ghost"}
          className="w-auto h-auto p-2"
        >
          <MoreHorizontal size={16} />
        </Button>
      </PopoverTrigger>

      <PopoverContent side="bottom" align="end" className="relative">
        <PopoverClose asChild className="absolute top-2 right-2">
          <Button
          ref={closeBtnRef}
          variant={"ghost"}
          className="w-auto h-auto p-2"
          >
          <X size={16} />
          </Button>
        </PopoverClose>
        <p className="py-3 px-0 text-center text-sm font-medium">
          List Options
        </p>
        <Button
          disabled={isPending}
          variant={"ghost"}
          className="w-full h-auto p-2 justify-start"
        >
          Add Card .
        </Button>
        <Button
        onClick={onCopyHandler}
          disabled={isPending}
          variant={"ghost"}
          className="w-full h-auto p-2 justify-start"
        >
          Copy List .
        </Button>
        <Separator />
        <Button
          onClick={onDeleteHandler}
          disabled={isPending}
          variant={"ghost"}
          className="w-full h-auto p-2 justify-start"
        >
          Delete List .
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default ListActions;
