import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getService, publishedServices } from "@/data/services";
import { buildMetadata } from "@/lib/seo";
import { ServiceDetail } from "@/components/services/ServiceDetail";

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service || service.status !== "published") return { title: "Service not found" };
  return buildMetadata({
    title: `${service.title} Services`,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service || service.status !== "published") notFound();
  return <ServiceDetail service={service} />;
}
