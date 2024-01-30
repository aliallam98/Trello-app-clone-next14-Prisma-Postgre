import React from 'react'
import CreateListForm from './CreateListForm'
import ListWrapper from './ListWrapper'
import ListItem from './ListItem'
import { List } from '@prisma/client'
import { ListWithCards } from '@/typings'



interface IProps {
    boardId:string
    orgId:string
    data:ListWithCards[] | undefined
}

const ListContainer = async ({boardId,orgId,data}:IProps) => {
  return (
    <ol className='relative z-40 flex gap-6'>
      {data?.map((list,i)=> (
      <ListWrapper 
      key={list.id}
      >
        <div className='w-full flex items-center justify-between p-2 rounded-md bg-[#f1f2f4]'>
            <ListItem
            index={i}
            key={list.id}
            data={list}
            />
        </div>
      </ListWrapper>
      ))}
        <CreateListForm
        boardId={boardId}
        orgId={orgId}
        />
    </ol>
  )
}

export default ListContainer