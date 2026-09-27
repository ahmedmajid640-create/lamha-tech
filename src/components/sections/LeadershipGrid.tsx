import { publishedLeadership } from "@/data/leadership";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { LeadershipCard } from "@/components/leadership/LeadershipCard";

export function LeadershipGrid({ number = "10", tone = "light", showLink = true }: { number?: string; tone?: "light" | "dark"; showLink?: boolean }) {
  return (
    <section aria-labelledby="leadership-heading" className={tone === "dark" ? "dark-section bg-deep text-white" : "bg-cloud"}>
      <div className="container-x section-y">
        <SectionHeading
          number={number}
          label="Leadership"
          title={<span id="leadership-heading">The people accountable for the work.</span>}
          description="Approved biographies and portraits will be published here as they become available."
          tone={tone}
        >
          {showLink && (
            <Button href="/about/leadership" variant={tone === "dark" ? "outline-light" : "outline"} size="sm" icon="arrow">
              Leadership
            </Button>
          )}
        </SectionHeading>
        <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {publishedLeadership.map((l, i) => (
            <Reveal key={l.slug} as="li" delay={i * 70}>
              <LeadershipCard leader={l} tone={tone} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
