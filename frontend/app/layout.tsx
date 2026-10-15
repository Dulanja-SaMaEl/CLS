import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

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
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('cls-theme');
                  var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (stored === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                    document.documentElement.style.colorScheme = 'light';
                  } else if (stored === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                    document.documentElement.style.colorScheme = 'dark';
                  } else if (systemDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-[#FDFBF7] dark:bg-[#0A0A0A] text-[#12141A] dark:text-[#EDEDED] antialiased font-sans selection:bg-[#C5A059] selection:text-[#0A0A0A] min-h-screen transition-colors duration-200">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
