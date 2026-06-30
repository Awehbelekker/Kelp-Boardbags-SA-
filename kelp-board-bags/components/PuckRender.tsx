"use client";

import { Render, type Data } from "@measured/puck";
import config from "@/puck.config";

/** Renders a published Vula page's Puck document on the storefront. */
export default function PuckRender({ data }: { data: Data }) {
  return <Render config={config} data={data} />;
}
