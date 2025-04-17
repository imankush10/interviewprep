"use client";

import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function FeedbackPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // Fetch current user
  const { data: user, isLoading: userLoading } = useCurrentUser();

  // Fetch interview
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

  // Fetch feedback
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

  // Handle loading and error states
  if (userLoading || interviewLoading || feedbackLoading) return <Loader />;
  if (!user) {
    router.replace("/sign-in");
    return null;
  }
  if (interviewError || !interview) {
    return <div className="text-center py-10">Interview not found.</div>;
  }
  if (feedbackError || !feedback) {
    return <div className="text-center py-10">Feedback not found.</div>;
  }

  return (
    <section className="section-feedback">
      <div className="flex flex-row justify-center">
        <h1 className="text-4xl font-semibold">
          Feedback on the Interview -{" "}
          <span className="capitalize">{interview.role}</span> Interview
        </h1>
      </div>

      <div className="flex flex-row justify-center ">
        <div className="flex flex-row gap-5">
          {/* Overall Impression */}
          <div className="flex flex-row gap-2 items-center">
            <Image src="/star.svg" width={22} height={22} alt="star" />
            <p>
              Overall Impression:{" "}
              <span className="text-primary-200 font-bold">
                {feedback.totalScore}
              </span>
              /100
            </p>
          </div>

          {/* Date */}
          <div className="flex flex-row gap-2">
            <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
            <p>
              {feedback.createdAt
                ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <hr />

      <p>{feedback.finalAssessment}</p>

      {/* Interview Breakdown */}
      <div className="flex flex-col gap-4">
        <h2>Breakdown of the Interview:</h2>
        {feedback.categoryScores?.map((category: any, index: number) => (
          <div key={index}>
            <p className="font-bold">
              {index + 1}. {category.name} ({category.score}/100)
            </p>
            <p>{category.comment}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h3>Strengths</h3>
        <ul>
          {feedback.strengths?.map((strength: string, index: number) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <h3>Areas for Improvement</h3>
        <ul>
          {feedback.areasForImprovement?.map((area: string, index: number) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </div>

      <div className="buttons">
        <Button className="btn-secondary flex-1">
          <Link href="/" className="flex w-full justify-center">
            <p className="text-sm font-semibold text-primary-200 text-center">
              Back to dashboard
            </p>
          </Link>
        </Button>

        <Button className="btn-primary flex-1">
          <Link
            href={`/interview/${id}`}
            className="flex w-full justify-center"
          >
            <p className="text-sm font-semibold text-black text-center">
              Retake Interview
            </p>
          </Link>
        </Button>
      </div>
    </section>
  );
}
