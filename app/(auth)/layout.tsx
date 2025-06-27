import { ReactNode } from "react";
import ClientNavigation from "@/components/ClientNavigation";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return <div className="min-h-screen w-full">
    <ClientNavigation/>
    {children}
    </div>;
};

export default AuthLayout;
