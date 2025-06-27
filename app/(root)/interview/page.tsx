"use client";
import Agent from "@/components/Agent";
import Loader from "@/components/Loader";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import React from "react";
import { motion } from "framer-motion";
import { Brain, Sparkles, Zap } from "lucide-react";

const Page = () => {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="relative z-10">

        {/* Agent Component */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Agent 
            userName={user?.name} 
            userId={user?.id} 
            type="generate" 
            interviewId="" // Empty for generation type
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Page;
