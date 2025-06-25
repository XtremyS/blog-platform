import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import ClientSessionProvider from "@/lib/ClientSessionProvider";
import NavBar from "@/components/NavBar";
const poppins = Poppins({ subsets: ["latin"], weight: ["400"] });

export const metadata: Metadata = {
  title: "Next.js Blog Platform Assessment (Full-Stack)",
  description:
    "A blogging platform with dynamic custom blocks and Markdown support By Rajul Verma. which also supports (CRUD)",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ClientSessionProvider>
          <NavBar />
          {children}
        </ClientSessionProvider>
      </body>
    </html>
  );
}
