import { Card } from "@prisma/client";
import { Draggable } from "@hello-pangea/dnd";
import useCardModel from "@/hooks/useCardModel";

interface IProps {
  data: Card;
  index: number;
}

const CardItem = ({ data, index }: IProps) => {
  const CardModel = useCardModel()
  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role="button"
          onClick={() => CardModel.onOpen(data.id)}
          className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm"
        >
          {data.title}
        </div>
      )}
    </Draggable>
  );
};

export default CardItem;
