import { getBoardById } from "@/actions/board.actions";
import BoardTitle from "@/components/dashboard/board/BoardTitle";
import { auth } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";
import React from "react";

interface IProps {
  params: {
    boardId: string;
  };
}
const page = async ({ params: { boardId } }: IProps) => {
  const { orgId } = auth();
  if (!orgId) {
    return redirect("/select-org");
  }

  const { results: board } = await getBoardById({ orgId, boardId });
   if (!board){
    return notFound();
}

  return (
    <section
      style={{ backgroundImage: `url(${board?.imageFullUrl})` }}
      className="relative h-full bg-no-repeat bg-cover bg-center"
    >
      <BoardTitle data={board} orgId={orgId} boardId={boardId} />
      <div className="absolute inset-0 bg-black/30" />
    </section>
  );
};

export default page;
