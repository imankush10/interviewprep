import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewByUserId } from "@/lib/actions/general.action";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const interviews = await getInterviewByUserId(user.id);
  return NextResponse.json(interviews || []);
}
