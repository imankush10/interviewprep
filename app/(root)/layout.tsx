"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Loader from "@/components/Loader";
import { motion } from "framer-motion";
import ClientNavigation from "@/components/ClientNavigation";

const InnerRootLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { data: user, isLoading, isError } = useCurrentUser();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setHasCheckedAuth(true);
      if (!user) router.replace("/sign-in");
    }
  }, [isLoading, user, router]);

  if (isLoading || !hasCheckedAuth) {
    return <Loader />;
  }
  if (!user) return <Loader />;

  return (
    <div className="min-h-screen">
      <ClientNavigation user={user} />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.main>
    </div>
  );
};

export default InnerRootLayout;
