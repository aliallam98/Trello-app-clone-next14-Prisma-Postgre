"use server"

import db from "@/lib/db"
import { CardWithList } from "@/typings"
import { Card } from "@prisma/client"



type CreateCardParams = {
    listId:string,
    orgId:string,
    title:string,
    description?:string
}

interface ICard {
    success: boolean;
    message: string;
    results?: Card | undefined;
}
export const createCard = async ({listId,orgId,title,description}:CreateCardParams) : Promise<ICard> => {
try {
    const isListExist = await db.list.findUnique({
        where:{
            id:listId,
            board:{
                orgId
            }
        }
    })
    if(!isListExist){
        throw new Error("List not found")
    }

    const lastCard = await db.card.findFirst({
        where:{listId},
        orderBy:{order:"desc"},
        select:{order:true}
    })

    const newOrder = lastCard ? lastCard.order + 1 : 1

    const card = await db.card.create({
        data:{
            listId,
            title,
            description,
            order:newOrder,
        },
        
    })

    return {success : true , message:"Card created successfully", results:card}
} catch (error:any) {
    console.log(error);
    return {success : false , message:"Failed to create",}
}
}

type GetAllCardParams = {
    listId:string,
    orgId:string,

}
interface ICards {
    success: boolean;
    message: string;
    results?: Card [] | undefined;
}
export const getAllCards = async ({listId,orgId}:GetAllCardParams):Promise<ICards>=>{
    const isListExist = await db.list.findUnique({
        where:{
            id:listId,
            board:{
                orgId
            }
        },
        
    })
    if(!isListExist){
        throw new Error("List not found")
    }
    const cards = await db.card.findMany({
        where:{
            listId,
        },
        orderBy:{
            order:"desc"
        }
    })

    return {success : true , message:"Card created successfully", results:cards}
}