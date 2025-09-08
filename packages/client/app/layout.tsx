import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Script from 'next/script'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Say My Brain',
  description: 'Save, organize, and chat with your links.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair:ital,opsz,wght@0,5..1200,300..900;1,5..1200,300..900&display=swap" rel="stylesheet"/>
      </head>
      <body className="bg-slate-100 text-slate-800" suppressHydrationWarning={true}>
        <Toaster position="top-center" />
        <main>{children}</main>
        <Script 
          src="https://platform.twitter.com/widgets.js" 
          strategy="lazyOnload" 
        />
      </body>
    </html>
  );
}
