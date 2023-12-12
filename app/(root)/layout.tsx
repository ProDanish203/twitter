import type { Metadata } from 'next'
import '../globals.css'
import { AuthProvider } from '@/store/AuthProvider'
import { BottomBar, RightSidebar, Sidebar } from '@/components/shared'
import { getAuthSession } from '@/utils/auth';
import { ComposeBtn } from '@/components/helpers';
import { Toaster } from 'react-hot-toast';


export const metadata: Metadata = {
  title: 'TwitterDS | Made By Danish Siddiqui',
  description: 'TwitterDS | A social media platform built by Danish Siddiqui, where users can share their daily life routines through tweets and also interact and engage with other users',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const session = await getAuthSession();

  return (
    <html lang="en">
    <head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
      <link rel="manifest" href="/site.webmanifest"/>  
    </head>
      <body>
      <AuthProvider>
        <Toaster
        position="top-center"
        reverseOrder={false}
        />

        <main className='min-h-screen bg-black'>

          <div className='container w-screen mx-auto'>

            <div className='relative max-w-7xl flex mx-auto w-full'>
              <div className='max-xs:hidden '>
                <Sidebar/>
              </div>
              <div className='relative min-h-screen w-full'>
                <div className='pt-20 pb-20'>
                  {children}
                </div>
              </div>
              <div className='max-lg:hidden'>
                <RightSidebar/>
              </div>
              
              <div className='xs:hidden'>
                {
                  session && (
                    <ComposeBtn userId={session.user.id}/>
                  )
                }
                <BottomBar/>
              </div>
            </div>

          </div>

        </main>

      </AuthProvider>
      </body>
    </html>
  )
}
