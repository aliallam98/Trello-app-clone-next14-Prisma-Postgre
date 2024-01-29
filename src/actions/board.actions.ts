"use server";

import db from "@/lib/db";
import { Board } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";



interface IBoard {
  success: boolean;
  message: string;
  results: Board | undefined
}
export const createBoard = async (boardData: any):Promise<IBoard> => {
  try {
    const newBoard = await db.board.create({
      data: boardData,
    });
    return { success: true, message: "Created", results: newBoard };
  } catch (error) {
    return { success: false, message: "Failed to create board", results: undefined }
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
    return { success: false, message: "Error retrieving boards", results: [] }
  }
};


 type getBoardByIdParams =  {
  boardId:string,
  orgId:string
}
export const getBoardById =  async ({boardId,orgId}:getBoardByIdParams)=>{
try {
  const board = await db.board.findUnique({
    where:{
      id:boardId,
      orgId
    }
  })
  if(!board){
    throw new Error("Cannot find this board")
  }
  return { success: true, message: "Done", results: board }
} catch (error:any) {
  console.log(error);
  return { success: false, message: error.message, }
}
}

type updateBoardByIdParams =  {
  boardId:string,
  orgId:string
  title:string
}
export const updateBoardById =  async ({boardId,orgId,title}:updateBoardByIdParams)=>{
  try {
    const boardToUpdate = await db.board.update({
      where:{id:boardId,orgId},
      data:{title}
    })
    if(!updateBoardById) throw new Error("Cannot Do This Actions 'Update Board' ")

    revalidatePath(`/board/${boardToUpdate.id}`)    
    return { success: true, message: "Updated", results: boardToUpdate }
  } catch (error) {
    console.log(error);
    
  }
}

type deleteBoardByIdParams =  {
  boardId:string,
  orgId:string
}
export const deleteBoardById =  async ({boardId,orgId}:deleteBoardByIdParams)=>{
  try {
    const boardToDelete = await db.board.delete({
      where:{id:boardId,orgId},
    })
    revalidatePath(`/organization/${orgId}`);
    return { success: true, message: "Deleted" }
  } catch (error:any) {
    console.log(error);
    if (error.code === "P2025") {
      return { success: false, message: "Board does not exist" };
    }
  }
  
}
