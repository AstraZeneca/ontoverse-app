'use client';

import Script from 'next/script';
import { ThemeProvider } from '@mui/material';
import { appTheme } from '@/theme';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </head>
      <body style={{ overflow: 'hidden', margin: 0 }}>
        <Script src="/env-config.js" strategy="beforeInteractive" />
        <ThemeProvider theme={appTheme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

