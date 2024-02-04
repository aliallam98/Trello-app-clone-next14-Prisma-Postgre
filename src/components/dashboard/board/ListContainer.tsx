"use client";

import React, { useEffect, useState } from "react";
import CreateListForm from "./CreateListForm";
import ListWrapper from "./ListWrapper";
import ListItem from "./ListItem";
import { List } from "@prisma/client";
import { ListWithCards } from "@/typings";

import { DragDropContext, Droppable } from "@hello-pangea/dnd";

interface IProps {
  boardId: string;
  orgId: string;
  data: ListWithCards[] 
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

const ListContainer = ({ boardId, orgId, data }: IProps) => {
  const [orderedData, setOrderedData] = useState(data);
  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    // if dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // User moves a list
    if (type === "list") {
      const items = reorder(
        orderedData,
        source.index,
        destination.index,
      ).map((item, index) => ({ ...item, order: index }));

      setOrderedData(items);
      // executeUpdateListOrder({ items, boardId });
    }

    // User moves a card
    if (type === "card") {
      let newOrderedData = [...orderedData];

      // Source and destination list
      const sourceList = newOrderedData.find(list => list.id === source.droppableId);
      const destList = newOrderedData.find(list => list.id === destination.droppableId);

      if (!sourceList || !destList) {
        return;
      }

      // Check if cards exists on the sourceList
      if (!sourceList.card) {
        sourceList.card = [];
      }

      // Check if cards exists on the destList
      if (!destList.card) {
        destList.card = [];
      }

      // Moving the card in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.card,
          source.index,
          destination.index,
        );

        reorderedCards.forEach((card, idx) => {
          card.order = idx;
        });

        sourceList.card = reorderedCards;

        setOrderedData(newOrderedData);
        // executeUpdateCardOrder({
        //   boardId: boardId,
        //   items: reorderedCards,
        // });
        // User moves the card to another list
      } else {
        // Remove card from the source list
        const [movedCard] = sourceList.card.splice(source.index, 1);

        // Assign the new listId to the moved card
        movedCard.listId = destination.droppableId;

        // Add card to the destination list
        destList.card.splice(destination.index, 0, movedCard);

        sourceList.card.forEach((card, idx) => {
          card.order = idx;
        });

        // Update the order for each card in the destination list
        destList.card.forEach((card, idx) => {
          card.order = idx;
        });

        setOrderedData(newOrderedData);
        // executeUpdateCardOrder({
        //   boardId: boardId,
        //   items: destList.cards,
        // });
      }
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData?.map((list, index) => {
              return <ListItem key={list.id} index={index} data={list} />;
            })}
            {provided.placeholder}
            <CreateListForm boardId={boardId} orgId={orgId} />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ListContainer;
