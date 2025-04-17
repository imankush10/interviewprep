"use client";
import { useQuery } from "@tanstack/react-query";
import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

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
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice real interview questions & get instant feedback
          </p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>
        <Image
          className="max-sm:hidden w-auto h-auto"
          src="/robot.png"
          alt="robot-image"
          height={400}
          width={400}
          priority={true}
        />
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {loadingUser ? (
            <p>Loading...</p>
          ) : hasPastInterviews ? (
            userInterviews.map((interview: any) => (
              <InterviewCard {...interview} key={interview.id} feedback={feedbackMap[interview.id]}/>
            ))
          ) : (
            <p>You haven&apos;t taken any interviews yet</p>
          )}
        </div>
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Take an Interview</h2>
        <div className="interviews-section">
          {loadingLatest ? (
            <p>Loading...</p>
          ) : hasUpcomingInterviews ? (
            allInterviews.map((interview: any) => (
              <InterviewCard
                {...interview}
                key={interview.id}
                feedback={feedbackMap[interview.id] || null}
              />
            ))
          ) : (
            <p>There are no interviews available</p>
          )}
        </div>
      </section>
    </>
  );
}
