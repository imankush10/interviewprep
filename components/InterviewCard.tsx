import { getRandomInterviewCover } from "@/lib/utils";
import dayjs from "dayjs";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import TechIcons from "./TechIcons";

const InterviewCard = ({
  id,
  userid,
  role,
  type,
  techstack,
  createdAt,
  feedback = null,
  coverImage // Add default value
}: InterviewCardProps) => {
  const normalisedType = /mix/gi.test(type) ? "Mixed" : type;
  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96 hover:scale-105 transition-all duration-500">
      <div className="card-interview">
        {/* Interview type badge */}
        <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-amber-700">
          <p className="badge-text">{normalisedType}</p>
        </div>

        {/* Company logo image */}
        <Image
          src={coverImage || getRandomInterviewCover()}
          alt="cover-image"
          height={90}
          width={90}
          className="rounded-full object-fit size-[90px]"
        />

        {/* Interview role */}
        <h3 className="capitalize mt-5">{role} Interview</h3>

        {/* Date and Score */}
        <div className="flex flex-row gap-5 mt-3">
          <div className="flex flex-row gap-2">
            <Image
              src="calendar.svg"
              width={22}
              height={22}
              alt="calendar"
              className="w-auto h-auto"
            />
            <p>{formattedDate}</p>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Image src="star.svg" width={22} height={22} alt="star rating" />
            <p>{feedback?.totalScore || "--"}/100</p>
          </div>
        </div>

        {/* Feedback */}
        <p className="line-clamp-2 mt-5">
          {feedback?.finalAssessment ||
            "You haven't taken this interview yet. Take it now to improve your skills."}
        </p>

        {/* Techstack and feedback links */}
        <div className="flex flex-row justify-between">
          <TechIcons techStack={techstack} />
          <Button>
            <Link
              href={feedback ? `/interview/${id}/feedback` : `/interview/${id}`}
            >
              {feedback ? "Check Feedback" : "View interview"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
