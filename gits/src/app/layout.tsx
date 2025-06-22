"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import "@/styles/globals.css";  // <-- import Tailwind CSS here

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
