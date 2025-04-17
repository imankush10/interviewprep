import { getCurrentUser } from "@/lib/actions/auth.action";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const feedback = await getFeedbackByInterviewId({
    interviewId: params.id,
    userId: user.id,
  });
  if (!feedback) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(feedback);
}
