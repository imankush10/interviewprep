import { ReactNode } from "react";
import ClientNavigation from "@/components/ClientNavigation";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return <div className="min-h-screen w-full">
    <ClientNaigation/>
    {children}
    </div>;
};

export default AuthLayout;
