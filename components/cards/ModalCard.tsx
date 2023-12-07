"use client"
import { getUser } from '@/lib/actions/User';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { ModalcardSkeleton } from '../skeleton';

interface Props{
    id: string;
}

export const ModalCard = async ({id}: Props) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getUser(id);
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [id]);

  if (!user) {
    return <ModalcardSkeleton/>;
  }

  return (
    <div className='flex items-center gap-2 justify-start'> 
      <Image src={user.image} alt={user.name} width={50} height={50}
      className='rounded-full object-cover w-[50px] h-[50px]'
      />

      <Link href={`/profile/${user._id}`}>
        <h6 className='text-text font-semibold md:text-md'>
          {user.name.length > 10 ? user.name.substring(0, 15) : user.name}
        </h6>
          <p className='text-whiteAccent text-sm'>@{user.username || ''}</p>
      </Link>
    </div>
  );
}
