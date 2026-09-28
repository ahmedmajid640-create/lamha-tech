import type { ServiceVisualKind } from "@/data/services";
import type { AccentVariant } from "./AccentScene";

/** Maps a service's illustration kind to a 3D accent form. */
export const accentForVisual: Record<ServiceVisualKind, AccentVariant> = {
  code: "cluster",
  web: "grid",
  mobile: "capsule",
  stack: "cluster",
  testing: "octahedron",
  security: "icosahedron",
  interface: "grid",
  identity: "rings",
  motion: "torusKnot",
  strategy: "rings",
  seo: "octahedron",
  analytics: "grid",
  scale: "torusKnot",
};
