import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Open Loops",
  description: "A quiet landing page for unfinished thoughts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
