import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import ReactQueryProvider from "@/store/react-query-provider";

const poppins = Poppins({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Twitter",
  description: "A Twitter clone built with Next.js",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          roboto.className,
          poppins.variable,
          "antialiased overflow-x-clip relative min-w-screen w-full min-h-screen"
        )}
      >
        <ReactQueryProvider>
          <Toaster richColors position="top-right" />
          <main>{children}</main>
          {modal}
          <div id="modal-root" />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
