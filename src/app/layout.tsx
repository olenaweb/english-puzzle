import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './index.css';
import './animate.css';
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'English Puzzle - A puzzle game for learning English',
  description: 'A puzzle game designed to help you learn English in a fun and interactive way.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
