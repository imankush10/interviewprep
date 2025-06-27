import { ReactNode } from "react";


const AuthLayout = ({ children }: { children: ReactNode }) => {
  return <div className="min-h-screen w-full">{children}</div>;
};

export default AuthLayout;
