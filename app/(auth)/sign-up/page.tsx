"use client";
import AuthForm from "@/components/AuthForm";
import Loader from "@/components/Loader";
import { useIsAuthenticated } from "@/hooks/useIsAuthenticated";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const SignUp = () => {
  const { data: authStatus, isLoading: authChecking } = useIsAuthenticated();
  const router = useRouter();

  useEffect(() => {
    if (authStatus?.authenticated) {
      router.replace("/");
    }
  }, [authStatus, router]);

  if (authChecking) return <Loader />;

  if (authStatus && !authStatus.authenticated) {
    return <AuthForm type="sign-up" />;
  }

  return <Loader />;
};


export default SignUp;
