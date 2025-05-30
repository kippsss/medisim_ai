import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { DiagnosesProvider } from './contexts/DiagnosesContext';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'medisimAI',
  description: 'Virtual patient simulator for medical students',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex justify-center">
          <DiagnosesProvider>{children}</DiagnosesProvider>
        </div>
      </body>
    </html>
  );
}
