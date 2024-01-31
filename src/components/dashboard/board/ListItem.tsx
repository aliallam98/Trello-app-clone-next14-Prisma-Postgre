import React from 'react'
import ListTitle from './ListTitle'
import { List } from '@prisma/client'
import { ListWithCards } from '@/typings'
import CreateCardFrom from './CreateCardFrom'


interface IProps {
    data:ListWithCards
    index:number
}
const ListItem = ({data}:IProps) => {
  return (
    <div className='w-full'>
        <ListTitle
        data={data}
        />
        <ol>
          Card Item
        </ol>
        <CreateCardFrom
        data={data}
        />
    </div>
  )
}

export default ListItem