"use client";

import { useRouter } from "next/navigation";

export default function NewPageButton() {
  const router = useRouter();
  const create = () => {
    const raw = window.prompt("New page URL slug (e.g. about, surf-guide):");
    if (!raw) return;
    const slug = raw.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
    if (slug) router.push(`/admin/pages/${slug}`);
  };
  return (
    <button onClick={create} className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium">
      + New page
    </button>
  );
}
