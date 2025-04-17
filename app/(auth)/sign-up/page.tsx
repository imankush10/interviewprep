"use client";
import AuthForm from "@/components/AuthForm";
import Loader from "@/components/Loader";
import { useIsAuthenticated } from "@/hooks/useIsAuthenticated";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const SignUp = () => {
  const { data: user, isLoading } = useIsAuthenticated();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  if (isLoading) return <Loader />;
  if (!user) {
    return <AuthForm type="sign-up" />;
  }
  return <Loader />;
};

export default SignUp;
