// src/app/layout.tsx
import React from 'react';
import SuiProviders from './components/SuiProviders';
import './globals.css';

export const metadata = {
  title: 'TokenTrip',
  description: 'Your Crypto Passport to Unforgettable Experiences',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white">
        <SuiProviders>
          {children}
        </SuiProviders>
      </body>
    </html>
  );
}