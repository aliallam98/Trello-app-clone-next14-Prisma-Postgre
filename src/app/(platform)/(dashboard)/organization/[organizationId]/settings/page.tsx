import { OrganizationProfile } from '@clerk/nextjs'
import React from 'react'

const SettingsPage = () => {
  return (
    <section className='flex justify-center mt-10 h-full'>
      <OrganizationProfile
      appearance={{
        elements:{
          rootBox: {
            height:"80%",
          },
          card:{
            boxShadow:"none",
            border:"1px solid #eee"
          }
        }
      }}
      />
    </section>
  )
}

export default SettingsPage