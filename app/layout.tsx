import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Colombo Law Society | Est. 1890 | Superior Courts Complex, Hulftsdorp",
  description: "Official portal of the Colombo Law Society representing the attorneys-at-law and advocates of the Supreme Court of Sri Lanka.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-noir-900 text-stone-100 antialiased font-sans selection:bg-bronze selection:text-noir-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
