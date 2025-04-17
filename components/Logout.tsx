"use client";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    queryClient.clear();
    router.replace("/sign-in");
  };

  return (
    <Button className="cursor-pointer btn-secondary" onClick={handleLogout}>
      Log out
    </Button>
  );
}
