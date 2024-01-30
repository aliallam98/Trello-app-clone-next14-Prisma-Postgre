import { Card, List } from "@prisma/client";


export type ListWithCards  = List & {card: Card[] }
export type CardWithList  = Card & {list: List }