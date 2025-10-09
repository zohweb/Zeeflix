// src/app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Zeeflix",
  description: "Find your next favorite movie",
  icons: {
    icon: "public\Zeelogo.png", 
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* optional */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body>{children}</body>
    </html>
  );
}
