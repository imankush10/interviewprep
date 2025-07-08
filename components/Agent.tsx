"use client";

import { interviewer } from "@/constants";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState, useCallback } from "react";
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
  AlertTriangle,
  X,
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

// Navigation blocking hook
const useNavigationBlocker = (shouldBlock: boolean, message: string) => {
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null
  );
  const originalPush = useRef<any>(null);
  const originalReplace = useRef<any>(null);
  const originalBack = useRef<any>(null);

  useEffect(() => {
    // Store original router methods
    if (!originalPush.current) {
      originalPush.current = router.push;
      originalReplace.current = router.replace;
      originalBack.current = router.back;
    }

    if (shouldBlock) {
      // Override router.push
      router.push = (href: string, options?: any) => {
        setWarningMessage(message);
        setShowWarning(true);
        setPendingNavigation(href);
        return Promise.resolve(true);
      };

      // Override router.replace
      router.replace = (href: string, options?: any) => {
        setWarningMessage(message);
        setShowWarning(true);
        setPendingNavigation(href);
        return Promise.resolve(true);
      };

      // Override router.back
      router.back = () => {
        setWarningMessage(message);
        setShowWarning(true);
        setPendingNavigation("back");
      };

      // Handle browser navigation
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = message;
        return message;
      };

      const handlePopState = (e: PopStateEvent) => {
        e.preventDefault();
        setWarningMessage(message);
        setShowWarning(true);
        setPendingNavigation("back");
        window.history.pushState(null, "", window.location.href);
        return false;
      };

      // Block all Link clicks
      const handleLinkClick = (e: Event) => {
        const target = e.target as HTMLElement;
        const link = target.closest('a, [role="link"]');
        if (link && link !== e.currentTarget) {
          e.preventDefault();
          e.stopPropagation();
          setWarningMessage(message);
          setShowWarning(true);

          const href = link.getAttribute("href");
          if (href && href !== "#") {
            setPendingNavigation(href);
          }
        }
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      window.addEventListener("popstate", handlePopState);
      document.addEventListener("click", handleLinkClick, true);
      window.history.pushState(null, "", window.location.href);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.removeEventListener("popstate", handlePopState);
        document.removeEventListener("click", handleLinkClick, true);
      };
    } else {
      // Restore original router methods when not blocking
      if (originalPush.current) {
        router.push = originalPush.current;
        router.replace = originalReplace.current;
        router.back = originalBack.current;
      }
    }
  }, [shouldBlock, message, router]);

  const hideWarning = useCallback(() => {
    setShowWarning(false);
    setWarningMessage("");
    setPendingNavigation(null);
  }, []);

  const confirmNavigation = useCallback(() => {
    if (pendingNavigation) {
      setShowWarning(false);

      // Temporarily disable blocking
      const currentPendingNav = pendingNavigation;
      setPendingNavigation(null);

      // Restore original methods and navigate
      if (originalPush.current) {
        router.push = originalPush.current;
        router.replace = originalReplace.current;
        router.back = originalBack.current;
      }

      setTimeout(() => {
        if (currentPendingNav === "back") {
          window.history.back();
        } else {
          originalPush.current(currentPendingNav);
        }
      }, 0);
    }
  }, [pendingNavigation, router]);

  return { showWarning, warningMessage, hideWarning, confirmNavigation };
};

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

