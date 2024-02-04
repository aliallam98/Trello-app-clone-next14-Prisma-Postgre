"use server";

import db from "@/lib/db";
import { ListWithCards } from "@/typings";
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
        order: true, // only return data {order : number}
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

type GetAllListsParams = {
  boardId: string;
  orgId: string;
};

interface ILists {
  success: boolean;
  message: string;
  results?: ListWithCards [] 

}
export const getAllLists = async ({ boardId, orgId }: GetAllListsParams) : Promise<ILists> => {
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
    const lists = await db.list.findMany({
      where: {
        boardId,
      },
      orderBy: {
        order: "asc",
      },
      include: {
        card: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });
    return { success: true, message: "Done", results: lists };
  } catch (error:any) {
    console.log(error);
    return { success: true, message: error.message , results: [] };
  }
};



type UpdateListParams = {
  listId:string
  boardId:string
  orgId:string
  title:string
}
export const updateList = async({listId,boardId,orgId,title}:UpdateListParams)=>{
try {
  const listToUpdate = await db.list.update({
    where:{
      id:listId,
      boardId,
      board:{
        orgId
      }
    },
    data:{
      title
    }
  })

  revalidatePath(`/board/${boardId}`)
  return { success: true, message: "List Updated", results: listToUpdate };
} catch (error) {
  return { success: false, message: "Failed To Update", };
}
}



type DeleteListParams = {
  listId:string
  boardId:string
  orgId:string
}
export const deleteList = async({listId,boardId,orgId}:DeleteListParams)=>{
try {
  const listToDelete = await db.list.delete({
   where:{
    id:listId,
    boardId,
    board:{
      orgId
    }
   }
  })
  revalidatePath(`/board/${boardId}`)
  return { success: true, message: "List Deleted",};
} catch (error:any) {
  console.log(error);
  return { success: false, message: "Failed To Delete List",};
}
}



type CopyListParams = {
  listId:string
  boardId:string
  orgId:string
}
export const copyList = async({listId,boardId,orgId}:CopyListParams)=>{
try {
  const ListToCopy = await db.list.findUnique({
    where: {
      id:listId,
      boardId,
      board:{
        orgId
      }
    },
    include:{
      card:true
    }
  })
  if(!ListToCopy) {
    throw new Error("Cannot find List")
  }
  const lastList = await db.list.findFirst({
    where: {
      boardId
    },
    orderBy: {
      order:"desc"
    },
    select:{order:true}
  })

  const newOrder = lastList ? lastList.order + 1 : 1

  const list = await db.list.create({
    data:{
      boardId:ListToCopy.boardId,
      title:`${ListToCopy.title} - Copy`,
      order:newOrder,
      card:{
        createMany:{
          data:ListToCopy.card.map((card)=>({
            title:card.title,
            description:card.description,
            order:card.order
          }))
        }
      }
    },
    include:{
      card:true
    }
  })


  revalidatePath(`/board/${boardId}`);
  return { success: true, message: "List Copied",results:list};
} catch (error) {
  console.log(error);
  return { success: false, message: "Failed To Copy List"};
}
}