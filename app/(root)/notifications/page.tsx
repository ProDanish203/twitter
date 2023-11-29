import { NotifCard } from '@/components/cards';
import { Header } from '@/components/shared';
import React from 'react'

const Notifications = () => {
  return (
    <section className='min-h-screen'>
    <div>
      <Header label="Notifications" isBack={true}/>
    </div>
    <NotifCard/>
    <NotifCard/>
    </section>
  )
}

export default Notifications;