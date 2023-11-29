import type { Metadata } from 'next'
import '../globals.css'
import { AuthProvider } from '@/store/AuthProvider'
import { BottomBar, RightSidebar, Sidebar } from '@/components/shared'
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { getAuthSession } from '@/utils/auth';
import { redirect } from 'next/navigation';
import { ComposeBtn } from '@/components/helpers';

export const metadata: Metadata = {
  title: 'X | Formerly Twitter',
  description: 'Take a glimpse on how things can be built, by Danish Siddiqui',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const session = await getAuthSession();
  if(!session) return redirect('/signin')

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>
      <body>
      <AuthProvider>
        <ToastContainer/>

        <main className='min-h-screen bg-black'>

          <div className='container w-screen mx-auto'>

            <div className='relative max-w-7xl flex mx-auto w-full'>
              <div className='max-xs:hidden '>
                <Sidebar/>
              </div>
              <div className='relative min-h-screen w-full'>
                <div className='pt-20'>
                  {children}
                </div>
              </div>
              <div className='max-lg:hidden'>
                <RightSidebar/>
              </div>
              
              <div className='xs:hidden'>
                <ComposeBtn/>
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
