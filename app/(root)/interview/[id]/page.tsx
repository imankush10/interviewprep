"use client";

import Agent from "@/components/Agent";
import TechIcons from "@/components/TechIcons";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Loader from "@/components/Loader";
import { getRandomInterviewCover } from "@/lib/utils";

export default function InterviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: user, isLoading: userLoading } = useCurrentUser();

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

  // Handle loading and error states
  if (userLoading || interviewLoading) return <Loader />;
  if (!user) {
    router.replace("/sign-in");
    return null;
  }
  if (interviewError || !interview) {
    return <div className="text-center py-10">Interview not found.</div>;
  }

  return (
    <>
      <div className="flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <Image
              src={interview.coverImage || getRandomInterviewCover()}
              alt="cover-image"
              width={40}
              height={40}
              className="rounded-full object-cover size-[40px]"
            />
            <h3 className="capitalize">{interview.role} Interview</h3>
          </div>
          <TechIcons techStack={interview.techstack} />
        </div>
        <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit capitalize">
          {interview.type}
        </p>
      </div>
      <Agent
        userName={user.name}
        interviewId={id}
        userId={user.id}
        questions={interview.questions}
        type="interview"
      />
    </>
  );
}
