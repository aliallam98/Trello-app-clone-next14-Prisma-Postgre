import {create} from "zustand"

interface CardModelStore {
    id?:string
    isOpen : boolean
    onClose : ()=>void
    onOpen : (id:string)=>void
}

const useCardModel = create<CardModelStore>((set)=>({
    id:undefined,
    isOpen:false,
    onOpen : (id)=> set({
        isOpen:true,
        id:id
    }),
    onClose:()=> set({
        isOpen:false,
        id:undefined
    })
}))

export default useCardModel