"use client";
import Agent from "@/components/Agent";
import Loader from "@/components/Loader";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import React from "react";

const Page = () => {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) return <Loader />;
  return (
    <>
      <h3>Interview Generation</h3>
      <Agent userName={user?.name} userId={user?.id} type="generate" />
    </>
  );
};

export default Page;
