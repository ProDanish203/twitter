import { AuthProvider } from '@/store/AuthProvider'
import '../globals.css'
import type { Metadata } from 'next'
import { redirect } from "next/navigation";
import { getAuthSession } from '@/utils/auth';

export const metadata: Metadata = {
  title: 'X | Formerly Twitter',
  description: 'X | A social media platform built by Danish Siddiqui, where users can share their daily life routines through tweets and also interact and engage with other users',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const session = await getAuthSession();
  if(session?.user) redirect("/");

  return (
    <html lang="en">
      <head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
      <link rel="manifest" href="/site.webmanifest"/>
      </head>
      <body className='h-screen bg-black'>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
