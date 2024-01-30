"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

type CreateListParams = {
  title: string;
  boardId: string;
  orgId: string;
};
export const createList = async ({
  boardId,
  title,
  orgId,
}: CreateListParams) => {
  try {
    const isBoardExist = await db.board.findFirst({
      where: {
        id: boardId,
        orgId,
      },
    });
    if (!isBoardExist) {
      throw new Error("Cannot find this board");
    }
    const lastList = await db.list.findFirst({
      where: {
        boardId,
      },
      select: {
        order: true,
      },
      orderBy: {
        order: "asc",
      },
    });

    console.log(lastList);

    const newOrder = lastList ? lastList.order + 1 : 1;
    const newList = await db.list.create({
      data: {
        boardId,
        title,
        order: newOrder,
      },
    });

    console.log(newList);

    revalidatePath(`/board/${orgId}`);
  } catch (error) {
    console.log(error);
  }
};
