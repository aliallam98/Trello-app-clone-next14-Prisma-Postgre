"use server";

import db from "@/lib/db";

export const createBoard = async (boardData: any) => {
  try {
    console.log(boardData);

    const newBoard = await db.board.create({
        data:boardData
    });
    
  } catch (error) {
    console.log(error);
  }
};
