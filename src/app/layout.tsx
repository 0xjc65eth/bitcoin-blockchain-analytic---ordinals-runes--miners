import React from 'react';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { metadata } from './metadata';
import '@fontsource/orbitron';
import '@fontsource/fira-code';
import '@fontsource/inter';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
} 