"use client"

import { useParams } from 'next/navigation'
import { useOrganizationList  } from '@clerk/nextjs'
import { useEffect } from 'react'
const OrgActiveHandler = () => {
    const params = useParams()
    const { setActive } = useOrganizationList();


    useEffect(()=>{
        if(!setActive) return

        setActive({
            organization: params.organizationId as string
        })

    },[setActive,params.organizationId ])



  return null
}

export default OrgActiveHandler