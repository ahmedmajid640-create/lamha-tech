import Link from "next/link";
import { ArrowUpRight, Briefcase, Clock, MapPin } from "lucide-react";
import type { Job } from "@/data/jobs";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/utils";

export function CareerCard({ job, className }: { job: Job; className?: string }) {
  return (
    <Link
      href={`/careers/${job.slug}`}
      className={cn(
        "group flex h-full flex-col rounded-lg border border-slate-200 bg-white p-6 transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-slate-300 hover:shadow-[var(--shadow-card-hover)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label-caps text-slate-500">{job.department}</p>
          <h3 className="mt-2 text-lg font-semibold text-navy">{job.title}</h3>
        </div>
        {job.status === "demo" && <Tag accent>Demo listing</Tag>}
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{job.summary}</p>
      <dl className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
        <div className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-blue" aria-hidden="true" />
          <dt className="sr-only">Location</dt>
          <dd>{job.location}</dd>
        </div>
        <div className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-blue" aria-hidden="true" />
          <dt className="sr-only">Employment type</dt>
          <dd>{job.employmentType}</dd>
        </div>
        <div className="inline-flex items-center gap-1.5">
          <Briefcase className="h-3.5 w-3.5 text-blue" aria-hidden="true" />
          <dt className="sr-only">Department</dt>
          <dd>{job.department}</dd>
        </div>
      </dl>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-blue">
        View role
        <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
