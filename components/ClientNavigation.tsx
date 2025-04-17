"use client";

import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions/auth.action";
import Image from "next/image";
import Link from "next/link";
import LogoutButton from "./Logout";

interface ClientNavigationProps {
  userInitial: string;
  userName: string;
}

const ClientNavigation = ({ userInitial, userName }: ClientNavigationProps) => {
  return (
    <nav className="flex items-center gap-2 justify-between">
      <Link href="/" className="flex items-center gap-2">
        <div className="flex flex-row gap-2 items-center">
          <Image
            src="/logo.svg"
            width={38}
            height={30}
            alt="logo"
            className="w-auto h-auto"
          />
          <h2 className="text-primary-100 text-2xl">InterviewPrep</h2>
        </div>
      </Link>

      <div className="flex gap-2 items-center">
        <span className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary text-white text-2xl font-semibold">
          {userInitial || "?"}
        </span>
        <LogoutButton />
      </div>
    </nav>
  );
};

export default ClientNavigation;
