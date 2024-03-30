"use server";

import db from "@/lib/db";
import { ACTIONS_TYPE, Board, ENTITY_TYPE } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createActivityLogs } from "./activity.actions";
import {
  decrementAvailableCount,
  hasAvailableCount,
  incrementAvailableCount,
} from "./org.limits.actions";
import { checkSubscription } from "./subscription";

interface IBoard {
  success: boolean;
  message: string;
  results: Board | undefined;
}
export const createBoard = async (boardData: any): Promise<IBoard> => {
  try {
    const hasCount = await hasAvailableCount();
    const isPro = await checkSubscription();

    if (!hasCount && !isPro) {
      throw new Error(
        "You have reached your limit of free boards. Please upgrade to create more."
      );
    }

    const newBoard = await db.board.create({
      data: boardData,
    });

    await createActivityLogs({
      entityId: newBoard.id,
      entityTitle: newBoard.title,
      actionType: ACTIONS_TYPE.CREATE,
      entityType: ENTITY_TYPE.BOARD,
    });

    if (!isPro) {
      await incrementAvailableCount();
    }
    revalidatePath(`/organization/${boardData.orgId}`)
    return { success: true, message: "Created", results: newBoard };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create board",
      results: undefined,
    };
  }
};

interface IBoards {
  success: boolean;
  message: string;
  results: Board[] | [];
}

export const getAllBoardsById = async (orgId: string): Promise<IBoards> => {
  try {
    const boards = await db.board.findMany({
      where: { orgId: orgId },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, message: "Done", results: boards };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Error retrieving boards", results: [] };
  }
};

type getBoardByIdParams = {
  boardId: string;
  orgId: string;
};
export const getBoardById = async ({ boardId, orgId }: getBoardByIdParams) => {
  try {
    const board = await db.board.findUnique({
      where: {
        id: boardId,
        orgId,
      },
    });
    if (!board) {
      throw new Error("Cannot find this board");
    }
    return { success: true, message: "Done", results: board };
  } catch (error: any) {
    console.log(error);
    return { success: false, message: error.message };
  }
};

type updateBoardByIdParams = {
  boardId: string;
  orgId: string;
  title: string;
};
export const updateBoardById = async ({
  boardId,
  orgId,
  title,
}: updateBoardByIdParams) => {
  try {
    const boardToUpdate = await db.board.update({
      where: { id: boardId, orgId },
      data: { title },
    });
    if (!updateBoardById)
      throw new Error("Cannot Do This Actions 'Update Board' ");

    revalidatePath(`/board/${boardToUpdate.id}`);

    await createActivityLogs({
      entityId: boardToUpdate.id,
      entityTitle: boardToUpdate.title,
      actionType: ACTIONS_TYPE.UPDATE,
      entityType: ENTITY_TYPE.BOARD,
    });
    return { success: true, message: "Updated", results: boardToUpdate };
  } catch (error) {
    console.log(error);
  }
};

type deleteBoardByIdParams = {
  boardId: string;
  orgId: string;
};
export const deleteBoardById = async ({
  boardId,
  orgId,
}: deleteBoardByIdParams) => {
  try {
    const isPro = await checkSubscription();

    const boardToDelete = await db.board.delete({
      where: { id: boardId, orgId },
    });
    await createActivityLogs({
      entityId: boardToDelete.id,
      entityTitle: boardToDelete.title,
      actionType: ACTIONS_TYPE.DELETE,
      entityType: ENTITY_TYPE.BOARD,
    });

    

    
    if (!isPro) {
      await decrementAvailableCount();
    }



    revalidatePath(`/organization/${orgId}`);
    return { success: true, message: "Deleted" };
  } catch (error: any) {
    console.log(error);
    if (error.code === "P2025") {
      return { success: false, message: "Board does not exist" };
    }
  }
};
