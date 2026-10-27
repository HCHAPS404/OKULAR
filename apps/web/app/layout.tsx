import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OKULAR — Understand. Verify. Prevent.",
  description: "A user-controlled checkpoint before consequential digital decisions.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
