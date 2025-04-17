import { createFeedback } from "@/lib/actions/general.action";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const result = await createFeedback(body);
  return NextResponse.json(result);
}