// Navigation Warning Modal
function NavigationWarningModal({
  isOpen,
  message,
  onClose,
  onEndInterview,
  onConfirmNavigation,
  isInterviewActive,
}: {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  onEndInterview?: () => void;
  onConfirmNavigation?: () => void;
  isInterviewActive: boolean;
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white/[0.08] backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center max-w-md mx-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />

          <h3 className="text-xl font-semibold text-white mb-4">
            {isInterviewActive
              ? "Interview in Progress"
              : "Processing Feedback"}
          </h3>

          <p className="text-white/70 mb-6">{message}</p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Stay
            </button>

            {isInterviewActive && onEndInterview && (
              <button
                onClick={onEndInterview}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                End Interview
              </button>
            )}

            {!isInterviewActive && onConfirmNavigation && (
              <button
                onClick={onConfirmNavigation}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Continue
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
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
  const [isProcessingFeedback, setIsProcessingFeedback] = useState(false);
  const hasSubmittedFeedback = useRef(false);
  const [isWaitingForPermission, setIsWaitingForPermission] = useState(false);
  const [hasPermissionBeenGranted, setHasPermissionBeenGranted] =
    useState(false);

  // Determine what to block and appropriate messages
  const isInterviewActive = callStatus === CallStatus.ACTIVE;
  const shouldBlockNavigation = isInterviewActive;

  const getBlockMessage = () => {
    if (isInterviewActive) {
      return "Your interview is currently active. Please end the interview before leaving this page.";
    }
    return "";
  };

  // Use navigation blocker
  const { showWarning, warningMessage, hideWarning, confirmNavigation } =
    useNavigationBlocker(shouldBlockNavigation, getBlockMessage());

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
      setIsProcessingFeedback(false);
      if (data.success && data.feedbackId) {
        router.push(`/interview/${interviewId}/feedback/`);
      } else {
        router.push("/");
      }
    },
    onError: () => {
      setIsProcessingFeedback(false);
      router.push("/");
    },
  });

  // Handle Vapi events
  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
      setIsWaitingForPermission(false);
      setHasPermissionBeenGranted(true);
    };

    const onCallEnd = () => {
      // Only process call end if we're not waiting for permission
      // and the call actually started properly
      if (!isWaitingForPermission && hasPermissionBeenGranted) {
        setCallStatus(CallStatus.FINISHED);
      } else {
        // If we were waiting for permission, reset to inactive
        setCallStatus(CallStatus.INACTIVE);
        setIsWaitingForPermission(false);
      }
    };

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

      // If error happens while waiting for permission, reset state
      if (isWaitingForPermission) {
        setCallStatus(CallStatus.INACTIVE);
        setIsWaitingForPermission(false);
        console.log("Permission-related error, resetting state");
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
  }, [isWaitingForPermission, hasPermissionBeenGranted]); // Add dependencies

  // Enhanced feedback generation on call end
  useEffect(() => {
    if (
      callStatus === CallStatus.FINISHED &&
      type !== "generate" &&
      !hasSubmittedFeedback.current &&
      hasPermissionBeenGranted && // Only submit if permission was properly granted
      messages.length > 0 // Only submit if we actually have conversation
    ) {
      hasSubmittedFeedback.current = true;
      setIsProcessingFeedback(true);

      setTimeout(() => {
        feedbackMutation.mutate({
          userId,
          interviewId,
          transcript: messages,
        });
      }, 100);
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
    hasPermissionBeenGranted, // Add this dependency
  ]);

  // Call handling
  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    setIsWaitingForPermission(true);

    try {
      // Check if we already have mic permission
      const permissionStatus = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });

      if (permissionStatus.state === "granted") {
        setHasPermissionBeenGranted(true);
        setIsWaitingForPermission(false);
      }

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
    } catch (error) {
      console.error("Error starting call:", error);
      setCallStatus(CallStatus.INACTIVE);
      setIsWaitingForPermission(false);
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

  // Handle forced interview end from navigation warning
  const handleForceEndInterview = () => {
    handleDisconnect();
    hideWarning();
  };

  const latestMessage = messages[messages.length - 1]?.content;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
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
                      src="/logo.png"
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
              disabled={
                callStatus === CallStatus.CONNECTING || isWaitingForPermission
              }
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 text-white font-semibold px-12 py-4 rounded-2xl flex items-center gap-3 shadow-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
            >
              {callStatus === CallStatus.CONNECTING ||
              isWaitingForPermission ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  {isWaitingForPermission
                    ? "Grant Microphone Permission..."
                    : "Connecting..."}
                </>
              ) : (
                <>
                  <Phone className="w-6 h-6" />
                  {type === "generate" ? "Create" : "Start"} Interview
                </>
              )}
            </motion.button>
          )}
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
                  className="bg-black/20 rounded-xl p-4 h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
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

        {/* Enhanced Feedback Processing Overlay */}
        <AnimatePresence>
          {(isProcessingFeedback || feedbackMutation.isLoading) && (
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-white/[0.08] backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center max-w-md mx-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Brain className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                </motion.div>

                <h3 className="text-xl font-semibold text-white mb-2">
                  Processing Interview
                </h3>
                <p className="text-white/70 mb-4">
                  Our AI is analyzing your performance and generating detailed
                  feedback...
                </p>

                {/* Progress indicator */}
                <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                  <motion.div
                    className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  />
                </div>

                <p className="text-white/50 text-sm">
                  Please don't close this window...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Warning Modal */}
        <NavigationWarningModal
          isOpen={showWarning}
          message={warningMessage}
          onClose={hideWarning}
          onEndInterview={
            isInterviewActive ? handleForceEndInterview : undefined
          }
          isInterviewActive={isInterviewActive}
        />

        {/* Call Controls */}
      </div>
    </div>
  );
};

export default Agent;
