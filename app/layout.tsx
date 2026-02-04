'use client';

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
        {/* Load runtime environment configuration injected by Docker - must load synchronously before other scripts */}
        <script src="/env-config.js" defer={false}></script>
      </head>
      <body style={{ overflow: 'hidden', margin: 0 }}>
        <ThemeProvider theme={appTheme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

