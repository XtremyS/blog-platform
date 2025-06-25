"use client";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./ThemeProvider";

interface ClientSessionProviderProps {
  children: ReactNode;
}

const ClientSessionProvider: React.FC<ClientSessionProviderProps> = ({
  children,
}) => {
  return (
    <SessionProvider>
      <ThemeProvider>
        {children}
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  );
};

export default ClientSessionProvider;
