import { publishedProjects } from "@/data/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { WorkGrid } from "@/components/work/WorkGrid";
import { DarkBackdrop } from "@/components/visuals/GridPattern";

export function WorkPreview({ number = "08" }: { number?: string }) {
  return (
    <section aria-labelledby="work-heading" className="dark-section relative overflow-hidden bg-abyss text-white">
      <DarkBackdrop glow={false} />
      <div className="container-x section-y relative">
        <SectionHeading
          number={number}
          label="Our work"
          title={
            <span id="work-heading">
              Ideas Built Into <span className="text-gradient-blue">Real Products.</span>
            </span>
          }
          description="Approved LAMHA projects and case studies will appear here."
          tone="dark"
        >
          <Button href="/work" variant="outline-light" size="sm" icon="arrow">
            View work
          </Button>
        </SectionHeading>
        <div className="mt-12">
          <WorkGrid projects={publishedProjects.slice(0, 4)} placeholders={3} />
        </div>
      </div>
    </section>
  );
}
