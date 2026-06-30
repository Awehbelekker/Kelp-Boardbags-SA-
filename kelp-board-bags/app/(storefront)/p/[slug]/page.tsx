import { notFound } from "next/navigation";
import type { Data } from "@measured/puck";
import { getPublishedPage } from "@/lib/vula-pages";
import PuckRender from "@/components/PuckRender";

export const revalidate = 30;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const page = await getPublishedPage(params.slug);
  return {
    title: page?.seo?.title || page?.title || "Kelp Board Bags",
    description: page?.seo?.description || undefined,
  };
}

export default async function VulaPage({ params }: { params: { slug: string } }) {
  const page = await getPublishedPage(params.slug);
  if (!page) notFound();
  return <PuckRender data={page.puck_data as unknown as Data} />;
}
