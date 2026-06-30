import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { listAdminPages } from "@/lib/vula-pages";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ pages: await listAdminPages() });
}
