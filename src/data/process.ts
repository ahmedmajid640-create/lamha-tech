export type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Discover",
    description:
      "We learn the business context, the users, the constraints and the real problem behind the request.",
  },
  {
    number: "02",
    title: "Define",
    description:
      "We turn findings into clear scope, priorities, architecture direction and a delivery plan.",
  },
  {
    number: "03",
    title: "Design",
    description:
      "We design the experience and the system together: interfaces, data models, integrations and flows.",
  },
  {
    number: "04",
    title: "Build",
    description:
      "We engineer in iterations with code reviews, working software and regular demonstrations.",
  },
  {
    number: "05",
    title: "Test",
    description:
      "Functional, regression, API, UI, performance and security testing before anything ships.",
  },
  {
    number: "06",
    title: "Deploy & Evolve",
    description:
      "We release, monitor and keep improving the product as the business and its needs grow.",
  },
];
