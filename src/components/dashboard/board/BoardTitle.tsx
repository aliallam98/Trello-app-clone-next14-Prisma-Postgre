
import { Board } from "@prisma/client";
import BoardActions from "./BoardActions";
import BoardTitleForm from "./BoardTitleForm";

interface IProps {
  data: Board | null;
  orgId:string
  boardId:string
}
const BoardTitle = ({ data,orgId,boardId }: IProps) => {
  return (
    <div className="relative z-40 flex items-center justify-between p-2 bg-black/50 text-white">
        <BoardTitleForm
        data = {data} orgId={orgId}
        />
        <BoardActions orgId={orgId} boardId={boardId}/>
    </div>
  );
};

export default BoardTitle;
