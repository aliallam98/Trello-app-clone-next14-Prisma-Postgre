import React from 'react'
import ListTitle from './ListTitle'
import { List } from '@prisma/client'
import { ListWithCards } from '@/typings'


interface IProps {
    data:ListWithCards
    index:number
}
const ListItem = ({data}:IProps) => {
  return (
    <div className='w-full cursor-pointer'>
        <ListTitle
        data={data}
        />
    </div>
  )
}

export default ListItem