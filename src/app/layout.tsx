// src/app/layout.tsx
import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Sticko",
  description: "Your sticky-notes app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* now all client pages/components can call useSession() */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
