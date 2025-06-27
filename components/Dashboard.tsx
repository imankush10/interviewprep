"use client";
import { useQuery } from "@tanstack/react-query";
import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { Brain, Sparkles, Zap, TrendingUp, Calendar, Play } from "lucide-react";
import SkeletonInterviewCard from "./skeletons/SkeletonInterviewCard";

function fetchUserInterviews() {
  return fetch("/api/user-interviews").then((res) => res.json());
}
function fetchLatestInterviews() {
  return fetch("/api/latest-interviews").then((res) => res.json());
}
function fetchUserFeedbacks() {
  return fetch("/api/feedback/user-feedback").then((res) => res.json());
}

export default function Dashboard() {
  const { data: userInterviews, isLoading: loadingUser } = useQuery({
    queryKey: ["user-interviews"],
    queryFn: fetchUserInterviews,
  });
  const { data: allInterviews, isLoading: loadingLatest } = useQuery({
    queryKey: ["latest-interviews"],
    queryFn: fetchLatestInterviews,
  });
  const { data: userFeedbacks, isLoading: loadingFeedbacks } = useQuery({
    queryKey: ["user-feedbacks"],
    queryFn: fetchUserFeedbacks,
  });

  const feedbackMap = React.useMemo(() => {
    const map: Record<string, any> = {};
    (userFeedbacks || []).forEach((fb: any) => {
      map[fb.interviewId] = fb;
    });
    return map;
  }, [userFeedbacks]);

  const hasPastInterviews = userInterviews?.length > 0;
  const hasUpcomingInterviews = allInterviews?.length > 0;

  return (
    <div className="min-h-screen bg-black/20 relative overflow-hidden">

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero CTA Section */}
        <motion.section
          className="relative mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1 space-y-6">
                {/* Status badge */}
                <motion.div
                  className="inline-flex items-center space-x-3 bg-white/[0.08] border border-white/20 rounded-full px-4 py-2 backdrop-blur-xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Brain className="w-4 h-4 text-purple-400" />
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="text-white/90 text-sm font-medium">
                    AI-Powered Practice
                  </span>
                </motion.div>

                <motion.h1
                  className="text-4xl lg:text-5xl font-bold text-white leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Get Interview-Ready with{" "}
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                    AI-Powered Practice
                  </span>
                </motion.h1>

                <motion.p
                  className="text-xl text-white/70 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Practice real interview questions & get instant feedback from our advanced AI interviewer
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Button
                    asChild
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-4 h-auto rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <Link href="/interview" className="flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      Start an Interview
                    </Link>
                  </Button>
                </motion.div>
              </div>

              <motion.div
                className="flex-shrink-0"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Image
                  className="w-auto h-auto max-w-sm lg:max-w-md"
                  src="/robot.png"
                  alt="AI Interview Assistant"
                  height={400}
                  width={400}
                  priority={true}
                />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Your Interviews Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4 ml-4">
            <h2 className="text-3xl font-bold text-white">Your Interview History</h2>
          </div>
          
          <div className="interviews-section">
            {loadingUser ? (
              <div className="interviews-section">
                <SkeletonInterviewCard />
                <SkeletonInterviewCard />
                <SkeletonInterviewCard />
              </div>
            ) : hasPastInterviews ? (
              userInterviews.map((interview: any, index: number) => (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <InterviewCard
                    {...interview}
                    feedback={feedbackMap[interview.id]}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                className="col-span-full bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Calendar className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/70 text-lg">You haven't taken any interviews yet</p>
                <p className="text-white/50 text-sm mt-2">Start your first interview to see your progress here</p>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Available Interviews Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h2 className="text-3xl font-bold text-white">Available Interviews</h2>
          </div>
          
          <div className="interviews-section">
            {loadingLatest ? (
              <motion.div
                className="col-span-full bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center justify-center gap-3">
                  <motion.div
                    className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <p className="text-white/70">Loading interviews...</p>
                </div>
              </motion.div>
            ) : hasUpcomingInterviews ? (
              allInterviews.map((interview: any, index: number) => (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <InterviewCard
                    {...interview}
                    feedback={feedbackMap[interview.id] || null}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                className="col-span-full bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Brain className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/70 text-lg">No interviews available at the moment</p>
                <p className="text-white/50 text-sm mt-2">Check back later for new interview opportunities</p>
              </motion.div>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
