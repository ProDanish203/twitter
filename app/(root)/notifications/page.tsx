import { NotifCard } from '@/components/cards';
import { Header } from '@/components/shared';
import { getCurrentUser, getNotifications } from '@/lib/actions/User';
import { redirect } from 'next/navigation';
import React from 'react'

const Notifications = async () => {
  const {data, success} = await getCurrentUser()
  if(!success) redirect("/");
  const {notifs} = await getNotifications();
  const {notifications} = notifs
  
  return (
    <section className='min-h-screen'>
    <div>
      <Header label="Notifications" isBack={true}/>
    </div>
    {
      notifications && notifications.length > 0
      ? notifications.map((notif:any, i:number) => (
        <NotifCard data={notif} key={notif._id}/>
      )) : (
        <h3 className='text-text text-xl font-semibold sm:px-7 px-3 sm:py-7 py-5'>No notifications :&#40;</h3>
      )
    }
    </section>
  )
}

export default Notifications;