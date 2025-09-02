import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "PizzaDev - A melhor pizzaria",
  description: "A melhor pizzaria do Brasil",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        {children}
      </body>
    </html>
  );
}
