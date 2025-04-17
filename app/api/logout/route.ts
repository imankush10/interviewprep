import { logout } from "@/lib/actions/auth.action";
import { NextResponse } from "next/server";

export async function POST() {
  await logout();
  return NextResponse.json({ success: true });
}