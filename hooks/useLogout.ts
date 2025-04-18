import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);
    await fetch("/api/logout", { method: "POST" });
    queryClient.clear();
    router.replace("/sign-in");
    setLoading(false);
  };

  return { logout, loading };
}
