/**
 * Puck block library — the self-serve page builder's components.
 *
 * Blocks use Tailwind *semantic* color classes (primary / accent / background / foreground /
 * muted), which each store maps to its own brand CSS vars — so this exact config dropped into
 * any Vula store renders in THAT store's brand. That is the brand flow-through.
 */
import type { Config } from "@measured/puck";
import Image from "next/image";
import Link from "next/link";

type Props = {
  Hero: { title: string; subtitle: string; image: string; ctaText: string; ctaHref: string };
  Heading: { text: string; level: "h1" | "h2" | "h3"; align: "left" | "center" };
  Text: { text: string; align: "left" | "center" };
  ImageBlock: { src: string; alt: string; rounded: boolean };
  CTA: { text: string; href: string; variant: "primary" | "outline" };
  Features: { title: string; items: { heading: string; body: string }[] };
  Spacer: { size: "sm" | "md" | "lg" };
};

const pad = "container-custom mx-auto px-4";

export const config: Config<Props> = {
  components: {
    Hero: {
      label: "Hero",
      fields: {
        title: { type: "text" }, subtitle: { type: "textarea" },
        image: { type: "text", label: "Background image URL" },
        ctaText: { type: "text", label: "Button text" }, ctaHref: { type: "text", label: "Button link" },
      },
      defaultProps: { title: "Your headline", subtitle: "A short supporting line.", image: "", ctaText: "Shop now", ctaHref: "/shop" },
      render: ({ title, subtitle, image, ctaText, ctaHref }) => (
        <section className="relative h-[420px] flex items-center justify-center text-center text-white bg-primary">
          {image ? <Image src={image} alt="" fill className="object-cover" /> : null}
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 max-w-3xl px-4">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">{title}</h1>
            {subtitle ? <p className="text-lg opacity-90 mb-6">{subtitle}</p> : null}
            {ctaText ? (
              <Link href={ctaHref || "#"} className="inline-block rounded-full bg-accent text-accent-foreground px-7 py-3 font-semibold">
                {ctaText}
              </Link>
            ) : null}
          </div>
        </section>
      ),
    },
    Heading: {
      label: "Heading",
      fields: {
        text: { type: "text" },
        level: { type: "select", options: [{ label: "H1", value: "h1" }, { label: "H2", value: "h2" }, { label: "H3", value: "h3" }] },
        align: { type: "select", options: [{ label: "Left", value: "left" }, { label: "Center", value: "center" }] },
      },
      defaultProps: { text: "Section heading", level: "h2", align: "left" },
      render: ({ text, level, align }) => {
        const Tag = level as keyof JSX.IntrinsicElements;
        const size = level === "h1" ? "text-4xl" : level === "h2" ? "text-3xl" : "text-2xl";
        return (
          <div className={`${pad} py-6`}>
            <Tag className={`${size} font-heading font-bold text-foreground ${align === "center" ? "text-center" : ""}`}>{text}</Tag>
          </div>
        );
      },
    },
    Text: {
      label: "Text",
      fields: {
        text: { type: "textarea" },
        align: { type: "select", options: [{ label: "Left", value: "left" }, { label: "Center", value: "center" }] },
      },
      defaultProps: { text: "Write your content here.", align: "left" },
      render: ({ text, align }) => (
        <div className={`${pad} py-3`}>
          <p className={`font-body text-muted-foreground leading-relaxed whitespace-pre-line max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>{text}</p>
        </div>
      ),
    },
    ImageBlock: {
      label: "Image",
      fields: { src: { type: "text", label: "Image URL" }, alt: { type: "text" }, rounded: { type: "radio", options: [{ label: "Rounded", value: true }, { label: "Square", value: false }] } },
      defaultProps: { src: "", alt: "", rounded: true },
      render: ({ src, alt, rounded }) => (
        <div className={`${pad} py-6`}>
          {src ? <img src={src} alt={alt} className={`w-full object-cover ${rounded ? "rounded-2xl" : ""}`} /> : <div className="h-48 bg-muted rounded-2xl" />}
        </div>
      ),
    },
    CTA: {
      label: "Button",
      fields: {
        text: { type: "text" }, href: { type: "text" },
        variant: { type: "select", options: [{ label: "Primary", value: "primary" }, { label: "Outline", value: "outline" }] },
      },
      defaultProps: { text: "Get in touch", href: "/contact", variant: "primary" },
      render: ({ text, href, variant }) => (
        <div className={`${pad} py-5 text-center`}>
          <Link href={href || "#"}
            className={variant === "primary"
              ? "inline-block rounded-full bg-primary text-primary-foreground px-7 py-3 font-semibold"
              : "inline-block rounded-full border border-primary text-primary px-7 py-3 font-semibold"}>
            {text}
          </Link>
        </div>
      ),
    },
    Features: {
      label: "Feature row (3)",
      fields: {
        title: { type: "text" },
        items: {
          type: "array", arrayFields: { heading: { type: "text" }, body: { type: "textarea" } },
          defaultItemProps: { heading: "Feature", body: "Describe it." },
        },
      },
      defaultProps: {
        title: "Why us",
        items: [
          { heading: "Sustainable", body: "Made responsibly." },
          { heading: "Handcrafted", body: "Built to last." },
          { heading: "Local", body: "Cape Town made." },
        ],
      },
      render: ({ title, items }) => (
        <section className={`${pad} py-12`}>
          {title ? <h2 className="text-3xl font-heading font-bold text-center text-foreground mb-8">{title}</h2> : null}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(items || []).map((it, i) => (
              <div key={i} className="rounded-2xl border border-border p-6 text-center">
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{it.heading}</h3>
                <p className="text-muted-foreground text-sm">{it.body}</p>
              </div>
            ))}
          </div>
        </section>
      ),
    },
    Spacer: {
      label: "Spacer",
      fields: { size: { type: "select", options: [{ label: "Small", value: "sm" }, { label: "Medium", value: "md" }, { label: "Large", value: "lg" }] } },
      defaultProps: { size: "md" },
      render: ({ size }) => <div className={size === "sm" ? "h-6" : size === "lg" ? "h-24" : "h-12"} />,
    },
  },
};

export default config;
