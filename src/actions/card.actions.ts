"use server";

import db from "@/lib/db";
import { CardWithList } from "@/typings";
import { ACTIONS_TYPE, Card, ENTITY_TYPE } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { createActivityLogs } from "./activity.actions";

type CreateCardParams = {
  listId: string;
  orgId: string;
  title: string;
  description?: string;
  boardId: string;
};

interface ICard {
  success: boolean;
  message: string;
  results?: Card | undefined;
}
export const createCard = async ({
  listId,
  orgId,
  title,
  description,
  boardId,
}: CreateCardParams): Promise<ICard> => {
  try {
    const isListExist = await db.list.findUnique({
      where: {
        id: listId,
        board: {
          orgId,
        },
      },
    });
    if (!isListExist) {
      throw new Error("List not found");
    }

    const lastCard = await db.card.findFirst({
      where: { listId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastCard ? lastCard.order + 1 : 1;

    const card = await db.card.create({
      data: {
        listId,
        title,
        description,
        order: newOrder,
      },
    });

    await createActivityLogs({
      entityId: card.id,
      entityTitle: card.title,
      actionType: ACTIONS_TYPE.CREATE,
      entityType: ENTITY_TYPE.CARD,
    });

    revalidatePath(`/board/${boardId}`);
    return {
      success: true,
      message: "Card created successfully",
      results: card,
    };
  } catch (error: any) {
    console.log(error);
    return { success: false, message: "Failed to create" };
  }
};

type GetAllCardParams = {
  listId: string;
  orgId: string;
};
interface ICards {
  success: boolean;
  message: string;
  results?: Card[] | undefined;
}
export const getAllCards = async ({
  listId,
  orgId,
}: GetAllCardParams): Promise<ICards> => {
  const isListExist = await db.list.findUnique({
    where: {
      id: listId,
      board: {
        orgId,
      },
    },
  });
  if (!isListExist) {
    throw new Error("List not found");
  }
  const cards = await db.card.findMany({
    where: {
      listId,
    },
    orderBy: {
      order: "desc",
    },
  });

  return {
    success: true,
    message: "Card created successfully",
    results: cards,
  };
};

type UpdateCardParams = {
  title?: string;
  description?: string;
  id: string;
  orgId: string;
  boardId: string;
};
export const updateCard = async ({
  title,
  description,
  id,
  orgId,
  boardId,
}: UpdateCardParams) => {
  try {
    const cardToUpdate = await db.card.update({
      where: {
        id,
        list: {
          board: {
            orgId,
          },
        },
      },
      data: {
        title,
        description,
      },
    });

    await createActivityLogs({
      entityId: cardToUpdate.id,
      entityTitle: cardToUpdate.title,
      actionType: ACTIONS_TYPE.UPDATE,
      entityType: ENTITY_TYPE.CARD,
    });
    revalidatePath(`/board/${boardId}`);
    return {
      success: true,
      message: "Card updated successfully",
      results: cardToUpdate,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to update card",
    };
  }
};
export const UpdateCardOrder = async ( { items, boardId,orgId}: any) => {
  let updatedCards;
  try {
    const transaction = items.map((card:any) =>
      db.card.update({
        where: {
          id: card.id,
          list: {
            board: {
              orgId,
            },
          },
        },
        data: {
          order: card.order,
          listId: card.listId,
        },
      })
    );

    updatedCards = await db.$transaction(transaction);
  } catch (error) {
    return {
      error: "Failed to reorder.",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: updatedCards };
};

type CopyCardParams = {
  id: string;
  orgId: string;
  boardId: string;
};
export const copyCard = async ({ id, orgId, boardId }: CopyCardParams) => {
  try {
    const cardToCopy = await db.card.findUnique({
      where: {
        id,
        list: {
          board: {
            orgId,
          },
        },
      },
    });

    if (!cardToCopy) {
      throw new Error("Card not found");
    }

    const lastCard = await db.card.findFirst({
      where: {
        listId: cardToCopy.listId,
      },
      orderBy: {
        order: "desc",
      },
      select: {
        order: true,
      },
    });

    const newOrder = lastCard ? lastCard.order + 1 : 1;

    const card = await db.card.create({
      data: {
        title: `${cardToCopy.title} - Copy`,
        description: cardToCopy.description,
        order: newOrder,
        listId: cardToCopy.listId,
      },
    });

    await createActivityLogs({
      entityId: card.id,
      entityTitle: card.title,
      actionType: ACTIONS_TYPE.CREATE,
      entityType: ENTITY_TYPE.CARD,
    });

    revalidatePath(`/board/${boardId}`);
    return {
      success: true,
      message: "Card created successfully",
      results: card,
    };
  } catch (error) {
    return { success: false, message: "Failed to copy card" };
  }
};

type DeleteCardParams = {
  id: string;
  orgId: string;
  boardId: string;
};
export const deleteCard = async ({ id, orgId, boardId }: DeleteCardParams) => {
  try {
    const cardToDelete = await db.card.delete({
      where: {
        id,
        list: {
          board: {
            orgId,
          },
        },
      },
    });

    await createActivityLogs({
      entityId: cardToDelete.id,
      entityTitle: cardToDelete.title,
      actionType: ACTIONS_TYPE.DELETE,
      entityType: ENTITY_TYPE.CARD,
    });

    revalidatePath(`/board/${boardId}`);
    return {
      success: true,
      message: "Card Deleted successfully",
      results: cardToDelete,
    };
  } catch (error) {
    return { success: false, message: "Failed to delete card" };
  }
};
