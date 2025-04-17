"use client";
import { useQuery } from '@tanstack/react-query';
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { mappings } from '@/constants';

const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";
function normalizeTechName(tech: string) {
  const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
  return mappings[key as keyof typeof mappings] || "javascript";
}

async function checkIconExists(url: string) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}

async function fetchTechLogos(techArray: string[]) {
  const logoURLs = techArray.map((tech) => {
    const normalized = normalizeTechName(tech);
    return {
      tech,
      url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
    };
  });

  const results = await Promise.all(
    logoURLs.map(async ({ tech, url }) => ({
      tech,
      url: (await checkIconExists(url)) ? url : "/tech.svg",
    }))
  );
  return results;
}

export default function TechIcons({ techStack }: { techStack: string[] }) {
  const { data: techicons, isLoading } = useQuery({
    queryKey: ['tech-logos', techStack],
    queryFn: () => fetchTechLogos(techStack),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  if (isLoading) {
    return <div className="flex flex-row"><span className="text-xs text-muted">Loading...</span></div>;
  }

  return (
    <div className="flex flex-row">
      {techicons?.slice(0, 3).map(({ tech, url }, index) => (
        <div
          key={tech}
          className={cn(
            "relative group bg-dark-300 rounded-full p-2 flex flex-center",
            index >= 1 && "-ml-3"
          )}
        >
          <span className="tech-tooltip">{tech}</span>
          <Image src={url} height={100} width={100} alt={tech} className="size-5" />
        </div>
      ))}
    </div>
  );
}