"use client";

import { interviewer } from "@/constants";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  Brain,
  MessageSquare,
  Loader2,
  Zap,
  Activity,
} from "lucide-react";
import Loader from "./Loader";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

interface AgentProps {
  userName: string;
  userId: string;
  type: string;
  interviewId: string;
  questions?: string[];
}

// Animated background component
function InterviewBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -inset-10 opacity-20"
        animate={{
          background: [
            "radial-gradient(600px circle at 30% 30%, rgba(120, 119, 198, 0.15), transparent 50%)",
            "radial-gradient(600px circle at 70% 70%, rgba(120, 119, 198, 0.15), transparent 50%)",
            "radial-gradient(600px circle at 50% 50%, rgba(120, 119, 198, 0.15), transparent 50%)",
            "radial-gradient(600px circle at 30% 30%, rgba(120, 119, 198, 0.15), transparent 50%)",
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

// Audio visualization component
function AudioVisualization({ isActive }: { isActive: boolean }) {
  return (
    <div className="flex items-center justify-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-gradient-to-t from-blue-400 to-purple-500 rounded-full"
          animate={
            isActive
              ? {
                  height: [4, 20, 4],
                  opacity: [0.4, 1, 0.4],
                }
              : {
                  height: 4,
                  opacity: 0.4,
                }
          }
          transition={{
            duration: 0.8,
            repeat: isActive ? Infinity : 0,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Status indicator component
function StatusIndicator({ status }: { status: CallStatus }) {
  const getStatusConfig = () => {
    switch (status) {
      case CallStatus.ACTIVE:
        return {
          color: "bg-green-400",
          text: "Interview Active",
          icon: Activity,
        };
      case CallStatus.CONNECTING:
        return { color: "bg-yellow-400", text: "Connecting...", icon: Loader2 };
      case CallStatus.FINISHED:
        return { color: "bg-red-400", text: "Interview Ended", icon: PhoneOff };
      default:
        return { color: "bg-gray-400", text: "Ready to Start", icon: Brain };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <div className="inline-flex items-center space-x-3 bg-white/[0.08] border border-white/20 rounded-full px-4 py-2 backdrop-blur-xl">
      <div
        className={cn(
          "w-2 h-2 rounded-full",
          config.color,
          status === CallStatus.ACTIVE && "animate-pulse"
        )}
      />
      {status === CallStatus.CONNECTING ? (
        <Loader2 className="w-4 h-4 text-white/90 animate-spin" />
      ) : (
        <IconComponent className="w-4 h-4 text-white/90" />
      )}
      <span className="text-white/90 text-sm font-medium">{config.text}</span>
    </div>
  );
}

const Agent = ({
  userName,
  userId,
  type,
  interviewId,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const hasSubmittedFeedback = useRef(false);

  // React Query mutation for feedback
  const feedbackMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch("/api/feedback", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success && data.feedbackId) {
        router.push(`/interview/${interviewId}/feedback/`);
      } else {
        router.push("/");
      }
    },
    onError: () => {
      router.push("/");
    },
  });

  // Handle Vapi events
  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: any) => {
      if (
        error?.error?.type === "no-room" ||
        error?.errorMsg === "Meeting has ended"
      ) {
        console.log("Normal call termination detected, ignoring error");
        return;
      }
      console.error("Vapi error:", error);
    };
    const onMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = {
          role: message.role,
          content: message.transcript,
        } as SavedMessage;
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);
    vapi.on("message", onMessage);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
      vapi.off("message", onMessage);
    };
  }, []);

  // Debounced feedback generation on call end
  useEffect(() => {
    console.log(userId);
    if (
      callStatus === CallStatus.FINISHED &&
      type !== "generate" &&
      !hasSubmittedFeedback.current
    ) {
      hasSubmittedFeedback.current = true;

      feedbackMutation.mutate({
        userId,
        interviewId,
        transcript: messages,
      });
    }

    if (callStatus === CallStatus.FINISHED && type === "generate") {
      router.push("/");
      router.refresh();
    }
  }, [
    callStatus,
    type,
    userId,
    interviewId,
    messages,
    router,
    feedbackMutation,
  ]);

  // Call handling
  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      const assistantOverrides = {
        variableValues: {
          username: userName,
          userid: userId,
        },
      };

      await vapi.start(
        process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,
        assistantOverrides
      );
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }

      const assistantOverrides = {
        variableValues: {
          questions: formattedQuestions,
        },
      };

      await vapi.start(interviewer, assistantOverrides);
    }
  };

  const handleDisconnect = () => {
    try {
      vapi.stop();
      setCallStatus(CallStatus.FINISHED);
    } catch (err) {
      console.log("Error during disconnect:", err);
      setCallStatus(CallStatus.FINISHED);
    }
  };

  const latestMessage = messages[messages.length - 1]?.content;
  const isCallInactiveOrFinished =
    callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <InterviewBackground />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Status Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <StatusIndicator status={callStatus} />
        </motion.div>

        {/* Interview Participants */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* AI Interviewer Card */}
          <motion.div
            className="relative"
            animate={isSpeaking ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 1, repeat: isSpeaking ? Infinity : 0 }}
          >
            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center shadow-2xl h-full">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto relative">
                  <div
                    className={cn(
                      "absolute inset-0 rounded-full transition-all duration-500",
                      isSpeaking
                        ? "bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 animate-pulse shadow-lg shadow-blue-500/25"
                        : "bg-gradient-to-r from-gray-600 to-gray-700"
                    )}
                  />
                  <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center">
                    <Image
                      src="/ai-avatar.png"
                      alt="AI Interviewer"
                      width={80}
                      height={80}
                      className="object-cover rounded-full"
                    />
                  </div>
                </div>

                {/* Audio visualization */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <AudioVisualization isActive={isSpeaking} />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                AI Interviewer
              </h3>
              <p className="text-white/60 text-sm mb-4">
                {isSpeaking ? "Speaking..." : "Listening"}
              </p>

              <div className="flex items-center justify-center space-x-4 text-white/40">
                <Brain className="w-5 h-5" />
                <Volume2
                  className={cn("w-5 h-5", isSpeaking && "text-blue-400")}
                />
                <Zap className="w-5 h-5" />
              </div>
            </div>
          </motion.div>

          {/* User Card */}
          <motion.div
            className="relative"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center shadow-2xl h-full">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {userName[0].toUpperCase()}
                </div>

                {/* Microphone status */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-white/[0.1] backdrop-blur-xl border border-white/20 rounded-full p-2">
                    <Mic className="w-4 h-4 text-green-400" />
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">{userName}</h3>
              <p className="text-white/60 text-sm mb-4">Candidate</p>

              <div className="flex items-center justify-center space-x-4 text-white/40">
                <Mic className="w-5 h-5 text-green-400" />
                <span className="text-xs">Ready</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Live Transcript */}
        <AnimatePresence>
          {messages.length > 0 && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">
                    Live Transcript
                  </h3>
                </div>

                <motion.div
                  className="bg-black/20 rounded-xl p-4 min-h-[100px] max-h-40 overflow-y-auto"
                  key={latestMessage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1 }}
                >
                  <p className="text-white/80 leading-relaxed">
                    {latestMessage || "Waiting for conversation to begin..."}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback Loading Overlay */}
        <AnimatePresence>
          {feedbackMutation.isLoading && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-white/[0.08] backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center max-w-md mx-4">
                <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Generating Feedback
                </h3>
                <p className="text-white/70">
                  Our AI is analyzing your interview performance...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call Controls */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {callStatus === CallStatus.ACTIVE ? (
            <motion.button
              onClick={handleDisconnect}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-12 py-4 rounded-2xl flex items-center gap-3 shadow-lg transition-all duration-300 transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PhoneOff className="w-6 h-6" />
              End Interview
            </motion.button>
          ) : (
            <motion.button
              onClick={handleCall}
              disabled={callStatus === CallStatus.CONNECTING}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 text-white font-semibold px-12 py-4 rounded-2xl flex items-center gap-3 shadow-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
              whileHover={{
                scale: callStatus === CallStatus.CONNECTING ? 1 : 1.05,
              }}
              whileTap={{
                scale: callStatus === CallStatus.CONNECTING ? 1 : 0.95,
              }}
            >
              {callStatus === CallStatus.CONNECTING ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Phone className="w-6 h-6" />
                  Start Interview
                </>
              )}
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Agent;
