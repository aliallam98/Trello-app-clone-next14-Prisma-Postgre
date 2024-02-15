import React from "react";
import CreateBoardForm from "./CreateBoardForm";
import { HelpCircle, User2 } from "lucide-react";
import Hint from "@/components/Hint";
import { auth } from "@clerk/nextjs";
import { getAllBoardsById } from "@/actions/board.actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAvailableCount } from "@/actions/org.limits.actions";
import { MAX_FREE_BOARDS } from "@/constants/boardCount";
import { checkSubscription } from "@/actions/subscription";

const BoardList = async () => {
  const { orgId } = auth();

  if (!orgId) {
    redirect("/select-org");
  }

  const { results: organizationBoards } = await getAllBoardsById(orgId);
  const availableBoardsCounts = await getAvailableCount();
  const isPro = await checkSubscription();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <User2 size={24} />

        <span className="font-semibold text-lg">Your Boards</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {organizationBoards.map((board) => (
          <Link
            key={board.id}
            href={`/board/${board.id}`}
            style={{ backgroundImage: `url(${board.imageThumbUrl})` }}
            className="relative group  bg-no-repeat bg-cover bg-center aspect-video  bg-sky-700   rounded-sm  h-full w-full overflow-hidden bg-muted p-2"
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition" />
            <p className="relative text-white font-semibold">{board.title}</p>
          </Link>
        ))}
        <CreateBoardForm>
          <div
            className="aspect-video  h-full w-full bg-mute rounded-sm relative
            flex flex-col p-2 justify-center items-center bg-muted hover:opacity-75 transition"
            role="button"
          >
            <p>Create New Board</p>
            <p className="text-sm text-muted-foreground">
              {isPro ? "UnLimited" : MAX_FREE_BOARDS - availableBoardsCounts}{" "}
              Remaining
            </p>
            <Hint
              sideOffset={40}
              side="right"
              description="Free Workspaces can have up to 5 open boards. For unlimited boards upgrade this workspace."
            >
              <HelpCircle className="absolute bottom-2 right-2 h-[14px] w-[14px]" />
            </Hint>
          </div>
        </CreateBoardForm>
      </div>
    </div>
  );
};

export default BoardList;
