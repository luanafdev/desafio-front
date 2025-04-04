import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@heroui/link";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import { AlertProvider } from "../contexts/AlertContext";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/assets/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
      <Providers themeProps={{ attribute: "class" }}>
          <div className="relative flex flex-col h-screen bg-[#333131] bg-[url(/assets/bg-green.png)] bg-repeat bg-center">
          <AlertProvider> {/* Envolvendo toda a aplicação */}
            <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow  bg-[#333131] bg-[url(/assets/bg-green.png)] bg-repeat bg-center">
              {children}
            </main>
        </AlertProvider>
          </div>
      </Providers>

      </body>
    </html>
  );
}
