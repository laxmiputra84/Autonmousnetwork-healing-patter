import type { Metadata } from 'next';
import './globals.css';
import { NetworkProvider } from '@/context/NetworkContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { ToastContainer } from '@/components/layout/ToastContainer';

export const metadata: Metadata = {
  title: 'Autonomous Network Healing Platform | NOC Command Center',
  description:
    'Self-healing automated network operations center platform with AI-driven root cause analysis and dynamic remediation.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-noc-bg text-slate-100 min-h-screen antialiased selection:bg-cyan-500 selection:text-black">
        <NetworkProvider>
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col pl-64 min-w-0">
              <Navbar />
              <main className="flex-1 p-6 relative grid-pattern min-h-[calc(100vh-4rem)]">
                {children}
              </main>
            </div>
          </div>
          <ToastContainer />
        </NetworkProvider>
      </body>
    </html>
  );
}
