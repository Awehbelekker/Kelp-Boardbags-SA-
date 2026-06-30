/**
 * Vula page service client (server-side only — holds the API key).
 * Pages are stored in Vula (vula_pages), so this same module drops into ANY Vula tenant:
 * just set NEXT_PUBLIC_VULA_TENANT_ID. Powers the Puck editor + the public render route.
 */
import "server-only";

const VULA_API = process.env.NEXT_PUBLIC_VULA_API_URL || "https://vula-group-production.up.railway.app";
const TENANT = process.env.NEXT_PUBLIC_VULA_TENANT_ID || "kelp-boardbags";
const KEY = process.env.VULA_API_KEY || "";

export type PuckData = { content: unknown[]; root: Record<string, unknown>; zones?: Record<string, unknown> };
export type VulaPage = {
  id?: string; tenant_id?: string; slug: string; title?: string;
  puck_data: PuckData; seo?: Record<string, string>; status?: "draft" | "published";
  updated_at?: string;
};

const base = `${VULA_API}/v1/commerce/${TENANT}`;
const headers = { "Content-Type": "application/json", "X-API-Key": KEY };

/** Published page for the public render route (or null if none). */
export async function getPublishedPage(slug: string): Promise<VulaPage | null> {
  const res = await fetch(`${base}/pages/${slug}`, { headers, next: { revalidate: 30 } });
  if (res.status === 404) return null;
  if (!res.ok) return null;
  return res.json();
}

/** All pages (draft + published) for the admin list. */
export async function listAdminPages(): Promise<VulaPage[]> {
  const res = await fetch(`${base}/admin/pages`, { headers, cache: "no-store" });
  if (!res.ok) return [];
  const d = await res.json();
  return d.pages || [];
}

/** A page for editing (returns an empty draft shape if it doesn't exist yet). */
export async function getAdminPage(slug: string): Promise<VulaPage> {
  const res = await fetch(`${base}/admin/pages/${slug}`, { headers, cache: "no-store" });
  if (!res.ok) return { slug, puck_data: { content: [], root: {} }, status: "draft" };
  return res.json();
}

/** Create or update a page (Puck save / publish). */
export async function savePage(slug: string, body: Partial<VulaPage>): Promise<VulaPage> {
  const res = await fetch(`${base}/admin/pages/${slug}`, {
    method: "PUT", headers,
    body: JSON.stringify({
      title: body.title, puck_data: body.puck_data || { content: [], root: {} },
      seo: body.seo || {}, status: body.status || "draft",
    }),
  });
  if (!res.ok) throw new Error(`Save failed ${res.status}`);
  const d = await res.json();
  return d.page;
}
