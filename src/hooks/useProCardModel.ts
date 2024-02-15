import {create} from "zustand"

interface ProCardModelStore {
    isOpen : boolean
    onClose : ()=>void
    onOpen : ()=>void
}

const useProCardModel = create<ProCardModelStore>((set)=>({
    isOpen:false,
    onOpen : ()=> set({
        isOpen:true,
    }),
    onClose:()=> set({
        isOpen:false,
    })
}))

export default useProCardModel