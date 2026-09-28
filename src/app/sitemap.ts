import type { MetadataRoute } from "next";
import { publishedServices } from "@/data/services";
import { solutions } from "@/data/solutions";
import { openJobs } from "@/data/jobs";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/solutions", priority: 0.8, changeFrequency: "monthly" },
    { path: "/technology", priority: 0.7, changeFrequency: "monthly" },
    { path: "/products", priority: 0.5, changeFrequency: "monthly" },
    { path: "/work", priority: 0.7, changeFrequency: "monthly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/about/leadership", priority: 0.6, changeFrequency: "monthly" },
    { path: "/careers", priority: 0.7, changeFrequency: "weekly" },
    { path: "/start-a-project", priority: 0.9, changeFrequency: "yearly" },
    { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
  ];

  return [
    ...staticRoutes.map((r) => ({ url: absoluteUrl(r.path), lastModified: now, changeFrequency: r.changeFrequency, priority: r.priority })),
    ...publishedServices.map((s) => ({ url: absoluteUrl(`/services/${s.slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...solutions.map((s) => ({ url: absoluteUrl(`/solutions/${s.slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...openJobs.map((j) => ({ url: absoluteUrl(`/careers/${j.slug}`), lastModified: now, changeFrequency: "weekly" as const, priority: 0.5 })),
  ];
}
