import './globals.css';
import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import SidebarNav from '../components/SidebarNav';
import SidebarFooter from '../components/SidebarFooter';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'JSON Schema Ecosystem Observability',
  description: 'Dashboard for tracking JSON Schema ecosystem metrics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${inter.className} bg-white dark:bg-black text-zinc-900 dark:text-white antialiased flex min-h-screen`}
      >
        {/* Sidebar Navigation */}
        <nav className='w-64 border-r border-zinc-800 bg-zinc-950 p-6 flex flex-col gap-6 sticky top-0 h-screen'>
          <div className='flex items-center gap-3 mb-8'>
            <div className='w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center font-bold'>
              JS
            </div>
            <h1 className='font-semibold text-lg leading-tight tracking-tight'>
              JSON Schema
            </h1>
          </div>
          <div className='mb-4'></div>
          <SidebarNav />
          <SidebarFooter />
        </nav>

        {/* Main Content */}
        <main className='flex-1 bg-white dark:bg-black p-10 overflow-auto'>
          <div className='max-w-6xl mx-auto'>
            <TopBar />
            {children}
            <Footer />
          </div>
        </main>
      </body>
    </html>
  );
}
