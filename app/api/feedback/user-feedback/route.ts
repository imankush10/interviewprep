import { getCurrentUser } from "@/lib/actions/auth.action";
import { db } from "@/firebase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const snapshot = await db
    .collection("feedback")
    .where("userId", "==", user.id)
    .get();

  const feedbacks = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return NextResponse.json(feedbacks);
}
