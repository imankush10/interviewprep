"use client";
import { useLogout } from "@/hooks/useLogout";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const { logout, loading } = useLogout();

  return (
    <>
      {loading && <Loader />}
      <Button
        className="cursor-pointer btn-secondary"
        onClick={logout}
        disabled={loading}
      >
        Log out
      </Button>
    </>
  );
}
