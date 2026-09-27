import {
  Code2,
  Globe,
  Smartphone,
  Layers,
  FlaskConical,
  ShieldCheck,
  PenTool,
  Fingerprint,
  Sparkles,
  Compass,
  Search,
  BarChart3,
  Gauge,
  Layout,
  Server,
  Cloud,
  Database,
  Workflow,
  Bot,
  Plug,
  type LucideProps,
} from "lucide-react";
import type { ServiceIconName } from "@/data/services";
import type { TechnologyIconName } from "@/data/technology";

/** Maps serializable icon names (from data files) to Lucide components. */
const registry = {
  code: Code2,
  globe: Globe,
  smartphone: Smartphone,
  layers: Layers,
  flask: FlaskConical,
  shield: ShieldCheck,
  "pen-tool": PenTool,
  fingerprint: Fingerprint,
  sparkles: Sparkles,
  compass: Compass,
  search: Search,
  "bar-chart": BarChart3,
  gauge: Gauge,
  layout: Layout,
  server: Server,
  cloud: Cloud,
  database: Database,
  workflow: Workflow,
  bot: Bot,
  plug: Plug,
} as const;

export type IconName = ServiceIconName | TechnologyIconName;

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Cmp = registry[name] ?? Code2;
  return <Cmp aria-hidden="true" focusable="false" {...props} />;
}
