"use client";

import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useIsAuthenticated } from "@/hooks/useIsAuthenticated";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Target,
  BarChart3,
  Home,
  RotateCcw,
  Brain,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Activity,
  Zap,
  Code,
  MessageSquare
} from "lucide-react";
import SkeletonFeedbackPage from "@/components/skeletons/SkeletonFeedbackPage";

// Animated background component
function FeedbackBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -inset-10 opacity-15"
        animate={{
          background: [
            "radial-gradient(600px circle at 30% 30%, rgba(120, 119, 198, 0.1), transparent 50%)",
            "radial-gradient(600px circle at 70% 70%, rgba(120, 119, 198, 0.1), transparent 50%)",
            "radial-gradient(600px circle at 50% 50%, rgba(120, 119, 198, 0.1), transparent 50%)",
            "radial-gradient(600px circle at 30% 30%, rgba(120, 119, 198, 0.1), transparent 50%)",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}

// Animated radar chart component
function RadarChart({ data }: { data: any[] }) {
  const size = 200;
  const center = size / 2;
  const maxRadius = 80;
  const levels = 5;

  const angleStep = (2 * Math.PI) / data.length;
  
  const getPoint = (index: number, value: number, radius: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  return (
    <div className="relative">
      <svg width={size} height={size} className="overflow-visible">
        {/* Grid circles */}
        {[...Array(levels)].map((_, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={(maxRadius * (i + 1)) / levels}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />
        ))}
        
        {/* Grid lines */}
        {data.map((_, index) => {
          const point = getPoint(index, 100, maxRadius);
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
            />
          );
        })}
        
        {/* Data polygon */}
        <motion.polygon
          points={data.map((item, index) => {
            const point = getPoint(index, item.score, maxRadius);
            return `${point.x},${point.y}`;
          }).join(' ')}
          fill="rgba(59, 130, 246, 0.2)"
          stroke="rgb(59, 130, 246)"
          strokeWidth="2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        
        {/* Data points */}
        {data.map((item, index) => {
          const point = getPoint(index, item.score, maxRadius);
          return (
            <motion.circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="rgb(59, 130, 246)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            />
          );
        })}
        
        {/* Labels */}
        {data.map((item, index) => {
          const labelPoint = getPoint(index, 100, maxRadius + 20);
          return (
            <text
              key={index}
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-white/70 font-medium"
            >
              {item.name}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

// Animated bar chart component
function AnimatedBarChart({ data }: { data: any[] }) {
  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <motion.div
          key={index}
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className="flex justify-between items-center">
            <span className="text-white/80 text-sm font-medium">{item.name}</span>
            <span className="text-white text-sm font-bold">{item.score}/100</span>
          </div>
          <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(item.score / 100) * 100}%` }}
              transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Performance trends component
function PerformanceTrends({ score }: { score: number }) {
  const trendData = [
    { label: "Technical Skills", value: score + Math.random() * 10 - 5 },
    { label: "Communication", value: score + Math.random() * 15 - 7 },
    { label: "Problem Solving", value: score + Math.random() * 8 - 4 },
    { label: "Code Quality", value: score + Math.random() * 12 - 6 },
  ];

  return (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-white flex items-center gap-2">
        <Activity className="w-5 h-5 text-green-400" />
        Performance Metrics
      </h4>
      
      <div className="grid grid-cols-2 gap-4">
        {trendData.map((item, index) => (
          <motion.div
            key={index}
            className="bg-black/20 rounded-xl p-4 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="text-2xl font-bold text-white mb-1">
              {Math.round(item.value)}%
            </div>
            <div className="text-xs text-white/60">{item.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Score circle component
function ScoreCircle({ score, size = "large" }: { score: number; size?: "small" | "large" }) {
  const radius = size === "large" ? 60 : 40;
  const strokeWidth = size === "large" ? 8 : 6;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="relative">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        <circle
          stroke="rgba(255, 255, 255, 0.1)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <motion.circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={getScoreColor(score)}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-bold ${size === "large" ? "text-3xl" : "text-xl"} text-white`}>
          {score}
        </span>
        <span className="text-xs text-white/60">SCORE</span>
      </div>
    </div>
  );
}

export default function FeedbackPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: user, isLoading: userLoading } = useIsAuthenticated();

  const {
    data: interview,
    isLoading: interviewLoading,
    error: interviewError,
  } = useQuery({
    queryKey: ["interview", id],
    queryFn: async () => {
      const res = await fetch(`/api/interview/${id}`);
      if (!res.ok) throw new Error("Interview not found");
      return res.json();
    },
    enabled: !!id,
  });

  const {
    data: feedback,
    isLoading: feedbackLoading,
    error: feedbackError,
  } = useQuery({
    queryKey: ["feedback", id],
    queryFn: async () => {
      const res = await fetch(`/api/feedback/${id}`);
      if (!res.ok) throw new Error("Feedback not found");
      return res.json();
    },
    enabled: !!id && !!user,
  });

  if (userLoading || interviewLoading || feedbackLoading)
    return <SkeletonFeedbackPage />;
  if (!user) {
    router.replace("/sign-in");
    return null;
  }
  if (interviewError || !interview) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Interview Not Found</h2>
          <p className="text-white/70">The interview you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }
  if (feedbackError || !feedback) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Feedback Not Found</h2>
          <p className="text-white/70">We couldn't find feedback for this interview.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <FeedbackBackground />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center space-x-3 bg-white/[0.08] border border-white/20 rounded-full px-6 py-3 backdrop-blur-xl mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Brain className="w-5 h-5 text-purple-400" />
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span className="text-white/90 text-sm font-medium">
              Advanced Analytics Ready
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl lg:text-6xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
              Performance
            </span>{" "}
            Analytics
          </motion.h1>
          
          <motion.p
            className="text-xl text-white/70 capitalize"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {interview.role} Position • Comprehensive Analysis
          </motion.p>
        </motion.div>

        {/* Two-Section Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Left Section - Analytics & Graphs */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {/* Overall Score with Enhanced Visualization */}
            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <ScoreCircle score={feedback.totalScore} />
                </div>
                
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-3xl font-bold text-white mb-2">Overall Performance</h2>
                  <p className="text-white/70 text-lg mb-4">
                    Exceptional performance with <span className="text-blue-400 font-semibold">{feedback.totalScore}/100</span>
                  </p>
                  
                  <div className="flex items-center justify-center lg:justify-start gap-4 text-white/60">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {feedback.createdAt
                          ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-semibold text-white">Skill Assessment Radar</h3>
              </div>
              
              <div className="flex justify-center">
                <RadarChart data={feedback.categoryScores || []} />
              </div>
            </div>

            {/* Performance Trends */}
            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
              <PerformanceTrends score={feedback.totalScore} />
            </div>
          </motion.div>

          {/* Right Section - Detailed Feedback */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Expanded Final Assessment - Main Feature */}
            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-6 h-6 text-blue-400" />
                <h3 className="text-2xl font-bold text-white">Detailed AI Feedback</h3>
              </div>
              
              {/* Full message with better formatting */}
              <div className="bg-gradient-to-br from-black/30 to-black/10 rounded-xl p-6 border border-white/10">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white/80 text-sm font-medium">AI Interviewer Analysis</span>
                  </div>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  <p className="text-white/90 leading-relaxed text-lg whitespace-pre-wrap font-light">
                    {feedback.finalAssessment}
                  </p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-white/50 text-sm">
                    <span>Assessment completed</span>
                    <span>{dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Breakdown with Bar Chart */}
            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-semibold text-white">Performance Breakdown</h3>
              </div>
              
              <AnimatedBarChart data={feedback.categoryScores || []} />
            </div>

            {/* Strengths and Improvements in Compact Layout */}
            <div className="grid grid-cols-1 gap-6">
              {/* Strengths */}
              <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">Key Strengths</h3>
                </div>
                <div className="space-y-2">
                  {feedback.strengths?.slice(0, 3).map((strength: string, index: number) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-green-500/10 rounded-xl border border-green-500/20"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                    >
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <p className="text-white/80 text-sm leading-relaxed">{strength}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Areas for Improvement */}
              <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingDown className="w-6 h-6 text-orange-400" />
                  <h3 className="text-lg font-semibold text-white">Growth Areas</h3>
                </div>
                <div className="space-y-2">
                  {feedback.areasForImprovement?.slice(0, 3).map((area: string, index: number) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-orange-500/10 rounded-xl border border-orange-500/20"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                    >
                      <AlertCircle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                      <p className="text-white/80 text-sm leading-relaxed">{area}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <Button
            asChild
            className="bg-white/[0.05] hover:bg-white/[0.1] border border-white/20 text-white font-semibold px-8 py-4 h-auto rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            <Link href="/" className="flex items-center gap-3">
              <Home className="w-5 h-5" />
              Back to Dashboard
            </Link>
          </Button>

          <Button
            asChild
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-4 h-auto rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            <Link href={`/interview/${id}`} className="flex items-center gap-3">
              <RotateCcw className="w-5 h-5" />
              Retake Interview
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
