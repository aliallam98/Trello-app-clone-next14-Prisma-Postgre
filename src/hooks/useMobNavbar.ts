import {create} from "zustand"

interface MobNavbarStore {
    isOpen : boolean
    onClose : ()=>void
    onOpen : ()=>void
}

const useMobSidebar = create<MobNavbarStore>((set)=>({
    isOpen:false,
    onOpen : ()=> set({
        isOpen:true
    }),
    onClose:()=> set({
        isOpen:false
    })
}))

export default useMobSidebar