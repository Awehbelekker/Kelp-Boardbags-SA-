"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Puck, type Data } from "@measured/puck";
import "@measured/puck/puck.css";
import config from "@/puck.config";

const EMPTY: Data = { content: [], root: {} };

export default function PageEditor() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [data, setData] = useState<Data | null>(null);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState("");

  useEffect(() => {
    fetch(`/api/pages/${slug}`)
      .then((r) => r.json())
      .then((p) => {
        const pd = p?.puck_data && Array.isArray(p.puck_data.content) ? p.puck_data : EMPTY;
        setData(pd);
        setTitle(p?.title || slug);
      })
      .catch(() => setData(EMPTY));
  }, [slug]);

  const persist = async (puck_data: Data, status: "draft" | "published") => {
    setSaving(status === "published" ? "Publishing…" : "Saving…");
    await fetch(`/api/pages/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, puck_data, status }),
    });
    setSaving(status === "published" ? "Published ✓" : "Saved ✓");
    setTimeout(() => setSaving(""), 2000);
  };

  if (!data) return <div className="p-8 text-muted-foreground">Loading editor…</div>;

  return (
    <div className="-m-8 h-[calc(100vh-4rem)]">
      <Puck
        config={config}
        data={data}
        headerTitle={`Editing: ${title}`}
        headerPath={`/p/${slug}`}
        onPublish={(d) => persist(d, "published")}
        overrides={{
          headerActions: ({ children }) => (
            <>
              <button
                onClick={() => persist((window as any).__puckData || data, "draft")}
                className="rounded-md border border-border px-3 py-1.5 text-sm mr-2"
              >
                Save draft
              </button>
              {saving ? <span className="text-sm text-muted-foreground mr-2">{saving}</span> : null}
              {children}
            </>
          ),
        }}
        onChange={(d) => {
          (window as any).__puckData = d;
        }}
      />
    </div>
  );
}
