"use client";
import { useQuery } from "@tanstack/react-query";
import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Sparkles,
  Calendar,
  Play,
  User,
  BookOpen,
  Plus,
} from "lucide-react";
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

  // Combine user interviews with taken interviews from available ones
  const { yourInterviews, availableInterviews } = React.useMemo(() => {
    const userInterviewIds = new Set(
      (userInterviews || []).map((i: any) => i.id)
    );
    const takenFromAvailable: any[] = [];
    const available: any[] = [];

    // Separate taken vs available from the latest interviews
    (allInterviews || []).forEach((interview: any) => {
      if (feedbackMap[interview.id]) {
        // Has feedback = taken, add to user's interviews
        takenFromAvailable.push({ ...interview, isTaken: true });
      } else {
        // No feedback = available to take
        available.push(interview);
      }
    });

    // Combine user created interviews with taken interviews
    const combinedUserInterviews = [
      ...(userInterviews || []).map((i: any) => ({ ...i, isCreated: true })),
      ...takenFromAvailable,
    ];

    return {
      yourInterviews: combinedUserInterviews,
      availableInterviews: available,
    };
  }, [userInterviews, allInterviews, feedbackMap]);

  const hasYourInterviews = yourInterviews.length > 0;
  const hasAvailableInterviews = availableInterviews.length > 0;

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
                  Practice real interview questions & get instant feedback from
                  our advanced AI interviewer
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
                      Create an Interview
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

        {/* Your Interviews Section - Combined Created + Taken */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-green-400" />
              <h2 className="text-3xl font-bold text-white">Your Interviews</h2>
              <span className="text-white/50 text-sm">
                ({yourInterviews.length} total)
              </span>
            </div>
          </div>

          <div className="interviews-section">
            {loadingUser || loadingLatest ? (
              <div className="interviews-section">
                <SkeletonInterviewCard />
                <SkeletonInterviewCard />
                <SkeletonInterviewCard />
              </div>
            ) : hasYourInterviews ? (
              yourInterviews.map((interview: any, index: number) => (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <InterviewCard
                    {...interview}
                    feedback={feedbackMap[interview.id] || null}
                    showBadge={interview.isCreated ? "created" : "taken"}
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
                <User className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/70 text-lg">No interviews yet</p>
                <p className="text-white/50 text-sm mt-2">
                  Create your first interview or take one from available
                  interviews
                </p>
                <div className="flex gap-3 justify-center mt-4">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-300"
                  >
                    <Link
                      href="/create-interview"
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Create Interview
                    </Link>
                  </Button>
                </div>
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
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <h2 className="text-3xl font-bold text-white">
              Available Interviews
            </h2>
            <span className="text-white/50 text-sm">
              ({availableInterviews.length} available)
            </span>
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
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <p className="text-white/70">
                    Loading available interviews...
                  </p>
                </div>
              </motion.div>
            ) : hasAvailableInterviews ? (
              availableInterviews.map((interview: any, index: number) => (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <InterviewCard
                    {...interview}
                    feedback={null}
                    showBadge="available"
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
                <BookOpen className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/70 text-lg">
                  No interviews available at the moment
                </p>
                <p className="text-white/50 text-sm mt-2">
                  Check back later for new interview opportunities
                </p>
              </motion.div>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
