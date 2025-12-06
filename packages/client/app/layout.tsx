import type { Metadata } from 'next';

import './globals.css';
import { Toaster } from 'react-hot-toast';
import Script from 'next/script'; 


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
<link rel="preconnect" href="https://fonts.gstatic.com" />
<link href="https://fonts.googleapis.com/css2?family=Special+Elite&display=swap" rel="stylesheet"/>
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
