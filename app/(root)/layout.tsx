"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import ClientNavigation from "@/components/ClientNavigation"; // We'll create this
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Loader from "@/components/Loader";

const InnerRootLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/sign-in");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return <Loader />;
  }

  return (
    <div className="root-layout">
      <ClientNavigation userInitial={user.name[0]} />
      {children}
    </div>
  );
};

export default InnerRootLayout;
