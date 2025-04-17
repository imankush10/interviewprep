"use client";

import { interviewer } from "@/constants";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
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
  const hasSubmittedFeedback = useRef(false); // Prevents multiple feedback submissions

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
    if (
      callStatus === CallStatus.FINISHED &&
      type !== "generate" &&
      !hasSubmittedFeedback.current
    ) {
      hasSubmittedFeedback.current = true; // Prevent duplicate submissions

      // Show feedback UI while waiting
      feedbackMutation.mutate({
        userId,
        interviewId,
        transcript: messages,
      });
    }

    // If type is "generate", just return to home after call ends
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
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }
      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
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
    <>
      <div className="call-view">
        {/* AI Interviewer */}
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="vapi ai avatar"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        {/* User */}
        {userName && (
          <div className="card-border">
            <div className="card-content">
              <span className="w-[122px] h-[122px] flex items-center justify-center bg-primary-200 text-secondary rounded-full text-5xl font-semibold shadow-md">
                {userName[0]}
              </span>
              <h3>{userName}</h3>
            </div>
          </div>
        )}
      </div>
      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={latestMessage}
              className={cn(
                "transition-opacity duration-300 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {latestMessage}
            </p>
          </div>
        </div>
      )}

      {/* Feedback Loading UI */}
      {feedbackMutation.isLoading && <Loader />}

      <div className="w-full flex justify-center">
        {callStatus === CallStatus.ACTIVE ? (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            End
          </button>
        ) : (
          <button className="relative btn-call" onClick={handleCall}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />
            <span className="relative">
              {!isCallInactiveOrFinished ? ". . ." : "Call"}
            </span>
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
