"use client";
import AuthForm from "@/components/AuthForm";
import Loader from "@/components/Loader";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const SignIn = () => {
  const { data: user, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  if (isLoading) return <Loader />;

  if (!user) {
    return <AuthForm type="sign-in" />;
  }
  return <Loader />;
};

export default SignIn;
