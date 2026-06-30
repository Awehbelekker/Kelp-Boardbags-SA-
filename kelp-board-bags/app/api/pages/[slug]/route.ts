import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAdminPage, savePage } from "@/lib/vula-pages";

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getAdminPage(params.slug));
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  try {
    const page = await savePage(params.slug, body);
    return NextResponse.json({ page });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 });
  }
}
