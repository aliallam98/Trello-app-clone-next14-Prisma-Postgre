import React from "react";
import ListTitle from "./ListTitle";
import { List } from "@prisma/client";
import { ListWithCards } from "@/typings";
import CreateCardFrom from "./CreateCardFrom";
import CardItem from "./CardItem";
import { cn } from "@/lib/utils";

import { Draggable, Droppable } from "@hello-pangea/dnd";

interface IProps {
  data: ListWithCards;
  index: number;
}
const ListItem = ({ data, index }: IProps) => {
  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="shrink-0 h-full w-[272px] select-none"
        >
          <div
            {...provided.dragHandleProps}
            className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2"
          >
            <ListTitle data={data} />
            <Droppable droppableId={data.id} type="card">
              {(provided) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
                    data.card.length > 0 ? "mt-2" : "mt-0"
                  )}
                >
                  {data.card.map((card, index) => (
                    <CardItem index={index} key={card.id} data={card} />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
            <CreateCardFrom data={data} />
          </div>
        </li>
      )}
    </Draggable>
  );
};

export default ListItem;
