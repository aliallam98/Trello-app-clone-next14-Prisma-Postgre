import React from 'react'


interface IProps {
    children : React.ReactNode
}
const ListWrapper = ({children}:IProps) => {
  return (
    <li className='shrink-0 h-full w-[272px] select-none'>
        {children}
    </li>
  )
}

export default ListWrapper