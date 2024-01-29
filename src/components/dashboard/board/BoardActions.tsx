"use client";

import { Button } from "@/components/ui/button";
import { MoreHorizontal, X } from "lucide-react";

import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTransition } from "react";
import { deleteBoardById } from "@/actions/board.actions";
import { toast } from "sonner";
import {useRouter } from "next/navigation";


interface IProps {
  boardId:string
  orgId:string
}
const BoardActions = ({boardId,orgId}:IProps) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition();
  const onDeleteHandler = async () => {
    try {
      startTransition(async()=>{
        const boardToDelete = await deleteBoardById({boardId,orgId})
        toast.success(`Board Deleted Successfully"`)
        return router.push(`/organization/${orgId}`);
      })
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong")
    }
  };
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"transparent"} className="w-fit ">
            <MoreHorizontal />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-4">
          <p className="text-center font-semibold text-sm pb-4">
            Board Actions
          </p>
          <PopoverClose asChild>
            <Button
              className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
              variant="ghost"
            >
              <X className="h-4 w-4" />
            </Button>
          </PopoverClose>
          <Button
            variant="ghost"
            onClick={onDeleteHandler}
            disabled={isPending}
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          >
            Delete this board
          </Button>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default BoardActions;
