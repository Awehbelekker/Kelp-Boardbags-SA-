import Link from "next/link";
import { listAdminPages } from "@/lib/vula-pages";
import NewPageButton from "@/components/admin/NewPageButton";

export const dynamic = "force-dynamic";

export default async function PagesAdmin() {
  const pages = await listAdminPages();
  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Pages</h1>
          <p className="text-sm text-muted-foreground">Build and edit your website pages — no developer needed.</p>
        </div>
        <NewPageButton />
      </div>

      <div className="rounded-xl border border-border divide-y divide-border bg-white">
        {pages.length === 0 && (
          <div className="p-6 text-sm text-muted-foreground">No pages yet — click “New page” to build one.</div>
        )}
        {pages.map((p) => (
          <div key={p.slug} className="flex items-center justify-between p-4">
            <div>
              <div className="font-medium text-foreground">{p.title || p.slug}</div>
              <div className="text-xs text-muted-foreground">
                /p/{p.slug} ·{" "}
                <span className={p.status === "published" ? "text-green-600" : "text-amber-600"}>{p.status}</span>
              </div>
            </div>
            <div className="flex gap-3 text-sm">
              {p.status === "published" && (
                <Link href={`/p/${p.slug}`} className="text-muted-foreground hover:underline" target="_blank">View</Link>
              )}
              <Link href={`/admin/pages/${p.slug}`} className="text-primary font-medium hover:underline">Edit</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
