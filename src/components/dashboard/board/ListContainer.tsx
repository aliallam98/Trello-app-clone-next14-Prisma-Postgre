import React from 'react'
import CreateListForm from './CreateListForm'



interface IProps {
    boardId:string
    orgId:string
}

const ListContainer = ({boardId,orgId}:IProps) => {
  return (
    <ol>
        <CreateListForm
        boardId={boardId}
        orgId={orgId}
        />
    </ol>
  )
}

export default ListContainer