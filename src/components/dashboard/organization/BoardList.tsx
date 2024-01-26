import React from "react";
import CreateBoardForm from "./CreateBoardForm";
import { HelpCircle, User2 } from "lucide-react";
import Hint from "@/components/Hint";

const BoardList = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <User2 size={24} />

        <span className="font-semibold text-lg">Your Boards</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        <CreateBoardForm>
          <div
            className="aspect-video  h-full w-full bg-mute rounded-sm relative
            flex flex-col p-2 justify-center items-center bg-muted hover:opacity-75 transition"
            role="button"
          >
            <p>Create New Board</p>
            <p className="text-sm text-muted-foreground">5 Boards Remaining</p>
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
